from fastapi import APIRouter, Depends, Path, Query, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from ...core.database import get_db
from ...schemas.device import DeviceCreate, DeviceResponse, DeviceUpdate, StandardDeviceUpdate, CustomDeviceUpdate
from ...services.device_service import DeviceService

router = APIRouter()

@router.get("/", response_model=List[DeviceResponse], operation_id="get_all_devices")
async def get_devices(
    skip: int = Query(0, description="Skip first N devices"),
    limit: int = Query(100, description="Limit the number of devices returned"),
    db: Session = Depends(get_db)
):
    """
    Get all devices with pagination.
    """
    return await DeviceService.get_devices(db, skip=skip, limit=limit)

@router.get("/{device_id}", response_model=DeviceResponse, operation_id="get_device_by_id")
async def get_device(
    device_id: int = Path(..., description="The ID of the device to get"),
    db: Session = Depends(get_db)
):
    """
    Get a device by ID.
    """
    return await DeviceService.get_device(db, device_id)

@router.post("/", response_model=DeviceResponse, operation_id="create_new_device")
async def create_device(
    device: DeviceCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new device (standard or custom).
    """
    return await DeviceService.create_device(db, device)

@router.put("/{device_id}", response_model=DeviceResponse, operation_id="update_device")
async def update_device(
    device_data: DeviceUpdate,
    device_id: int = Path(..., description="The ID of the device to update"),
    standard_data: Optional[StandardDeviceUpdate] = None,
    custom_data: Optional[CustomDeviceUpdate] = None,
    db: Session = Depends(get_db)
):
    """
    Update a device and its associated details.
    """
    return await DeviceService.update_device(
        db,
        device_id,
        device_data,
        standard_data=standard_data,
        custom_data=custom_data
    )

@router.delete("/{device_id}", operation_id="delete_device")
async def delete_device(
    device_id: int = Path(..., description="The ID of the device to delete"),
    db: Session = Depends(get_db)
):
    """
    Delete a device.
    """
    result = await DeviceService.delete_device(db, device_id)
    if result:
        return {"message": f"Device with ID {device_id} deleted successfully"}
    return {"message": f"Failed to delete device with ID {device_id}"}