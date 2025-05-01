# app/schemas/sensor.py
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class AlertLevel(str, Enum):
    INFO = "info"
    WARNING = "warning"
    CRITICAL = "critical"

class AlertStatus(str, Enum):
    NEW = "new"
    ONGOING = "ongoing"
    RESOLVED = "resolved"

# Base schemas
class SensorBase(BaseModel):
    name: str
    description: Optional[str] = None
    metric_key: str
    alert_condition: str
    alert_level: AlertLevel = AlertLevel.WARNING

# Create schema
class SensorCreate(SensorBase):
    device_id: int

# Update schema
class SensorUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    metric_key: Optional[str] = None
    alert_condition: Optional[str] = None
    alert_level: Optional[AlertLevel] = None
    is_active: Optional[bool] = None

# Alert schemas
class AlertBase(BaseModel):
    value: float
    message: str
    is_resolved: bool = False

class AlertCreate(AlertBase):
    sensor_id: int

class AlertResponse(AlertBase):
    id: int
    sensor_id: int
    timestamp: datetime
    status: AlertStatus
    first_detected_at: datetime
    last_checked_at: datetime
    resolution_time: Optional[datetime] = None
    consecutive_checks: int = 1

    class Config:
        from_attributes = True

# Response schema
class SensorResponse(SensorBase):
    id: int
    device_id: int
    created_at: datetime
    updated_at: datetime
    is_active: bool
    alerts: List[AlertResponse] = []

    class Config:
        from_attributes = True