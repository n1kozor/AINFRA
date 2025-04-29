from sqlalchemy.orm import Session
from ..models.settings import MonitoringSettings


def initialize_default_settings(db: Session):
    """Initialize default settings if they don't exist"""

    # Ellenőrzési intervallum - alapértelmezett 1 perc
    if not db.query(MonitoringSettings).filter(
            MonitoringSettings.key == "availability_check_interval_minutes"
    ).first():
        MonitoringSettings.set_setting(
            db,
            "availability_check_interval_minutes",
            "1",
            "How often to check device availability (in minutes)"
        )