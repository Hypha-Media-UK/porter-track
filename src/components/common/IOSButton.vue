<template>
  <v-btn
    :color="color"
    :variant="variant"
    :size="size"
    :rounded="rounded"
    :icon="icon"
    :disabled="disabled"
    :loading="loading"
    :block="block"
    :density="density"
    :class="['ios-button', buttonClass]"
    v-bind="$attrs"
    @click="$emit('click', $event)"
  >
    <v-icon v-if="prependIcon" :icon="prependIcon" start />
    <slot></slot>
    <v-icon v-if="appendIcon" :icon="appendIcon" end />
  </v-btn>
</template>

<script setup>
defineProps({
  color: {
    type: String,
    default: 'primary'
  },
  variant: {
    type: String,
    default: 'tonal',
    validator: (value) => ['filled', 'tonal', 'outlined', 'text', 'plain'].includes(value)
  },
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['x-small', 'small', 'default', 'large', 'x-large'].includes(value)
  },
  rounded: {
    type: String,
    default: 'pill'
  },
  icon: {
    type: String,
    default: ''
  },
  prependIcon: {
    type: String,
    default: ''
  },
  appendIcon: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  block: {
    type: Boolean,
    default: false
  },
  density: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'comfortable', 'compact'].includes(value)
  },
  buttonClass: {
    type: String,
    default: ''
  }
})

defineEmits(['click'])
</script>

<style scoped>
.ios-button {
  font-weight: 500;
  letter-spacing: 0;
  text-transform: none;
  transition: all 0.2s ease;
}

/* Variant styles to make them more iOS-like */
.ios-button.v-btn--variant-filled {
  box-shadow: none;
}

.ios-button.v-btn--variant-tonal {
  box-shadow: none;
  opacity: 0.9;
}

.ios-button.v-btn--variant-outlined {
  border-width: 1px;
}

.ios-button.v-btn--variant-text {
  text-decoration: none;
}

/* Add subtle hover effect */
.ios-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.ios-button.v-btn--variant-text:hover {
  box-shadow: none;
  background-color: rgba(0, 0, 0, 0.03);
}

/* Add tap effect */
.ios-button:active {
  transform: translateY(0);
  opacity: 0.8;
}

/* Disabled state */
.ios-button.v-btn--disabled {
  opacity: 0.5;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .ios-button.v-btn--variant-text:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
}
</style>
