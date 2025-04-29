import os
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "AInfrastructure Platform"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./infra_platform.db")
    PLUGINS_DIR: str = os.getenv("PLUGINS_DIR", "./plugins")

    class Config:
        env_file = ".env"


@lru_cache()
def get_settings():
    return Settings()