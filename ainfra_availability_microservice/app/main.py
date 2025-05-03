# app/main.py
from datetime import datetime, timedelta

from fastapi import FastAPI, Depends, Path, Query, Body, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from sqlalchemy import func
from sqlalchemy.orm import Session
import asyncio
import time

from app.models.database import get_db, Base, engine
from app.models.models import Device, AvailabilityCheck, MonitoringSettings
from app.schemas.schemas import (
    AvailabilityCheckResponse,
    AvailabilitySettingsUpdate,
    DeviceCreate,
    DeviceUpdate
)
from app.services.availability import AvailabilityService
from app.services.scheduler import (
    AvailabilityScheduler,
    background_check_status,
    check_results,
    check_results_lock,
    thread_pool_executor
)
from app.services.sync import sync_devices, run_device_sync
import config


# Initialize settings
def initialize_default_settings(db: Session):
    """Initialize default settings if they don't exist"""
    # Check interval - default 1 minute
    if not db.query(MonitoringSettings).filter(
            MonitoringSettings.key == "availability_check_interval_minutes"
    ).first():
        MonitoringSettings.set_setting(
            db,
            "availability_check_interval_minutes",
            str(config.DEFAULT_CHECK_INTERVAL),
            "How often to check device availability (in minutes)"
        )


# Helper function for background checks
async def check_all_devices_db():
    """Run check_all_devices with a new database connection in a non-blocking way"""
    db = None
    try:
        # Create a new DB session
        from app.models.database import SessionLocal
        db = SessionLocal()

        print(f"Running scheduled availability checks at {time.strftime('%Y-%m-%d %H:%M:%S')}")
        # Run the actual check
        results = await AvailabilityService.check_all_devices(db)
        print(f"Completed {len(results)} device checks")
        return {"status": "completed", "count": len(results)}

    except Exception as e:
        print(f"Error during scheduled availability check: {str(e)}")
        return {"status": "error", "message": str(e)}

    finally:
        if db:
            db.close()


# Endpoint for processing device checks
async def process_device_check(device_id: int):
    """Process a single device check and update the results"""
    global background_check_status

    try:
        # Create new DB session for each check
        from app.models.database import SessionLocal
        db = SessionLocal()
        try:
            # Perform the check
            result = await AvailabilityService.check_device_availability(device_id, db)

            # Update results
            async with check_results_lock:
                check_results[device_id] = result

            # Update status
            async with check_results_lock:
                background_check_status["completed_count"] += 1
        finally:
            db.close()
    except Exception as e:
        print(f"Error checking device {device_id}: {str(e)}")
        async with check_results_lock:
            background_check_status["completed_count"] += 1


# Lifespan context manager
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)

    # Startup actions
    db = None
    try:
        # Create DB connection
        from app.models.database import SessionLocal
        db = SessionLocal()

        # Initialize default settings
        initialize_default_settings(db)

        # Initialize and start scheduler
        scheduler = AvailabilityScheduler()
        scheduler.init_scheduler()

        # Schedule availability checks
        interval = AvailabilityService.get_check_interval(db)
        scheduler.schedule_availability_checks(check_all_devices_db, interval_minutes=interval)

        # Schedule device synchronization every minute
        scheduler.schedule_device_sync(run_device_sync, interval_minutes=config.DEFAULT_SYNC_INTERVAL)

        scheduler.start()

        # Initial device sync
        await sync_devices()

    finally:
        if db:
            db.close()

    yield

    # Shutdown actions
    scheduler = AvailabilityScheduler()
    scheduler.stop()

    # Close thread pool
    thread_pool_executor.shutdown()


# FastAPI app
app = FastAPI(
    title="Availability Monitoring Microservice",
    description="Microservice for monitoring device availability",
    version="1.0.0",
    lifespan=lifespan,
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Endpoints
@app.get("/")
async def root():
    return {
        "name": "Availability Monitoring Microservice",
        "version": "1.0.0",
        "status": "running"
    }


@app.get("/devices")
async def get_devices(db: Session = Depends(get_db)):
    """Get all monitored devices"""
    devices = db.query(Device).all()
    return [{"id": d.id, "name": d.name, "ip_address": d.ip_address, "is_active": d.is_active} for d in devices]


@app.post("/sync-devices")
async def force_device_sync():
    """Manually trigger device synchronization from main system"""
    await sync_devices()
    return {"message": "Device synchronization completed"}


@app.get("/{device_id}/check")
async def check_device_availability(
        device_id: int = Path(..., description="The ID of the device to check"),
        db: Session = Depends(get_db)
):
    """
    Check if a device is available right now.
    """
    return await AvailabilityService.check_device_availability(device_id, db)


@app.get("/latest")
async def get_latest_availability(
        db: Session = Depends(get_db)
):
    """
    Get the latest availability state for all devices without running new checks.
    """
    return await AvailabilityService.get_latest_availability(db)


@app.get("/results")
async def get_availability_check_results():
    """
    Get the current availability check results.
    Returns partial results as they become available.
    """
    async with check_results_lock:
        # Return a copy of the results to avoid concurrent modification issues
        return list(check_results.values())


@app.get("/check-status")
async def get_availability_check_status():
    """
    Get the status of the background availability check process.
    """
    async with check_results_lock:
        # Calculate elapsed time if check is in progress
        if background_check_status["in_progress"] and background_check_status["start_time"]:
            elapsed_seconds = time.time() - background_check_status["start_time"]
            estimated_total = 0

            # Estimate completion time based on progress so far
            if background_check_status["completed_count"] > 0:
                estimated_total = (elapsed_seconds / background_check_status["completed_count"]) * \
                                  background_check_status[
                                      "total_count"]

            return {
                **background_check_status,
                "elapsed_seconds": elapsed_seconds,
                "estimated_total_seconds": estimated_total
            }

        return background_check_status


@app.get("/{device_id}/history", response_model=list[AvailabilityCheckResponse])
async def get_device_availability_history(
        device_id: int = Path(..., description="The ID of the device"),
        limit: int = Query(100, description="Limit the number of records returned"),
        db: Session = Depends(get_db)
):
    """
    Get availability check history for a device.
    """
    return AvailabilityService.get_device_availability_history(db, device_id, limit)


@app.get("/{device_id}/chart-data")
async def get_device_availability_chart_data(
        device_id: int = Path(..., description="The ID of the device"),
        days: int = Query(7, description="Number of days to show in the chart"),
        db: Session = Depends(get_db)
):
    """
    Get availability data formatted for charts.
    """
    return AvailabilityService.get_availability_chart_data(db, device_id, days)


@app.post("/run-checks")
async def run_availability_checks(
        background_tasks: BackgroundTasks,
        max_concurrent: int = Query(config.MAX_CONCURRENT_CHECKS, description="Maximum number of concurrent checks"),
        db: Session = Depends(get_db)
):
    """
    Manually trigger availability checks for all active devices.
    """
    global background_check_status, check_results

    # If a check is already running, return information about it
    if background_check_status["in_progress"]:
        return {
            "message": "Availability checks already in progress",
            "status": background_check_status
        }

    # Reset the results
    async with check_results_lock:
        check_results = {}

    # Get device IDs to check
    device_count = db.query(Device).filter(Device.is_active == True).count()
    device_ids = [d.id for d in db.query(Device.id).filter(Device.is_active == True).all()]

    # Update the status
    async with check_results_lock:
        background_check_status = {
            "in_progress": True,
            "completed_count": 0,
            "total_count": device_count,
            "start_time": time.time()
        }

    async def run_checks_in_background():
        global background_check_status

        try:
            # Create a semaphore to limit concurrency
            semaphore = asyncio.Semaphore(max_concurrent)

            async def check_device_with_semaphore(device_id):
                async with semaphore:
                    await process_device_check(device_id)

            # Create tasks for all devices
            tasks = [check_device_with_semaphore(device_id) for device_id in device_ids]

            # Run all tasks concurrently with the semaphore
            if tasks:
                await asyncio.gather(*tasks)
        except Exception as e:
            print(f"Error in background availability check: {str(e)}")
        finally:
            # Mark the process as complete
            async with check_results_lock:
                background_check_status["in_progress"] = False

    # Start the checks in the background
    background_tasks.add_task(run_checks_in_background)

    return {
        "message": f"Started availability checks for {len(device_ids)} devices with max concurrency {max_concurrent}",
        "status": background_check_status
    }


@app.get("/check-all")
async def check_all_devices_availability(
        max_concurrent: int = Query(config.MAX_CONCURRENT_CHECKS, description="Maximum number of concurrent checks"),
        db: Session = Depends(get_db)
):
    """
    Check availability for all active devices with controlled concurrency.
    """
    return await AvailabilityService.check_all_devices(db, max_concurrent)


@app.get("/settings")
async def get_availability_settings(
        db: Session = Depends(get_db)
):
    """
    Get current availability monitoring settings.
    """
    interval = AvailabilityService.get_check_interval(db)
    return {
        "check_interval_minutes": interval
    }


@app.post("/settings")
async def update_availability_settings(
        settings: AvailabilitySettingsUpdate = Body(...),
        db: Session = Depends(get_db)
):
    """
    Update availability monitoring settings.
    """
    AvailabilityService.set_check_interval(db, settings.check_interval_minutes)

    # Update scheduler with new interval
    scheduler = AvailabilityScheduler()
    scheduler.schedule_availability_checks(check_all_devices_db, interval_minutes=settings.check_interval_minutes)

    return {
        "message": f"Settings updated. New check interval: {settings.check_interval_minutes} minutes",
        "check_interval_minutes": settings.check_interval_minutes
    }


# In the monitoring microservice (app/main.py)
@app.get("/stats")
async def get_monitoring_statistics(
        time_range: str = Query(None, description="Time range filter: '30m', '1h', '6h', '24h', '7d' or 'all'"),
        db: Session = Depends(get_db)
):
    """
    Get comprehensive monitoring statistics and system overview.

    Returns aggregated data about device availability, response times,
    errors, and historical trends.

    Parameters:
    - time_range: Optional filter to limit data to a specific time range
    """
    try:
        # Parse time range and set the start time accordingly
        start_time = None
        if time_range:
            now = datetime.utcnow()
            if time_range == "30m":
                start_time = now - timedelta(minutes=30)
            elif time_range == "1h":
                start_time = now - timedelta(hours=1)
            elif time_range == "6h":
                start_time = now - timedelta(hours=6)
            elif time_range == "24h":
                start_time = now - timedelta(hours=24)
            elif time_range == "7d":
                start_time = now - timedelta(days=7)
            # 'all' doesn't set a start_time, so we get all data

        # Get total devices count
        total_devices = db.query(func.count(Device.id)).scalar()
        active_devices = db.query(func.count(Device.id)).filter(Device.is_active == True).scalar()

        # Get latest availability data
        latest_availability = await AvailabilityService.get_latest_availability(db)

        # Calculate current availability metrics
        devices_up = sum(1 for device in latest_availability if device["is_available"])
        devices_down = sum(1 for device in latest_availability if not device["is_available"])

        # Calculate availability percentage
        availability_rate = (devices_up / len(latest_availability)) * 100 if latest_availability else 0

        # Get average response time for available devices
        response_times = [device["response_time"] for device in latest_availability
                          if device["is_available"] and device["response_time"]]
        avg_response_time = sum(response_times) / len(response_times) if response_times else 0

        # Get check methods distribution
        check_methods = {}
        for device in latest_availability:
            method = device["check_method"]
            check_methods[method] = check_methods.get(method, 0) + 1

        # Determine the time range for recent errors
        error_time_range = start_time if start_time else (datetime.utcnow() - timedelta(days=1))
        error_query = db.query(AvailabilityCheck).filter(
            AvailabilityCheck.is_available == False,
            AvailabilityCheck.timestamp >= error_time_range,
            AvailabilityCheck.error_message != None
        ).order_by(AvailabilityCheck.timestamp.desc())

        # Limit error records to reduce response size
        recent_errors = error_query.limit(50).all()

        error_summary = []
        for error in recent_errors:
            device = db.query(Device).filter(Device.id == error.device_id).first()
            if device:
                error_summary.append({
                    "device_id": error.device_id,
                    "device_name": device.name,
                    "error_message": error.error_message,
                    "timestamp": error.timestamp.isoformat()
                })

        # Calculate hourly availability trend
        # Adjust the number of hours based on time range
        hours_to_show = 24  # Default 24 hours
        if time_range:
            if time_range == "30m":
                hours_to_show = 1  # Just show the current hour
            elif time_range == "1h":
                hours_to_show = 1
            elif time_range == "6h":
                hours_to_show = 6
            elif time_range == "24h":
                hours_to_show = 24
            elif time_range == "7d":
                hours_to_show = 24 * 7

        hourly_stats = []
        for hour_offset in range(hours_to_show, -1, -1):
            hour_start = datetime.utcnow() - timedelta(hours=hour_offset)
            hour_end = hour_start + timedelta(hours=1)

            checks_query = db.query(AvailabilityCheck).filter(
                AvailabilityCheck.timestamp >= hour_start,
                AvailabilityCheck.timestamp < hour_end
            )

            checks = checks_query.all()

            available_count = sum(1 for check in checks if check.is_available)
            total_count = len(checks)

            hourly_stats.append({
                "hour": (datetime.utcnow() - timedelta(hours=hour_offset)).strftime("%Y-%m-%d %H:00"),
                "availability_rate": (available_count / total_count * 100) if total_count > 0 else 0,
                "check_count": total_count
            })

        # Get monitoring settings
        interval = AvailabilityService.get_check_interval(db)

        # Check if any background tasks are running
        async with check_results_lock:
            has_running_checks = background_check_status["in_progress"]

        # Get slowest devices based on the time range
        slowest_devices_query = db.query(AvailabilityCheck).filter(
            AvailabilityCheck.is_available == True,
            AvailabilityCheck.response_time != None
        )

        if start_time:
            slowest_devices_query = slowest_devices_query.filter(AvailabilityCheck.timestamp >= start_time)

        slowest_devices_query = slowest_devices_query.order_by(
            AvailabilityCheck.response_time.desc()
        ).limit(5)

        slowest_devices = []
        for check in slowest_devices_query.all():
            device = db.query(Device).filter(Device.id == check.device_id).first()
            if device:
                slowest_devices.append({
                    "device_id": check.device_id,
                    "device_name": device.name,
                    "is_available": check.is_available,
                    "response_time": check.response_time,
                    "check_method": check.check_method,
                    "timestamp": check.timestamp.isoformat(),
                    "error": check.error_message
                })

        # Prepare the response
        return {
            "system_status": {
                "timestamp": datetime.utcnow().isoformat(),
                "service_name": "Availability Monitoring Microservice",
                "version": "1.0.0",
                "background_checks_running": has_running_checks,
                "check_interval_minutes": interval,
                "time_range": time_range or "all"
            },
            "device_summary": {
                "total_devices": total_devices,
                "active_devices": active_devices,
                "inactive_devices": total_devices - active_devices
            },
            "availability_summary": {
                "devices_available": devices_up,
                "devices_unavailable": devices_down,
                "availability_rate": round(availability_rate, 2),
                "avg_response_time_ms": round(avg_response_time, 2) if avg_response_time else None
            },
            "check_methods": check_methods,
            "hourly_trend": hourly_stats,
            "recent_errors": error_summary,
            "top_slowest_devices": slowest_devices
        }
    except Exception as e:
        print(f"Error generating monitoring statistics: {str(e)}")
        return {
            "error": f"Failed to generate statistics: {str(e)}",
            "timestamp": datetime.utcnow().isoformat()
        }