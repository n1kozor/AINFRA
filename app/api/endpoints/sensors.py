from fastapi import APIRouter, Depends, Path, Query, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ...core.database import get_db
from ...schemas.sensor import SensorCreate, SensorResponse, SensorUpdate, AlertCreate, AlertResponse
from ...services.sensor_service import SensorService

router = APIRouter()

@router.get("/", response_model=List[SensorResponse], operation_id="get_all_sensors")
async def get_sensors(
    skip: int = Query(0, description="Skip first N sensors"),
    limit: int = Query(100, description="Limit the number of sensors returned"),
    db: Session = Depends(get_db)
):
    """
    Get all sensors with pagination.
    """
    return await SensorService.get_sensors(db, skip=skip, limit=limit)

@router.get("/device/{device_id}", response_model=List[SensorResponse], operation_id="get_device_sensors")
async def get_device_sensors(
    device_id: int = Path(..., description="The ID of the device"),
    db: Session = Depends(get_db)
):
    """
    Get all sensors for a specific device.
    """
    return await SensorService.get_device_sensors(db, device_id)

@router.get("/{sensor_id}", response_model=SensorResponse, operation_id="get_sensor_by_id")
async def get_sensor(
    sensor_id: int = Path(..., description="The ID of the sensor to get"),
    db: Session = Depends(get_db)
):
    """
    Get a sensor by ID.
    """
    return await SensorService.get_sensor(db, sensor_id)

@router.post("/", response_model=SensorResponse, operation_id="create_new_sensor")
async def create_sensor(
    sensor: SensorCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new sensor.
    """
    return await SensorService.create_sensor(db, sensor)

@router.put("/{sensor_id}", response_model=SensorResponse, operation_id="update_sensor")
async def update_sensor(
    sensor_data: SensorUpdate,
    sensor_id: int = Path(..., description="The ID of the sensor to update"),
    db: Session = Depends(get_db)
):
    """
    Update a sensor.
    """
    return await SensorService.update_sensor(db, sensor_id, sensor_data)

@router.delete("/{sensor_id}", operation_id="delete_sensor")
async def delete_sensor(
    sensor_id: int = Path(..., description="The ID of the sensor to delete"),
    db: Session = Depends(get_db)
):
    """
    Delete a sensor.
    """
    result = await SensorService.delete_sensor(db, sensor_id)
    if result:
        return {"message": f"Sensor with ID {sensor_id} deleted successfully"}
    return {"message": f"Failed to delete sensor with ID {sensor_id}"}

@router.post("/alerts", response_model=AlertResponse, operation_id="create_sensor_alert")
async def create_alert(
    alert: AlertCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new alert for a sensor.
    """
    return await SensorService.create_alert(db, alert)