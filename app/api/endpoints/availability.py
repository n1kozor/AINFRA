from fastapi import APIRouter, Depends, Path, Query, HTTPException, Body, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from sqlalchemy import func

from ...core.database import get_db, SessionLocal
from ...services.availability_service import AvailabilityService
from ...schemas.availability import AvailabilityCheckResponse, AvailabilitySettingsUpdate
from ...models.device import Device
import asyncio
import threading
import time

router = APIRouter()

# Globális változók a háttérfeldolgozás állapotának tárolásához
background_check_status = {
    "in_progress": False,
    "completed_count": 0,
    "total_count": 0,
    "start_time": None,
}

# Globális változó a részeredmények tárolásához
# Ezek folyamatosan frissülnek, ahogy az egyes eszközök ellenőrzése befejeződik
check_results = {}
check_results_lock = threading.Lock()


def update_check_result(result):
    """Update the check results with a new result"""
    global check_results
    if not result or "device_id" not in result:
        return

    with check_results_lock:
        check_results[result["device_id"]] = result


@router.get("/{device_id}/check", operation_id="check_device_availability")
async def check_device_availability(
        device_id: int = Path(..., description="The ID of the device to check"),
        db: Session = Depends(get_db)
):
    """
    Check if a device is available right now.
    """
    # Use a dedicated session per check to avoid blocking
    return await AvailabilityService.check_device_availability(device_id)


@router.get("/latest", operation_id="get_latest_availability")
async def get_latest_availability(
        db: Session = Depends(get_db)
):
    """
    Get the latest availability state for all devices without running new checks.
    This is a fast query that only reads from the database.
    """
    return await AvailabilityService.get_latest_availability(db)


@router.get("/results", operation_id="get_availability_check_results")
async def get_availability_check_results():
    """
    Get the current availability check results.
    Returns partial results as they become available.
    """
    with check_results_lock:
        # Return a copy of the results to avoid concurrent modification issues
        return list(check_results.values())


@router.get("/check-status", operation_id="get_availability_check_status")
async def get_availability_check_status():
    """
    Get the status of the background availability check process.
    """
    # Calculate elapsed time if check is in progress
    if background_check_status["in_progress"] and background_check_status["start_time"]:
        elapsed_seconds = time.time() - background_check_status["start_time"]
        estimated_total = 0

        # Estimate completion time based on progress so far
        if background_check_status["completed_count"] > 0:
            estimated_total = (elapsed_seconds / background_check_status["completed_count"]) * background_check_status[
                "total_count"]

        return {
            **background_check_status,
            "elapsed_seconds": elapsed_seconds,
            "estimated_total_seconds": estimated_total
        }

    return background_check_status


@router.get("/{device_id}/history", response_model=List[AvailabilityCheckResponse],
            operation_id="get_device_availability_history")
async def get_device_availability_history(
        device_id: int = Path(..., description="The ID of the device"),
        limit: int = Query(100, description="Limit the number of records returned"),
        db: Session = Depends(get_db)
):
    """
    Get availability check history for a device.
    """
    return AvailabilityService.get_device_availability_history(db, device_id, limit)


@router.get("/{device_id}/chart-data", operation_id="get_device_availability_chart_data")
async def get_device_availability_chart_data(
        device_id: int = Path(..., description="The ID of the device"),
        days: int = Query(7, description="Number of days to show in the chart"),
        db: Session = Depends(get_db)
):
    """
    Get availability data formatted for charts.

    This endpoint provides data suitable for creating uptime and response time
    charts on the frontend. It includes timestamps, availability status (0/1),
    and response times for the specified time period.
    """
    return AvailabilityService.get_availability_chart_data(db, device_id, days)


@router.get("/check-all", operation_id="check_all_devices_availability")
async def check_all_devices_availability(
        max_concurrent: int = Query(50, description="Maximum number of concurrent checks"),
        db: Session = Depends(get_db)
):
    """
    Check availability for all active devices with controlled concurrency.
    """
    return await AvailabilityService.check_all_devices(db, max_concurrent)


async def process_device_check(device_id: int):
    """Process a single device check and update the results"""
    global background_check_status, check_results

    try:
        # Perform the check
        result = await AvailabilityService.check_device_availability(device_id)

        # Update results
        update_check_result(result)

        # Update status
        with check_results_lock:
            background_check_status["completed_count"] += 1
    except Exception as e:
        print(f"Error checking device {device_id}: {str(e)}")
        with check_results_lock:
            background_check_status["completed_count"] += 1


@router.post("/run-checks", operation_id="run_availability_checks")
async def run_availability_checks(
        background_tasks: BackgroundTasks,
        max_concurrent: int = Query(100, description="Maximum number of concurrent checks"),
):
    """
    Manually trigger availability checks for all active devices.
    The checks will run in the background with high concurrency.
    Returns immediately with status information.
    """
    global background_check_status, check_results

    # If a check is already running, return information about it
    if background_check_status["in_progress"]:
        return {
            "message": "Availability checks already in progress",
            "status": background_check_status
        }

    # Reset the results
    with check_results_lock:
        check_results = {}

    # Get device IDs to check
    db = SessionLocal()
    try:
        # Count active devices
        device_count = db.query(func.count(Device.id)).filter(Device.is_active == True).scalar()

        # Get all device IDs
        device_ids = [d.id for d in db.query(Device.id).filter(Device.is_active == True).all()]

        # Update the status
        background_check_status = {
            "in_progress": True,
            "completed_count": 0,
            "total_count": device_count,
            "start_time": time.time()
        }
    finally:
        db.close()

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
            background_check_status["in_progress"] = False

    # Start the checks in the background
    background_tasks.add_task(run_checks_in_background)

    return {
        "message": f"Started availability checks for {len(device_ids)} devices with max concurrency {max_concurrent}",
        "status": background_check_status
    }


@router.get("/settings", operation_id="get_availability_settings")
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


@router.post("/settings", operation_id="update_availability_settings")
async def update_availability_settings(
        settings: AvailabilitySettingsUpdate = Body(...),
        db: Session = Depends(get_db)
):
    """
    Update availability monitoring settings.
    """
    AvailabilityService.set_check_interval(db, settings.check_interval_minutes)

    # Update scheduler with new interval
    from ...core.availability_scheduler import AvailabilityScheduler
    scheduler = AvailabilityScheduler()
    scheduler.schedule_availability_checks(interval_minutes=settings.check_interval_minutes)

    return {
        "message": f"Settings updated. New check interval: {settings.check_interval_minutes} minutes",
        "check_interval_minutes": settings.check_interval_minutes
    }