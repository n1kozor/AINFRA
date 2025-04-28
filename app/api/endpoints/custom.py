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
    """
    return await CustomDeviceService.get_device_metrics(db, device_id)

@router.post("/{device_id}/operations/{operation_id}", operation_id="execute_custom_device_operation")
async def execute_operation(
    device_id: int = Path(..., description="The ID of the custom device"),
    operation_id: str = Path(..., description="The ID of the operation to execute"),
    params: Dict[str, Any] = Body({}, description="Parameters for the operation"),
    db: Session = Depends(get_db)
):
    """
    Execute a custom operation on a device.
    """
    return await CustomDeviceService.execute_operation(db, device_id, operation_id, params)