# app/services/sync.py
import httpx
import asyncio
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from app.models.models import Device, AvailabilityCheck
from app.models.database import SessionLocal
import config


async def sync_devices():
    """
    Synchronize devices from the main API to local database.
    Handles updates, creates, and hard-deletes devices that are no longer in the main system.
    """
    print(f"Starting device synchronization: {datetime.now()}")
    db = SessionLocal()
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(config.MAIN_API_URL)
            if response.status_code != 200:
                print(f"Error fetching devices: {response.status_code}")
                return

            main_devices = response.json()

        # Current devices in the monitoring system
        current_device_map = {d.id: d for d in db.query(Device).all()}

        # Keep track of devices found in main system
        found_device_ids = set()

        # Update or create devices
        for device_data in main_devices:
            device_id = device_data["id"]
            found_device_ids.add(device_id)

            if device_id in current_device_map:
                # Update existing device
                device = current_device_map[device_id]
                device.name = device_data["name"]
                device.ip_address = device_data["ip_address"]
                device.is_active = device_data.get("is_active", True)
                device.updated_at = datetime.utcnow()
                print(f"Updated device: {device.name} (ID: {device_id})")
            else:
                # Create new device
                new_device = Device(
                    id=device_id,
                    name=device_data["name"],
                    ip_address=device_data["ip_address"],
                    is_active=device_data.get("is_active", True)
                )
                db.add(new_device)
                print(f"New device added: {device_data['name']} (ID: {device_id})")

        # Delete devices that no longer exist in main system
        devices_to_delete = [device_id for device_id in current_device_map.keys()
                             if device_id not in found_device_ids]

        if devices_to_delete:
            # First, delete associated availability checks
            for device_id in devices_to_delete:
                device = current_device_map[device_id]

                # Log before deletion
                print(f"Deleting device and its availability history: {device.name} (ID: {device_id})")

                # Option 1: Delete all availability checks for this device
                db.query(AvailabilityCheck).filter(
                    AvailabilityCheck.device_id == device_id
                ).delete(synchronize_session=False)

                # Option 2: Delete the device (will cascade delete checks if configured)
                db.delete(device)

            print(f"Deleted {len(devices_to_delete)} devices that no longer exist in the main system")

        db.commit()
        print(f"Device synchronization complete. {len(main_devices)} devices processed.")

    except Exception as e:
        db.rollback()
        print(f"Error during device synchronization: {str(e)}")
    finally:
        db.close()


# Helper function for triggering sync in background
async def run_device_sync():
    """Run device synchronization in the background"""
    await sync_devices()
    return {"status": "Device synchronization completed"}