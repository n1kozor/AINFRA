import ast
import inspect
from typing import Dict, Any, List, Tuple, Optional
from .base import BasePlugin


def validate_plugin_code(code: str) -> Tuple[bool, Optional[str]]:
    """
    Validate plugin code for security and correctness.

    Args:
        code: The Python code to validate

    Returns:
        Tuple of (is_valid, error_message)
    """
    # Check for syntax errors
    try:
        ast.parse(code)
    except SyntaxError as e:
        return False, f"Syntax error: {str(e)}"

    # Check for dangerous imports
    tree = ast.parse(code)
    imports = []

    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            for name in node.names:
                imports.append(name.name)
        elif isinstance(node, ast.ImportFrom):
            imports.append(node.module)

    blacklist = []
    for dangerous in blacklist:
        if any(imp == dangerous or (imp and imp.startswith(f"{dangerous}.")) for imp in imports):
            return False, f"Dangerous import detected: {dangerous}"

    # Check that the plugin inherits from BasePlugin
    class_defs = [node for node in ast.walk(tree) if isinstance(node, ast.ClassDef)]
    has_plugin_class = False

    for class_def in class_defs:
        for base in class_def.bases:
            if isinstance(base, ast.Name) and base.id == 'BasePlugin':
                has_plugin_class = True
                break

    if not has_plugin_class:
        return False, "No class inheriting from BasePlugin found"

    return True, None


def load_plugin_class(code: str) -> type[BasePlugin]:
    """
    Load a plugin class from code string.

    Args:
        code: The Python code containing the plugin class

    Returns:
        The plugin class
    """
    namespace = {}
    exec(f"from app.plugins.base import BasePlugin\n{code}", namespace)

    # Find the class that inherits from BasePlugin
    for name, obj in namespace.items():
        if (inspect.isclass(obj) and
                issubclass(obj, BasePlugin) and
                obj is not BasePlugin):
            return obj

    raise ValueError("No valid plugin class found")


# app/plugins/validator.py - hozzáadjuk az alábbi függvényt

def get_plugin_template() -> str:
    """
    Get a plugin code template that users can customize
    """
    return '''from app.plugins.base import BasePlugin
from typing import Dict, Any, List

class ExamplePlugin(BasePlugin):
    """
    Example plugin for custom device integration
    """

    @property
    def name(self) -> str:
        return "Example Plugin"

    @property
    def version(self) -> str:
        return "1.0.0"

    @property
    def description(self) -> str:
        return "An example plugin demonstrating the plugin API"

    @property
    def ui_schema(self) -> Dict[str, Any]:
        return {
            "components": {
                "status": {
                    "type": "status_panel",
                    "title": "Device Status"
                },
                "metrics": {
                    "type": "metrics_panel",
                    "title": "Device Metrics"
                },
                "processes": {
                    "type": "table",
                    "title": "Running Processes",
                    "actions": [
                        {
                            "title": "Restart Process", 
                            "action": "restart_process", 
                            "buttonType": "warning",
                            "enabledWhen": "row.status === 'stopped'"
                        },
                        {
                            "title": "Stop Process", 
                            "action": "stop_process", 
                            "buttonType": "error",
                            "enabledWhen": "row.status === 'running'"
                        }
                    ]
                }
            },
            "buttons": [
                {
                    "title": "Restart Device",
                    "action": "restart_device",
                    "variant": "warning",
                    "icon": "restart",
                    "confirm": true
                },
                {
                    "title": "Update Firmware",
                    "action": "update_firmware",
                    "variant": "primary",
                    "icon": "update",
                    "confirm": true
                }
            ],
            "properties": {
                "connection": {
                    "title": "Connection Settings",
                    "required": ["host"],
                    "properties": {
                        "host": {
                            "title": "Host IP or Name",
                            "type": "string",
                            "default": "192.168.1.100"
                        },
                        "port": {
                            "title": "Port",
                            "type": "number",
                            "default": 22
                        },
                        "username": {
                            "title": "Username",
                            "type": "string"
                        },
                        "password": {
                            "title": "Password",
                            "type": "string",
                            "format": "password"
                        }
                    }
                }
            }
        }

    async def connect(self, params: Dict[str, Any]) -> bool:
        """Try to connect to the device"""
        # Here you would implement actual connection logic
        # For example:
        # try:
        #     client = SomeClient(
        #         host=params.get("host", "localhost"),
        #         port=params.get("port", 22),
        #         username=params.get("username", ""),
        #         password=params.get("password", "")
        #     )
        #     await client.connect()
        #     return True
        # except Exception as e:
        #     print(f"Connection error: {str(e)}")
        #     return False

        # For this example, we'll just return True
        return True

    async def get_status(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Get device status information"""
        # In a real plugin, you would fetch actual status from the device
        return {
            "status": "online",
            "connection": True,
            "firmware_version": "1.2.3",
            "serial_number": "ABC123456",
            "last_seen": "2023-04-12 15:30:22",
            "uptime": "3 days, 4 hours"
        }

    async def get_metrics(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Get device metrics"""
        # In a real plugin, you would fetch actual metrics from the device
        return {
            "cpu_usage": 45.2,
            "memory_used": 4.5,
            "memory_total": 16.0,
            "disk_usage": 78.5,
            "processes": [
                {"pid": 1234, "name": "nginx", "cpu": 2.3, "memory": 1.2, "status": "running"},
                {"pid": 5678, "name": "mysql", "cpu": 1.5, "memory": 3.7, "status": "running"},
                {"pid": 9012, "name": "apache", "cpu": 0.0, "memory": 0.5, "status": "stopped"}
            ],
            "network_interfaces": [
                {"name": "eth0", "rx": 1024000, "tx": 512000, "status": "up"},
                {"name": "wlan0", "rx": 256000, "tx": 128000, "status": "down"}
            ]
        }

    def get_operations(self) -> List[Dict[str, Any]]:
        """Return available operations"""
        return [
            {
                "id": "restart_device",
                "name": "Restart Device",
                "description": "Restart the device safely",
                "confirm": True
            },
            {
                "id": "update_firmware",
                "name": "Update Firmware",
                "description": "Update device firmware",
                "params": ["firmware_url"],
                "confirm": True
            },
            {
                "id": "restart_process",
                "name": "Restart Process",
                "description": "Restart a specific process",
                "params": ["pid"]
            },
            {
                "id": "stop_process",
                "name": "Stop Process",
                "description": "Stop a specific process",
                "params": ["pid"]
            }
        ]

    async def execute_operation(self, operation_id: str, params: Dict[str, Any]) -> Dict[str, Any]:
        """Execute a custom operation"""
        if operation_id == "restart_device":
            # Simulating a device restart
            return {
                "success": True,
                "message": "Device restarted successfully",
                "logs": "15:45:28 - Initiating restart\\n15:45:30 - Restart complete"
            }

        elif operation_id == "update_firmware":
            # Simulating firmware update
            firmware_url = params.get("firmware_url", "")
            return {
                "success": True,
                "message": f"Firmware updated from {firmware_url}",
                "data": {"new_version": "1.3.0"},
                "logs": "Downloading firmware...\\nVerifying checksum...\\nInstalling firmware...\\nUpdate complete."
            }

        elif operation_id == "restart_process":
            # Simulating process restart
            pid = params.get("pid", 0)
            return {
                "success": True,
                "message": f"Process {pid} restarted",
                "data": {"pid": pid, "new_status": "running"}
            }

        elif operation_id == "stop_process":
            # Simulating process stop
            pid = params.get("pid", 0)
            return {
                "success": True,
                "message": f"Process {pid} stopped",
                "data": {"pid": pid, "new_status": "stopped"}
            }

        else:
            raise NotImplementedError(f"Operation {operation_id} not implemented")
'''