import os
import importlib.util
import sys
from typing import Dict, List, Type, Optional
from .base import BasePlugin
from .validator import load_plugin_class
from ..models.plugin import Plugin
from sqlalchemy.orm import Session


class PluginLoader:
    """
    Plugin loader responsible for loading and managing plugins.
    """
    _instance = None
    _plugins: Dict[int, Type[BasePlugin]] = {}

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(PluginLoader, cls).__new__(cls)
        return cls._instance

    def get_plugin_class(self, plugin_id: int) -> Optional[Type[BasePlugin]]:
        """Get plugin class by ID"""
        return self._plugins.get(plugin_id)

    def load_plugins(self, db: Session) -> None:
        """Load all active plugins from database"""
        plugins = db.query(Plugin).filter(Plugin.is_active == True).all()

        for plugin in plugins:
            try:
                plugin_class = load_plugin_class(plugin.code)
                self._plugins[plugin.id] = plugin_class
            except Exception as e:
                print(f"Error loading plugin {plugin.name}: {str(e)}")

    def reload_plugin(self, db: Session, plugin_id: int) -> bool:
        """Reload a specific plugin"""
        plugin = db.query(Plugin).filter(Plugin.id == plugin_id, Plugin.is_active == True).first()
        if not plugin:
            return False

        try:
            plugin_class = load_plugin_class(plugin.code)
            self._plugins[plugin.id] = plugin_class
            return True
        except Exception as e:
            print(f"Error reloading plugin {plugin.name}: {str(e)}")
            return False