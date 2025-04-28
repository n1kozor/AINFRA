import ast
import inspect
from typing import Dict, Any, List, Tuple, Optional
from .base import BasePlugin


def validate_plugin_code(code: str) -> Tuple[bool, Optional[str]]:
    """
    Validate plugin code for security and correctness.

    Args:
        code: The Python code to validate

    Returns:
        Tuple of (is_valid, error_message)
    """
    # Check for syntax errors
    try:
        ast.parse(code)
    except SyntaxError as e:
        return False, f"Syntax error: {str(e)}"

    # Check for dangerous imports
    tree = ast.parse(code)
    imports = []

    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            for name in node.names:
                imports.append(name.name)
        elif isinstance(node, ast.ImportFrom):
            imports.append(node.module)

    blacklist = ['os', 'subprocess', 'sys', 'shutil', 'requests']
    for dangerous in blacklist:
        if any(imp == dangerous or (imp and imp.startswith(f"{dangerous}.")) for imp in imports):
            return False, f"Dangerous import detected: {dangerous}"

    # Check that the plugin inherits from BasePlugin
    class_defs = [node for node in ast.walk(tree) if isinstance(node, ast.ClassDef)]
    has_plugin_class = False

    for class_def in class_defs:
        for base in class_def.bases:
            if isinstance(base, ast.Name) and base.id == 'BasePlugin':
                has_plugin_class = True
                break

    if not has_plugin_class:
        return False, "No class inheriting from BasePlugin found"

    return True, None


def load_plugin_class(code: str) -> type[BasePlugin]:
    """
    Load a plugin class from code string.

    Args:
        code: The Python code containing the plugin class

    Returns:
        The plugin class
    """
    namespace = {}
    exec(f"from app.plugins.base import BasePlugin\n{code}", namespace)

    # Find the class that inherits from BasePlugin
    for name, obj in namespace.items():
        if (inspect.isclass(obj) and
                issubclass(obj, BasePlugin) and
                obj is not BasePlugin):
            return obj

    raise ValueError("No valid plugin class found")