# app/services/sensor_service.py
from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func
from typing import List, Dict, Any, Optional, Tuple
from ..models.sensor import Sensor, Alert, AlertStatus, AlertLevel
from ..models.device import Device, DeviceType
from ..schemas.sensor import SensorCreate, SensorUpdate, AlertCreate
from ..core.exceptions import SensorNotFoundException, DeviceNotFoundException
from ..services.standard_service import StandardDeviceService
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
        # Verify device exists and is a standard device
        device = db.query(Device).filter(
            Device.id == sensor_data.device_id,
            Device.type == DeviceType.STANDARD
        ).first()

        if not device:
            if db.query(Device).filter(Device.id == sensor_data.device_id).first():
                raise ValueError(
                    f"Device with ID {sensor_data.device_id} is not a standard device. Sensors can only be added to standard devices.")
            else:
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

        # Check for existing active alerts for this sensor
        existing_alert = db.query(Alert).filter(
            Alert.sensor_id == alert_data.sensor_id,
            Alert.status != AlertStatus.RESOLVED
        ).first()

        if existing_alert:
            # Update existing alert
            existing_alert.value = alert_data.value
            existing_alert.last_checked_at = datetime.datetime.utcnow()
            existing_alert.consecutive_checks += 1
            existing_alert.is_resolved = alert_data.is_resolved

            if existing_alert.is_resolved:
                existing_alert.status = AlertStatus.RESOLVED
                existing_alert.resolution_time = datetime.datetime.utcnow()
            elif existing_alert.consecutive_checks > 3 and existing_alert.status == AlertStatus.NEW:
                existing_alert.status = AlertStatus.ONGOING

            alert = existing_alert
        else:
            # Create new alert
            alert = Alert(
                sensor_id=alert_data.sensor_id,
                value=alert_data.value,
                message=alert_data.message,
                is_resolved=alert_data.is_resolved,
                status=AlertStatus.RESOLVED if alert_data.is_resolved else AlertStatus.NEW,
                resolution_time=datetime.datetime.utcnow() if alert_data.is_resolved else None
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

    @staticmethod
    async def get_active_alerts(db: Session, device_id: Optional[int] = None) -> List[Alert]:
        """Get all active (non-resolved) alerts"""
        query = db.query(Alert).filter(
            Alert.status != AlertStatus.RESOLVED
        )

        if device_id:
            query = query.join(Sensor).filter(Sensor.device_id == device_id)

        return query.order_by(Alert.last_checked_at.desc()).all()

    @staticmethod
    async def get_alert_history(
            db: Session,
            device_id: Optional[int] = None,
            days: int = 7
    ) -> List[Alert]:
        """Get alert history for the specified time period"""
        since_date = datetime.datetime.utcnow() - datetime.timedelta(days=days)

        query = db.query(Alert).filter(
            or_(
                Alert.timestamp >= since_date,
                Alert.last_checked_at >= since_date
            )
        )

        if device_id:
            query = query.join(Sensor).filter(Sensor.device_id == device_id)

        return query.order_by(Alert.last_checked_at.desc()).all()

    @staticmethod
    async def resolve_alert(db: Session, alert_id: int) -> Alert:
        """Manually resolve an alert"""
        alert = db.query(Alert).filter(Alert.id == alert_id).first()
        if not alert:
            raise HTTPException(status_code=404, detail=f"Alert with ID {alert_id} not found")

        alert.is_resolved = True
        alert.status = AlertStatus.RESOLVED
        alert.resolution_time = datetime.datetime.utcnow()

        db.commit()
        db.refresh(alert)
        return alert

    @staticmethod
    async def check_sensor(db: Session, sensor_id: int) -> Optional[Alert]:
        """
        Check a sensor against its metric and create/update alerts if needed
        """
        # Get sensor
        sensor = await SensorService.get_sensor(db, sensor_id)

        if not sensor.is_active:
            return None

        # Get the device
        device = db.query(Device).filter(
            Device.id == sensor.device_id,
            Device.type == DeviceType.STANDARD,
            Device.is_active == True
        ).first()

        if not device:
            return None

        try:
            # Extract the metric path from the key (e.g., "cpu.total" -> ["cpu", "total"])
            metric_path = sensor.metric_key.split('.')

            # Fetch the metric from the device
            if len(metric_path) == 1:
                # Simple metric like "cpu"
                result = await StandardDeviceService.get_specific_metric(db, device.id, metric_path[0])

                if "error" in result:
                    print(f"Error fetching metric: {result['error']}")
                    return None

                # Extract the value from the result
                metric_data = result.get(metric_path[0], {})

                # If metric_data is a dict and no more path segments, use the first value
                # This is a simplification - in practice you'd want more robust handling
                if isinstance(metric_data, dict) and len(metric_data) > 0:
                    metric_value = next(iter(metric_data.values()))
                else:
                    metric_value = metric_data

            elif len(metric_path) >= 2:
                # Nested metric like "cpu.total"
                result = await StandardDeviceService.get_specific_metric(db, device.id, metric_path[0])

                if "error" in result:
                    print(f"Error fetching metric: {result['error']}")
                    return None

                # Navigate through the nested structure
                current_value = result.get(metric_path[0], {})
                for segment in metric_path[1:]:
                    if isinstance(current_value, dict):
                        current_value = current_value.get(segment, {})
                    else:
                        # If we can't navigate further, we're stuck
                        print(f"Cannot navigate to {segment} in {current_value}")
                        return None

                metric_value = current_value

            # Convert to float if possible
            try:
                metric_value = float(metric_value)
            except (ValueError, TypeError):
                print(f"Could not convert metric value {metric_value} to float")
                return None

            # Check if condition is met
            condition_met = await SensorService.check_metric_against_condition(
                metric_value, sensor.alert_condition
            )

            # Get existing active alert
            existing_alert = db.query(Alert).filter(
                Alert.sensor_id == sensor.id,
                Alert.status != AlertStatus.RESOLVED
            ).order_by(Alert.last_checked_at.desc()).first()

            if condition_met:
                # Condition is met, there's a problem
                alert_message = (
                    f"Alert for sensor '{sensor.name}': Metric {sensor.metric_key} "
                    f"has value {metric_value} which meets condition {sensor.alert_condition}"
                )

                if existing_alert:
                    # Update existing alert
                    existing_alert.value = metric_value
                    existing_alert.message = alert_message
                    existing_alert.last_checked_at = datetime.datetime.utcnow()
                    existing_alert.consecutive_checks += 1

                    if existing_alert.consecutive_checks > 3 and existing_alert.status == AlertStatus.NEW:
                        existing_alert.status = AlertStatus.ONGOING

                    db.commit()
                    db.refresh(existing_alert)
                    return existing_alert
                else:
                    # Create new alert
                    alert = Alert(
                        sensor_id=sensor.id,
                        value=metric_value,
                        message=alert_message,
                        is_resolved=False,
                        status=AlertStatus.NEW,
                        first_detected_at=datetime.datetime.utcnow(),
                        last_checked_at=datetime.datetime.utcnow()
                    )
                    db.add(alert)
                    db.commit()
                    db.refresh(alert)
                    return alert
            else:
                # Condition is not met, everything is fine
                if existing_alert:
                    # Check if we need consecutive success checks to resolve
                    consecutive_success_needed = 3  # Number of consecutive checks needed to resolve

                    if existing_alert.consecutive_checks < 0:
                        # Already counting success checks
                        existing_alert.consecutive_checks -= 1
                        existing_alert.last_checked_at = datetime.datetime.utcnow()
                        existing_alert.value = metric_value

                        if abs(existing_alert.consecutive_checks) >= consecutive_success_needed:
                            # Enough consecutive success checks, resolve the alert
                            existing_alert.is_resolved = True
                            existing_alert.status = AlertStatus.RESOLVED
                            existing_alert.resolution_time = datetime.datetime.utcnow()
                            existing_alert.message += f" (Auto-resolved after {consecutive_success_needed} checks)"
                    else:
                        # First successful check after failures
                        existing_alert.consecutive_checks = -1
                        existing_alert.last_checked_at = datetime.datetime.utcnow()
                        existing_alert.value = metric_value

                    db.commit()
                    db.refresh(existing_alert)
                    return existing_alert

            return None

        except Exception as e:
            print(f"Error checking sensor {sensor_id}: {str(e)}")
            return None

    @staticmethod
    async def check_all_sensors(db: Session) -> Dict[str, Any]:
        """
        Check all active sensors and create/update alerts as needed
        """
        print(f"[{datetime.datetime.utcnow()}] Checking all sensors...")

        # Get all active sensors for standard devices
        sensors = db.query(Sensor).join(
            Device, Sensor.device_id == Device.id
        ).filter(
            Sensor.is_active == True,
            Device.type == DeviceType.STANDARD,
            Device.is_active == True
        ).all()

        results = {
            "total_sensors": len(sensors),
            "alerts_created": 0,
            "alerts_updated": 0,
            "alerts_resolved": 0,
            "errors": 0
        }

        for sensor in sensors:
            try:
                # Check if this sensor already has an active alert
                existing_alert = db.query(Alert).filter(
                    Alert.sensor_id == sensor.id,
                    Alert.status != AlertStatus.RESOLVED
                ).first()

                alert = await SensorService.check_sensor(db, sensor.id)

                if alert:
                    if not existing_alert:
                        # New alert created
                        results["alerts_created"] += 1
                    elif alert.is_resolved and alert.status == AlertStatus.RESOLVED:
                        # Alert resolved
                        results["alerts_resolved"] += 1
                    else:
                        # Alert updated
                        results["alerts_updated"] += 1
            except Exception as e:
                print(f"Error processing sensor {sensor.id}: {str(e)}")
                results["errors"] += 1

        print(f"Sensor check completed: {results}")
        return results