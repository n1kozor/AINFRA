# main.py - Corrected implementation for Pydantic Tool objects

from fastapi import FastAPI, Depends
from contextlib import asynccontextmanager
from .core.config import get_settings
from .core.database import Base, engine
from .api.router import api_router
from .core.init_settings import initialize_default_settings
from .plugins.loader import PluginLoader
from sqlalchemy.orm import Session
from .core.database import get_db
from fastapi_mcp import FastApiMCP
from fastapi.middleware.cors import CORSMiddleware

# Create database tables
Base.metadata.create_all(bind=engine)

# Instantiate settings
settings = get_settings()


# Define lifespan
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup actions
    db = next(get_db())
    try:
        # Initialize default settings
        initialize_default_settings(db)

        # Load plugins
        plugin_loader = PluginLoader()
        plugin_loader.load_plugins(db)

        # Ez a rész törölve - itt volt a scheduler inicializálása
    finally:
        db.close()

    # Fontos: itt kell a yield-nek lennie, nem a try-finally blokkon belül!
    yield

    # A shutdown actions rész is törölve - itt volt a scheduler leállítása


# Create FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# Include API router
app.include_router(api_router, prefix=settings.API_V1_STR)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add MCP without customization
mcp = FastApiMCP(app,
                 exclude_operations=["delete_device", "create_new_device", "update_device",
                                     "create_new_plugin", "update_plugin", "delete_plugin",
                                     "update_sensor", "delete_sensor", "create_sensor"])
mcp.mount()


# Root endpoint
@app.get("/")
async def root():
    return {
        "name": settings.PROJECT_NAME,
        "docs": "/docs",
        "api_base": settings.API_V1_STR
    }