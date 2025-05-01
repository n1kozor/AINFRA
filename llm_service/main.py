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
    target_device_id: str = None
    target_device_name: str = None
    main_api_url: str = "http://localhost:8000/mcp"


class StatisticsRequest(BaseModel):
    prompt: str


class ReportResponse(BaseModel):
    output: str


@app.post("/generate", response_model=ReportResponse)
async def generate_report(request: ReportRequest = Body(...)):
    """
    Generate AI response
    """
    try:
        server = MCPServerHTTP(url=request.main_api_url)

        agent = Agent("openai:gpt-4.1", mcp_servers=[server])

        prompt = request.prompt
        if request.target_device_id or request.target_device_name:
            device_info = f"Device ID: {request.target_device_id or 'N/A'}, Device Name: {request.target_device_name or 'N/A'}"
            prompt = f"{device_info}\n\n{prompt}"

        async with agent.run_mcp_servers():
            result = await agent.run(prompt)
            return ReportResponse(output=result.output)
    except Exception as e:
        return ReportResponse(output=f"Error: {str(e)}")


@app.post("/generate_statistics_all", response_model=ReportResponse)
async def generate_statistics_all(request: StatisticsRequest = Body(...)):
    """
    Generate statistics report for all devices using only the get_all_system_statistics tool
    """
    try:
        server = MCPServerHTTP(url="http://localhost:8000/mcp")
        agent = Agent("openai:gpt-4.1", mcp_servers=[server])

        # Hardcoded instruction to always use get_all_system_statistics
        enhanced_prompt = (
            "IMPORTANT INSTRUCTION: You MUST ONLY use the 'get_all_system_statistics' tool "
            "to collect data for this report, regardless of what else is requested. "
            "Do not attempt to use any other tools.\n\n"
            f"User request: {request.prompt}"
        )

        async with agent.run_mcp_servers():
            result = await agent.run(enhanced_prompt)
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
    uvicorn.run(app, host="0.0.0.0", port=8002)