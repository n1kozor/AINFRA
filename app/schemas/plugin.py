from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime

# Base schema
class PluginBase(BaseModel):
    name: str
    description: Optional[str] = None
    version: str
    author: Optional[str] = None

# Create schema
class PluginCreate(PluginBase):
    code: str
    ui_schema: Dict[str, Any] = {}

# Update schema
class PluginUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    version: Optional[str] = None
    author: Optional[str] = None
    code: Optional[str] = None
    ui_schema: Optional[Dict[str, Any]] = None
    is_active: Optional[bool] = None

# Response schema
class PluginResponse(PluginBase):
    id: int
    code: str
    ui_schema: Dict[str, Any]
    created_at: datetime
    updated_at: datetime
    is_active: bool

    class Config:
        from_attributes = True