import aiohttp
from sqlalchemy.orm import Session
from typing import Dict, Any, List
from ..models.device import Device, DeviceType
from ..core.exceptions import DeviceNotFoundException


class StandardDeviceService:
    @staticmethod
    async def get_device_stats(db: Session, device_id: int) -> Dict[str, Any]:
        """
        Get comprehensive stats from a standard device using Glances API
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

        # Define endpoints to fetch
        endpoints = {
            "system": True,  # System information
            "cpu": True,  # CPU usage
            "mem": True,  # Memory usage
            "memswap": True,  # Swap usage
            "core": True,  # CPU cores
            "uptime": True,  # System uptime
            "quicklook": True,  # Overview metrics
            "fs": True,  # Storage information
            "containers": False,  # Docker containers (optional)
            "processlist": False  # Process list (optional)
        }

        result = {}
        error = None

        # Fetch data from each endpoint
        async with aiohttp.ClientSession() as session:
            try:
                for endpoint, required in endpoints.items():
                    try:
                        async with session.get(f"{base_url}/{endpoint}", timeout=10) as response:
                            if response.status == 200:
                                data = await response.json()
                                # Konvertáljuk a memória értékeket MB-ba, ha szükséges
                                if endpoint in ["mem", "memswap"]:
                                    data = StandardDeviceService._convert_memory_to_mb(data)
                                result[endpoint] = data
                            elif required:
                                # Log critical failure
                                error = f"Failed to fetch {endpoint}: HTTP {response.status}"
                                break
                    except Exception as e:
                        if required:
                            error = f"Error fetching {endpoint}: {str(e)}"
                            break
                        # Non-required endpoints can fail silently

                # Process and format the data for frontend consumption
                if not error:
                    return StandardDeviceService._format_device_stats(result)
            except aiohttp.ClientConnectorError as e:
                error = f"Failed to connect to Glances API at {base_url}. Make sure Glances is running in web server mode with: glances -w"
            except Exception as e:
                error = f"Unexpected error: {str(e)}"

        return {"error": error}

    @staticmethod
    def _format_device_stats(data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Format the raw Glances data into a structured format for the frontend
        """
        # System information
        system_data = data.get("system", {})
        uptime = data.get("uptime", "Unknown")

        # CPU information
        cpu_data = data.get("cpu", {})
        core_data = data.get("core", {})
        quicklook = data.get("quicklook", {})

        # Memory information
        mem_data = data.get("mem", {})
        swap_data = data.get("memswap", {})

        # Storage information
        fs_data = data.get("fs", [])

        # Process information
        process_list = data.get("processlist", [])

        # Container information
        container_data = data.get("containers", [])

        # Network information from quicklook or network data
        network_data = data.get("network", {})

        # Format the final result
        result = {
            "system": {
                "hostname": system_data.get("hostname", "Unknown"),
                "os_name": system_data.get("os_name", "Unknown"),
                "os_version": system_data.get("os_version", ""),
                "platform": system_data.get("platform", ""),
                "linux_distro": system_data.get("linux_distro", ""),
                "uptime": uptime
            },
            "cpu": {
                "total": cpu_data.get("total", 0) if isinstance(cpu_data.get("total"), (int, float)) else 0,
                "user": cpu_data.get("user", 0) * 100 if isinstance(cpu_data.get("user"), (int, float)) else 0,
                "system": cpu_data.get("system", 0) * 100 if isinstance(cpu_data.get("system"), (int, float)) else 0,
                "idle": cpu_data.get("idle", 0) * 100 if isinstance(cpu_data.get("idle"), (int, float)) else 0,
                "cores_count": core_data.get("phys", 0) if isinstance(core_data, dict) else 0,
                "logical_cores": core_data.get("log", 0) if isinstance(core_data, dict) else 0,
                "cores": []
            },
            "memory": {
                "total": mem_data.get("total", 0),
                "used": mem_data.get("used", 0),
                "free": mem_data.get("free", 0),
                "percent": mem_data.get("percent", 0),
                "cached": mem_data.get("cached", 0),
                "buffers": mem_data.get("buffers", 0),
                "swap_total": swap_data.get("total", 0),
                "swap_used": swap_data.get("used", 0),
                "swap_free": swap_data.get("free", 0),
                "swap_percent": swap_data.get("percent", 0)
            },
            "disk": [],
            "network": [],
            "processes": {
                "total": 0,
                "running": 0,
                "sleeping": 0,
                "thread": 0,
                "list": []
            },
            "containers": []
        }

        # Add CPU cores data if available
        if isinstance(quicklook, dict) and "percpu" in quicklook:
            for core in quicklook.get("percpu", []):
                if isinstance(core, dict):
                    result["cpu"]["cores"].append({
                        "core": core.get("cpu_number", 0),
                        "usage": core.get("total", 0) * 100 if isinstance(core.get("total"), (int, float)) else 0
                    })

        # Add disk information
        if isinstance(fs_data, list):
            for disk in fs_data:
                if isinstance(disk, dict):
                    result["disk"].append({
                        "device": disk.get("device_name", "Unknown"),
                        "mountpoint": disk.get("mnt_point", ""),
                        "fs_type": disk.get("fs_type", ""),
                        "total": disk.get("size", 0),
                        "used": disk.get("used", 0),
                        "free": disk.get("free", 0),
                        "percent": disk.get("percent", 0)
                    })

        # Add network interfaces
        if isinstance(network_data, dict):
            for iface_name, iface_data in network_data.items():
                if isinstance(iface_data, dict) and iface_name != "time_since_update":
                    result["network"].append({
                        "interface": iface_name,
                        "rx": iface_data.get("rx", 0),
                        "tx": iface_data.get("tx", 0),
                        "rx_packets": iface_data.get("cx", 0),
                        "tx_packets": iface_data.get("tx_packets", 0)
                    })

        # Process information if available
        if isinstance(process_list, list):
            result["processes"]["total"] = len(process_list)
            result["processes"]["running"] = sum(
                1 for p in process_list if isinstance(p, dict) and p.get("status") == "R")
            result["processes"]["sleeping"] = sum(
                1 for p in process_list if isinstance(p, dict) and p.get("status") == "S")
            result["processes"]["thread"] = sum(
                p.get("num_threads", 0) for p in process_list if isinstance(p, dict) and "num_threads" in p)

            # Add top processes by CPU usage
            top_processes = sorted(
                [p for p in process_list if isinstance(p, dict)],
                key=lambda p: p.get("cpu_percent", 0),
                reverse=True
            )[:10]  # Top 10 processes

            for process in top_processes:
                result["processes"]["list"].append({
                    "pid": process.get("pid", 0),
                    "name": process.get("name", "Unknown"),
                    "username": process.get("username", ""),
                    "cpu_percent": process.get("cpu_percent", 0),
                    "memory_percent": process.get("memory_percent", 0),
                    "status": process.get("status", ""),
                    "cmdline": " ".join(process.get("cmdline", [])) if process.get("cmdline") else ""
                })

        # Container information if available
        if isinstance(container_data, list):
            for container in container_data:
                if isinstance(container, dict):
                    result["containers"].append({
                        "name": container.get("name", "Unknown"),
                        "id": container.get("id", ""),
                        "status": container.get("status", ""),
                        "image": container.get("image", []),
                        "cpu_percent": container.get("cpu_percent", 0),
                        "memory_percent": container.get("memory_percent", 0),
                        "network_rx": container.get("network_rx", 0),
                        "network_tx": container.get("network_tx", 0),
                        "uptime": container.get("uptime", "")
                    })

        return result

    @staticmethod
    async def get_specific_metric(db: Session, device_id: int, metric: str) -> Dict[str, Any]:
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
        glances_port = 61208
        base_url = f"http://{device.ip_address}:{glances_port}/api/4"

        # Fetch specific metric
        async with aiohttp.ClientSession() as session:
            try:
                async with session.get(f"{base_url}/{metric}", timeout=10) as response:
                    if response.status != 200:
                        return {"error": f"Failed to fetch metric: HTTP {response.status}"}

                    data = await response.json()

                    # Memóriával kapcsolatos metrikákat konvertáljuk MB-ba
                    if metric in ["mem", "memswap"]:
                        data = StandardDeviceService._convert_memory_to_mb(data)

                    return {metric: data}
            except Exception as e:
                return {"error": f"Failed to fetch metric: {str(e)}"}

    @staticmethod
    def _convert_memory_to_mb(memory_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Convert memory values from bytes to megabytes
        """
        # Új metódus: A memória értékek konvertálása byte-ról MB-ba a könnyebb értelmezhetőség érdekében
        bytes_to_mb = 1024 * 1024  # 1 MB = 1,048,576 bytes

        converted_data = {}
        for key, value in memory_data.items():
            if isinstance(value, (int, float)) and key != "percent":
                converted_data[key] = round(value / bytes_to_mb, 2)  # Kerekítjük 2 tizedesjegyre
            else:
                converted_data[key] = value

        return converted_data

    @staticmethod
    async def get_all_available_metrics(db: Session, device_id: int) -> Dict[str, Any]:
        """
        Get a list of all available metrics from Glances
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
        glances_port = 61208
        base_url = f"http://{device.ip_address}:{glances_port}/api/4"

        # Fetch the list of available plugins/metrics
        async with aiohttp.ClientSession() as session:
            try:
                async with session.get(f"{base_url}", timeout=10) as response:
                    if response.status != 200:
                        return {"error": f"Failed to fetch available metrics: HTTP {response.status}"}

                    data = await response.json()
                    return {"available_metrics": data}
            except Exception as e:
                return {"error": f"Failed to get available metrics: {str(e)}"}