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

from agents.context_mapper_agent import ContextMapperAgent
from agents.planner_agent import PlannerAgent
from agents.ingest_agent import IngestAgent
from agents.plan_agent import plan_agent

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
        os.getenv("FRONTEND_URL", "http://localhost:5173")  # Set FRONTEND_URL in .env for production
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# NOTE: For production, set FRONTEND_URL in your .env to your deployed frontend URL.

# Initialize agents
print("🚀 Initializing Cognix AI Agents...")
try:
    ingest_agent = IngestAgent()
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

class IngestRequest(BaseModel):
    sources: Optional[List[str]] = None
    date_range: Optional[dict] = None
    filters: Optional[dict] = None
    user_id: Optional[str] = "default"

class CategorizeRequest(BaseModel):
    content_items: List[dict]

class PlanRequest(BaseModel):
    content_items: List[dict]
    user_goals: List[str]

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
            
            # CollectorAgent is not implemented. Raise a clear error.
            raise NotImplementedError("File ingestion is not implemented. Please use the /api/ingest endpoint.")
            
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
    try:
        result = None
        async for event in ingest_agent.run_async({"text": input_data.text, "title": input_data.title}):
            if hasattr(event, 'content') and event.content:
                result = event.content
        if not result:
            raise HTTPException(status_code=500, detail="No result from agent.")
        content_item = {
            "id": result.get("id", f"text-{datetime.now().timestamp()}"),
            "type": "text",
            "title": input_data.title,
            "content": input_data.text,
            "extracted_text": result.get("extracted_text", input_data.text),
            "metadata": result.get("metadata", {}),
            "timestamp": datetime.now().isoformat(),
            "status": "completed",
            "categories": result.get("categories", []),
            "relevance_score": result.get("relevance_score", None)
        }
        content_store[content_item["id"]] = content_item
        return ContentResponse(**content_item)
    except Exception as e:
        print(f"❌ Exception processing text: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/upload/youtube", response_model=ContentResponse)
async def upload_youtube(input_data: YouTubeInput):
    """Process YouTube URL through Collector Agent"""
    try:
        print(f"🎥 Processing YouTube URL: {input_data.url}")
        
        raise NotImplementedError("YouTube ingestion is not implemented. Please use the /api/ingest endpoint.")
        
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

@app.post("/api/ingest")
async def ingest_data(request: IngestRequest):
    """Trigger data ingestion using IngestAgent"""
    try:
        print(f"Received ingest request: {request.dict()}")
        ingest_agent = IngestAgent()
        result = await ingest_agent.process_ingestion_request(
            sources=request.sources,
            date_range=request.date_range,
            filters=request.filters,
            user_id=request.user_id
        )
        print(f"Ingest result: {result}")
        return JSONResponse(content=result)
    except Exception as e:
        print(f"❌ Error in ingestion: {e}")
        traceback.print_exc()
        return JSONResponse(content={"success": False, "error": str(e), "data": {}}, status_code=500)

@app.post("/api/categorize")
async def categorize_content(request: CategorizeRequest):
    """Categorize ingested content using ContextMapperAgent"""
    try:
        # For demo, just join all text fields
        all_text = " ".join([item.get("extracted_text", "") for item in request.content_items])
        result = await context_mapper_agent.process(all_text)
        return JSONResponse(content=result)
    except Exception as e:
        print(f"❌ Error in categorization: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Categorization error: {str(e)}")

@app.post("/api/plan")
async def generate_plan(request: PlanRequest):
    """Generate an action plan from categorized content and user goals using PlannerAgent"""
    try:
        result = await planner_agent.generate_action_plan(request.content_items, request.user_goals)
        return JSONResponse(content=result)
    except Exception as e:
        print(f"❌ Error in planning: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Planning error: {str(e)}")

@app.post("/api/plan-from-text")
async def plan_from_text(input_data: TextInput):
    try:
        result = None
        async for event in plan_agent.run_async({"text": input_data.text}):
            if hasattr(event, 'content') and event.content:
                result = event.content
        if not result:
            raise HTTPException(status_code=500, detail="No result from agent.")
        return {"plan": result.get("plan", [])}
    except Exception as e:
        print(f"❌ Exception processing plan: {str(e)}")
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