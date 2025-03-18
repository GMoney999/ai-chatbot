package main

import (
	"encoding/json" // For JSON encoding/decoding
	"io"
	"log"      // For logging errors
	"net/http" // For creating an HTTP server
)

// MessagePayload
// Struct to match the expected JSON payload
type MessagePayload struct {
	UserID         string `json:"user_id"`
	ConversationID string `json:"conversation_id"`
	UserMessage    string `json:"user_message"`
	AssistantReply string `json:"assistant_reply"`
	Timestamp      string `json:"timestamp"`
}

// Handler function for storing conversation data
func storeDataHandler(w http.ResponseWriter, r *http.Request) {
	// Ensure it's a POST request
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	// Read request body
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Failed to read request body", http.StatusBadRequest)
		return
	}

	// Close the body (important for memory safety)
	// log any errors
	defer func() {
		if err := r.Body.Close(); err != nil {
			log.Println("Error closing request body:", err)
		}
	}()

	// Log incoming request
	log.Printf("\n🚀 [REQUEST] %s %s from %s", r.Method, r.URL.Path, r.RemoteAddr)

	// Log request body
	var prettyBody map[string]interface{}
	if err := json.Unmarshal(body, &prettyBody); err == nil {
		formattedBody, _ := json.MarshalIndent(prettyBody, "", "  ")
		log.Printf("📥 [BODY] %s", string(formattedBody))
	} else {
		log.Printf("📥 [BODY] (raw) %s", string(body))
	}

	// Unmarshal JSON into struct
	var payload MessagePayload
	if err := json.Unmarshal(body, &payload); err != nil {
		http.Error(w, "Invalid JSON format", http.StatusBadRequest)
		return
	}

	// Log parsed payload
	log.Printf("📝 [PARSED PAYLOAD]\n  🔹 UserID: %s\n  🔹 ConversationID: %s\n  🔹 UserMessage: %s\n  🔹 AssistantReply: %s\n  🔹 Timestamp: %s",
		payload.UserID, payload.ConversationID, payload.UserMessage, payload.AssistantReply, payload.Timestamp)

	// Send a JSON response
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	response := map[string]string{"status": "success", "message": "Data received successfully"}
	json.NewEncoder(w).Encode(response)

	// Log response
	log.Println("✅ [RESPONSE] Successfully stored conversation data - 200 OK")
}

func main() {
	// Set up the HTTP server
	http.HandleFunc("/api/store_data", storeDataHandler)

	port := "8080"
	// Log server start
	log.Printf("\n🌍 [SERVER] Running on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
