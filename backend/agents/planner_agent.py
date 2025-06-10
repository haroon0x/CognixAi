import asyncio
from typing import Dict, Any, List
import uuid
from datetime import datetime, timedelta
import os

# Try to import AI libraries for real processing
try:
    import google.genai as genai
    from google.genai import types
    HAS_GEMINI = True
except ImportError:
    HAS_GEMINI = False

try:
    import openai
    HAS_OPENAI = True
except ImportError:
    HAS_OPENAI = False

class PlannerAgent:
    """Agent responsible for generating intelligent action plans using Gemini AI"""
    
    def __init__(self):
        self.name = "PlannerAgent"
        self.description = "Generates intelligent action plans based on content analysis and user objectives using Gemini AI"
        
        # Initialize AI clients with Gemini as primary
        self.gemini_client = None
        self.openai_client = None
        
        # Try to initialize Gemini first (primary) using google-genai
        if HAS_GEMINI and os.getenv('GOOGLE_API_KEY'):
            try:
                self.gemini_client = genai.Client(api_key=os.getenv('GOOGLE_API_KEY'))
                print("✅ Gemini AI client initialized for planning with google-genai")
            except Exception as e:
                print(f"⚠️ Gemini initialization failed: {e}")
        
        # Try to initialize OpenAI as fallback
        if HAS_OPENAI and os.getenv('OPENAI_API_KEY'):
            try:
                self.openai_client = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
                print("✅ OpenAI client initialized for planning (fallback)")
            except Exception as e:
                print(f"⚠️ OpenAI initialization failed: {e}")
        
        print(f"✅ Initialized {self.name}")
    
    async def generate_action_plan(self, content_items: List[Dict[str, Any]], user_goals: List[str]) -> Dict[str, Any]:
        """Generate an intelligent action plan using Gemini AI"""
        start_time = datetime.now()
        
        try:
            # Try Gemini AI-powered action plan generation first
            action_plan = await self._gemini_generate_action_plan(content_items, user_goals)
            
            # Fallback to OpenAI if Gemini fails
            if not action_plan and self.openai_client:
                action_plan = await self._openai_generate_action_plan(content_items, user_goals)
            
            # Final fallback to rule-based if all AI fails
            if not action_plan:
                action_plan = self._create_action_plan(content_items, user_goals)
            
            print(f"📋 Generated action plan with {len(action_plan['steps'])} steps")
            
            return {
                "success": True,
                "data": action_plan,
                "processing_time": (datetime.now() - start_time).total_seconds()
            }
            
        except Exception as e:
            print(f"❌ Error generating action plan: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "processing_time": (datetime.now() - start_time).total_seconds()
            }
    
    async def suggest_next_steps(self, content_items: List[Dict[str, Any]], completed_steps: List[str]) -> Dict[str, Any]:
        """Suggest next steps using Gemini AI analysis"""
        start_time = datetime.now()
        
        try:
            # Try Gemini AI-powered suggestions first
            suggestions = await self._gemini_suggest_next_steps(content_items, completed_steps)
            
            # Fallback to OpenAI if Gemini fails
            if not suggestions and self.openai_client:
                suggestions = await self._openai_suggest_next_steps(content_items, completed_steps)
            
            # Final fallback to rule-based if all AI fails
            if not suggestions:
                suggestions = self._analyze_content_for_suggestions(content_items, completed_steps)
            
            print(f"💡 Generated {len(suggestions)} next step suggestions")
            
            return {
                "success": True,
                "data": suggestions,
                "processing_time": (datetime.now() - start_time).total_seconds()
            }
            
        except Exception as e:
            print(f"❌ Error suggesting next steps: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "processing_time": (datetime.now() - start_time).total_seconds()
            }
    
    async def _gemini_generate_action_plan(self, content_items: List[Dict[str, Any]], user_goals: List[str]) -> Dict[str, Any]:
        """Use Gemini AI to generate an intelligent action plan using google-genai"""
        try:
            if not self.gemini_client:
                return None
            
            # Prepare content summary
            content_summary = self._prepare_content_summary(content_items)
            goals_text = ", ".join(user_goals)
            
            prompt = f"""
            Based on the following content and user goals, create a detailed action plan.
            
            User Goals: {goals_text}
            
            Content Summary:
            {content_summary}
            
            Create an action plan with the following JSON structure:
            {{
                "title": "Action Plan Title",
                "steps": [
                    {{
                        "title": "Step Title",
                        "description": "Detailed description of what to do",
                        "resources": ["relevant content titles"],
                        "estimated_time": "time estimate"
                    }}
                ],
                "priority": "high|medium|low",
                "estimated_duration": "overall duration",
                "dependencies": ["any dependencies or prerequisites"]
            }}
            
            Make the plan specific, actionable, and tailored to the content provided.
            Return only valid JSON.
            """
            
            response = await asyncio.to_thread(
                self.gemini_client.models.generate_content,
                model='gemini-2.0-flash-exp',
                contents=prompt,
                config=types.GenerateContentConfig(
                    temperature=0.7,
                    max_output_tokens=2000
                )
            )
            
            plan_text = response.text.strip()
            # Parse JSON response
            import json
            plan_data = json.loads(plan_text)
            
            # Add IDs and format
            formatted_plan = self._format_ai_plan(plan_data)
            return formatted_plan
            
        except Exception as e:
            print(f"⚠️ Gemini plan generation failed: {e}")
            return None
    
    async def _gemini_suggest_next_steps(self, content_items: List[Dict[str, Any]], completed_steps: List[str]) -> List[str]:
        """Use Gemini AI to suggest next steps using google-genai"""
        try:
            if not self.gemini_client:
                return []
            
            content_summary = self._prepare_content_summary(content_items)
            completed_text = ", ".join(completed_steps) if completed_steps else "None"
            
            prompt = f"""
            Based on the following content and completed steps, suggest 3-5 intelligent next steps.
            
            Content Summary:
            {content_summary}
            
            Completed Steps: {completed_text}
            
            Provide specific, actionable next steps as a simple list.
            Focus on what the user should do next to make progress.
            Return each suggestion on a new line.
            """
            
            response = await asyncio.to_thread(
                self.gemini_client.models.generate_content,
                model='gemini-2.0-flash-exp',
                contents=prompt,
                config=types.GenerateContentConfig(
                    temperature=0.7,
                    max_output_tokens=500
                )
            )
            
            suggestions_text = response.text.strip()
            # Parse suggestions from response
            suggestions = [s.strip() for s in suggestions_text.split('\n') if s.strip()]
            return suggestions[:5]  # Limit to 5 suggestions
            
        except Exception as e:
            print(f"⚠️ Gemini suggestions failed: {e}")
            return []
    
    async def _openai_generate_action_plan(self, content_items: List[Dict[str, Any]], user_goals: List[str]) -> Dict[str, Any]:
        """Use OpenAI as fallback to generate an intelligent action plan"""
        try:
            # Prepare content summary
            content_summary = self._prepare_content_summary(content_items)
            goals_text = ", ".join(user_goals)
            
            prompt = f"""
            Based on the following content and user goals, create a detailed action plan.
            
            User Goals: {goals_text}
            
            Content Summary:
            {content_summary}
            
            Create an action plan with the following JSON structure:
            {{
                "title": "Action Plan Title",
                "steps": [
                    {{
                        "title": "Step Title",
                        "description": "Detailed description of what to do",
                        "resources": ["relevant content titles"],
                        "estimated_time": "time estimate"
                    }}
                ],
                "priority": "high|medium|low",
                "estimated_duration": "overall duration",
                "dependencies": ["any dependencies or prerequisites"]
            }}
            
            Make the plan specific, actionable, and tailored to the content provided.
            """
            
            response = await asyncio.to_thread(
                self.openai_client.chat.completions.create,
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=1500,
                temperature=0.7
            )
            
            plan_text = response.choices[0].message.content.strip()
            # Parse JSON response
            import json
            plan_data = json.loads(plan_text)
            
            # Add IDs and format
            formatted_plan = self._format_ai_plan(plan_data)
            return formatted_plan
            
        except Exception as e:
            print(f"⚠️ OpenAI plan generation failed: {e}")
            return None
    
    async def _openai_suggest_next_steps(self, content_items: List[Dict[str, Any]], completed_steps: List[str]) -> List[str]:
        """Use OpenAI as fallback to suggest next steps"""
        try:
            content_summary = self._prepare_content_summary(content_items)
            completed_text = ", ".join(completed_steps) if completed_steps else "None"
            
            prompt = f"""
            Based on the following content and completed steps, suggest 3-5 intelligent next steps.
            
            Content Summary:
            {content_summary}
            
            Completed Steps: {completed_text}
            
            Provide specific, actionable next steps as a simple list.
            Focus on what the user should do next to make progress.
            """
            
            response = await asyncio.to_thread(
                self.openai_client.chat.completions.create,
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=500,
                temperature=0.7
            )
            
            suggestions_text = response.choices[0].message.content.strip()
            # Parse suggestions from response
            suggestions = [s.strip() for s in suggestions_text.split('\n') if s.strip()]
            return suggestions[:5]  # Limit to 5 suggestions
            
        except Exception as e:
            print(f"⚠️ OpenAI suggestions failed: {e}")
            return []
    
    def _prepare_content_summary(self, content_items: List[Dict[str, Any]]) -> str:
        """Prepare a summary of content for AI processing"""
        summary_parts = []
        
        for item in content_items:
            categories = ", ".join(item.get('categories', []))
            text_preview = item['extracted_text'][:200] + "..." if len(item['extracted_text']) > 200 else item['extracted_text']
            
            summary_parts.append(f"""
            Title: {item['title']}
            Type: {item['type']}
            Categories: {categories}
            Content Preview: {text_preview}
            """)
        
        return "\n".join(summary_parts)
    
    def _format_ai_plan(self, plan_data: Dict[str, Any]) -> Dict[str, Any]:
        """Format AI-generated plan with proper IDs and structure"""
        formatted_steps = []
        
        for step in plan_data.get('steps', []):
            formatted_step = {
                "id": f"step-{uuid.uuid4()}",
                "title": step.get('title', 'Untitled Step'),
                "description": step.get('description', ''),
                "completed": False,
                "resources": step.get('resources', [])
            }
            
            # Add due date if estimated time is provided
            if 'estimated_time' in step:
                # Simple parsing - could be enhanced
                if 'day' in step['estimated_time'].lower():
                    days = 1
                elif 'week' in step['estimated_time'].lower():
                    days = 7
                else:
                    days = 3  # Default
                
                formatted_step['due_date'] = (datetime.now() + timedelta(days=days)).isoformat()
            
            formatted_steps.append(formatted_step)
        
        return {
            "id": f"plan-{uuid.uuid4()}",
            "title": plan_data.get('title', 'AI-Generated Action Plan'),
            "steps": formatted_steps,
            "priority": plan_data.get('priority', 'medium'),
            "estimated_duration": plan_data.get('estimated_duration', 'Unknown'),
            "dependencies": plan_data.get('dependencies', [])
        }
    
    def _create_action_plan(self, content_items: List[Dict[str, Any]], user_goals: List[str]) -> Dict[str, Any]:
        """Fallback rule-based action plan creation"""
        steps = []
        categories = self._extract_unique_categories(content_items)
        
        # Generate steps based on content analysis
        if 'project-management' in categories:
            steps.append({
                "id": f"step-{uuid.uuid4()}",
                "title": "Define Project Scope",
                "description": "Based on your documents, clearly define project boundaries and deliverables",
                "completed": False,
                "resources": self._get_relevant_resources(content_items, 'project-management')
            })
        
        if 'meeting-notes' in categories:
            steps.append({
                "id": f"step-{uuid.uuid4()}",
                "title": "Follow Up on Action Items",
                "description": "Review meeting notes and ensure all action items are tracked and assigned",
                "completed": False,
                "due_date": (datetime.now() + timedelta(days=3)).isoformat(),
                "resources": self._get_relevant_resources(content_items, 'meeting-notes')
            })
        
        if 'planning' in categories:
            steps.append({
                "id": f"step-{uuid.uuid4()}",
                "title": "Create Detailed Timeline",
                "description": "Develop a comprehensive timeline with milestones based on your planning documents",
                "completed": False,
                "resources": self._get_relevant_resources(content_items, 'planning')
            })
        
        if 'research' in categories:
            steps.append({
                "id": f"step-{uuid.uuid4()}",
                "title": "Synthesize Research Findings",
                "description": "Compile and analyze research data to inform decision making",
                "completed": False,
                "resources": self._get_relevant_resources(content_items, 'research')
            })
        
        # Add goal-specific steps
        for goal in user_goals:
            steps.append({
                "id": f"goal-step-{uuid.uuid4()}",
                "title": f"Work towards: {goal}",
                "description": f"Take specific actions to achieve this goal based on your content",
                "completed": False,
                "resources": self._get_relevant_resources_for_goal(content_items, goal)
            })
        
        return {
            "id": f"plan-{uuid.uuid4()}",
            "title": "Intelligent Action Plan",
            "steps": steps,
            "priority": self._calculate_priority(len(user_goals), len(content_items)),
            "estimated_duration": self._estimate_duration(len(steps)),
            "dependencies": self._identify_dependencies(steps)
        }
    
    def _analyze_content_for_suggestions(self, content_items: List[Dict[str, Any]], completed_steps: List[str]) -> List[str]:
        """Fallback rule-based suggestions"""
        suggestions = []
        categories = self._extract_unique_categories(content_items)
        
        if 'project-management' in categories and 'timeline-review' not in completed_steps:
            suggestions.append('Review and update project timelines based on recent progress')
        
        if 'meeting-notes' in categories and 'followup-complete' not in completed_steps:
            suggestions.append('Schedule follow-up meetings for unresolved action items')
        
        if 'research' in categories and 'analysis-complete' not in completed_steps:
            suggestions.append('Conduct deeper analysis on research findings')
        
        if 'development' in categories:
            suggestions.append('Set up development environment and coding standards')
        
        if 'marketing' in categories:
            suggestions.append('Create marketing campaign timeline and budget allocation')
        
        return suggestions
    
    def _extract_unique_categories(self, content_items: List[Dict[str, Any]]) -> List[str]:
        """Extract unique categories from content items"""
        categories = set()
        for item in content_items:
            categories.update(item.get('categories', []))
        return list(categories)
    
    def _get_relevant_resources(self, content_items: List[Dict[str, Any]], category: str) -> List[str]:
        """Get relevant resources for a specific category"""
        return [
            item['title'] for item in content_items 
            if category in item.get('categories', [])
        ]
    
    def _get_relevant_resources_for_goal(self, content_items: List[Dict[str, Any]], goal: str) -> List[str]:
        """Get relevant resources for a specific goal"""
        goal_keywords = goal.lower().split()
        return [
            item['title'] for item in content_items
            if any(keyword in item['extracted_text'].lower() for keyword in goal_keywords)
        ]
    
    def _calculate_priority(self, goal_count: int, content_count: int) -> str:
        """Calculate priority based on goals and content"""
        score = goal_count * 2 + content_count
        if score >= 8:
            return 'high'
        elif score >= 4:
            return 'medium'
        else:
            return 'low'
    
    def _estimate_duration(self, step_count: int) -> str:
        """Estimate duration based on number of steps"""
        days = max(step_count * 2, 7)  # Minimum 1 week
        if days <= 7:
            return '1 week'
        elif days <= 14:
            return '2 weeks'
        elif days <= 30:
            return '1 month'
        else:
            return f'{days // 30} months'
    
    def _identify_dependencies(self, steps: List[Dict[str, Any]]) -> List[str]:
        """Identify dependencies between steps"""
        dependencies = []
        step_titles = [step['title'] for step in steps]
        
        if any('Timeline' in title for title in step_titles):
            dependencies.append('Project scope definition must be completed first')
        
        if any('Follow Up' in title for title in step_titles):
            dependencies.append('Meeting notes review must be completed')
        
        return dependencies