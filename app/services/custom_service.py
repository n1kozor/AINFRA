from sqlalchemy.orm import Session
from typing import Dict, Any, List, Optional
from ..models.device import Device, CustomDevice, DeviceType
from ..core.exceptions import DeviceNotFoundException
from ..plugins.loader import PluginLoader


class CustomDeviceService:
    @staticmethod
    async def get_device_status(db: Session, device_id: int) -> Dict[str, Any]:
        """
        Get status from a custom device using its plugin
        """
        # Fetch device from database
        device = db.query(Device).filter(
            Device.id == device_id,
            Device.type == DeviceType.CUSTOM,
            Device.is_active == True
        ).first()

        if not device or not device.custom_device:
            raise DeviceNotFoundException(f"Custom device with ID {device_id} not found")

        # Get plugin
        plugin_loader = PluginLoader()
        plugin_class = plugin_loader.get_plugin_class(device.custom_device.plugin_id)

        if not plugin_class:
            return {"error": "Plugin not loaded"}

        # Create plugin instance and connect
        try:
            plugin = plugin_class()
            connection_params = device.custom_device.connection_params

            # Connect to device
            connected = await plugin.connect(connection_params)
            if not connected:
                return {"error": "Failed to connect to device"}

            # Get status
            status = await plugin.get_status(connection_params)
            return status
        except Exception as e:
            return {"error": f"Error connecting to device: {str(e)}"}

    @staticmethod
    async def get_device_metrics(db: Session, device_id: int) -> Dict[str, Any]:
        """
        Get metrics from a custom device using its plugin
        """
        # Fetch device from database
        device = db.query(Device).filter(
            Device.id == device_id,
            Device.type == DeviceType.CUSTOM,
            Device.is_active == True
        ).first()

        if not device or not device.custom_device:
            raise DeviceNotFoundException(f"Custom device with ID {device_id} not found")

        # Get plugin
        plugin_loader = PluginLoader()
        plugin_class = plugin_loader.get_plugin_class(device.custom_device.plugin_id)

        if not plugin_class:
            return {"error": "Plugin not loaded"}

        # Create plugin instance and connect
        try:
            plugin = plugin_class()
            connection_params = device.custom_device.connection_params

            # Connect to device
            connected = await plugin.connect(connection_params)
            if not connected:
                return {"error": "Failed to connect to device"}

            # Get metrics
            metrics = await plugin.get_metrics(connection_params)
            return metrics
        except Exception as e:
            return {"error": f"Error retrieving device metrics: {str(e)}"}

    @staticmethod
    async def execute_operation(
            db: Session,
            device_id: int,
            operation_id: str,
            params: Dict[str, Any] = {}
    ) -> Dict[str, Any]:
        """
        Execute a custom operation on a device
        """
        # Fetch device from database
        device = db.query(Device).filter(
            Device.id == device_id,
            Device.type == DeviceType.CUSTOM,
            Device.is_active == True
        ).first()

        if not device or not device.custom_device:
            raise DeviceNotFoundException(f"Custom device with ID {device_id} not found")

        # Get plugin
        plugin_loader = PluginLoader()
        plugin_class = plugin_loader.get_plugin_class(device.custom_device.plugin_id)

        if not plugin_class:
            return {"error": "Plugin not loaded"}

        # Create plugin instance and connect
        try:
            plugin = plugin_class()
            connection_params = device.custom_device.connection_params

            # Connect to device
            connected = await plugin.connect(connection_params)
            if not connected:
                return {"error": "Failed to connect to device"}

            # Execute operation
            result = await plugin.execute_operation(
                operation_id=operation_id,
                params={**connection_params, **params}
            )
            return result
        except NotImplementedError:
            return {"error": f"Operation {operation_id} not implemented by this plugin"}
        except Exception as e:
            return {"error": f"Error executing operation: {str(e)}"}