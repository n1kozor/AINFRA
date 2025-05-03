from typing import List, Dict, Optional
from openai import OpenAI, APIError
import database


async def fetch_available_models() -> List[Dict[str, str]]:
    """Fetch available models from OpenAI API using the official SDK"""
    api_key = database.get_setting("openai_api_key")

    if not api_key:
        return []

    try:
        # Create OpenAI client
        client = OpenAI(api_key=api_key)

        # Get models
        models_response = client.models.list()

        # Filter and format models
        models = []
        for model in models_response.data:
            model_id = model.id
            if model_id and (
                    model_id.startswith('gpt-') or
                    model_id.startswith('text-') or
                    model_id.startswith('dall-') or
                    model_id.startswith('whisper-') or
                    model_id.startswith('claude-')
            ):
                models.append({
                    'id': model_id,
                    'name': model_id,
                    'provider': 'openai'
                })

        return models
    except APIError as e:
        print(f"OpenAI API Error: {str(e)}")
        return []
    except Exception as e:
        print(f"Error fetching models: {str(e)}")
        return []