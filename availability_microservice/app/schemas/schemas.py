# app/schemas/schemas.py
from pydantic import BaseModel, Field, IPvAnyAddress
from typing import List, Dict, Any, Optional
from datetime import datetime

# Availability Check schemas
class AvailabilityCheckBase(BaseModel):
    device_id: int
    is_available: bool
    response_time: Optional[float] = None
    check_method: str
    error_message: Optional[str] = None


class AvailabilityCheckCreate(AvailabilityCheckBase):
    pass


class AvailabilityCheckResponse(AvailabilityCheckBase):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True


# Settings schemas
class AvailabilitySettingsUpdate(BaseModel):
    check_interval_minutes: int = Field(..., gt=0, le=1440,
                                       description="How often to check device availability (in minutes)")


class UptimeStats(BaseModel):
    device_id: int
    uptime_percent: float
    checks_count: int
    first_check: datetime
    last_check: datetime
    last_state: bool


# Device schemas
class DeviceCreate(BaseModel):
    name: str
    ip_address: IPvAnyAddress
    is_active: bool = True


class DeviceUpdate(BaseModel):
    name: Optional[str] = None
    ip_address: Optional[IPvAnyAddress] = None
    is_active: Optional[bool] = None


class DeviceResponse(BaseModel):
    id: int
    name: str
    ip_address: str
    is_active: bool

    class Config:
        from_attributes = True