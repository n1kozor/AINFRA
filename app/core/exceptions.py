from fastapi import HTTPException, status

class DeviceNotFoundException(HTTPException):
    def __init__(self, detail="Device not found"):
        super().__init__(status_code=status.HTTP_404_NOT_FOUND, detail=detail)

class PluginNotFoundException(HTTPException):
    def __init__(self, detail="Plugin not found"):
        super().__init__(status_code=status.HTTP_404_NOT_FOUND, detail=detail)

class PluginValidationError(HTTPException):
    def __init__(self, detail="Plugin validation failed"):
        super().__init__(status_code=status.HTTP_400_BAD_REQUEST, detail=detail)

class SensorNotFoundException(HTTPException):
    def __init__(self, detail="Sensor not found"):
        super().__init__(status_code=status.HTTP_404_NOT_FOUND, detail=detail)