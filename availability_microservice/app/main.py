# app/main.py
from fastapi import FastAPI, Depends, Path, Query, Body, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
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