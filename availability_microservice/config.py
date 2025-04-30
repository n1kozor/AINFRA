# config.py
import os

# Database configuration
DATABASE_URL = os.getenv("AVAILABILITY_DB_URL", "sqlite:///./availability_monitor.db")
MAIN_API_URL = os.getenv("MAIN_API_URL", "http://localhost:8000/api/v1/devices/")

# Server configuration
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8001"))

# Monitoring settings
DEFAULT_CHECK_INTERVAL = 1  # minutes
DEFAULT_SYNC_INTERVAL = 1   # minutes
MAX_CONCURRENT_CHECKS = 50