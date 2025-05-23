# app/api/endpoints/statistics.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
import httpx
from typing import Dict, Any, Optional

from ...core.database import get_db

router = APIRouter()


# Docker environment detection function
def is_running_in_docker():
    try:
        with open('/proc/1/cgroup', 'rt') as f:
            return 'docker' in f.read()
    except:
        return False


@router.get("/all-system-stats", operation_id="get_all_system_statistics")
async def get_system_statistics(
        time_range: Optional[str] = Query(None,
                                          description="Time range filter: '30m', '1h', '6h', '24h', '7d' or 'all'")
):
    """
    Get comprehensive monitoring statistics from the availability monitoring service.

    This endpoint aggregates data about device availability, response times,
    errors, and historical trends from the monitoring microservice.

    Parameters:
    - time_range: Optional filter to limit data to a specific time range
    - Time range filter: '30m', '1h', '6h', '24h', '7d' or 'all'
    """
    try:
        # Use appropriate host based on environment
        host = "availability_service" if is_running_in_docker() else "localhost"

        async with httpx.AsyncClient(timeout=10.0) as client:
            # Build the URL with query parameters if provided
            url = f"http://{host}:8001/stats"
            if time_range:
                url += f"?time_range={time_range}"

            print(f"Connecting to monitoring service at: {url}")

            response = await client.get(url)

            if response.status_code != 200:
                return {
                    "error": f"Failed to fetch statistics from monitoring service: HTTP {response.status_code}",
                    "message": "The monitoring service may be unavailable. Please check if it's running."
                }

            return response.json()

    except httpx.RequestError as e:
        host_used = "availability_service" if is_running_in_docker() else "localhost"
        return {
            "error": "Failed to connect to monitoring service",
            "message": f"Could not connect to monitoring service at http://{host_used}:8001: {str(e)}",
            "help": "Please ensure that the availability monitoring microservice is running on port 8001."
        }
    except Exception as e:
        return {
            "error": "Unexpected error retrieving monitoring statistics",
            "message": str(e)
        }