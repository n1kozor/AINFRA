from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from ..models.sensor import Sensor, Alert, AlertLevel
from ..models.device import Device
from ..schemas.sensor import SensorCreate, SensorUpdate, AlertCreate
from ..core.exceptions import SensorNotFoundException, DeviceNotFoundException
import datetime


class SensorService:
    @staticmethod
    async def get_sensors(db: Session, skip: int = 0, limit: int = 100) -> List[Sensor]:
        """Get all sensors with pagination"""
        return db.query(Sensor).offset(skip).limit(limit).all()

    @staticmethod
    async def get_device_sensors(db: Session, device_id: int) -> List[Sensor]:
        """Get all sensors for a specific device"""
        device = db.query(Device).filter(Device.id == device_id).first()
        if not device:
            raise DeviceNotFoundException(f"Device with ID {device_id} not found")

        return db.query(Sensor).filter(Sensor.device_id == device_id).all()

    @staticmethod
    async def get_sensor(db: Session, sensor_id: int) -> Sensor:
        """Get a sensor by ID"""
        sensor = db.query(Sensor).filter(Sensor.id == sensor_id).first()
        if not sensor:
            raise SensorNotFoundException(f"Sensor with ID {sensor_id} not found")
        return sensor

    @staticmethod
    async def create_sensor(db: Session, sensor_data: SensorCreate) -> Sensor:
        """Create a new sensor"""
        # Verify device exists
        device = db.query(Device).filter(Device.id == sensor_data.device_id).first()
        if not device:
            raise DeviceNotFoundException(f"Device with ID {sensor_data.device_id} not found")

        # Create sensor
        sensor = Sensor(
            name=sensor_data.name,
            description=sensor_data.description,
            device_id=sensor_data.device_id,
            metric_key=sensor_data.metric_key,
            alert_condition=sensor_data.alert_condition,
            alert_level=sensor_data.alert_level
        )

        db.add(sensor)
        db.commit()
        db.refresh(sensor)
        return sensor

    @staticmethod
    async def update_sensor(db: Session, sensor_id: int, sensor_data: SensorUpdate) -> Sensor:
        """Update a sensor"""
        sensor = await SensorService.get_sensor(db, sensor_id)

        # Update fields
        for key, value in sensor_data.dict(exclude_unset=True).items():
            setattr(sensor, key, value)

        db.commit()
        db.refresh(sensor)
        return sensor

    @staticmethod
    async def delete_sensor(db: Session, sensor_id: int) -> bool:
        """Delete a sensor"""
        sensor = await SensorService.get_sensor(db, sensor_id)
        db.delete(sensor)
        db.commit()
        return True

    @staticmethod
    async def create_alert(db: Session, alert_data: AlertCreate) -> Alert:
        """Create a new alert for a sensor"""
        # Verify sensor exists
        sensor = db.query(Sensor).filter(Sensor.id == alert_data.sensor_id).first()
        if not sensor:
            raise SensorNotFoundException(f"Sensor with ID {alert_data.sensor_id} not found")

        # Create alert
        alert = Alert(
            sensor_id=alert_data.sensor_id,
            value=alert_data.value,
            message=alert_data.message,
            is_resolved=alert_data.is_resolved
        )

        db.add(alert)
        db.commit()
        db.refresh(alert)
        return alert

    @staticmethod
    async def check_metric_against_condition(
            metric_value: float,
            condition: str
    ) -> bool:
        """
        Check if a metric value meets an alert condition

        Condition format examples: ">90", "<5", "==0", ">=75"
        """
        if condition.startswith(">"):
            if condition.startswith(">="):
                threshold = float(condition[2:])
                return metric_value >= threshold
            else:
                threshold = float(condition[1:])
                return metric_value > threshold
        elif condition.startswith("<"):
            if condition.startswith("<="):
                threshold = float(condition[2:])
                return metric_value <= threshold
            else:
                threshold = float(condition[1:])
                return metric_value < threshold
        elif condition.startswith("=="):
            threshold = float(condition[2:])
            return metric_value == threshold
        elif condition.startswith("!="):
            threshold = float(condition[2:])
            return metric_value != threshold

        # Default case if format not recognized
        return False