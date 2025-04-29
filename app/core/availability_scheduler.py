from .simple_scheduler import SimpleScheduler
from ..services.availability_service import AvailabilityService
from ..core.database import SessionLocal
from datetime import datetime
import asyncio
import threading
import concurrent.futures

# Create a thread pool executor for background tasks
thread_pool_executor = concurrent.futures.ThreadPoolExecutor(max_workers=4)


# Helper function that creates a new database connection and runs checks in background
async def check_all_devices_db():
    """Run check_all_devices with a new database connection in a non-blocking way"""
    # Get the running event loop
    loop = asyncio.get_event_loop()

    # Define the background function that will run in a separate thread
    def background_task():
        # Create an event loop for this thread
        thread_loop = asyncio.new_event_loop()
        asyncio.set_event_loop(thread_loop)

        try:
            # Make a new database session
            db = SessionLocal()
            try:
                print(f"Running scheduled availability checks at {datetime.utcnow().isoformat()}")
                # Run the actual check in this thread's event loop
                return thread_loop.run_until_complete(
                    AvailabilityService.check_all_devices(db, max_concurrent=75)
                )
            except Exception as e:
                print(f"Error during scheduled availability check: {str(e)}")
            finally:
                db.close()
                thread_loop.close()
        except Exception as e:
            print(f"Fatal error in background task: {str(e)}")

    # Execute the background task in the thread pool to avoid blocking
    # We don't need to await the result since it's a background job
    loop.run_in_executor(thread_pool_executor, background_task)

    # Return immediately - checks are running in background
    return {"status": "Availability checks started in background"}


class AvailabilityScheduler:
    _instance = None
    _scheduler = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(AvailabilityScheduler, cls).__new__(cls)
            cls._instance._scheduler = SimpleScheduler()
        return cls._instance

    def init_scheduler(self, app=None):
        """Initialize the scheduler (app parameter is ignored)"""
        # No need for app parameter, it's here for compatibility
        return self._scheduler

    def start(self):
        """Start the scheduler"""
        self._scheduler.start()

    def stop(self):
        """Stop the scheduler"""
        self._scheduler.stop()

    def schedule_availability_checks(self, interval_minutes=1):
        """Schedule availability checks for all devices"""
        # Ensure valid interval
        if interval_minutes < 1:
            interval_minutes = 1
        elif interval_minutes > 1440:  # 24*60 = 1440 minutes in a day
            interval_minutes = 1440

        # Schedule the task
        self._scheduler.schedule_task(
            task_id="check_all_devices_availability",
            coroutine_func=check_all_devices_db,
            interval_minutes=interval_minutes
        )