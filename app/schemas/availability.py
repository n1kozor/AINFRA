from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

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

class AvailabilitySettingsUpdate(BaseModel):
    check_interval_minutes: int = Field(..., gt=0, le=1440, description="How often to check device availability (in minutes)")

class UptimeStats(BaseModel):
    device_id: int
    uptime_percent: float
    checks_count: int
    first_check: datetime
    last_check: datetime
    last_state: bool