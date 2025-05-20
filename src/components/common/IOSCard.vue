<template>
  <v-card class="ios-card my-3" :class="className">
    <slot></slot>
  </v-card>
</template>

<script setup>
defineProps({
  className: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.ios-card {
  border-radius: 12px;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s ease;
  overflow: hidden;
}

.ios-card:hover {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

/* iOS style inset for nested content */
.ios-card :deep(.inset-content) {
  margin-left: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

/* iOS style headers */
.ios-card :deep(.ios-card-header) {
  padding: 16px;
  font-size: 20px;
  font-weight: 600;
  color: #000000;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* iOS style content sections */
.ios-card :deep(.ios-card-content) {
  padding: 16px;
}

/* iOS style actions */
.ios-card :deep(.ios-card-actions) {
  padding: 8px 16px 16px 16px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .ios-card {
    background-color: #2C2C2E;
  }
  
  .ios-card :deep(.ios-card-header) {
    color: #FFFFFF;
  }
  
  .ios-card :deep(.inset-content) {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
}
</style>
