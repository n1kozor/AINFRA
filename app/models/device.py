from sqlalchemy import Column, Integer, String, ForeignKey, Enum, DateTime, Boolean, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from ..core.database import Base


class DeviceType(str, enum.Enum):
    STANDARD = "standard"
    CUSTOM = "custom"


class OSType(str, enum.Enum):
    WINDOWS = "windows"
    MACOS = "macos"
    LINUX = "linux"


class Device(Base):
    __tablename__ = "devices"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    type = Column(Enum(DeviceType), nullable=False)
    ip_address = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = Column(Boolean, default=True)

    standard_device = relationship("StandardDevice", back_populates="device", uselist=False,
                                   cascade="all, delete-orphan")
    custom_device = relationship("CustomDevice", back_populates="device", uselist=False, cascade="all, delete-orphan")
    sensors = relationship("Sensor", back_populates="device", cascade="all, delete-orphan")

    availability_checks = relationship("AvailabilityCheck", back_populates="device", cascade="all, delete-orphan")


class StandardDevice(Base):
    __tablename__ = "standard_devices"

    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(Integer, ForeignKey("devices.id"), unique=True)
    os_type = Column(Enum(OSType), nullable=False)
    hostname = Column(String(255), nullable=False)

    device = relationship("Device", back_populates="standard_device")


class CustomDevice(Base):
    __tablename__ = "custom_devices"

    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(Integer, ForeignKey("devices.id"), unique=True)
    plugin_id = Column(Integer, ForeignKey("plugins.id"))
    connection_params = Column(JSON, default={})

    device = relationship("Device", back_populates="custom_device")
    plugin = relationship("Plugin", back_populates="custom_devices")