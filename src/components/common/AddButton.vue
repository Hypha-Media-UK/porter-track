<template>
  <IOSButton
    :color="color"
    variant="text"
    :size="size"
    density="comfortable"
    rounded="pill"
    :class="['add-button', buttonClass]"
    @click="$emit('click', $event)"
  >
    <v-icon :icon="'mdi-plus'" />
  </IOSButton>
</template>

<script setup>
import IOSButton from './IOSButton.vue'

defineProps({
  color: {
    type: String,
    default: 'primary'
  },
  size: {
    type: String,
    default: 'small',
    validator: (value) => ['x-small', 'small', 'default', 'large', 'x-large'].includes(value)
  },
  buttonClass: {
    type: String,
    default: ''
  }
})

defineEmits(['click'])
</script>

<style scoped>
.add-button {
  min-width: 36px !important;
  min-height: 36px !important;
  width: 36px !important;
  height: 36px !important;
  padding: 0 !important;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50% !important;
}

.add-button.v-btn--size-x-small {
  min-width: 28px !important;
  min-height: 28px !important;
  width: 28px !important;
  height: 28px !important;
}

.add-button.v-btn--size-small {
  min-width: 36px !important;
  min-height: 36px !important;
  width: 36px !important;
  height: 36px !important;
}

.add-button.v-btn--size-default {
  min-width: 44px !important;
  min-height: 44px !important;
  width: 44px !important;
  height: 44px !important;
}

.add-button.v-btn--size-large {
  min-width: 52px !important;
  min-height: 52px !important;
  width: 52px !important;
  height: 52px !important;
}

.add-button.v-btn--size-x-large {
  min-width: 60px !important;
  min-height: 60px !important;
  width: 60px !important;
  height: 60px !important;
}
</style>
