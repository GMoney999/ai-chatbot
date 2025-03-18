import axios from "axios";

const apiClient = axios.create({
  baseURL: 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json'
  }
});

export interface MessagePayload {
  user_id: string;
  conversation_id: string;
  user_message: string;
  timestamp: string;
}

export const sendMessage = async (message: MessagePayload) => {
  try {
    const response = await apiClient.post("/message", message);;
    return response.data
  } catch (error) {
    console.error("Request failed: ", error.response?.data || error.message);
    throw error;
  }
}
