<template>
  <div class="text-center" v-if="show">
    <v-progress-circular 
      :indeterminate="true" 
      :color="color" 
      :size="size"
    ></v-progress-circular>
    <p v-if="message" class="mt-2">{{ message }}</p>
  </div>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    default: true
  },
  color: {
    type: String,
    default: 'primary'
  },
  size: {
    type: Number,
    default: 32
  },
  message: {
    type: String,
    default: 'Loading...'
  }
})
</script>
