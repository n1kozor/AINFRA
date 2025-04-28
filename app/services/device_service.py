from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any, Union
from ..models.device import Device, StandardDevice, CustomDevice, DeviceType
from ..schemas.device import DeviceCreate, DeviceUpdate, StandardDeviceUpdate, CustomDeviceUpdate
from ..core.exceptions import DeviceNotFoundException, PluginNotFoundException
from ..models.plugin import Plugin


class DeviceService:
    @staticmethod
    async def get_devices(db: Session, skip: int = 0, limit: int = 100) -> List[Device]:
        """Get all devices with pagination"""
        return db.query(Device).offset(skip).limit(limit).all()

    @staticmethod
    async def get_device(db: Session, device_id: int) -> Device:
        """Get a device by ID"""
        device = db.query(Device).filter(Device.id == device_id).first()
        if not device:
            raise DeviceNotFoundException(f"Device with ID {device_id} not found")
        return device

    @staticmethod
    async def create_device(db: Session, device_data: DeviceCreate) -> Device:
        """Create a new device with associated standard or custom device"""
        # Create base device
        device = Device(
            name=device_data.name,
            description=device_data.description,
            type=device_data.type,
            ip_address=str(device_data.ip_address)
        )

        db.add(device)
        db.flush()  # Get the device ID

        # Create associated device based on type
        if device_data.type == DeviceType.STANDARD:
            if not device_data.standard_device:
                db.rollback()
                raise ValueError("Standard device data is required for device type STANDARD")

            std_device = StandardDevice(
                device_id=device.id,
                os_type=device_data.standard_device.os_type,
                hostname=device_data.standard_device.hostname,
                username=device_data.standard_device.username,
                password=device_data.standard_device.password,
                port=device_data.standard_device.port
            )
            db.add(std_device)

        elif device_data.type == DeviceType.CUSTOM:
            if not device_data.custom_device:
                db.rollback()
                raise ValueError("Custom device data is required for device type CUSTOM")

            # Verify plugin exists
            plugin = db.query(Plugin).filter(
                Plugin.id == device_data.custom_device.plugin_id,
                Plugin.is_active == True
            ).first()

            if not plugin:
                db.rollback()
                raise PluginNotFoundException(
                    f"Plugin with ID {device_data.custom_device.plugin_id} not found or not active")

            custom_device = CustomDevice(
                device_id=device.id,
                plugin_id=device_data.custom_device.plugin_id,
                connection_params=device_data.custom_device.connection_params
            )
            db.add(custom_device)

        db.commit()
        db.refresh(device)

        # Ha custom device, akkor töltsük fel a plugin_name-et is
        if device.type == DeviceType.CUSTOM and device.custom_device:
            plugin = db.query(Plugin).filter(Plugin.id == device.custom_device.plugin_id).first()
            if plugin:
                # Itt nem módosítjuk közvetlenül az adatbázist, csak a visszaadandó objektumot bővítjük
                setattr(device.custom_device, "plugin_name", plugin.name)

        return device

    @staticmethod
    async def update_device(
            db: Session,
            device_id: int,
            device_data: DeviceUpdate,
            standard_data: Optional[StandardDeviceUpdate] = None,
            custom_data: Optional[CustomDeviceUpdate] = None
    ) -> Device:
        """Update a device and its associated standard or custom device"""
        device = await DeviceService.get_device(db, device_id)

        # Update base device fields
        for key, value in device_data.dict(exclude_unset=True).items():
            setattr(device, key, value)

        # Update specific device type data
        if device.type == DeviceType.STANDARD and standard_data:
            if not device.standard_device:
                raise ValueError(f"Device {device_id} does not have associated standard device data")

            for key, value in standard_data.dict(exclude_unset=True).items():
                setattr(device.standard_device, key, value)

        elif device.type == DeviceType.CUSTOM and custom_data:
            if not device.custom_device:
                raise ValueError(f"Device {device_id} does not have associated custom device data")

            if custom_data.plugin_id:
                # Verify plugin exists if changing
                plugin = db.query(Plugin).filter(
                    Plugin.id == custom_data.plugin_id,
                    Plugin.is_active == True
                ).first()

                if not plugin:
                    raise PluginNotFoundException(f"Plugin with ID {custom_data.plugin_id} not found or not active")

            for key, value in custom_data.dict(exclude_unset=True).items():
                setattr(device.custom_device, key, value)

        db.commit()
        db.refresh(device)
        return device

    @staticmethod
    async def delete_device(db: Session, device_id: int) -> bool:
        """Delete a device"""
        device = await DeviceService.get_device(db, device_id)
        db.delete(device)
        db.commit()
        return True