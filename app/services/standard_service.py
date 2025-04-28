import aiohttp
import json
from sqlalchemy.orm import Session
from typing import Dict, Any, Optional
from ..models.device import Device, StandardDevice, DeviceType
from ..core.exceptions import DeviceNotFoundException
from ..utils.monitoring import parse_glances_data


class StandardDeviceService:
    @staticmethod
    async def get_device_stats(db: Session, device_id: int) -> Dict[str, Any]:
        """
        Get stats from a standard device using Glances API
        """
        # Fetch device from database
        device = db.query(Device).filter(
            Device.id == device_id,
            Device.type == DeviceType.STANDARD,
            Device.is_active == True
        ).first()

        if not device or not device.standard_device:
            raise DeviceNotFoundException(f"Standard device with ID {device_id} not found")

        # Prepare Glances API URL - Glances generally runs on port 61208, not on SSH port
        std_device = device.standard_device
        glances_port = 61208  # Default Glances web server port
        base_url = f"http://{device.ip_address}:{glances_port}/api/4"

        # Fetch stats from Glances API
        async with aiohttp.ClientSession() as session:
            try:
                # Add timeout to avoid long waiting times
                async with session.get(f"{base_url}/all", timeout=5) as response:
                    if response.status != 200:
                        return {"error": f"Failed to fetch stats: HTTP {response.status}"}

                    data = await response.json()
                    return parse_glances_data(data)
            except aiohttp.ClientConnectorError as e:
                return {
                    "error": f"Failed to connect to Glances API at {base_url}/all. Make sure Glances is running in web server mode with: glances -w",
                    "details": str(e)
                }
            except aiohttp.ClientError as e:
                return {"error": f"Glances API request failed: {str(e)}"}
            except Exception as e:
                return {"error": f"Unexpected error: {str(e)}"}

    @staticmethod
    async def get_specific_metric(
            db: Session,
            device_id: int,
            metric: str
    ) -> Dict[str, Any]:
        """
        Get a specific metric from a standard device
        """
        # Fetch device from database
        device = db.query(Device).filter(
            Device.id == device_id,
            Device.type == DeviceType.STANDARD,
            Device.is_active == True
        ).first()

        if not device or not device.standard_device:
            raise DeviceNotFoundException(f"Standard device with ID {device_id} not found")

        # Prepare Glances API URL
        glances_port = 61208  # Default Glances web server port
        base_url = f"http://{device.ip_address}:{glances_port}/api/4"

        # Fetch specific metric
        async with aiohttp.ClientSession() as session:
            try:
                # Add timeout to avoid long waiting times
                async with session.get(f"{base_url}/{metric}", timeout=5) as response:
                    if response.status != 200:
                        return {"error": f"Failed to fetch metric: HTTP {response.status}"}

                    data = await response.json()
                    return {metric: data}
            except aiohttp.ClientConnectorError as e:
                return {
                    "error": f"Failed to connect to Glances API at {base_url}/{metric}. Make sure Glances is running in web server mode with: glances -w",
                    "details": str(e)
                }
            except aiohttp.ClientError as e:
                return {"error": f"Glances API request failed: {str(e)}"}
            except Exception as e:
                return {"error": f"Unexpected error: {str(e)}"}