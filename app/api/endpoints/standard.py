from fastapi import APIRouter, Depends, Path, Query, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any

from ...core.database import get_db
from ...services.standard_service import StandardDeviceService

router = APIRouter()


@router.get("/{device_id}/stats", operation_id="get_standard_device_stats")
async def get_device_stats(
        device_id: int = Path(..., description="The ID of the standard device"),
        db: Session = Depends(get_db)
):
    """
    Get all stats from a standard device using Glances API.

    This endpoint connects to the Glances web server running on the target device
    and retrieves all available system information. The Glances server must be
    running on the target device with the web server enabled (using 'glances -w').

    The default port for Glances web server is 61208. Make sure this port is
    accessible from the server running this API.

    Returns comprehensive system information including CPU, memory, disk, network,
    and process statistics.
    """
    result = await StandardDeviceService.get_device_stats(db, device_id)

    # If there's an error field, provide additional help in the response
    if "error" in result:
        result[
            "help"] = "Ensure that Glances is installed and running in web server mode on the target device. Run 'glances -w' on the target device to start the web server."

    return result


@router.get("/{device_id}/metrics/{metric}", operation_id="get_standard_device_metric")
async def get_specific_metric(
        device_id: int = Path(..., description="The ID of the standard device"),
        metric: str = Path(..., description="The specific metric to retrieve (e.g., cpu, memory, disk)"),
        db: Session = Depends(get_db)
):
    """
    Get a specific metric from a standard device.

    This endpoint connects to the Glances web server on the target device and
    retrieves a specific system metric. The Glances server must be running on
    the target device with the web server enabled (using 'glances -w').

    Common metric values:
    - cpu: CPU usage statistics
    - memory: Memory usage statistics
    - disk: Disk usage statistics
    - network: Network interface statistics
    - process: Process information
    - system: General system information

    For a complete list of available metrics, refer to the Glances API documentation.
    """
    result = await StandardDeviceService.get_specific_metric(db, device_id, metric)

    # If there's an error field, provide additional help in the response
    if "error" in result:
        result[
            "help"] = "Ensure that Glances is installed and running in web server mode on the target device. Run 'glances -w' on the target device to start the web server."

    return result