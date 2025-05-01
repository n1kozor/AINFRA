# app/core/init_settings.py
from sqlalchemy.orm import Session
from ..models.settings import MonitoringSettings


def initialize_default_settings(db: Session):
    """Initialize default settings if they don't exist"""

    # Set check interval to 30 seconds (0.5 minutes)
    if not db.query(MonitoringSettings).filter(
            MonitoringSettings.key == "availability_check_interval_minutes"
    ).first():
        MonitoringSettings.set_setting(
            db,
            "availability_check_interval_minutes",
            "0.5",
            "How often to check device availability (in minutes)"
        )
    else:
        # Update existing setting to 30 seconds
        MonitoringSettings.set_setting(
            db,
            "availability_check_interval_minutes",
            "0.5",
            "How often to check device availability (in minutes)"
        )