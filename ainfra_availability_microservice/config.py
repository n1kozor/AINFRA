# config.py
import os
import socket

# Detect if running in Docker
def is_running_in_docker():
    try:
        with open('/proc/1/cgroup', 'rt') as f:
            return 'docker' in f.read()
    except:
        return False

# Use appropriate host based on environment
HOST_NAME = "app" if is_running_in_docker() else "localhost"

# Database configuration
DATABASE_URL = os.getenv("AVAILABILITY_DB_URL", "sqlite:///./availability_monitor.db")
MAIN_API_URL = os.getenv("MAIN_API_URL", f"http://{HOST_NAME}:8000/api/v1/devices/")

# Server configuration
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8001"))

# Monitoring settings
DEFAULT_CHECK_INTERVAL = 1  # minutes
DEFAULT_SYNC_INTERVAL = 1   # minutes
MAX_CONCURRENT_CHECKS = 50