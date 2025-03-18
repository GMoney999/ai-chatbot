<script setup lang="ts">
import { ref } from 'vue';

const userInput = ref('');

function sendMessage() {
  if (userMessage.value.trim() !== '') {
    emit('submit-message', userMessage.value);
    userMessage.value = ''; // Clear input after sending
  }
}

const userMessage = ref('');
const emit = defineEmits(['submit-message']);
</script>

<template>
  <div class="user-input">
    <input v-model="userMessage" placeholder="Type a message..." @keydown.enter="sendMessage"/>
    <button @click="sendMessage">Send</button>
  </div>
</template>


<style scoped>
 button {
  font-size: small;
  border-radius: 8px;
  margin-right: 5px;
 }

  .user-input {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    background-color: transparent;
  }

  .user-input input {
    width: 100%;
    padding: 12px 16px;
    border-radius: 8px;
    border: none;
    background-color: #3b3f5c;
    color: #ffffff;
    font-size: 14px;
    outline: none;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .user-input button {
    width: 45px;
    height: 45px;
    background-color: #3b3f5c;
    border-radius: 8px right;
    color: #ffffff;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .user-input button:hover {
    background-color: #505579;
  }
</style>
