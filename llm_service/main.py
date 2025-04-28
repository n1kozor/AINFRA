# report_service/main.py
import os
from fastapi import FastAPI, Body
from pydantic import BaseModel
from pydantic_ai import Agent
from pydantic_ai.mcp import MCPServerHTTP
from dotenv import load_dotenv
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()



app = FastAPI(
    title="AI Report Generator Service",
    description="Microservice for generating AI-powered reports about infrastructure",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ReportRequest(BaseModel):
    prompt: str
    target_server: str = None
    main_api_url: str = "http://localhost:8000/mcp"


class ReportResponse(BaseModel):
    output: str


@app.post("/generate", response_model=ReportResponse)
async def generate_report(request: ReportRequest = Body(...)):
    """
    Generate AI response
    """
    try:
        server = MCPServerHTTP(url=request.main_api_url)

        agent = Agent("openai:gpt-4.1-mini", mcp_servers=[server])

        prompt = request.prompt
        if request.target_server:
            prompt = f"Server: {request.target_server}\n\n{prompt}"

        async with agent.run_mcp_servers():
            result = await agent.run(prompt)
            return ReportResponse(output=result.output)
    except Exception as e:
        return ReportResponse(output=f"Error: {str(e)}")


@app.get("/")
async def root():
    """
    Service core Endpint
    """
    return {
        "service": "AI Report Generator",
        "status": "running",
        "version": "1.0.0"
    }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)