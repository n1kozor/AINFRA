# app/api/endpoints/custom.py
from fastapi import APIRouter, Depends, Path, Body, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any

from ...core.database import get_db
from ...services.custom_service import CustomDeviceService

router = APIRouter()


@router.get("/{device_id}/status", operation_id="get_custom_device_status")
async def get_device_status(
        device_id: int = Path(..., description="The ID of the custom device"),
        db: Session = Depends(get_db)
):
    """
    Get status from a custom device using its plugin.
    """
    return await CustomDeviceService.get_device_status(db, device_id)


@router.get("/{device_id}/metrics", operation_id="get_custom_device_metrics")
async def get_device_metrics(
        device_id: int = Path(..., description="The ID of the custom device"),
        db: Session = Depends(get_db)
):
    """
    Get metrics from a custom device using its plugin.

    For Docker containers, this returns all containers and their status.
    Use this endpoint first to see available containers and their IDs.
    """
    return await CustomDeviceService.get_device_metrics(db, device_id)


@router.get("/{device_id}/operations", operation_id="get_custom_device_operations")
async def get_device_operations(
        device_id: int = Path(..., description="The ID of the custom device"),
        db: Session = Depends(get_db)
):
    """
    Get all available operations for a device with usage examples.

    This endpoint helps AI models understand how to control the device by providing:
    1. List of all operations supported by the device
    2. Example parameters for each operation
    3. Expected response format

    Use this endpoint to discover how to interact with a specific device,
    then use the execute_operation endpoint to perform the actual operation.
    """
    return await CustomDeviceService.get_available_operations(db, device_id)


@router.post("/{device_id}/operations/{operation_id}", operation_id="execute_custom_device_operation")
async def execute_operation(
        device_id: int = Path(..., description="The ID of the custom device"),
        operation_id: str = Path(..., description="The ID of the operation to execute"),
        params: Dict[str, Any] = Body({},
                                      description="Parameters for the operation",
                                      examples=[
                                          {
                                              "summary": "Start Docker container",
                                              "description": "Start a stopped Docker container by its ID",
                                              "value": {"container_id": "abc123"}
                                          },
                                          {
                                              "summary": "Stop Docker container",
                                              "description": "Stop a running Docker container by its ID",
                                              "value": {"container_id": "abc123"}
                                          },
                                          {
                                              "summary": "Restart Docker container",
                                              "description": "Restart a Docker container by its ID",
                                              "value": {"container_id": "abc123"}
                                          }
                                      ]
                                      ),
        db: Session = Depends(get_db)
):
    """
    Execute a custom operation on a device.

    First use the get_custom_device_metrics endpoint to see the available devices (like Docker containers)
    Then use the get_custom_device_operations endpoint to see what operations are available.
    Finally, call this endpoint with the appropriate operation_id and parameters.

    Common operations for Docker containers:
    - operation_id="start_container", params={"container_id": "abc123"}
    - operation_id="stop_container", params={"container_id": "abc123"}
    - operation_id="restart_container", params={"container_id": "abc123"}
    - operation_id="refresh_containers", params={}
    - operation_id="prune_containers", params={}

    The available operations and required parameters depend on the specific device plugin.
    """
    return await CustomDeviceService.execute_operation(db, device_id, operation_id, params)