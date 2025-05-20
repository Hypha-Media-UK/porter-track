<template>
  <div class="text-center py-4">
    <v-icon v-if="icon" :icon="icon" size="large" :color="iconColor" class="mb-2"></v-icon>
    <h3 v-if="title" class="text-h6 mb-2">{{ title }}</h3>
    <p>{{ message }}</p>
    <v-btn
      v-if="actionText"
      :color="actionColor"
      :variant="actionVariant"
      class="mt-3"
      @click="$emit('action')"
    >
      <v-icon v-if="actionIcon" start>{{ actionIcon }}</v-icon>
      {{ actionText }}
    </v-btn>
  </div>
</template>

<script setup>
defineProps({
  icon: {
    type: String,
    default: ''
  },
  iconColor: {
    type: String,
    default: 'grey'
  },
  title: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: 'No items found'
  },
  actionText: {
    type: String,
    default: ''
  },
  actionIcon: {
    type: String,
    default: ''
  },
  actionColor: {
    type: String,
    default: 'primary'
  },
  actionVariant: {
    type: String,
    default: 'text'
  }
})

defineEmits(['action'])
</script>
