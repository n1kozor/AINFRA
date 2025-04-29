import asyncio
import socket
import time
import aiohttp
from sqlalchemy.orm import Session, sessionmaker
from typing import Dict, Any, List, Optional, Tuple
from sqlalchemy import func, and_
from datetime import datetime, timedelta
from ..models.device import Device, DeviceType
from ..models.availability import AvailabilityCheck
from ..models.settings import MonitoringSettings
from ..plugins.loader import PluginLoader


class AvailabilityService:
    @staticmethod
    def get_check_interval(db: Session) -> int:
        """Get the monitoring check interval in minutes from settings"""
        interval = MonitoringSettings.get_setting(
            db,
            "availability_check_interval_minutes",
            "1"  # Default to 1 minute if not set
        )
        try:
            return int(interval)
        except ValueError:
            return 1

    @staticmethod
    def set_check_interval(db: Session, minutes: int) -> None:
        """Set the monitoring check interval in minutes"""
        MonitoringSettings.set_setting(
            db,
            "availability_check_interval_minutes",
            str(minutes),
            "How often to check device availability (in minutes)"
        )

    @staticmethod
    async def check_device_availability(device_id: int, db: Session = None) -> Dict[str, Any]:
        """
        Check if a device is available.
        Uses a shared database connection if provided, or creates new one.
        """
        # Create a new database session only if not provided
        from ..core.database import SessionLocal

        db_created = False
        if db is None:
            db = SessionLocal()
            db_created = True

        try:
            device = db.query(Device).filter(Device.id == device_id).first()
            if not device:
                return {"error": "Device not found"}

            if device.type == DeviceType.STANDARD:
                result = await AvailabilityService._check_standard_device(device, db)
            elif device.type == DeviceType.CUSTOM:
                result = await AvailabilityService._check_custom_device(device, db)
            else:
                result = {"error": "Unknown device type"}

            return result
        finally:
            # Only close the DB if we created it
            if db_created and db:
                db.close()

    @staticmethod
    async def _check_standard_device(device: Device, db: Session) -> Dict[str, Any]:
        """Check standard device availability with socket connections on multiple ports"""
        start_time = time.time()
        is_available = False
        error_message = None
        response_time = None

        print(f"Checking availability for device: {device.name} ({device.ip_address})")

        # Create port check tasks instead of sequential checks
        async def check_port(ip, port):
            try:
                # Use asyncio's create_connection which is non-blocking
                future = asyncio.open_connection(host=str(ip), port=port)
                # Set timeout for the connection attempt
                reader, writer = await asyncio.wait_for(future, timeout=1.0)
                # Close the connection if successful
                writer.close()
                await writer.wait_closed()
                print(f"Successfully connected to {ip}:{port}")
                return True
            except (asyncio.TimeoutError, ConnectionRefusedError, OSError):
                return False

        try:
            # Test standard ports
            test_ports = [80, 22, 443, 8080, 3389]

            # Create tasks for all ports and run them concurrently
            tasks = [check_port(device.ip_address, port) for port in test_ports]
            results = await asyncio.gather(*tasks)

            # If any port is open, the device is available
            is_available = any(results)

            if is_available:
                response_time = (time.time() - start_time) * 1000  # ms
            else:
                print(f"All connection attempts failed for {device.ip_address}")
                error_message = "Device is not reachable on any standard port"

        except Exception as e:
            error_message = str(e)
            print(f"Check error: {error_message}")

        # Save result to database
        check = AvailabilityCheck(
            device_id=device.id,
            is_available=is_available,
            response_time=response_time,
            check_method="asyncio.socket",
            error_message=error_message
        )
        db.add(check)
        db.commit()

        result = {
            "device_id": device.id,
            "device_name": device.name,
            "is_available": is_available,
            "response_time": response_time,
            "check_method": "asyncio.socket",
            "timestamp": check.timestamp.isoformat(),
            "error": error_message
        }

        print(f"Availability check result for {device.name}: {'Available' if is_available else 'Not available'}")

        return result

    @staticmethod
    async def _check_custom_device(device: Device, db: Session) -> Dict[str, Any]:
        """Check custom device availability using its plugin"""
        if not device.custom_device or not device.custom_device.plugin_id:
            return {"error": "No plugin configured for this device"}

        # Get plugin
        plugin_loader = PluginLoader()
        plugin_class = plugin_loader.get_plugin_class(device.custom_device.plugin_id)

        if not plugin_class:
            return {"error": "Plugin not loaded"}

        start_time = time.time()
        is_available = False
        error_message = None
        response_time = None
        check_method = "plugin"

        try:
            # Create plugin instance
            plugin = plugin_class()
            connection_params = device.custom_device.connection_params

            # Check if plugin has check_availability method
            if hasattr(plugin, "check_availability") and callable(getattr(plugin, "check_availability")):
                # Use plugin's check_availability method
                result = await plugin.check_availability(connection_params)
                is_available = result.get("is_available", False)
                error_message = result.get("error")
                check_method = result.get("method", "plugin")
            else:
                # Fallback to connect method
                is_available = await plugin.connect(connection_params)
                if not is_available:
                    error_message = "Connect method returned False"

            response_time = (time.time() - start_time) * 1000  # ms
        except Exception as e:
            error_message = str(e)

        # Save result to database
        check = AvailabilityCheck(
            device_id=device.id,
            is_available=is_available,
            response_time=response_time,
            check_method=check_method,
            error_message=error_message
        )
        db.add(check)
        db.commit()

        return {
            "device_id": device.id,
            "device_name": device.name,
            "is_available": is_available,
            "response_time": response_time,
            "check_method": check_method,
            "timestamp": check.timestamp.isoformat(),
            "error": error_message
        }

    @staticmethod
    async def check_all_devices(db: Session = None, max_concurrent: int = 50) -> List[Dict[str, Any]]:
        """
        Check availability for all active devices in parallel.

        Args:
            db: Database session for initial query
            max_concurrent: Maximum number of concurrent checks
        """
        # Use a new session to prevent blocking the main session
        from ..core.database import SessionLocal

        close_db = False
        if db is None:
            db = SessionLocal()
            close_db = True

        try:
            # Just get device IDs and all required data to prevent repeated DB queries
            devices = db.query(Device).filter(Device.is_active == True).all()
            device_ids = [d.id for d in devices]

            # Create a semaphore to limit concurrency
            semaphore = asyncio.Semaphore(max_concurrent)

            # Use a single database session for all checks to prevent connection pool exhaustion
            # We'll share the same session across all checks
            async def check_with_semaphore(device_id):
                async with semaphore:
                    return await AvailabilityService.check_device_availability(device_id, db)

            # Create tasks for all devices
            tasks = [check_with_semaphore(device_id) for device_id in device_ids]

            # Execute all tasks concurrently
            results = []
            if tasks:
                results = await asyncio.gather(*tasks, return_exceptions=True)

                # Handle any exceptions
                final_results = []
                for i, result in enumerate(results):
                    if isinstance(result, Exception):
                        print(f"Error checking device {device_ids[i]}: {str(result)}")
                        # Add an error result
                        final_results.append({
                            "device_id": device_ids[i],
                            "device_name": f"Device ID {device_ids[i]}",
                            "is_available": False,
                            "error": str(result),
                            "check_method": "error",
                            "timestamp": datetime.utcnow().isoformat()
                        })
                    else:
                        final_results.append(result)

                return final_results

            return results

        finally:
            # Only close the session if we created it
            if close_db and db:
                db.close()

    @staticmethod
    async def get_latest_availability(db: Session) -> List[Dict[str, Any]]:
        """
        Get latest availability status for all active devices
        from database without running new checks
        """
        # Subquery to get the latest check for each device
        subquery = db.query(
            AvailabilityCheck.device_id,
            func.max(AvailabilityCheck.timestamp).label('max_timestamp')
        ).group_by(AvailabilityCheck.device_id).subquery()

        # Join with the actual checks to get the full data
        latest_checks = db.query(AvailabilityCheck).join(
            subquery,
            and_(
                AvailabilityCheck.device_id == subquery.c.device_id,
                AvailabilityCheck.timestamp == subquery.c.max_timestamp
            )
        ).all()

        # Format results
        results = []
        for check in latest_checks:
            device = db.query(Device).filter(Device.id == check.device_id).first()
            if device:
                results.append({
                    "device_id": device.id,
                    "device_name": device.name,
                    "is_available": check.is_available,
                    "response_time": check.response_time,
                    "check_method": check.check_method,
                    "timestamp": check.timestamp.isoformat(),
                    "error": check.error_message
                })

        return results

    @staticmethod
    def get_device_availability_history(
            db: Session,
            device_id: int,
            limit: int = 100
    ) -> List[AvailabilityCheck]:
        """Get availability check history for a device"""
        return db.query(AvailabilityCheck).filter(
            AvailabilityCheck.device_id == device_id
        ).order_by(
            AvailabilityCheck.timestamp.desc()
        ).limit(limit).all()

    @staticmethod
    def get_availability_chart_data(
            db: Session,
            device_id: int,
            days: int = 7
    ) -> Dict[str, Any]:
        """
        Get availability data formatted for charts

        Returns timestamps and availability data for the specified time period
        """
        start_date = datetime.utcnow() - timedelta(days=days)

        # Lekérdezzük az ellenőrzési adatokat
        checks = db.query(AvailabilityCheck).filter(
            AvailabilityCheck.device_id == device_id,
            AvailabilityCheck.timestamp >= start_date
        ).order_by(
            AvailabilityCheck.timestamp
        ).all()

        # Formázzuk az adatokat a frontend chart számára
        timestamps = []
        availability = []
        response_times = []

        for check in checks:
            timestamps.append(check.timestamp.isoformat())
            availability.append(1 if check.is_available else 0)  # 1=elérhető, 0=nem elérhető
            response_times.append(check.response_time if check.response_time else 0)

        # Napi uptime százalék számítása
        daily_stats = AvailabilityService._calculate_daily_uptime(checks)

        return {
            "device_id": device_id,
            "timestamps": timestamps,
            "availability": availability,
            "response_times": response_times,
            "daily_uptime": daily_stats["daily_uptime"],
            "daily_dates": daily_stats["daily_dates"],
            "total_uptime_percent": daily_stats["total_uptime"]
        }

    @staticmethod
    def _calculate_daily_uptime(checks: List[AvailabilityCheck]) -> Dict[str, Any]:
        """Calculate daily uptime percentages from check results"""
        if not checks:
            return {"daily_uptime": [], "daily_dates": [], "total_uptime": 0}

        # Csoportosítjuk a napi ellenőrzéseket
        daily_checks = {}

        for check in checks:
            date_key = check.timestamp.strftime("%Y-%m-%d")
            if date_key not in daily_checks:
                daily_checks[date_key] = []
            daily_checks[date_key].append(check)

        # Kiszámítjuk a napi uptime százalékokat
        daily_uptime = []
        daily_dates = []
        total_available = 0
        total_checks = 0

        for date_key in sorted(daily_checks.keys()):
            day_checks = daily_checks[date_key]
            available_count = sum(1 for c in day_checks if c.is_available)
            total_count = len(day_checks)

            if total_count > 0:
                uptime_percent = (available_count / total_count) * 100
            else:
                uptime_percent = 0

            daily_uptime.append(round(uptime_percent, 2))
            daily_dates.append(date_key)

            total_available += available_count
            total_checks += total_count

        # Teljes időszak uptime százaléka
        total_uptime = (total_available / total_checks) * 100 if total_checks > 0 else 0

        return {
            "daily_uptime": daily_uptime,
            "daily_dates": daily_dates,
            "total_uptime": round(total_uptime, 2)
        }