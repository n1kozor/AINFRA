# app/models/availability.py
from sqlalchemy import Column, Integer, ForeignKey, DateTime, Boolean, String, Float
from sqlalchemy.orm import relationship
from datetime import datetime
import pytz
from ..core.database import Base


class AvailabilityCheck(Base):
    __tablename__ = "availability_checks"

    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(Integer, ForeignKey("devices.id"))
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    is_available = Column(Boolean, default=False)
    response_time = Column(Float, nullable=True)
    check_method = Column(String(50), nullable=False)  # "ping", "tcp", "http", "plugin", etc.
    error_message = Column(String(255), nullable=True)

    device = relationship("Device", back_populates="availability_checks")

    def formatted_timestamp(self, timezone='UTC'):
        """Return formatted timestamp string in specified timezone"""
        tz = pytz.timezone(timezone)
        local_dt = self.timestamp.replace(tzinfo=pytz.utc).astimezone(tz)
        return local_dt.strftime("%Y-%m-%d %H:%M:%S %Z")