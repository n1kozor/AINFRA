# app/services/availability.py
from sqlalchemy import func, and_
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import asyncio
import time
from typing import List, Dict, Any

from app.models.models import Device, AvailabilityCheck, MonitoringSettings
from app.utils.ping import ping_device_async
import config

class AvailabilityService:
    @staticmethod
    def get_check_interval(db: Session) -> int:
        """Get the monitoring check interval in minutes from settings"""
        interval = MonitoringSettings.get_setting(
            db,
            "availability_check_interval_minutes",
            str(config.DEFAULT_CHECK_INTERVAL)
        )
        try:
            return int(interval)
        except ValueError:
            return config.DEFAULT_CHECK_INTERVAL

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
    async def _check_standard_ports(ip_address, timeout=1.0):
        """Check if any standard ports are open on the device"""
        start_time = time.time()

        # Check standard ports
        async def check_port(ip, port):
            try:
                # Use asyncio's create_connection which is non-blocking
                future = asyncio.open_connection(host=str(ip), port=port)
                # Set timeout for the connection attempt
                reader, writer = await asyncio.wait_for(future, timeout=timeout)
                # Close the connection if successful
                writer.close()
                await writer.wait_closed()
                print(f"Successfully connected to {ip}:{port}")
                return True
            except (asyncio.TimeoutError, ConnectionRefusedError, OSError):
                return False

        # Test standard ports
        test_ports = [80, 22, 443, 8080, 3389]

        # Create tasks for all ports and run them concurrently
        tasks = [check_port(ip_address, port) for port in test_ports]
        results = await asyncio.gather(*tasks)

        # If any port is open, the device is available
        is_available = any(results)
        response_time = (time.time() - start_time) * 1000 if is_available else None  # ms

        return {
            "is_available": is_available,
            "response_time": response_time
        }

    @staticmethod
    async def check_device_availability(device_id: int, db: Session) -> Dict[str, Any]:
        """Check if a device is available using reliable ping and port checks."""
        device = db.query(Device).filter(Device.id == device_id).first()
        if not device:
            return {"error": "Device not found"}

        start_time = time.time()
        is_available = False
        error_message = None
        response_time = None
        check_method = "unknown"

        check_id = f"{device_id}-{int(time.time())}"
        print(f"[{check_id}] Checking availability for: {device.name} ({device.ip_address})")

        try:
            # 1. Try port check first
            print(f"[{check_id}] Trying port check first...")
            port_check_result = await AvailabilityService._check_standard_ports(device.ip_address)

            if port_check_result["is_available"]:
                is_available = True
                response_time = port_check_result["response_time"]
                check_method = "port_check"
                print(f"[{check_id}] Port check SUCCESS for {device.name}")
            else:
                print(f"[{check_id}] Port check FAILED for {device.name}, trying ping...")

                # 2. Try ping
                successful_pings = 0
                total_response_time = 0

                # Multiple ping attempts for reliability
                for attempt in range(3):
                    print(f"[{check_id}] Ping attempt {attempt + 1}/3 for {device.name}")

                    # Run ping in thread pool
                    ping_success, ping_response_time = await ping_device_async(device.ip_address)

                    if ping_success:
                        successful_pings += 1
                        if ping_response_time:
                            total_response_time += ping_response_time

                # Need at least two successful pings
                if successful_pings > 2:
                    is_available = True
                    response_time = total_response_time / successful_pings if successful_pings > 0 else None
                    check_method = "ping"
                    print(f"[{check_id}] Ping SUCCESS for {device.name} ({successful_pings}/3 attempts)")
                else:
                    is_available = False
                    error_message = "Device is not reachable via ports or ping"
                    check_method = "all_failed"
                    print(f"[{check_id}] Both methods FAILED for {device.name}")

        except Exception as e:
            error_message = str(e)
            is_available = False
            check_method = "error"
            print(f"[{check_id}] Error during check for {device.name}: {error_message}")

        # Save to database
        check = AvailabilityCheck(
            device_id=device.id,
            is_available=is_available,
            response_time=response_time,
            check_method=check_method,
            error_message=error_message
        )
        db.add(check)
        db.commit()

        print(
            f"[{check_id}] FINAL RESULT for {device.name}: {'Available' if is_available else 'Not available'} via {check_method}")

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
    async def check_all_devices(db: Session, max_concurrent: int = config.MAX_CONCURRENT_CHECKS) -> List[Dict[str, Any]]:
        """
        Check availability for all active devices in parallel.

        Args:
            db: Database session
            max_concurrent: Maximum number of concurrent checks
        """
        # Get device IDs
        devices = db.query(Device).filter(Device.is_active == True).all()
        device_ids = [d.id for d in devices]

        # Create a semaphore to limit concurrency
        semaphore = asyncio.Semaphore(max_concurrent)

        async def check_with_semaphore(device_id):
            async with semaphore:
                # Create new DB session for each check to avoid thread issues
                from app.models.database import SessionLocal
                local_db = SessionLocal()
                try:
                    return await AvailabilityService.check_device_availability(device_id, local_db)
                finally:
                    local_db.close()

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

        # Get check data
        checks = db.query(AvailabilityCheck).filter(
            AvailabilityCheck.device_id == device_id,
            AvailabilityCheck.timestamp >= start_date
        ).order_by(
            AvailabilityCheck.timestamp
        ).all()

        # Format data for frontend chart
        timestamps = []
        availability = []
        response_times = []

        for check in checks:
            timestamps.append(check.timestamp.isoformat())
            availability.append(1 if check.is_available else 0)  # 1=available, 0=not available
            response_times.append(check.response_time if check.response_time else 0)

        # Calculate daily uptime percentage
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

        # Group daily checks
        daily_checks = {}

        for check in checks:
            date_key = check.timestamp.strftime("%Y-%m-%d")
            if date_key not in daily_checks:
                daily_checks[date_key] = []
            daily_checks[date_key].append(check)

        # Calculate daily uptime percentages
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

        # Total period uptime percentage
        total_uptime = (total_available / total_checks) * 100 if total_checks > 0 else 0

        return {
            "daily_uptime": daily_uptime,
            "daily_dates": daily_dates,
            "total_uptime": round(total_uptime, 2)
        }