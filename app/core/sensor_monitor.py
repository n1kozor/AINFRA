# app/core/sensor_monitor.py
import asyncio
from sqlalchemy.orm import Session
from datetime import datetime
from ..core.database import SessionLocal
from ..services.sensor_service import SensorService


async def check_sensors():
    """Check all sensors every 30 seconds"""
    db = SessionLocal()
    try:
        print(f"[{datetime.utcnow()}] Starting sensor check...")
        result = await SensorService.check_all_sensors(db)
        print(f"Sensor check completed: {result}")
    except Exception as e:
        print(f"Error in sensor check: {str(e)}")
    finally:
        db.close()


async def start_sensor_monitoring():
    """Start the sensor monitoring loop"""
    while True:
        await check_sensors()
        await asyncio.sleep(30)  # 30 seconds