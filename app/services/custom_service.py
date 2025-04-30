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
    async def get_available_operations(db: Session, device_id: int) -> Dict[str, Any]:
        """
        Get all available operations for a device with usage examples
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

        # Create plugin instance
        try:
            plugin = plugin_class()

            # Get operations and examples
            operations = plugin.get_operations()
            examples = plugin.get_operation_examples()

            # Create AI-friendly response
            return {
                "device_id": device_id,
                "device_name": device.name,
                "device_type": device.type,
                "plugin_name": plugin.name,
                "plugin_version": plugin.version,
                "available_operations": operations,
                "operation_examples": examples,
                "usage_instructions": "To execute an operation, use the execute_custom_device_operation endpoint with device_id, operation_id, and the required parameters."
            }
        except Exception as e:
            return {"error": f"Error retrieving device operations: {str(e)}"}

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
        # Paraméterek normalizálása - többszintű beágyazás és különböző formátumok kezelése
        normalized_params = {}

        # Kezelje azt az esetet, ha a params None
        if params is None:
            params = {}

        # Kezelje azt az esetet, ha a params nem szótár
        if not isinstance(params, dict):
            try:
                # Megpróbáljuk szótárrá alakítani, ha lehetséges
                params = dict(params)
            except (TypeError, ValueError):
                # Ha az átalakítás sikertelen, üres szótárat hozunk létre
                params = {}

        # Kezdjük az eredeti paraméterekkel
        normalized_params.update(params)

        # Beágyazott paraméterek kezelése - többszintű beágyazás támogatása
        # Több lehetséges paraméternevet ellenőrzünk (params, parameters, args, arguments)
        nested_params_keys = ["params", "parameters", "args", "arguments"]
        for param_key in nested_params_keys:
            if param_key in params and isinstance(params[param_key], dict):
                # Beágyazott paraméterek egyesítése
                nested = params[param_key]
                for key, value in nested.items():
                    # Csak akkor adjuk hozzá a beágyazott paramétert, ha még nem létezik felső szinten
                    if key not in normalized_params:
                        normalized_params[key] = value

        # Diagnosztikai naplózás
        print(f"DEBUG: Executing operation '{operation_id}' with normalized params: {normalized_params}")

        # A metódus eredeti implementációja a normalizált paraméterekkel
        device = db.query(Device).filter(
            Device.id == device_id,
            Device.type == DeviceType.CUSTOM,
            Device.is_active == True
        ).first()

        if not device or not device.custom_device:
            raise DeviceNotFoundException(f"Custom device with ID {device_id} not found")

        # Plugin betöltése
        plugin_loader = PluginLoader()
        plugin_class = plugin_loader.get_plugin_class(device.custom_device.plugin_id)

        if not plugin_class:
            return {"error": "Plugin not loaded"}

        # Plugin példány létrehozása és kapcsolódás
        try:
            plugin = plugin_class()
            connection_params = device.custom_device.connection_params

            # Kapcsolódás az eszközhöz
            connected = await plugin.connect(connection_params)
            if not connected:
                return {"error": "Failed to connect to device"}

            # Művelet végrehajtása a normalizált paraméterekkel
            result = await plugin.execute_operation(
                operation_id=operation_id,
                params={**connection_params, **normalized_params}
            )
            return result
        except NotImplementedError:
            return {"error": f"Operation {operation_id} not implemented by this plugin"}
        except Exception as e:
            return {"error": f"Error executing operation: {str(e)}"}