import os
import redis
import logging

logging.basicConfig(filename="redis_cache.log", level=logging.INFO, format="%(asctime)s - %(message)s")
redis_logger = logging.getLogger("redis_cache")

# Initialize Redis client
redis_client = redis.Redis(
    host=os.getenv("REDIS_HOST", "localhost"),
    port=int(os.getenv("REDIS_PORT", 6379)),
    db=0,
    decode_responses=True  # Ensure responses are strings
)

def store_message(conversation_id: str, sender: str, message: str):
    """
    Store a user or assistant message in Redis list and trim it to keep last 10 messages.
    """
    key = f"conversation:{conversation_id}:messages"
    redis_client.lpush(key, f"{sender}: {message}")
    redis_client.ltrim(key, 0, 9)  # Keep only the last 10 messages
    messages = redis_client.lrange(key, 0, -1)
    redis_logger.info(f"[REDIS] Updated Messages for Conversation {conversation_id}:")
    for msg in messages:
        if "User:" not in msg:  # Ensure only assistant messages are stored correctly
            redis_logger.info(f"  - {msg}")

def store_session_metadata(conversation_id: str, metadata: dict):
    """
    Store session metadata in Redis hash.
    """
    key = f"conversation:{conversation_id}"
    redis_client.hset(key, mapping=metadata)
    metadata = redis_client.hgetall(key)
    redis_logger.info(f"[REDIS] Updated Metadata for Conversation {conversation_id}:")
    for k, v in metadata.items():
        redis_logger.info(f"  {k}: {v}")

def increment_message_count(conversation_id: str):
    """
    Increment the message count for the conversation.
    """
    key = f"conversation:{conversation_id}"
    redis_client.hincrby(key, "message_count", 1)
    count = redis_client.hget(key, "message_count")
    redis_logger.info(f"[REDIS] Message Count Updated for Conversation {conversation_id}: {count}")

def get_conversation_messages(conversation_id: str):
    """
    Retrieve the last 10 messages from Redis.
    """
    key = f"conversation:{conversation_id}:messages"
    return redis_client.lrange(key, 0, -1)

def get_session_metadata(conversation_id: str):
    """
    Retrieve session metadata from Redis.
    """
    key = f"conversation:{conversation_id}"
    return redis_client.hgetall(key)


def format_conversation(conversation_id: str):
    """
    Retrieves and formats the conversation messages into a human-readable form.
    """
    messages = get_conversation_messages(conversation_id)

    # Reverse to maintain chronological order
    messages.reverse()

    formatted_output = [f"Conversation History (ID: {conversation_id})\n"]

    for msg in messages:
        sender, content = msg.split(": ", 1)
        formatted_output.append(f"{sender.capitalize()}: {content}")

    return "\n".join(formatted_output)


import re
from datetime import datetime

def pretty_print_conversation(log_file_path, output_file_path):
    conversation = []
    current_timestamp = None
    # Regex to capture the timestamp at the beginning of each log line.
    timestamp_regex = re.compile(r"^(?P<timestamp>\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2},\d{3})")
    # Regex to identify REDIS update messages that contain conversation details.
    redis_regex = re.compile(r"\[REDIS\] Updated Messages for Conversation")
    # Regex to capture individual conversation messages.
    message_regex = re.compile(r"^\s*-\s*(user|assistant):\s*(.+)")

    with open(log_file_path, 'r') as f:
        lines = f.readlines()

    # Iterate over all lines in the log.
    for i, line in enumerate(lines):
        # Update the current timestamp if the line starts with one.
        ts_match = timestamp_regex.match(line)
        if ts_match:
            current_timestamp = ts_match.group("timestamp")
        # When we find a line indicating conversation updates...
        if redis_regex.search(line):
            # Process subsequent lines until we hit a new timestamp line.
            j = i + 1
            while j < len(lines) and not timestamp_regex.match(lines[j]):
                msg_match = message_regex.match(lines[j])
                if msg_match:
                    role = msg_match.group(1).capitalize()  # Format role as 'User' or 'Assistant'
                    message = msg_match.group(2).strip()
                    conversation.append((current_timestamp, role, message))
                j += 1

    # Write the cleaned conversation to the output file.
    with open(output_file_path, 'w') as out:
        for ts, role, msg in conversation:
            # Format the timestamp in a readable way (optionally you can reformat it).
            dt = datetime.strptime(ts, "%Y-%m-%d %H:%M:%S,%f")
            formatted_ts = dt.strftime("%Y-%m-%d %H:%M:%S")
            out.write(f"{formatted_ts} - {role}: {msg}\n")

# Example usage:
if __name__ == '__main__':
    pretty_print_conversation("redis_cache.log", "formatted_conversation.txt")