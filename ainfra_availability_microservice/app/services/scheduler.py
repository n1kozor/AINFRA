# app/services/scheduler.py
import asyncio
import time
from typing import Dict, Any, Callable
import concurrent.futures
from datetime import datetime

# Thread pool for background tasks
thread_pool_executor = concurrent.futures.ThreadPoolExecutor(max_workers=8)

class SimpleScheduler:
    _instance = None
    _running = False
    _tasks = {}

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(SimpleScheduler, cls).__new__(cls)
            cls._instance._tasks = {}
            cls._instance._running = False
        return cls._instance

    def start(self):
        """Start the scheduler"""
        self._running = True
        print("Simple scheduler started")

    def stop(self):
        """Stop the scheduler"""
        self._running = False

        # Cancel all running tasks
        for task_id, task in list(self._tasks.items()):
            if not task.done():
                task.cancel()
        self._tasks = {}
        print("Simple scheduler stopped")

    def schedule_task(
            self,
            task_id: str,
            coroutine_func,
            interval_minutes: int
    ):
        """Schedule a task to run at fixed intervals"""
        # Cancel existing task if it exists
        if task_id in self._tasks and not self._tasks[task_id].done():
            self._tasks[task_id].cancel()

        # Create new task
        async def _run_task_periodically():
            while self._running:
                try:
                    start_time = time.time()

                    # Execute the task
                    await coroutine_func()

                    # Calculate sleep time
                    elapsed = time.time() - start_time
                    sleep_time = max(0, interval_minutes * 60 - elapsed)

                    # Sleep until next execution
                    await asyncio.sleep(sleep_time)

                except asyncio.CancelledError:
                    # Handle task cancellation
                    break
                except Exception as e:
                    print(f"Error in scheduled task {task_id}: {str(e)}")
                    # Wait a bit before retrying to avoid tight loop on errors
                    await asyncio.sleep(10)

        # Start the task and store its reference
        self._tasks[task_id] = asyncio.create_task(_run_task_periodically())
        print(f"Scheduled task {task_id} to run every {interval_minutes} minutes")


class AvailabilityScheduler:
    _instance = None
    _scheduler = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(AvailabilityScheduler, cls).__new__(cls)
            cls._instance._scheduler = SimpleScheduler()
        return cls._instance

    def init_scheduler(self):
        """Initialize the scheduler"""
        return self._scheduler

    def start(self):
        """Start the scheduler"""
        self._scheduler.start()

    def stop(self):
        """Stop the scheduler"""
        self._scheduler.stop()

    def schedule_availability_checks(self, coroutine_func, interval_minutes=1):
        """Schedule availability checks for all devices"""
        # Ensure valid interval
        if interval_minutes < 1:
            interval_minutes = 1
        elif interval_minutes > 1440:  # 24*60 = 1440 minutes in a day
            interval_minutes = 1440

        # Schedule the task
        self._scheduler.schedule_task(
            task_id="check_all_devices_availability",
            coroutine_func=coroutine_func,
            interval_minutes=interval_minutes
        )

    def schedule_device_sync(self, coroutine_func, interval_minutes=1):
        """Schedule device synchronization from main system"""
        # Ensure valid interval
        if interval_minutes < 1:  # Minimum 1 minute
            interval_minutes = 1

        # Schedule the task
        self._scheduler.schedule_task(
            task_id="sync_devices",
            coroutine_func=coroutine_func,
            interval_minutes=interval_minutes
        )

# Background task management
background_check_status = {
    "in_progress": False,
    "completed_count": 0,
    "total_count": 0,
    "start_time": None,
}

# Store check results
check_results = {}
check_results_lock = asyncio.Lock()

async def update_check_result(result):
    """Update the check results with a new result"""
    global check_results
    if not result or "device_id" not in result:
        return

    async with check_results_lock:
        check_results[result["device_id"]] = result