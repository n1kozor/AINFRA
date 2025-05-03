from sqlalchemy import create_engine, Column, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.sql import func
from contextlib import contextmanager
from typing import Dict, List, Optional
import os
from pathlib import Path

# Ensure database directory exists
DB_PATH = Path("./data")
DB_PATH.mkdir(exist_ok=True)
DATABASE_URL = f"sqlite:///{DB_PATH}/ainfra_llm_service.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class Setting(Base):
    __tablename__ = "settings"

    key = Column(String, primary_key=True, index=True)
    value = Column(String, nullable=False)


class Model(Base):
    __tablename__ = "models"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    provider = Column(String, nullable=False)
    last_updated = Column(DateTime, default=func.now())


@contextmanager
def get_db():
    """Provide a transactional scope around a series of operations."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Initialize the database with required tables and default values"""
    Base.metadata.create_all(bind=engine)

    # Insert default settings if they don't exist
    default_settings = {
        "default_model": "gpt-4.1-mini",
        "openai_api_key": "",
        "mcp_base_url": "http://localhost:8000/mcp"
    }

    with get_db() as db:
        for key, value in default_settings.items():
            setting = db.query(Setting).filter(Setting.key == key).first()
            if not setting:
                db.add(Setting(key=key, value=value))
        db.commit()


def get_setting(key: str) -> Optional[str]:
    """Retrieve a setting value from the database"""
    with get_db() as db:
        setting = db.query(Setting).filter(Setting.key == key).first()
        return setting.value if setting else None


def update_setting(key: str, value: str) -> bool:
    """Update a setting in the database"""
    with get_db() as db:
        setting = db.query(Setting).filter(Setting.key == key).first()
        if setting:
            setting.value = value
        else:
            db.add(Setting(key=key, value=value))
        db.commit()
        return True


def get_all_settings() -> Dict[str, str]:
    """Get all settings as a dictionary"""
    with get_db() as db:
        settings = db.query(Setting).all()
        return {setting.key: setting.value for setting in settings}


def save_models(models: List[Dict[str, str]]) -> bool:
    """Save or update available models in the database"""
    with get_db() as db:
        # Clear existing models
        db.query(Model).delete()

        # Add new models
        for model_data in models:
            model = Model(
                id=model_data['id'],
                name=model_data['name'],
                provider=model_data['provider']
            )
            db.add(model)

        db.commit()
        return True


def get_available_models() -> List[Dict[str, str]]:
    """Get all available models from the database"""
    with get_db() as db:
        models = db.query(Model).all()
        return [
            {"id": model.id, "name": model.name, "provider": model.provider}
            for model in models
        ]


# Initialize database on module import
init_db()