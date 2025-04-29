# app/plugins/base.py
from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional, Union


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
        """
        UI schema for rendering frontend components

        Example:
        {
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
                            "title": "Kill Process",
                            "action": "kill_process",
                            "buttonType": "error",
                            "enabledWhen": "row.status === 'running'"
                        }
                    ]
                }
            },
            "buttons": [
                {
                    "title": "Restart Device",
                    "action": "restart",
                    "variant": "warning",
                    "icon": "restart",
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
                            "default": "localhost"
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
        """
        return {}

    @abstractmethod
    async def connect(self, params: Dict[str, Any]) -> bool:
        """Connect to the device"""
        pass

    @abstractmethod
    async def get_status(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """
        Get device status

        Return a dictionary that may include these keys:
        - 'status': bool or str - overall device status
        - 'connection': bool - connection status
        - Any other key-value pairs for status information

        Example:
        {
            'status': 'online',
            'connection': True,
            'last_seen': '2023-04-12 15:30:22',
            'uptime': '3 days, 4 hours'
        }
        """
        pass

    @abstractmethod
    async def get_metrics(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """
        Get device metrics

        Return a dictionary with metrics that follow these guidelines:
        - Simple metrics as key-value pairs (e.g., 'cpu_usage': 45.2)
        - Complex data as arrays of objects under specific keys
        - Use consistent keys for similar metrics

        Example:
        {
            'cpu_usage': 45.2,
            'memory_used': 4.5,
            'memory_total': 16.0,
            'disk_usage': 78.5,
            'processes': [
                {'pid': 1234, 'name': 'nginx', 'cpu': 2.3, 'memory': 1.2, 'status': 'running'},
                {'pid': 5678, 'name': 'mysql', 'cpu': 1.5, 'memory': 3.7, 'status': 'running'}
            ],
            'network_interfaces': [
                {'name': 'eth0', 'rx': 1024000, 'tx': 512000, 'status': 'up'},
                {'name': 'wlan0', 'rx': 256000, 'tx': 128000, 'status': 'down'}
            ]
        }
        """
        pass

    def get_operations(self) -> List[Dict[str, Any]]:
        """
        Return available operations for this plugin

        Each operation should have:
        - 'id': Unique identifier for the operation
        - 'name': Display name
        - 'description': Optional description
        - 'params': List of parameter names (optional)
        - 'confirm': Boolean if confirmation is needed (optional)

        Example:
        [
            {
                'id': 'restart',
                'name': 'Restart Device',
                'description': 'Restart the device safely',
                'confirm': True
            },
            {
                'id': 'update_config',
                'name': 'Update Configuration',
                'description': 'Update device configuration',
                'params': ['config_file']
            }
        ]
        """
        return []

    async def execute_operation(self, operation_id: str, params: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute custom operation

        Return a dictionary with operation results that may include:
        - 'success': Boolean indicating if operation was successful
        - 'message': Status message
        - 'data': Any additional data
        - 'logs': Text logs if available

        Example:
        {
            'success': True,
            'message': 'Device restarted successfully',
            'data': {'restart_time': '2023-04-12 15:45:30'},
            'logs': '15:45:28 - Initiating restart\n15:45:30 - Restart complete'
        }
        """
        raise NotImplementedError(f"Operation {operation_id} not implemented")