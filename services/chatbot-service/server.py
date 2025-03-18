from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from langchain.chat_models import init_chat_model
from langchain_core.messages import HumanMessage, SystemMessage
from redis_cache import store_message, increment_message_count, format_conversation


import os
import logging
import anthropic
import httpx

# Logging configuration
logging.basicConfig(filename="server.log", level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)


# FastAPI app setup
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Allow only your frontend's origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Load environment variables from .env file
load_dotenv()

client = anthropic.Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY"),
)

# Request body model
class MessagePayload(BaseModel):
    user_message: str
    user_id: str
    conversation_id: str
    timestamp: str




def extract_assistant_response(response):
    """
    Extracts the assistant's text response from the Claude API response.

    :param response: The API response object from `client.messages.create()`
    :return: A string containing the extracted assistant message or an error message if extraction fails.
    """
    try:
        # Ensure response has 'content' and it's a list
        if hasattr(response, "content") and isinstance(response.content, list):
            # Extract text from all TextBlock elements
            extracted_text = "\n".join(block.text for block in response.content if hasattr(block, "text"))
            return extracted_text.strip() if extracted_text else "No content received from LLM."
        else:
            return "Response content is missing or improperly formatted."
    except Exception as e:
        return f"Error extracting response: {str(e)}"










# Stores session info (long term)

DYNAMODB_SERVICE_URL = "http://localhost:8080/api/store_data"

async def store_long_term(payload: MessagePayload, assistant_reply: str):
    """
    Send conversation data to the storage service responsible for DynamoDB.
    """
    async with httpx.AsyncClient() as client:
        response = await client.post(
            DYNAMODB_SERVICE_URL,
            json={
                "user_id": payload.user_id,
                "conversation_id": payload.conversation_id,
                "user_message": payload.user_message,
                "assistant_reply": assistant_reply,
                "timestamp": payload.timestamp,
            }
        )

        if response.status_code == 200:
            return response.json()
        else:
            return {"error": f"Failed to store data: {response.text}"}






# Receives a message from the frontend

@app.post("/message")
async def receive_message(payload: MessagePayload):
    user_message = payload.user_message
    logger.info(f"Received message: {user_message}")

    if not user_message:
        logger.error("Message field is required")
        raise HTTPException(status_code=400, detail="Message field is required")

    # Retrieve formatted conversation history
    conversation_history = format_conversation(payload.conversation_id)

    logger.info(f"Conversation history: {conversation_history}")

    # Get response from Claude AI
    response = client.messages.create(
        model="claude-3-7-sonnet-20250219",
        max_tokens=48,
        messages=[
            {"role": "assistant", "content": "You are a helpful assistant"},
            {"role": "user",
             "content": f"Here is the conversation so far:\n\n{conversation_history}\n\nUser: {user_message}\n\nOnly respond as the assistant. Do not continue as the user."}        ]
    )

    # Format AI RESPONSE
    assistant_reply = extract_assistant_response(response)

    # Store messages in Redis
    store_message(payload.conversation_id, "user", payload.user_message)
    store_message(payload.conversation_id, "assistant", assistant_reply)
    increment_message_count(payload.conversation_id)

    # Send data to your storage service
    storage_response = await store_long_term(payload, assistant_reply)
    logger.info(f"Stored in DynamoDB Service: {storage_response}")

    return {"status": "success", "message": assistant_reply}