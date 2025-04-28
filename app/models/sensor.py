from sqlalchemy import Column, Integer, String, ForeignKey, Enum, DateTime, Boolean, Text, JSON, Float
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from ..core.database import Base


class AlertLevel(str, enum.Enum):
    INFO = "info"
    WARNING = "warning"
    CRITICAL = "critical"


class Sensor(Base):
    __tablename__ = "sensors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    device_id = Column(Integer, ForeignKey("devices.id"))
    metric_key = Column(String(255), nullable=False)  # A monitorozott metrika azonosítója
    alert_condition = Column(String(255), nullable=False)  # pl. ">90", "<5"
    alert_level = Column(Enum(AlertLevel), default=AlertLevel.WARNING)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = Column(Boolean, default=True)

    device = relationship("Device", back_populates="sensors")
    alerts = relationship("Alert", back_populates="sensor", cascade="all, delete-orphan")


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    sensor_id = Column(Integer, ForeignKey("sensors.id"))
    value = Column(Float, nullable=False)
    message = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    is_resolved = Column(Boolean, default=False)

    sensor = relationship("Sensor", back_populates="alerts")