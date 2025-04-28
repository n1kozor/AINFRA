from typing import Dict, Any, List, Union


def parse_glances_data(data: Union[Dict[str, Any], List, Any]) -> Dict[str, Any]:
    """
    Parse and sanitize Glances data to extract key metrics

    Args:
        data: Raw Glances API response

    Returns:
        Dict containing key metrics in a structured format
    """
    # Check if data is not a dictionary
    if not isinstance(data, dict):
        # If it's a list, try to use the first item if it's a dict
        if isinstance(data, list) and len(data) > 0 and isinstance(data[0], dict):
            data = data[0]
        else:
            # Return an error if we can't process the data
            return {
                "error": "Unexpected response format from Glances API",
                "raw_data_type": str(type(data)),
                "raw_data_preview": str(data)[:200] if hasattr(data, "__str__") else "Not available"
            }

    result = {}

    # CPU metrics
    if "cpu" in data:
        cpu_data = data["cpu"]
        if isinstance(cpu_data, dict):
            result["cpu"] = {
                "usage": cpu_data.get("total", 0),
                "cores": [],
                "temperature": data.get("sensors", {}).get("temperatures", []) if isinstance(data.get("sensors"),
                                                                                             dict) else []
            }

            # Per-core data
            for key, value in cpu_data.items():
                if key.startswith("cpu_"):
                    try:
                        core_num = int(key.split("_")[1])
                        result["cpu"]["cores"].append({
                            "core": core_num,
                            "usage": value
                        })
                    except (ValueError, IndexError):
                        pass
        elif isinstance(cpu_data, (int, float)):
            # Handle case where cpu might be just a single value
            result["cpu"] = {
                "usage": cpu_data,
                "cores": [],
                "temperature": []
            }

    # Memory metrics
    if "mem" in data:
        mem_data = data["mem"]
        if isinstance(mem_data, dict):
            result["memory"] = {
                "total": mem_data.get("total", 0),
                "used": mem_data.get("used", 0),
                "free": mem_data.get("free", 0),
                "percent": mem_data.get("percent", 0)
            }
        else:
            # Handle case where memory info is not a dict
            result["memory"] = {
                "total": 0,
                "used": 0,
                "free": 0,
                "percent": 0,
                "raw_data": str(mem_data)[:100] if hasattr(mem_data, "__str__") else "Not available"
            }

    # Disk metrics
    if "fs" in data:
        fs_data = data["fs"]
        result["disk"] = []

        if isinstance(fs_data, list):
            for disk in fs_data:
                if isinstance(disk, dict):
                    result["disk"].append({
                        "device": disk.get("device_name", "unknown"),
                        "mountpoint": disk.get("mnt_point", ""),
                        "total": disk.get("size", 0),
                        "used": disk.get("used", 0),
                        "free": disk.get("free", 0),
                        "percent": disk.get("percent", 0)
                    })
        elif isinstance(fs_data, dict):
            # Single disk as dict
            result["disk"].append({
                "device": fs_data.get("device_name", "unknown"),
                "mountpoint": fs_data.get("mnt_point", ""),
                "total": fs_data.get("size", 0),
                "used": fs_data.get("used", 0),
                "free": fs_data.get("free", 0),
                "percent": fs_data.get("percent", 0)
            })

    # Network metrics
    if "network" in data:
        network_data = data["network"]
        result["network"] = []

        if isinstance(network_data, dict):
            for interface_name, interface_data in network_data.items():
                # Skip lo interface
                if interface_name == "lo":
                    continue

                if isinstance(interface_data, dict):
                    result["network"].append({
                        "interface": interface_name,
                        "rx": interface_data.get("rx", 0),
                        "tx": interface_data.get("tx", 0),
                        "rx_packets": interface_data.get("rx_packets", 0),
                        "tx_packets": interface_data.get("tx_packets", 0)
                    })
        elif isinstance(network_data, list):
            # If network data is a list of interfaces
            for interface in network_data:
                if isinstance(interface, dict) and "interface_name" in interface:
                    result["network"].append({
                        "interface": interface.get("interface_name", "unknown"),
                        "rx": interface.get("rx", 0),
                        "tx": interface.get("tx", 0),
                        "rx_packets": interface.get("rx_packets", 0),
                        "tx_packets": interface.get("tx_packets", 0)
                    })

    # Processes
    if "processcount" in data:
        proc_data = data["processcount"]
        if isinstance(proc_data, dict):
            result["processes"] = {
                "total": proc_data.get("total", 0),
                "running": proc_data.get("running", 0),
                "sleeping": proc_data.get("sleeping", 0),
                "thread": proc_data.get("thread", 0)
            }
        else:
            # Simple case where processcount might be just a number
            result["processes"] = {
                "total": proc_data if isinstance(proc_data, (int, float)) else 0
            }

    # System info
    if "system" in data:
        sys_data = data["system"]
        if isinstance(sys_data, dict):
            result["system"] = {
                "hostname": sys_data.get("hostname", ""),
                "os_name": sys_data.get("os_name", ""),
                "os_version": sys_data.get("os_version", ""),
                "uptime": sys_data.get("uptime", "")
            }
        else:
            result["system"] = {
                "raw_data": str(sys_data)[:100] if hasattr(sys_data, "__str__") else "Not available"
            }

    # If result is empty but data is not empty, include raw data preview
    if not result and data:
        result["raw_data_preview"] = str(data)[:500] if hasattr(data, "__str__") else "Not available"

    return result