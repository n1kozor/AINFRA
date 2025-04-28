from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional


class BasePlugin(ABC):
    """Base class for all custom device plugins."""

    @property
    @abstractmethod
    def name(self) -> str:
        """Plugin name"""
        pass

    @property
    @abstractmethod
    def version(self) -> str:
        """Plugin version"""
        pass

    @property
    @abstractmethod
    def description(self) -> str:
        """Plugin description"""
        pass

    @property
    def ui_schema(self) -> Dict[str, Any]:
        """UI schema for rendering frontend components"""
        return {}

    @abstractmethod
    async def connect(self, params: Dict[str, Any]) -> bool:
        """Connect to the device"""
        pass

    @abstractmethod
    async def get_status(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Get device status"""
        pass

    @abstractmethod
    async def get_metrics(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Get device metrics"""
        pass

    def get_operations(self) -> List[Dict[str, Any]]:
        """Return available operations for this plugin"""
        return []

    async def execute_operation(self, operation_id: str, params: Dict[str, Any]) -> Dict[str, Any]:
        """Execute custom operation"""
        raise NotImplementedError(f"Operation {operation_id} not implemented")