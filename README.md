# Building Custom Plugins for Infrastruktúra Platform

## Introduction

Infrastruktúra Platform provides a powerful and flexible plugin system that allows you to monitor and control virtually any device with a network connection or API. This document outlines how to build custom plugins for the platform.

## Plugin Architecture

Plugins in Infrastruktúra Platform follow a standardized architecture:

- Each plugin extends the `BasePlugin` abstract class
- Plugins provide status monitoring, metric collection, and operations for devices
- The plugin system handles validation, loading, and execution in a secure manner
- A UI schema describes how the plugin appears in the frontend

## Getting Started

### Plugin Requirements

To create a plugin, you need:

1. Basic knowledge of Python
2. Understanding of the device's API or communication protocol
3. Access to the device for testing

### Base Plugin Structure

All plugins must extend the `BasePlugin` abstract class and implement its required methods:

```python
from app.plugins.base import BasePlugin
from typing import Dict, Any, List, Optional

class MyCustomPlugin(BasePlugin):
    @property
    def name(self) -> str:
        return "My Custom Plugin"
    
    @property
    def version(self) -> str:
        return "1.0.0"
    
    @property
    def description(self) -> str:
        return "Description of what my plugin does"
    
    @property
    def ui_schema(self) -> Dict[str, Any]:
        # UI schema definition
        return {...}
        
    async def connect(self, params: Dict[str, Any]) -> bool:
        # Connection logic
        ...
        
    async def get_status(self, params: Dict[str, Any]) -> Dict[str, Any]:
        # Status retrieval logic
        ...
        
    async def get_metrics(self, params: Dict[str, Any]) -> Dict[str, Any]:
        # Metrics retrieval logic
        ...
```

## Core Methods

### Required Methods

| Method | Description |
|--------|-------------|
| `name` | Plugin display name |
| `version` | Plugin version string |
| `description` | Human-readable description |
| `ui_schema` | UI definition for the frontend |
| `connect(params)` | Establish connection to the device |
| `get_status(params)` | Get device status information |
| `get_metrics(params)` | Get device metrics for monitoring |

### Optional Methods

| Method | Description |
|--------|-------------|
| `get_operations()` | Return list of available operations |
| `execute_operation(operation_id, params)` | Execute custom operations |

## Creating the UI Schema

The UI schema defines how your plugin appears in the frontend. It uses a JSON structure to define forms, tables, and other UI components.

Example UI schema:

```python
def ui_schema(self) -> Dict[str, Any]:
    return {
        "title": "My Device Plugin",
        "description": "Manages My Device via HTTP API",
        "type": "object",
        "properties": {
            "connection": {
                "type": "object",
                "title": "Connection Settings",
                "required": ["ip_address", "api_key"],
                "properties": {
                    "ip_address": {
                        "type": "string",
                        "title": "IP Address",
                        "description": "Device IP address"
                    },
                    "api_key": {
                        "type": "string",
                        "title": "API Key",
                        "description": "Authentication key",
                        "format": "password"
                    }
                }
            }
        },
        "components": {
            "status_panel": {
                "type": "panel",
                "title": "Device Status",
                "properties": [
                    {"key": "status", "title": "Status"},
                    {"key": "uptime", "title": "Uptime"}
                ]
            },
            "device_controls": {
                "type": "actions",
                "title": "Controls",
                "actions": [
                    {
                        "title": "Restart Device",
                        "action": "restart_device",
                        "buttonType": "warning"
                    }
                ]
            }
        }
    }
```

## Implementing Plugin Logic

### Connection Logic

The `connect()` method establishes a connection to the device and verifies credentials:

```python
async def connect(self, params: Dict[str, Any]) -> bool:
    try:
        # Validate required parameters
        if not params.get("ip_address") or not params.get("api_key"):
            return False
            
        # Test connection to device
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"http://{params['ip_address']}/api/status",
                headers={"Authorization": f"Bearer {params['api_key']}"},
                timeout=5
            ) as response:
                return response.status == 200
    except Exception as e:
        print(f"Connection error: {str(e)}")
        return False
```

### Status and Metrics

These methods retrieve information from the device:

```python
async def get_status(self, params: Dict[str, Any]) -> Dict[str, Any]:
    try:
        # Get device status
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"http://{params['ip_address']}/api/status",
                headers={"Authorization": f"Bearer {params['api_key']}"},
                timeout=5
            ) as response:
                if response.status != 200:
                    return {"error": f"Failed to get status: {response.status}"}
                
                data = await response.json()
                return {
                    "status": data.get("status", "Unknown"),
                    "uptime": data.get("uptime", "Unknown"),
                    "firmware": data.get("firmware_version", "Unknown")
                }
    except Exception as e:
        return {"error": str(e)}
```

### Custom Operations

Define operations that can be performed on the device:

```python
def get_operations(self) -> List[Dict[str, Any]]:
    return [
        {
            "id": "restart_device",
            "name": "Restart Device",
            "description": "Restart the device",
            "params": []
        },
        {
            "id": "update_firmware",
            "name": "Update Firmware",
            "description": "Update device firmware",
            "params": ["version"]
        }
    ]

async def execute_operation(self, operation_id: str, params: Dict[str, Any]) -> Dict[str, Any]:
    try:
        if operation_id == "restart_device":
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"http://{params['ip_address']}/api/restart",
                    headers={"Authorization": f"Bearer {params['api_key']}"},
                    timeout=10
                ) as response:
                    if response.status == 200:
                        return {"success": True, "message": "Device restarting"}
                    return {"success": False, "error": f"Failed to restart: {response.status}"}
        
        elif operation_id == "update_firmware":
            # Implementation for firmware update
            ...
            
        else:
            return {"error": f"Unknown operation: {operation_id}"}
    
    except Exception as e:
        return {"error": str(e)}
```

## Communication Protocols

Plugins can use various communication protocols:

| Protocol | Recommended Library | Use Case |
|----------|---------------------|----------|
| HTTP/REST | `aiohttp` | Web APIs, cloud services |
| SSH | `asyncssh` | Linux/Unix devices, network equipment |
| SNMP | `aiosnmp` | Network devices, printers |
| MQTT | `asyncio-mqtt` | IoT devices, smart home |
| WebSocket | `websockets` | Real-time data streams |
| TCP/UDP | `asyncio` | Custom protocols, legacy devices |

## Best Practices

1. **Async Everything**: Use async methods for all I/O operations to ensure scalability
2. **Error Handling**: Implement comprehensive error handling and provide meaningful error messages
3. **Parameter Validation**: Always validate input parameters before using them
4. **Security**: Avoid storing credentials in plugin code, use connection parameters
5. **Timeouts**: Always set timeouts for network operations to prevent hanging
6. **Throttling**: Implement rate limiting when making frequent API calls
7. **Documentation**: Document expected parameters and return values

## Adding Your Plugin to the Platform

1. Navigate to the platform's admin interface
2. Go to the Plugins section and click "Add New Plugin"
3. Enter your plugin's name, description, and version
4. Paste your Python code for the plugin
5. Save the plugin
6. Test the plugin by adding a new custom device that uses it

## Troubleshooting

- **Plugin Validation Failed**: Check that your plugin implements all required methods and has valid syntax
- **Connection Issues**: Verify network connectivity and credential parameters
- **Performance Problems**: Look for blocking operations or missing timeouts
- **UI Not Rendering**: Verify your UI schema follows the correct format

## Example Plugins

Here's a simple example plugin for an HTTP-based API:

```python
from app.plugins.base import BasePlugin
import aiohttp
from typing import Dict, Any, List

class SimpleHttpDevicePlugin(BasePlugin):
    @property
    def name(self) -> str:
        return "Simple HTTP Device"
    
    @property
    def version(self) -> str:
        return "1.0.0"
    
    @property
    def description(self) -> str:
        return "Monitors and controls devices with HTTP API"
    
    @property
    def ui_schema(self) -> Dict[str, Any]:
        return {
            "title": "HTTP Device",
            "properties": {
                "connection": {
                    "type": "object",
                    "properties": {
                        "url": {
                            "type": "string",
                            "title": "API URL"
                        },
                        "token": {
                            "type": "string",
                            "title": "API Token",
                            "format": "password"
                        }
                    }
                }
            },
            "components": {
                "status_display": {
                    "type": "panel",
                    "title": "Status",
                    "properties": [
                        {"key": "status", "title": "Status"},
                        {"key": "version", "title": "Version"}
                    ]
                }
            }
        }
    
    async def connect(self, params: Dict[str, Any]) -> bool:
        try:
            if not params.get("url"):
                return False
                
            async with aiohttp.ClientSession() as session:
                headers = {}
                if params.get("token"):
                    headers["Authorization"] = f"Bearer {params['token']}"
                    
                async with session.get(
                    f"{params['url']}/status", 
                    headers=headers, 
                    timeout=5
                ) as response:
                    return response.status == 200
        except:
            return False
    
    async def get_status(self, params: Dict[str, Any]) -> Dict[str, Any]:
        try:
            async with aiohttp.ClientSession() as session:
                headers = {}
                if params.get("token"):
                    headers["Authorization"] = f"Bearer {params['token']}"
                    
                async with session.get(
                    f"{params['url']}/status", 
                    headers=headers, 
                    timeout=5
                ) as response:
                    if response.status != 200:
                        return {"error": "Failed to get status"}
                    
                    data = await response.json()
                    return {
                        "status": data.get("status", "Unknown"),
                        "version": data.get("version", "Unknown")
                    }
        except Exception as e:
            return {"error": str(e)}
    
    async def get_metrics(self, params: Dict[str, Any]) -> Dict[str, Any]:
        try:
            async with aiohttp.ClientSession() as session:
                headers = {}
                if params.get("token"):
                    headers["Authorization"] = f"Bearer {params['token']}"
                    
                async with session.get(
                    f"{params['url']}/metrics", 
                    headers=headers, 
                    timeout=5
                ) as response:
                    if response.status != 200:
                        return {"error": "Failed to get metrics"}
                    
                    return await response.json()
        except Exception as e:
            return {"error": str(e)}
```

## Conclusion

The Infrastruktúra Platform plugin system provides a powerful way to integrate and manage diverse devices through a unified interface. By following this guide, you can create custom plugins for any networked device or service, extending the platform's capabilities to meet your specific requirements.

Happy plugin development!