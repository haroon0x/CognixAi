#!/usr/bin/env python3
"""
Cognix Backend Startup Script
"""
import uvicorn
import os
import sys

def main():
    """Start the Cognix backend server"""
    print("🧠 Starting Cognix Backend API...")
    print("📡 Server will be available at: http://localhost:8000")
    print("📚 API Documentation: http://localhost:8000/docs")
    print("🔄 CORS enabled for frontend at: http://localhost:5173")
    
    try:
        uvicorn.run(
            "main:app",
            host="0.0.0.0",
            port=8000,
            reload=True,
            log_level="info"
        )
    except KeyboardInterrupt:
        print("\n👋 Shutting down Cognix Backend...")
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()