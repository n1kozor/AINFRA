# app/models/models.py
from sqlalchemy import Column, Integer, String, DateTime, Boolean, Float, ForeignKey, func, and_
from sqlalchemy.orm import relationship, Session
from datetime import datetime
import pytz

from .database import Base

class Device(Base):
    __tablename__ = "devices"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    ip_address = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = Column(Boolean, default=True)

    availability_checks = relationship("AvailabilityCheck", back_populates="device", cascade="all, delete-orphan")


class AvailabilityCheck(Base):
    __tablename__ = "availability_checks"

    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(Integer, ForeignKey("devices.id"))
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    is_available = Column(Boolean, default=False)
    response_time = Column(Float, nullable=True)
    check_method = Column(String(50), nullable=False)
    error_message = Column(String(255), nullable=True)

    device = relationship("Device", back_populates="availability_checks")

    def formatted_timestamp(self, timezone='UTC'):
        """Return formatted timestamp string in specified timezone"""
        tz = pytz.timezone(timezone)
        local_dt = self.timestamp.replace(tzinfo=pytz.utc).astimezone(tz)
        return local_dt.strftime("%Y-%m-%d %H:%M:%S %Z")


class MonitoringSettings(Base):
    __tablename__ = "monitoring_settings"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(100), unique=True, nullable=False, index=True)
    value = Column(String(255), nullable=False)
    description = Column(String(255), nullable=True)

    @classmethod
    def get_setting(cls, db, key, default=None):
        """Get a setting value by key"""
        setting = db.query(cls).filter(cls.key == key).first()
        return setting.value if setting else default

    @classmethod
    def set_setting(cls, db, key, value, description=None):
        """Set a setting value"""
        setting = db.query(cls).filter(cls.key == key).first()
        if setting:
            setting.value = value
            if description:
                setting.description = description
        else:
            setting = cls(key=key, value=value, description=description)
            db.add(setting)
        db.commit()
        return setting