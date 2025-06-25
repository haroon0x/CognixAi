from dotenv import load_dotenv
import os
load_dotenv()
api_key=os.getenv("GOOGLE_API_KEY")
GOOGLE_GENAI_USE_VERTEXAI=os.getenv("GOOGLE_GENAI_USE_VERTEXAI")

from google.adk.agents import Agent , LlmAgent , SequentialAgent
from backend.config.prompt import PLANNER_SYSTEM_PROMPT

planner_agent = LlmAgent(
    model="gemini-2.0-flash",
    name="planner_agent",
    description="Makes plans for the user based on the users unstructured data.",
    instruction=PLANNER_SYSTEM_PROMPT,
)

root_agent = planner_agent