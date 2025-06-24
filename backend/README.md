# Cognix Backend API

This is the Python backend for Cognix, built with FastAPI and Google Gemini AI for intelligent content processing.

## Features

- **Multi-Agent Architecture**: Collector, Context Mapper, and Planner agents
- **Google Gemini AI Integration**: Real AI processing using google-genai with fallback implementations
- **RESTful API**: Clean endpoints for frontend integration
- **File Processing**: PDF, image, and text content extraction with AI enhancement
- **YouTube Integration**: Transcript extraction and analysis
- **Action Planning**: Intelligent task generation based on content and goals

## Setup

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Set up Google AI API Key**:
   ```bash
   export GOOGLE_API_KEY=your_google_api_key_here
   ```

3. **Start the Server**:
   ```bash
   python start.py
   ```

The server will start at `http://localhost:8000` with automatic reload enabled.

## API Endpoints

### Content Processing
- `POST /api/upload/files` - Upload and process files
- `POST /api/upload/text` - Process text input
- `POST /api/upload/youtube` - Process YouTube URLs
- `GET /api/content` - Get all processed content

### Action Planning
- `POST /api/generate-plan` - Generate action plan from content and goals
- `GET /api/action-plans` - Get all action plans
- `PUT /api/action-plans/{plan_id}/steps/{step_id}/toggle` - Toggle step completion

### Documentation
- `GET /docs` - Interactive API documentation (Swagger UI)
- `GET /redoc` - Alternative API documentation

## Architecture

### Agents

1. **CollectorAgent** (`agents/collector_agent.py`)
   - Extracts content from PDFs, images, YouTube videos, and text
   - Uses Gemini AI for content enhancement and cleanup
   - Falls back to mock implementations for development

2. **ContextMapperAgent** (`agents/context_mapper_agent.py`)
   - Categorizes content using Gemini AI classification
   - Calculates relevance scores with AI analysis
   - Identifies relationships between content items

3. **PlannerAgent** (`agents/planner_agent.py`)
   - Generates intelligent action plans using Gemini AI
   - Suggests next steps based on content analysis
   - Prioritizes tasks based on user goals

### Google Gemini AI Integration

The backend uses the latest `google-genai` package with Gemini 2.0 Flash Experimental model:

```python
import google.genai as genai
from google.genai import types

# Initialize client
client = genai.Client(api_key=os.getenv('GOOGLE_API_KEY'))

# Generate content
response = client.models.generate_content(
    model='gemini-2.0-flash-exp',
    contents=prompt,
    config=types.GenerateContentConfig(
        temperature=0.7,
        max_output_tokens=1000
    )
)
```

## AI Models Used

- **Primary**: Gemini 2.0 Flash Experimental (`gemini-2.0-flash-exp`)
- **Fallback**: OpenAI GPT-3.5-turbo (if configured)
- **Local Fallback**: Rule-based processing for development

## Development

The system includes comprehensive error handling and graceful fallbacks:

- If Google AI is not available, OpenAI is used as fallback
- If no AI is available, rule-based implementations are used
- All agents work independently and can be tested in isolation
- CORS is configured for frontend development
- Automatic API documentation generation

## Production Deployment

For production deployment:

1. Set up proper environment variables (especially `GOOGLE_API_KEY`)
2. Configure database instead of in-memory storage
3. Add authentication and authorization
4. Set up proper logging and monitoring
5. Configure HTTPS and security headers

## Environment Variables

You can add any API key or secret to a `.env` file in the project root. All variables are loaded and available to the backend, whether or not they are prefixed. Example keys:

```
GOOGLE_API_KEY=your_google_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
COGNIX_CUSTOM_KEY=your_custom_value
```

- All variables in `.env` are available via `os.environ` and `config.get_api_key('KEY_NAME')`.
- You can add any key you need; extra fields are allowed.
- See `.env.example` for a template.