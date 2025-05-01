# app/api/endpoints/statistics.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import httpx
import asyncio
from typing import Dict, Any

from ...core.database import get_db

router = APIRouter()


@router.get("/all-system-stats", operation_id="get_all_system_statistics")
async def get_system_statistics():
    """
    Get comprehensive monitoring statistics from the availability monitoring service.

    This endpoint aggregates data about ALL device availability, response times,
    errors, and historical trends from the monitoring microservice.
    """
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get("http://localhost:8001/stats")

            if response.status_code != 200:
                return {
                    "error": f"Failed to fetch statistics from monitoring service: HTTP {response.status_code}",
                    "message": "The monitoring service may be unavailable. Please check if it's running."
                }

            return response.json()

    except httpx.RequestError as e:
        return {
            "error": "Failed to connect to monitoring service",
            "message": f"Could not connect to monitoring service at http://localhost:8001: {str(e)}",
            "help": "Please ensure that the availability monitoring microservice is running on port 8001."
        }
    except Exception as e:
        return {
            "error": "Unexpected error retrieving monitoring statistics",
            "message": str(e)
        }