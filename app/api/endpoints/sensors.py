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
    Creates a new sensor for monitoring CPU or RAM usage on a standard device.

    ## Required parameters:
    - `name`: Human-readable name for the sensor (e.g., "High CPU Alert", "Memory Warning")
    - `description`: Detailed description of what this sensor monitors
    - `device_id`: ID of the standard device to monitor
    - `metric_key`: The specific metric to monitor (see supported types below)
    - `alert_condition`: The condition that triggers an alert (see format below)
    - `alert_level`: Severity level ("INFO", "WARNING", "CRITICAL")

    ## Supported sensor types (metric_key):
    1. RAM Usage: "mem.used"
       - Monitors memory usage in megabytes (MB)
       - Example: Create an alert when RAM usage exceeds 2000 MB

    2. CPU Total Usage: "cpu.total"
       - Monitors CPU usage as a percentage (0-100)
       - Example: Create an alert when CPU usage exceeds 80%

    ## Alert condition format:
    The alert_condition must use one of these comparison operators followed by a threshold value:
    - `>` greater than (e.g., ">80" triggers when value is above 80)
    - `<` less than (e.g., "<10" triggers when value is below 10)
    - `>=` greater than or equal to (e.g., ">=90" triggers when value is 90 or above)
    - `<=` less than or equal to (e.g., "<=5" triggers when value is 5 or below)
    - `==` equal to (e.g., "==0" triggers when value is exactly 0)
    - `!=` not equal to (e.g., "!=0" triggers when value is not 0)

    ## Examples:

    1. Create a RAM usage alert:
    ```json
    {
      "name": "High Memory Usage Alert",
      "description": "Alerts when system memory usage exceeds 2GB",
      "device_id": 1,
      "metric_key": "mem.used",
      "alert_condition": ">2000",
      "alert_level": "WARNING"
    }
    ```

    2. Create a CPU usage alert:
    ```json
    {
      "name": "Critical CPU Load",
      "description": "Alerts when CPU usage exceeds 90%",
      "device_id": 1,
      "metric_key": "cpu.total",
      "alert_condition": ">=90",
      "alert_level": "CRITICAL"
    }
    ```

    3. Create a low CPU usage alert:
    ```json
    {
      "name": "Idle CPU Alert",
      "description": "Detects when CPU usage is abnormally low",
      "device_id": 1,
      "metric_key": "cpu.total",
      "alert_condition": "<5",
      "alert_level": "INFO"
    }
    ```
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