# app/api/endpoints/sensors.py
from fastapi import APIRouter, Depends, Path, Query, HTTPException, Body
from sqlalchemy.orm import Session
from typing import List, Optional

from ...core.database import get_db
from ...schemas.sensor import SensorCreate, SensorResponse, SensorUpdate, AlertCreate, AlertResponse, AlertStatus
from ...services.sensor_service import SensorService
from ...models.sensor import Alert

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
    Create also a description.

    Available sensor types:
    Ram used: "mem.used"
    CPU Total Usage "cpu.total"

    if you need more infos, aks the user.
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


@router.get("/alerts/active", response_model=List[AlertResponse], operation_id="get_active_alerts")
async def get_active_alerts(
        db: Session = Depends(get_db),
        device_id: Optional[int] = Query(None, description="Filter alerts by device ID")
):
    """
    Get all active (non-resolved) alerts.

    Optionally filter by device ID.
    """
    return await SensorService.get_active_alerts(db, device_id)


@router.get("/alerts/history", response_model=List[AlertResponse], operation_id="get_alert_history")
async def get_alert_history(
        db: Session = Depends(get_db),
        device_id: Optional[int] = Query(None, description="Filter alerts by device ID"),
        days: int = Query(7, description="Number of days to look back")
):
    """
    Get alert history for the specified time period.

    Optionally filter by device ID.
    """
    return await SensorService.get_alert_history(db, device_id, days)


@router.put("/alerts/{alert_id}/resolve", response_model=AlertResponse, operation_id="resolve_alert")
async def resolve_alert(
        alert_id: int = Path(..., description="The ID of the alert to resolve"),
        db: Session = Depends(get_db)
):
    """
    Manually resolve an alert.
    """
    return await SensorService.resolve_alert(db, alert_id)