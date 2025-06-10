import asyncio
from typing import Dict, Any, List
import uuid
from datetime import datetime
import re
import os

# Try to import AI libraries for real processing
try:
    import google.genai as genai
    from google.genai import types
    HAS_GEMINI = True
except ImportError:
    HAS_GEMINI = False
    print("⚠️ google-genai not available, using fallback implementations")

try:
    import openai
    HAS_OPENAI = True
except ImportError:
    HAS_OPENAI = False
    print("⚠️ openai not available, using fallback implementations")

class ContextMapperAgent:
    """Agent responsible for categorizing content and mapping relationships using Gemini AI"""
    
    def __init__(self):
        self.name = "ContextMapperAgent"
        self.description = "Categorizes content, calculates relevance scores, and identifies relationships using Gemini AI"
        
        # Initialize AI clients with Gemini as primary
        self.gemini_client = None
        self.openai_client = None
        
        # Try to initialize Gemini first (primary) using google-genai
        if HAS_GEMINI and os.getenv('GOOGLE_API_KEY'):
            try:
                self.gemini_client = genai.Client(api_key=os.getenv('GOOGLE_API_KEY'))
                print("✅ Gemini AI client initialized with google-genai (primary)")
            except Exception as e:
                print(f"⚠️ Gemini initialization failed: {e}")
        
        # Try to initialize OpenAI as fallback
        if HAS_OPENAI and os.getenv('OPENAI_API_KEY'):
            try:
                self.openai_client = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
                print("✅ OpenAI client initialized (fallback)")
            except Exception as e:
                print(f"⚠️ OpenAI initialization failed: {e}")
        
        print(f"✅ Initialized {self.name}")
    
    async def categorize_content(self, content_items: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Categorize content items and calculate relevance scores using Gemini AI"""
        start_time = datetime.now()
        
        try:
            categorized_items = []
            
            for item in content_items:
                # Try Gemini AI-powered categorization first
                categories = await self._gemini_categorize(item["extracted_text"], item["title"])
                relevance_score = await self._gemini_calculate_relevance(item["extracted_text"])
                
                # Fallback to OpenAI if Gemini fails
                if not categories and self.openai_client:
                    categories = await self._openai_categorize(item["extracted_text"], item["title"])
                if relevance_score is None and self.openai_client:
                    relevance_score = await self._openai_calculate_relevance(item["extracted_text"])
                
                # Final fallback to rule-based if all AI fails
                if not categories:
                    categories = self._extract_categories(item["extracted_text"])
                if relevance_score is None:
                    relevance_score = self._calculate_relevance_score(item["extracted_text"])
                
                categorized_item = {
                    **item,
                    "categories": categories,
                    "relevance_score": relevance_score
                }
                categorized_items.append(categorized_item)
                
                print(f"🏷️ Categorized '{item['title']}': {categories} (relevance: {relevance_score:.2f})")
            
            return {
                "success": True,
                "data": categorized_items,
                "processing_time": (datetime.now() - start_time).total_seconds()
            }
            
        except Exception as e:
            print(f"❌ Error categorizing content: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "processing_time": (datetime.now() - start_time).total_seconds()
            }
    
    async def find_relationships(self, content_items: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Find relationships between content items using Gemini AI"""
        start_time = datetime.now()
        
        try:
            relationships = []
            
            for i in range(len(content_items)):
                for j in range(i + 1, len(content_items)):
                    # Try Gemini AI-powered relationship analysis first
                    similarity = await self._gemini_calculate_similarity(
                        content_items[i]["extracted_text"],
                        content_items[j]["extracted_text"]
                    )
                    
                    # Fallback to OpenAI if Gemini fails
                    if similarity is None and self.openai_client:
                        similarity = await self._openai_calculate_similarity(
                            content_items[i]["extracted_text"],
                            content_items[j]["extracted_text"]
                        )
                    
                    # Final fallback to rule-based if all AI fails
                    if similarity is None:
                        similarity = self._calculate_similarity(
                            content_items[i]["extracted_text"],
                            content_items[j]["extracted_text"]
                        )
                    
                    common_topics = self._find_common_topics(
                        content_items[i]["categories"],
                        content_items[j]["categories"]
                    )
                    
                    if similarity > 0.3:
                        relationships.append({
                            "item1": content_items[i]["id"],
                            "item2": content_items[j]["id"],
                            "similarity": similarity,
                            "common_topics": common_topics
                        })
            
            print(f"🔗 Found {len(relationships)} relationships between content items")
            
            return {
                "success": True,
                "data": relationships,
                "processing_time": (datetime.now() - start_time).total_seconds()
            }
            
        except Exception as e:
            print(f"❌ Error finding relationships: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "processing_time": (datetime.now() - start_time).total_seconds()
            }
    
    async def _gemini_categorize(self, text: str, title: str) -> List[str]:
        """Use Gemini AI to categorize content using google-genai"""
        try:
            if not self.gemini_client:
                return []
            
            prompt = f"""
            Analyze the following content and categorize it into relevant categories.
            Choose from these categories: project-management, meeting-notes, planning, research, 
            development, marketing, finance, education, documentation, general.
            
            Title: {title}
            Content: {text[:1000]}...
            
            Return only the category names as a comma-separated list.
            Example: project-management, planning
            """
            
            response = await asyncio.to_thread(
                self.gemini_client.models.generate_content,
                model='gemini-2.0-flash-exp',
                contents=prompt,
                config=types.GenerateContentConfig(
                    temperature=0.3,
                    max_output_tokens=100
                )
            )
            
            categories_text = response.text.strip()
            return [cat.strip() for cat in categories_text.split(',') if cat.strip()]
            
        except Exception as e:
            print(f"⚠️ Gemini categorization failed: {e}")
            return []
    
    async def _gemini_calculate_relevance(self, text: str) -> float:
        """Use Gemini AI to calculate relevance score using google-genai"""
        try:
            if not self.gemini_client:
                return None
            
            prompt = f"""
            Analyze the following content and rate its relevance/quality on a scale of 0.0 to 1.0.
            Consider factors like clarity, actionability, completeness, and usefulness.
            
            Content: {text[:1000]}...
            
            Return only a number between 0.0 and 1.0.
            Example: 0.85
            """
            
            response = await asyncio.to_thread(
                self.gemini_client.models.generate_content,
                model='gemini-2.0-flash-exp',
                contents=prompt,
                config=types.GenerateContentConfig(
                    temperature=0.1,
                    max_output_tokens=10
                )
            )
            
            score_text = response.text.strip()
            return float(score_text)
            
        except Exception as e:
            print(f"⚠️ Gemini relevance calculation failed: {e}")
            return None
    
    async def _gemini_calculate_similarity(self, text1: str, text2: str) -> float:
        """Use Gemini AI to calculate similarity between texts using google-genai"""
        try:
            if not self.gemini_client:
                return None
            
            prompt = f"""
            Compare these two texts and rate their similarity on a scale of 0.0 to 1.0.
            Consider semantic similarity, topic overlap, and content relevance.
            
            Text 1: {text1[:500]}...
            Text 2: {text2[:500]}...
            
            Return only a number between 0.0 and 1.0.
            Example: 0.72
            """
            
            response = await asyncio.to_thread(
                self.gemini_client.models.generate_content,
                model='gemini-2.0-flash-exp',
                contents=prompt,
                config=types.GenerateContentConfig(
                    temperature=0.1,
                    max_output_tokens=10
                )
            )
            
            score_text = response.text.strip()
            return float(score_text)
            
        except Exception as e:
            print(f"⚠️ Gemini similarity calculation failed: {e}")
            return None
    
    async def _openai_categorize(self, text: str, title: str) -> List[str]:
        """Use OpenAI as fallback to categorize content"""
        try:
            prompt = f"""
            Analyze the following content and categorize it into relevant categories.
            Choose from these categories: project-management, meeting-notes, planning, research, 
            development, marketing, finance, education, documentation, general.
            
            Title: {title}
            Content: {text[:1000]}...
            
            Return only the category names as a comma-separated list.
            """
            
            response = await asyncio.to_thread(
                self.openai_client.chat.completions.create,
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=100,
                temperature=0.3
            )
            categories_text = response.choices[0].message.content.strip()
            return [cat.strip() for cat in categories_text.split(',')]
        except Exception as e:
            print(f"⚠️ OpenAI categorization failed: {e}")
            return []
    
    async def _openai_calculate_relevance(self, text: str) -> float:
        """Use OpenAI as fallback to calculate relevance score"""
        try:
            prompt = f"""
            Analyze the following content and rate its relevance/quality on a scale of 0.0 to 1.0.
            Consider factors like clarity, actionability, completeness, and usefulness.
            
            Content: {text[:1000]}...
            
            Return only a number between 0.0 and 1.0.
            """
            
            response = await asyncio.to_thread(
                self.openai_client.chat.completions.create,
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=10,
                temperature=0.1
            )
            score_text = response.choices[0].message.content.strip()
            return float(score_text)
        except Exception as e:
            print(f"⚠️ OpenAI relevance calculation failed: {e}")
            return None
    
    async def _openai_calculate_similarity(self, text1: str, text2: str) -> float:
        """Use OpenAI as fallback to calculate similarity between texts"""
        try:
            prompt = f"""
            Compare these two texts and rate their similarity on a scale of 0.0 to 1.0.
            Consider semantic similarity, topic overlap, and content relevance.
            
            Text 1: {text1[:500]}...
            Text 2: {text2[:500]}...
            
            Return only a number between 0.0 and 1.0.
            """
            
            response = await asyncio.to_thread(
                self.openai_client.chat.completions.create,
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=10,
                temperature=0.1
            )
            score_text = response.choices[0].message.content.strip()
            return float(score_text)
        except Exception as e:
            print(f"⚠️ OpenAI similarity calculation failed: {e}")
            return None
    
    def _extract_categories(self, text: str) -> List[str]:
        """Fallback rule-based category extraction"""
        categories = []
        lowercase_text = text.lower()
        
        category_keywords = {
            'project-management': ['project', 'timeline', 'milestone', 'deadline', 'scope', 'deliverable'],
            'meeting-notes': ['meeting', 'agenda', 'attendees', 'action items', 'notes', 'discussion'],
            'planning': ['plan', 'strategy', 'objective', 'goal', 'roadmap', 'vision'],
            'research': ['research', 'analysis', 'data', 'study', 'findings', 'investigation'],
            'development': ['development', 'code', 'programming', 'technical', 'software', 'implementation'],
            'marketing': ['marketing', 'campaign', 'promotion', 'brand', 'advertising', 'customer'],
            'finance': ['budget', 'cost', 'revenue', 'financial', 'expense', 'profit'],
            'education': ['learn', 'tutorial', 'course', 'training', 'education', 'knowledge'],
            'documentation': ['documentation', 'manual', 'guide', 'instructions', 'specification']
        }
        
        for category, keywords in category_keywords.items():
            if any(keyword in lowercase_text for keyword in keywords):
                categories.append(category)
        
        return categories if categories else ['general']
    
    def _calculate_relevance_score(self, text: str) -> float:
        """Fallback rule-based relevance scoring"""
        quality_indicators = [
            'objective', 'goal', 'plan', 'action', 'timeline',
            'deliverable', 'requirement', 'milestone', 'task',
            'strategy', 'implementation', 'analysis', 'solution'
        ]
        
        lowercase_text = text.lower()
        matches = sum(1 for indicator in quality_indicators if indicator in lowercase_text)
        
        # Bonus for length and structure
        word_count = len(text.split())
        length_bonus = min(word_count / 500, 0.3)  # Up to 0.3 bonus for longer content
        
        base_score = min(matches / len(quality_indicators), 0.7)
        return min(base_score + length_bonus, 1.0)
    
    def _calculate_similarity(self, text1: str, text2: str) -> float:
        """Fallback rule-based similarity calculation"""
        words1 = set(text1.lower().split())
        words2 = set(text2.lower().split())
        
        intersection = words1.intersection(words2)
        union = words1.union(words2)
        
        return len(intersection) / len(union) if union else 0
    
    def _find_common_topics(self, categories1: List[str], categories2: List[str]) -> List[str]:
        """Find common categories between two items"""
        return list(set(categories1).intersection(set(categories2)))