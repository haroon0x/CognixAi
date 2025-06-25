from fastapi import FastAPI
from pydantic import BaseModel
import sys
import os
import uuid
import asyncio
from backend.agents.agent import *
import json
from dotenv import load_dotenv
load_dotenv()
import os

from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types

sys.path.append(os.path.join(os.path.dirname(__file__), 'config'))
from backend.config.prompt import PLANNER_SYSTEM_PROMPT

app = FastAPI()

class PlanRequest(BaseModel):
    text: str

# Set up ADK runner and session service
app_name = "cognix_ai"
session_service = InMemorySessionService()
runner = Runner(agent=planner_agent, app_name=app_name, session_service=session_service)

@app.post('/plan')
async def generate_plan(request: PlanRequest):
    user_id = "frontend_user"  # You can customize this per user/session
    session = await session_service.create_session(app_name=app_name, user_id=user_id)
    content = types.Content(role='user', parts=[types.Part(text=request.text)])
    events = runner.run(user_id=user_id, session_id=session.id, new_message=content)
    final_response = None
    for event in events:
        if event.is_final_response():
            final_response = event.content.parts[0].text
            break
    try:
        plan = json.loads(final_response)
        return plan
    except Exception:
        return {"error": "Agent did not return a valid plan object.", "raw": final_response}

@app.get('/status')
def status():
    return {"status": "ok"}