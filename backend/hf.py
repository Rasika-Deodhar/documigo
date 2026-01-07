import os
from typing import Optional
from openai import OpenAI, AuthenticationError


# Read token and optional model id from environment variables
HF_TOKEN = os.environ.get("HF_TOKEN")
HF_MODEL = os.environ.get("HF_MODEL", "meta-llama/Llama-3.1-8B-Instruct:sambanova")


def _normalize_model_id(model_env: Optional[str]) -> str:
    """Normalize a possibly comma-separated model env var and return a single model id.

    This will take the first entry if multiple are provided (commas) and strip whitespace.
    It avoids passing invalid comma-containing strings to the HF validator.
    """
    if not model_env:
        raise ValueError("No model id provided via HF_MODEL environment variable")
    # If user accidentally supplied a comma-separated list, take the first one
    model_id = model_env.split(",")[0].strip()
    return model_id


def generate_response(data: str, query: str) -> str:
    """Send document text + query to Hugging Face chat completion and return the assistant response.

    Requires HF_TOKEN in environment. Optionally set HF_MODEL to choose the model. If HF_MODEL
    contains multiple values separated by commas, the first value will be used.
    
    Uses the OpenAI SDK with Hugging Face's router endpoint (https://router.huggingface.co/v1)
    for better compatibility and support for multiple inference providers (sambanova, meta, etc).
    """
    if not HF_TOKEN:
        raise RuntimeError("HF_TOKEN environment variable is not set")

    model_id = _normalize_model_id(HF_MODEL)

    # Use OpenAI SDK with Hugging Face router endpoint
    client = OpenAI(
        base_url="https://router.huggingface.co/v1",
        api_key=HF_TOKEN,
    )

    messages = [
        {
            "role": "user",
            "content": f"Here is the document content:\n\n{data}\n\nPlease answer the following query based on this document: {query}",
        }
    ]

    try:
        completion = client.chat.completions.create(
            model=model_id,
            messages=messages,
            stream=False,
        )
        # Extract the response text from the completion
        print(completion)
        if completion.choices and len(completion.choices) > 0:
            return completion.choices[0].message.content
        return "Assistant did not return any content."
    except AuthenticationError:
        raise RuntimeError(
            "Authentication failed with HF_TOKEN. Make sure HF_TOKEN is valid.\n"
            "If your token recently changed or expired, update the HF_TOKEN environment variable."
        )
    except Exception as e:
        raise RuntimeError(f"Failed to generate response from model '{model_id}': {str(e)}")