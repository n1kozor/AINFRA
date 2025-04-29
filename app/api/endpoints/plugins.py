# app/api/endpoints/plugins.py - új végponttal kiegészítve

from fastapi import APIRouter, Depends, Path, Query, HTTPException, Body
from sqlalchemy.orm import Session
from typing import List

from ...core.database import get_db
from ...schemas.plugin import PluginCreate, PluginResponse, PluginUpdate
from ...services.plugin_service import PluginService

router = APIRouter()

@router.get("/", response_model=List[PluginResponse], operation_id="get_all_plugins")
async def get_plugins(
    skip: int = Query(0, description="Skip first N plugins"),
    limit: int = Query(100, description="Limit the number of plugins returned"),
    db: Session = Depends(get_db)
):
    """
    Get all plugins with pagination.
    """
    return await PluginService.get_plugins(db, skip=skip, limit=limit)

@router.get("/{plugin_id}", response_model=PluginResponse, operation_id="get_plugin_by_id")
async def get_plugin(
    plugin_id: int = Path(..., description="The ID of the plugin to get"),
    db: Session = Depends(get_db)
):
    """
    Get a plugin by ID.
    """
    return await PluginService.get_plugin(db, plugin_id)

@router.get("/template", operation_id="get_plugin_template")
async def get_plugin_template():
    """
    Get plugin template code.
    """
    return {"template": await PluginService.get_plugin_template()}

@router.post("/", response_model=PluginResponse, operation_id="create_new_plugin")
async def create_plugin(
    plugin: PluginCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new plugin after validating the code.
    """
    return await PluginService.create_plugin(db, plugin)

@router.put("/{plugin_id}", response_model=PluginResponse, operation_id="update_plugin")
async def update_plugin(
    plugin_data: PluginUpdate,
    plugin_id: int = Path(..., description="The ID of the plugin to update"),
    db: Session = Depends(get_db)
):
    """
    Update a plugin after validating the code if provided.
    """
    return await PluginService.update_plugin(db, plugin_id, plugin_data)

@router.delete("/{plugin_id}", operation_id="delete_plugin")
async def delete_plugin(
    plugin_id: int = Path(..., description="The ID of the plugin to delete"),
    db: Session = Depends(get_db)
):
    """
    Delete a plugin.
    """
    result = await PluginService.delete_plugin(db, plugin_id)
    if result:
        return {"message": f"Plugin with ID {plugin_id} deleted successfully"}
    return {"message": f"Failed to delete plugin with ID {plugin_id}"}