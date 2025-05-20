<template>
  <span class="status-badge" :class="statusClass">
    <v-icon v-if="icon" :icon="statusIcon" size="small" class="status-badge__icon"></v-icon>
    <span class="status-badge__text">{{ statusLabel }}</span>
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    required: true,
    validator: (value) => ['pending', 'completed', 'in-progress', 'success', 'warning', 'error', 'info'].includes(value)
  },
  label: {
    type: String,
    default: ''
  },
  icon: {
    type: Boolean,
    default: true
  }
})

const statusClass = computed(() => {
  return {
    'status-badge--pending': props.status === 'pending',
    'status-badge--in-progress': props.status === 'in-progress',
    'status-badge--completed': props.status === 'completed' || props.status === 'success',
    'status-badge--warning': props.status === 'warning',
    'status-badge--error': props.status === 'error',
    'status-badge--info': props.status === 'info'
  }
})

const statusIcon = computed(() => {
  switch (props.status) {
    case 'pending':
      return 'mdi-clock-outline'
    case 'in-progress':
      return 'mdi-progress-clock'
    case 'completed':
    case 'success':
      return 'mdi-check-circle-outline'
    case 'warning':
      return 'mdi-alert-outline'
    case 'error':
      return 'mdi-alert-circle-outline'
    case 'info':
      return 'mdi-information-outline'
    default:
      return 'mdi-help-circle-outline'
  }
})

const statusLabel = computed(() => {
  if (props.label) return props.label
  
  switch (props.status) {
    case 'pending':
      return 'Pending'
    case 'in-progress':
      return 'In Progress'
    case 'completed':
      return 'Completed'
    case 'success':
      return 'Success'
    case 'warning':
      return 'Warning'
    case 'error':
      return 'Error'
    case 'info':
      return 'Info'
    default:
      return 'Unknown'
  }
})
</script>

<style scoped>
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
}

.status-badge__icon {
  margin-right: 4px;
}

/* Status variants */
.status-badge--pending {
  background-color: rgba(255, 149, 0, 0.15);
  color: #FF9500;
}

.status-badge--in-progress {
  background-color: rgba(88, 86, 214, 0.15);
  color: #5856D6;
}

.status-badge--completed {
  background-color: rgba(52, 199, 89, 0.15);
  color: #34C759;
}

.status-badge--warning {
  background-color: rgba(255, 149, 0, 0.15);
  color: #FF9500;
}

.status-badge--error {
  background-color: rgba(255, 59, 48, 0.15);
  color: #FF3B30;
}

.status-badge--info {
  background-color: rgba(0, 122, 255, 0.15);
  color: #007AFF;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .status-badge--pending {
    background-color: rgba(255, 159, 10, 0.15);
    color: #FF9F0A;
  }
  
  .status-badge--in-progress {
    background-color: rgba(94, 92, 230, 0.15);
    color: #5E5CE6;
  }
  
  .status-badge--completed {
    background-color: rgba(48, 209, 88, 0.15);
    color: #30D158;
  }
  
  .status-badge--warning {
    background-color: rgba(255, 159, 10, 0.15);
    color: #FF9F0A;
  }
  
  .status-badge--error {
    background-color: rgba(255, 69, 58, 0.15);
    color: #FF453A;
  }
  
  .status-badge--info {
    background-color: rgba(10, 132, 255, 0.15);
    color: #0A84FF;
  }
}
</style>
