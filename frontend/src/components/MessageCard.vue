<script setup lang="ts">
defineProps<{
  message: string;
  isUser: boolean;
}>();
</script>

<template>
  <div :class="['message-card', isUser ? 'user-message' : 'bot-message']">
    {{ message }}
  </div>
</template>

<style scoped>
.message-card {
  padding: 10px 15px;
  border-radius: 15px;
  margin: 5px 0;
  max-width: 75%;
  word-wrap: break-word;
  color: #fff;
  font-size: 14px;
  display: inline-block; /* Adjust size to content */
}

.user-message {
  align-self: flex-end;
  background-color: #2e65d1;
}

.bot-message {
  background-color: #6b6c7a;
  align-self: flex-start;
  background-color: #43454a;
}
</style>


