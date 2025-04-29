# app/models/settings.py
from sqlalchemy import Column, Integer, String, Float, Boolean
from ..core.database import Base

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