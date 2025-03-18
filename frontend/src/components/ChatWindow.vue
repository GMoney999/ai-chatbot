<script setup lang="ts">
import MessageCard from './MessageCard.vue';

defineProps<{
  messages: Array<{ message: string; isUser: boolean }>;
}>();
</script>

<template>
  <div class="chat-window">
    <MessageCard
      v-for="(msg, index) in messages"
      :key="index"
      :message="msg.message"
      :isUser="msg.isUser"
    />
  </div>
</template>

<style scoped>
.chat-window {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  color: #ffffff;
  justify-content: flex-start; /* Stack messages at the top */
  box-shadow: inset 0 2px 4px rgba(200, 200, 200, 1);
}
</style>

