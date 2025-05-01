# app/api/router.py
from fastapi import APIRouter
from .endpoints import devices, standard, custom, plugins, sensors, statistics

api_router = APIRouter()

# Include all API endpoint routers
api_router.include_router(devices.router, prefix="/devices", tags=["devices"])
api_router.include_router(standard.router, prefix="/standard", tags=["standard"])
api_router.include_router(custom.router, prefix="/custom", tags=["custom"])
api_router.include_router(plugins.router, prefix="/plugins", tags=["plugins"])
api_router.include_router(sensors.router, prefix="/sensors", tags=["sensors"])
api_router.include_router(statistics.router, prefix="/stats", tags=["statistics"])