from fastapi import FastAPI, Depends, Path, Query, Body, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Boolean, Float, ForeignKey, func, and_
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker, Session
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
import asyncio
import threading
import time
import httpx
import os
import pytz
from pydantic import BaseModel, Field, IPvAnyAddress
import concurrent.futures
import uvicorn
import platform
from ping3 import ping as ping3_ping

DATABASE_URL = os.getenv("AVAILABILITY_DB_URL", "sqlite:///./availability_monitor.db")
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
    pool_size=20,
    max_overflow=30,
    pool_timeout=60
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Model definitions
class Device(Base):
    __tablename__ = "devices"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    ip_address = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = Column(Boolean, default=True)

    availability_checks = relationship("AvailabilityCheck", back_populates="device", cascade="all, delete-orphan")


class AvailabilityCheck(Base):
    __tablename__ = "availability_checks"

    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(Integer, ForeignKey("devices.id"))
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    is_available = Column(Boolean, default=False)
    response_time = Column(Float, nullable=True)
    check_method = Column(String(50), nullable=False)
    error_message = Column(String(255), nullable=True)

    device = relationship("Device", back_populates="availability_checks")

    def formatted_timestamp(self, timezone='UTC'):
        """Return formatted timestamp string in specified timezone"""
        tz = pytz.timezone(timezone)
        local_dt = self.timestamp.replace(tzinfo=pytz.utc).astimezone(tz)
        return local_dt.strftime("%Y-%m-%d %H:%M:%S %Z")


class MonitoringSettings(Base):
    __tablename__ = "monitoring_settings"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(100), unique=True, nullable=False, index=True)
    value = Column(String(255), nullable=False)
    description = Column(String(255), nullable=True)

    @classmethod
    def get_setting(cls, db, key, default=None):
        """Get a setting value by key"""
        setting = db.query(cls).filter(cls.key == key).first()
        return setting.value if setting else default

    @classmethod
    def set_setting(cls, db, key, value, description=None):
        """Set a setting value"""
        setting = db.query(cls).filter(cls.key == key).first()
        if setting:
            setting.value = value
            if description:
                setting.description = description
        else:
            setting = cls(key=key, value=value, description=description)
            db.add(setting)
        db.commit()
        return setting


# Pydantic models
class AvailabilityCheckBase(BaseModel):
    device_id: int
    is_available: bool
    response_time: Optional[float] = None
    check_method: str
    error_message: Optional[str] = None


class AvailabilityCheckCreate(AvailabilityCheckBase):
    pass


class AvailabilityCheckResponse(AvailabilityCheckBase):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True


class AvailabilitySettingsUpdate(BaseModel):
    check_interval_minutes: int = Field(..., gt=0, le=1440,
                                        description="How often to check device availability (in minutes)")


class UptimeStats(BaseModel):
    device_id: int
    uptime_percent: float
    checks_count: int
    first_check: datetime
    last_check: datetime
    last_state: bool


class DeviceCreate(BaseModel):
    name: str
    ip_address: IPvAnyAddress
    is_active: bool = True


class DeviceUpdate(BaseModel):
    name: Optional[str] = None
    ip_address: Optional[IPvAnyAddress] = None
    is_active: Optional[bool] = None


# Create database
Base.metadata.create_all(bind=engine)

# Thread pool for background tasks
thread_pool_executor = concurrent.futures.ThreadPoolExecutor(max_workers=8)

# Global variables
background_check_status = {
    "in_progress": False,
    "completed_count": 0,
    "total_count": 0,
    "start_time": None,
}

# Store results
check_results = {}
check_results_lock = threading.Lock()


def update_check_result(result):
    """Update the check results with a new result"""
    global check_results
    if not result or "device_id" not in result:
        return

    with check_results_lock:
        check_results[result["device_id"]] = result


def check_host_availability(ip_address, timeout=1):
    """
    Check if host is available using ping3 package with strict validation.
    Returns (is_available, response_time_ms)
    """
    try:
        print(f"Starting ping3 check for: {ip_address}")
        # Returns None on timeout/failure, or response time in seconds on success
        response_time = ping3_ping(ip_address, timeout=timeout, unit='s')

        # Csak akkor fogadjuk el, ha a válaszidő nem None és nagyobb mint 0
        if response_time is not None and response_time > 0:
            print(f"Ping3 valid success for {ip_address}: {response_time * 1000:.2f}ms")
            return True, response_time * 1000  # Convert to ms

        # A nulla válaszidők gyanúsak, ezeket elutasítjuk
        if response_time == 0:
            print(f"Ping3 suspicious zero time for {ip_address} - rejecting")
            return False, None

        print(f"Ping3 failed for {ip_address}")
        return False, None
    except Exception as e:
        print(f"Ping3 error for {ip_address}: {str(e)}")
        return False, None


# Availability service
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
    async def check_device_availability(device_id: int, db: Session) -> Dict[str, Any]:
        """Check if a device is available using reliable ping3 package."""
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

                # 2. Try ping3
                successful_pings = 0
                total_response_time = 0

                # Multiple ping attempts for reliability
                for attempt in range(3):
                    print(f"[{check_id}] Ping attempt {attempt + 1}/3 for {device.name}")

                    # Run ping in thread pool
                    ping_success, ping_response_time = await AvailabilityService._ping_device(device.ip_address)

                    if ping_success:
                        successful_pings += 1
                        if ping_response_time:
                            total_response_time += ping_response_time

                # Need at least one successful ping
                if successful_pings > 2:
                    is_available = True
                    response_time = total_response_time / successful_pings if successful_pings > 0 else None
                    check_method = "ping"
                    print(f"[{check_id}] Ping SUCCESS for {device.name} ({successful_pings}/2 attempts)")
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
    async def _ping_device(ip_address):
        """Execute ping using ping3 package in a non-blocking way"""
        loop = asyncio.get_running_loop()

        # Run ping in a thread to avoid blocking the event loop
        return await loop.run_in_executor(
            thread_pool_executor,
            check_host_availability,
            ip_address
        )

    @staticmethod
    async def check_all_devices(db: Session, max_concurrent: int = 50) -> List[Dict[str, Any]]:
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


async def sync_devices():
    print(f"Starting device synchronization: {datetime.now()}")
    db = SessionLocal()
    try:
        MAIN_API_URL = "http://localhost:8000/api/v1/devices/"

        async with httpx.AsyncClient() as client:
            response = await client.get(MAIN_API_URL)
            if response.status_code != 200:
                print(f"Error fetching devices: {response.status_code}")
                return

            main_devices = response.json()

        # Current devices in the monitoring system
        current_device_ids = {d.id: d for d in db.query(Device).all()}

        # Update or create devices
        for device_data in main_devices:
            device_id = device_data["id"]

            if device_id in current_device_ids:
                # Update
                device = current_device_ids[device_id]
                device.name = device_data["name"]
                device.ip_address = device_data["ip_address"]
                device.is_active = device_data.get("is_active", True)
            else:
                # Create new device
                new_device = Device(
                    id=device_id,
                    name=device_data["name"],
                    ip_address=device_data["ip_address"],
                    is_active=device_data.get("is_active", True)
                )
                db.add(new_device)
                print(f"New device added: {device_data['name']} (ID: {device_id})")

        # Mark as inactive devices that no longer exist in the main system
        main_device_ids = {d["id"] for d in main_devices}
        for device_id, device in current_device_ids.items():
            if device_id not in main_device_ids:
                device.is_active = False  # Soft delete
                print(f"Device deactivated: {device.name} (ID: {device_id})")

        db.commit()
        print(f"Device synchronization complete. {len(main_devices)} devices updated.")

    except Exception as e:
        db.rollback()
        print(f"Error during device synchronization: {str(e)}")
    finally:
        db.close()


# Helper function for background checks
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


# Helper function for device sync task
async def run_device_sync():
    """Run device synchronization in the background"""
    # Get the running event loop
    loop = asyncio.get_event_loop()

    # Define the background function that will run
    def background_sync():
        # Create an event loop for this thread
        thread_loop = asyncio.new_event_loop()
        asyncio.set_event_loop(thread_loop)

        try:
            # Run the sync in this thread's event loop
            return thread_loop.run_until_complete(sync_devices())
        except Exception as e:
            print(f"Error during device synchronization: {str(e)}")
        finally:
            thread_loop.close()

    # Execute the background task in the thread pool to avoid blocking
    loop.run_in_executor(thread_pool_executor, background_sync)

    # Return immediately
    return {"status": "Device synchronization started in background"}


# Scheduler implementation
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

    def schedule_device_sync(self, interval_minutes=1):  # Sync every minute
        """Schedule device synchronization from main system"""
        # Ensure valid interval
        if interval_minutes < 1:  # Minimum 1 minute
            interval_minutes = 1

        # Schedule the task
        self._scheduler.schedule_task(
            task_id="sync_devices",
            coroutine_func=run_device_sync,
            interval_minutes=interval_minutes
        )


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
            "1",
            "How often to check device availability (in minutes)"
        )


# Endpoint for processing device checks
async def process_device_check(device_id: int):
    """Process a single device check and update the results"""
    global background_check_status, check_results

    try:
        # Create new DB session for each check to avoid issues
        db = SessionLocal()
        try:
            # Perform the check
            result = await AvailabilityService.check_device_availability(device_id, db)

            # Update results
            update_check_result(result)

            # Update status
            with check_results_lock:
                background_check_status["completed_count"] += 1
        finally:
            db.close()
    except Exception as e:
        print(f"Error checking device {device_id}: {str(e)}")
        with check_results_lock:
            background_check_status["completed_count"] += 1


# Lifespan context manager
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup actions
    db = SessionLocal()
    try:
        # Initialize default settings
        initialize_default_settings(db)

        # Initialize and start scheduler
        scheduler = AvailabilityScheduler()
        scheduler.init_scheduler()

        # Schedule availability checks
        interval = AvailabilityService.get_check_interval(db)
        scheduler.schedule_availability_checks(interval_minutes=interval)

        # Schedule device synchronization every minute
        scheduler.schedule_device_sync(interval_minutes=1)

        scheduler.start()

        # Initial device sync
        await sync_devices()

    finally:
        db.close()
    yield
    # Shutdown actions
    scheduler = AvailabilityScheduler()
    scheduler.stop()


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


@app.get("/devices", response_model=List[Dict[str, Any]])
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
    with check_results_lock:
        # Return a copy of the results to avoid concurrent modification issues
        return list(check_results.values())


@app.get("/check-status")
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


@app.get("/{device_id}/history", response_model=List[AvailabilityCheckResponse])
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
        max_concurrent: int = Query(100, description="Maximum number of concurrent checks"),
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
    with check_results_lock:
        check_results = {}

    # Get device IDs to check
    device_count = db.query(func.count(Device.id)).filter(Device.is_active == True).scalar()
    device_ids = [d.id for d in db.query(Device.id).filter(Device.is_active == True).all()]

    # Update the status
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
            background_check_status["in_progress"] = False

    # Start the checks in the background
    background_tasks.add_task(run_checks_in_background)

    return {
        "message": f"Started availability checks for {len(device_ids)} devices with max concurrency {max_concurrent}",
        "status": background_check_status
    }


@app.get("/check-all")
async def check_all_devices_availability(
        max_concurrent: int = Query(50, description="Maximum number of concurrent checks"),
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
    scheduler.schedule_availability_checks(interval_minutes=settings.check_interval_minutes)

    return {
        "message": f"Settings updated. New check interval: {settings.check_interval_minutes} minutes",
        "check_interval_minutes": settings.check_interval_minutes
    }


# Main entry point
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)