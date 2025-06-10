from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional
import os
import json
from datetime import datetime
import uuid
from dotenv import load_dotenv
import traceback
import tempfile

# Load environment variables
load_dotenv()

from agents.collector_agent import CollectorAgent
from agents.context_mapper_agent import ContextMapperAgent
from agents.planner_agent import PlannerAgent

app = FastAPI(
    title="Cognix Backend API", 
    version="1.0.0",
    description="AI-powered content organization and planning system"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite dev server
        "http://localhost:3000",  # Alternative React dev server
        os.getenv("FRONTEND_URL", "http://localhost:5173")
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize agents
print("🚀 Initializing Cognix AI Agents...")
try:
    collector_agent = CollectorAgent()
    context_mapper_agent = ContextMapperAgent()
    planner_agent = PlannerAgent()
    print("✅ All agents initialized successfully!")
except Exception as e:
    print(f"❌ Error initializing agents: {e}")
    traceback.print_exc()

# Pydantic models
class TextInput(BaseModel):
    text: str
    title: Optional[str] = "Text Note"

class YouTubeInput(BaseModel):
    url: str

class GoalInput(BaseModel):
    goals: List[str]
    content_ids: List[str]

class ContentResponse(BaseModel):
    id: str
    type: str
    title: str
    content: str
    extracted_text: str
    metadata: dict
    timestamp: str
    status: str
    categories: List[str]
    relevance_score: Optional[float] = None

class ActionPlanResponse(BaseModel):
    id: str
    title: str
    steps: List[dict]
    priority: str
    estimated_duration: str
    dependencies: List[str]

# In-memory storage (replace with database in production)
content_store = {}
action_plans_store = {}

@app.get("/")
async def root():
    return {
        "message": "🧠 Cognix Backend API is running",
        "version": "1.0.0",
        "agents": {
            "collector": "✅ Active",
            "context_mapper": "✅ Active", 
            "planner": "✅ Active"
        },
        "endpoints": {
            "docs": "/docs",
            "upload_files": "/api/upload/files",
            "upload_text": "/api/upload/text",
            "upload_youtube": "/api/upload/youtube",
            "generate_plan": "/api/generate-plan"
        }
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "agents_active": 3,
        "content_items": len(content_store),
        "action_plans": len(action_plans_store)
    }

@app.post("/api/upload/files", response_model=List[ContentResponse])
async def upload_files(files: List[UploadFile] = File(...)):
    """Upload and process files through Collector Agent"""
    results = []
    
    print(f"📁 Processing {len(files)} uploaded files...")
    
    for file in files:
        temp_path = None
        try:
            print(f"📄 Processing file: {file.filename} ({file.content_type})")
            
            # Create a temporary file
            with tempfile.NamedTemporaryFile(delete=False, suffix=f"_{file.filename}") as temp_file:
                temp_path = temp_file.name
                content = await file.read()
                temp_file.write(content)
            
            # Process through Collector Agent
            result = None
            if file.content_type == "application/pdf":
                result = await collector_agent.extract_from_pdf(temp_path)
            elif file.content_type and file.content_type.startswith("image/"):
                result = await collector_agent.extract_from_image(temp_path)
            else:
                # Handle text files
                try:
                    with open(temp_path, "r", encoding="utf-8") as f:
                        text_content = f.read()
                    result = await collector_agent.extract_from_text(text_content, file.filename)
                except UnicodeDecodeError:
                    # Try with different encoding
                    try:
                        with open(temp_path, "r", encoding="latin-1") as f:
                            text_content = f.read()
                        result = await collector_agent.extract_from_text(text_content, file.filename)
                    except Exception as encoding_error:
                        print(f"❌ Encoding error for {file.filename}: {encoding_error}")
                        result = {
                            "success": False,
                            "error": f"Could not read file with any encoding: {str(encoding_error)}"
                        }
            
            if result and result["success"]:
                content_item = result["data"]
                
                # Process through Context Mapper Agent
                print(f"🏷️ Categorizing content: {content_item['title']}")
                try:
                    categorized = await context_mapper_agent.categorize_content([content_item])
                    if categorized["success"]:
                        content_item = categorized["data"][0]
                except Exception as categorization_error:
                    print(f"⚠️ Categorization failed: {categorization_error}")
                    # Continue without categorization
                
                # Store in memory
                content_store[content_item["id"]] = content_item
                results.append(ContentResponse(**content_item))
                print(f"✅ Successfully processed: {file.filename}")
            else:
                error_msg = result.get('error', 'Unknown error') if result else 'Processing failed'
                print(f"❌ Failed to process: {file.filename} - {error_msg}")
                raise HTTPException(status_code=500, detail=f"Error processing {file.filename}: {error_msg}")
            
        except Exception as e:
            print(f"❌ Exception processing {file.filename}: {str(e)}")
            traceback.print_exc()
            raise HTTPException(status_code=500, detail=f"Error processing {file.filename}: {str(e)}")
        finally:
            # Clean up temp file
            if temp_path and os.path.exists(temp_path):
                try:
                    os.unlink(temp_path)
                except Exception as cleanup_error:
                    print(f"⚠️ Failed to cleanup temp file: {cleanup_error}")
    
    print(f"✅ Successfully processed {len(results)} files")
    return results

@app.post("/api/upload/text", response_model=ContentResponse)
async def upload_text(input_data: TextInput):
    """Process text input through Collector Agent"""
    try:
        print(f"📝 Processing text input: {input_data.title}")
        
        result = await collector_agent.extract_from_text(input_data.text, input_data.title)
        
        if result["success"]:
            content_item = result["data"]
            
            # Process through Context Mapper Agent
            print(f"🏷️ Categorizing text content: {content_item['title']}")
            try:
                categorized = await context_mapper_agent.categorize_content([content_item])
                if categorized["success"]:
                    content_item = categorized["data"][0]
            except Exception as categorization_error:
                print(f"⚠️ Categorization failed: {categorization_error}")
                # Continue without categorization
            
            # Store in memory
            content_store[content_item["id"]] = content_item
            print(f"✅ Successfully processed text: {input_data.title}")
            return ContentResponse(**content_item)
        else:
            print(f"❌ Failed to process text: {result.get('error', 'Unknown error')}")
            raise HTTPException(status_code=500, detail=result["error"])
            
    except Exception as e:
        print(f"❌ Exception processing text: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/upload/youtube", response_model=ContentResponse)
async def upload_youtube(input_data: YouTubeInput):
    """Process YouTube URL through Collector Agent"""
    try:
        print(f"🎥 Processing YouTube URL: {input_data.url}")
        
        result = await collector_agent.extract_from_youtube(input_data.url)
        
        if result["success"]:
            content_item = result["data"]
            
            # Process through Context Mapper Agent
            print(f"🏷️ Categorizing YouTube content: {content_item['title']}")
            try:
                categorized = await context_mapper_agent.categorize_content([content_item])
                if categorized["success"]:
                    content_item = categorized["data"][0]
            except Exception as categorization_error:
                print(f"⚠️ Categorization failed: {categorization_error}")
                # Continue without categorization
            
            # Store in memory
            content_store[content_item["id"]] = content_item
            print(f"✅ Successfully processed YouTube: {content_item['title']}")
            return ContentResponse(**content_item)
        else:
            print(f"❌ Failed to process YouTube: {result.get('error', 'Unknown error')}")
            raise HTTPException(status_code=500, detail=result["error"])
            
    except Exception as e:
        print(f"❌ Exception processing YouTube: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/content", response_model=List[ContentResponse])
async def get_content():
    """Get all processed content"""
    print(f"📋 Retrieving {len(content_store)} content items")
    return [ContentResponse(**item) for item in content_store.values()]

@app.post("/api/generate-plan", response_model=ActionPlanResponse)
async def generate_action_plan(input_data: GoalInput):
    """Generate action plan through Planner Agent"""
    try:
        print(f"🎯 Generating action plan for {len(input_data.goals)} goals and {len(input_data.content_ids)} content items")
        
        # Get content items
        content_items = [content_store[cid] for cid in input_data.content_ids if cid in content_store]
        
        if not content_items:
            raise HTTPException(status_code=400, detail="No valid content items found")
        
        print(f"📊 Using {len(content_items)} content items for planning")
        result = await planner_agent.generate_action_plan(content_items, input_data.goals)
        
        if result["success"]:
            action_plan = result["data"]
            action_plans_store[action_plan["id"]] = action_plan
            print(f"✅ Generated action plan: {action_plan['title']} with {len(action_plan['steps'])} steps")
            return ActionPlanResponse(**action_plan)
        else:
            print(f"❌ Failed to generate action plan: {result.get('error', 'Unknown error')}")
            raise HTTPException(status_code=500, detail=result["error"])
            
    except Exception as e:
        print(f"❌ Exception generating action plan: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/action-plans", response_model=List[ActionPlanResponse])
async def get_action_plans():
    """Get all action plans"""
    print(f"📋 Retrieving {len(action_plans_store)} action plans")
    return [ActionPlanResponse(**plan) for plan in action_plans_store.values()]

@app.put("/api/action-plans/{plan_id}/steps/{step_id}/toggle")
async def toggle_action_step(plan_id: str, step_id: str):
    """Toggle completion status of an action step"""
    try:
        if plan_id not in action_plans_store:
            raise HTTPException(status_code=404, detail="Action plan not found")
        
        plan = action_plans_store[plan_id]
        for step in plan["steps"]:
            if step["id"] == step_id:
                step["completed"] = not step["completed"]
                print(f"🔄 Toggled step '{step['title']}' to {'completed' if step['completed'] else 'pending'}")
                return {"success": True, "completed": step["completed"]}
        
        raise HTTPException(status_code=404, detail="Step not found")
    except Exception as e:
        print(f"❌ Exception toggling step: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

# Error handler for unhandled exceptions
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    print(f"❌ Unhandled exception: {str(exc)}")
    traceback.print_exc()
    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal server error: {str(exc)}"}
    )

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Cognix Backend API...")
    uvicorn.run(app, host="0.0.0.0", port=8000)