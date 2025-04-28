from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from ..models.plugin import Plugin
from ..schemas.plugin import PluginCreate, PluginUpdate
from ..plugins.validator import validate_plugin_code
from ..plugins.loader import PluginLoader
from ..core.exceptions import PluginNotFoundException, PluginValidationError


class PluginService:
    @staticmethod
    async def get_plugins(db: Session, skip: int = 0, limit: int = 100) -> List[Plugin]:
        """Get all plugins with pagination"""
        return db.query(Plugin).offset(skip).limit(limit).all()

    @staticmethod
    async def get_plugin(db: Session, plugin_id: int) -> Plugin:
        """Get a plugin by ID"""
        plugin = db.query(Plugin).filter(Plugin.id == plugin_id).first()
        if not plugin:
            raise PluginNotFoundException(f"Plugin with ID {plugin_id} not found")
        return plugin

    @staticmethod
    async def create_plugin(db: Session, plugin_data: PluginCreate) -> Plugin:
        """
        Create a new plugin after validating the code
        """
        # Validate plugin code
        is_valid, error_message = validate_plugin_code(plugin_data.code)
        if not is_valid:
            raise PluginValidationError(error_message)

        # Create plugin
        plugin = Plugin(
            name=plugin_data.name,
            description=plugin_data.description,
            version=plugin_data.version,
            author=plugin_data.author,
            code=plugin_data.code,
            ui_schema=plugin_data.ui_schema
        )

        db.add(plugin)
        db.commit()
        db.refresh(plugin)

        # Reload plugins
        plugin_loader = PluginLoader()
        plugin_loader.reload_plugin(db, plugin.id)

        return plugin

    @staticmethod
    async def update_plugin(db: Session, plugin_id: int, plugin_data: PluginUpdate) -> Plugin:
        """
        Update a plugin after validating the code if provided
        """
        plugin = await PluginService.get_plugin(db, plugin_id)

        # If code is being updated, validate it
        if plugin_data.code is not None:
            is_valid, error_message = validate_plugin_code(plugin_data.code)
            if not is_valid:
                raise PluginValidationError(error_message)

        # Update fields
        for key, value in plugin_data.dict(exclude_unset=True).items():
            setattr(plugin, key, value)

        db.commit()
        db.refresh(plugin)

        # Reload plugin if it's active
        if plugin.is_active:
            plugin_loader = PluginLoader()
            plugin_loader.reload_plugin(db, plugin.id)

        return plugin

    @staticmethod
    async def delete_plugin(db: Session, plugin_id: int) -> bool:
        """Delete a plugin"""
        plugin = await PluginService.get_plugin(db, plugin_id)
        db.delete(plugin)
        db.commit()
        return True