from pydantic import BaseModel, Field, IPvAnyAddress
from typing import Optional, List, Dict, Any, Union
from datetime import datetime
from enum import Enum

class DeviceType(str, Enum):
    STANDARD = "standard"
    CUSTOM = "custom"

class OSType(str, Enum):
    WINDOWS = "windows"
    MACOS = "macos"
    LINUX = "linux"

# Base schemas
class DeviceBase(BaseModel):
    name: str
    description: Optional[str] = None
    ip_address: IPvAnyAddress

class StandardDeviceBase(BaseModel):
    os_type: OSType
    hostname: str


class CustomDeviceBase(BaseModel):
    plugin_id: int
    connection_params: Dict[str, Any] = {}

# Create schemas
class DeviceCreate(DeviceBase):
    type: DeviceType
    standard_device: Optional[StandardDeviceBase] = None
    custom_device: Optional[CustomDeviceBase] = None

# Update schemas
class DeviceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    ip_address: Optional[IPvAnyAddress] = None
    is_active: Optional[bool] = None

class StandardDeviceUpdate(BaseModel):
    os_type: Optional[OSType] = None
    hostname: Optional[str] = None

class CustomDeviceUpdate(BaseModel):
    plugin_id: Optional[int] = None
    connection_params: Optional[Dict[str, Any]] = None

# Response schemas
class StandardDeviceResponse(StandardDeviceBase):
    id: int

    class Config:
        from_attributes = True

class CustomDeviceResponse(CustomDeviceBase):
    id: int
    plugin_name: Optional[str] = None

    class Config:
        from_attributes = True

class DeviceResponse(DeviceBase):
    id: int
    type: DeviceType
    is_active: bool
    created_at: datetime
    updated_at: datetime
    standard_device: Optional[StandardDeviceResponse] = None
    custom_device: Optional[CustomDeviceResponse] = None

    class Config:
        from_attributes = True