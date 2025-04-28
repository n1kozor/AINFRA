import importlib.util
import sys
from pathlib import Path
from typing import Dict, Any, List, Tuple, Optional
import json


def safe_json_loads(json_str: str, default: Any = None) -> Any:
    """
    Safely load JSON string

    Args:
        json_str: JSON string to load
        default: Default value to return if loading fails

    Returns:
        Parsed JSON or default value
    """
    try:
        return json.loads(json_str)
    except (json.JSONDecodeError, TypeError):
        return default if default is not None else {}


def parse_condition(condition: str) -> Tuple[str, float]:
    """
    Parse alert condition string into operator and value

    Args:
        condition: Condition string (e.g., ">90", "<5")

    Returns:
        Tuple of (operator, value)
    """
    operators = [">=", "<=", "==", "!=", ">", "<"]

    for op in operators:
        if condition.startswith(op):
            try:
                value = float(condition[len(op):])
                return op, value
            except ValueError:
                break

    raise ValueError(f"Invalid condition format: {condition}")


def format_bytes(bytes_value: int) -> str:
    """
    Format bytes to human-readable string

    Args:
        bytes_value: Bytes value

    Returns:
        Formatted string (e.g., "1.23 GB")
    """
    suffixes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
    i = 0
    while bytes_value >= 1024 and i < len(suffixes) - 1:
        bytes_value /= 1024.0
        i += 1
    return f"{bytes_value:.2f} {suffixes[i]}"