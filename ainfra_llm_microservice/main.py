import os

from fastapi import FastAPI, Body, HTTPException, Query
from pydantic import BaseModel
from pydantic_ai import Agent
from pydantic_ai.mcp import MCPServerHTTP
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from enum import Enum
from typing import List, Optional
import database
import openai_client

app = FastAPI(
    title="AInfra LLM Service API",
    description="Microservice for generating AI-powered reports about devices",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class DeviceType(str, Enum):
    standard_device = "standard_device"
    custom_device = "custom_device"


class ReportRequest(BaseModel):
    prompt: str
    target_device_id: str = None
    target_device_name: str = None
    device_type: DeviceType = DeviceType.standard_device
    model: str = None  # Optional model override


class StatisticsRequest(BaseModel):
    prompt: str
    model: str = None  # Optional model override


class ReportResponse(BaseModel):
    output: str


class SettingsUpdate(BaseModel):
    openai_api_key: Optional[str] = None
    default_model: Optional[str] = None
    mcp_base_url: Optional[str] = None


class Settings(BaseModel):
    openai_api_key: str
    default_model: str
    mcp_base_url: str


class ModelInfo(BaseModel):
    id: str
    name: str
    provider: str


class ModelsList(BaseModel):
    models: List[ModelInfo]


def get_model_config():
    """Get the model configuration from the database"""
    settings = database.get_all_settings()
    return {
        "default_model": settings.get("default_model", "gpt-4.1-mini"),
        "openai_api_key": settings.get("openai_api_key", ""),
        "mcp_base_url": settings.get("mcp_base_url", "http://localhost:8000/mcp")
    }


@app.post("/generate", response_model=ReportResponse)
async def generate_report(request: ReportRequest = Body(...)):
    """
    Generate AI response for a specific report request
    """
    try:
        config = get_model_config()

        if not config["openai_api_key"]:
            raise HTTPException(status_code=400, detail="API key not configured")

        # Use model from request if provided, otherwise use default
        model_name = request.model or config["default_model"]

        # IMPORTANT: Set the environment variable with the API key from database
        # This is necessary because pydantic_ai may be using openai SDK internally
        # which looks for this environment variable
        os.environ["OPENAI_API_KEY"] = config["openai_api_key"]

        server = MCPServerHTTP(url=config["mcp_base_url"])
        agent = Agent(f"openai:{model_name}", mcp_servers=[server])

        prompt = request.prompt
        if request.target_device_id or request.target_device_name:
            device_info = (
                f"Device ID: {request.target_device_id or 'N/A'}, "
                f"Device Name: {request.target_device_name or 'N/A'}, "
                f"Device Type: {request.device_type.value}"
            )
            prompt = f"{device_info}\n\n{prompt}"

        # Debug print to show the prompt being sent to the LLM
        print("=" * 50)
        print(f"DEBUG - /generate endpoint - Using model: {model_name}")
        print("DEBUG - Using API key from database: {key_preview}".format(
            key_preview=config["openai_api_key"][:5] + "..." if config["openai_api_key"] else "None"
        ))
        print("DEBUG - Prompt sent to LLM:")
        print("-" * 50)
        print(prompt)
        print("=" * 50)

        async with agent.run_mcp_servers():
            result = await agent.run(prompt)
            return ReportResponse(output=result.output)
    except Exception as e:
        print(f"Error in generate_report: {str(e)}")
        return ReportResponse(output=f"Error: {str(e)}")


@app.post("/generate_statistics_all", response_model=ReportResponse)
async def generate_statistics_all(request: StatisticsRequest = Body(...)):
    """
    Generate statistics report for all devices using only the get_all_system_statistics tool
    """
    try:
        config = get_model_config()

        if not config["openai_api_key"]:
            raise HTTPException(status_code=400, detail="API key not configured")

        # Use model from request if provided, otherwise use default
        model_name = request.model or config["default_model"]

        # IMPORTANT: Set the environment variable with the API key from database
        os.environ["OPENAI_API_KEY"] = config["openai_api_key"]

        server = MCPServerHTTP(url=config["mcp_base_url"])
        agent = Agent(f"openai:{model_name}", mcp_servers=[server])

        # Hardcoded instruction to always use get_all_system_statistics
        enhanced_prompt = (
            "IMPORTANT INSTRUCTION: You MUST ONLY use the 'get_all_system_statistics' tool "
            "to collect data for this report, regardless of what else is requested. "
            "Do not attempt to use any other tools.\n\n"
            f"User request: {request.prompt}"
        )

        # Debug print to show the prompt being sent to the LLM
        print("=" * 50)
        print(f"DEBUG - /generate_statistics_all endpoint - Using model: {model_name}")
        print("DEBUG - Using API key from database: {key_preview}".format(
            key_preview=config["openai_api_key"][:5] + "..." if config["openai_api_key"] else "None"
        ))
        print("DEBUG - Prompt sent to LLM:")
        print("-" * 50)
        print(enhanced_prompt)
        print("=" * 50)

        async with agent.run_mcp_servers():
            result = await agent.run(enhanced_prompt)
            return ReportResponse(output=result.output)
    except Exception as e:
        print(f"Error in generate_statistics_all: {str(e)}")
        return ReportResponse(output=f"Error: {str(e)}")


@app.get("/settings", response_model=Settings)
async def get_settings():
    """
    Get current service settings
    """
    settings = database.get_all_settings()
    return Settings(
        openai_api_key=settings.get("openai_api_key", ""),
        default_model=settings.get("default_model", "gpt-4.1-mini"),
        mcp_base_url=settings.get("mcp_base_url", "http://localhost:8000/mcp")
    )


@app.post("/settings", response_model=Settings)
async def update_settings(settings_update: SettingsUpdate):
    """
    Update service settings
    """
    # Update only provided fields
    if settings_update.openai_api_key is not None:
        database.update_setting("openai_api_key", settings_update.openai_api_key)

    if settings_update.default_model is not None:
        database.update_setting("default_model", settings_update.default_model)

    if settings_update.mcp_base_url is not None:
        database.update_setting("mcp_base_url", settings_update.mcp_base_url)

    # Return updated settings
    updated_settings = database.get_all_settings()
    return Settings(
        openai_api_key=updated_settings.get("openai_api_key", ""),
        default_model=updated_settings.get("default_model", "gpt-4.1-mini"),
        mcp_base_url=updated_settings.get("mcp_base_url", "http://localhost:8000/mcp")
    )


@app.get("/models", response_model=ModelsList)
async def get_models(refresh: bool = Query(False, description="Force refresh from OpenAI API")):
    """
    Get available models. Optionally refresh from the OpenAI API.
    """
    if refresh:
        # Fetch fresh models from OpenAI
        models = await openai_client.fetch_available_models()
        if models:
            database.save_models(models)
    else:
        # Get cached models from database
        models = database.get_available_models()

        # If no models in database, try to fetch them
        if not models:
            models = await openai_client.fetch_available_models()
            if models:
                database.save_models(models)

    return ModelsList(models=[ModelInfo(**model) for model in models])


@app.get("/")
async def root():
    """
    Service core Endpoint
    """
    return {
        "service": "AI Report Generator",
        "status": "running",
        "version": "1.0.0"
    }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8002)