from fastapi import FastAPI, Depends
from contextlib import asynccontextmanager
from .core.config import get_settings
from .core.database import Base, engine
from .api.router import api_router
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
        plugin_loader = PluginLoader()
        plugin_loader.load_plugins(db)
    finally:
        db.close()
    yield
    # (Optional) Shutdown actions can be placed after yield if needed

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


# Add MCP
mcp = FastApiMCP(app)
mcp.mount()

# Root endpoint
@app.get("/")
async def root():
    return {
        "name": settings.PROJECT_NAME,
        "docs": "/docs",
        "api_base": settings.API_V1_STR
    }
