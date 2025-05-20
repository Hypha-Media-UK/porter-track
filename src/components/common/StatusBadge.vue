<template>
  <div class="status-badge">
    <span class="status-indicator" :class="statusClass"></span>
    <span class="status-text">{{ label || statusLabel }}</span>
  </div>
</template>

<script>
export default {
  name: 'StatusBadge',
  props: {
    status: {
      type: String,
      default: 'neutral',
      validator: (value) => ['success', 'warning', 'error', 'info', 'neutral'].includes(value)
    },
    active: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    }
  },
  computed: {
    statusClass() {
      return [
        `status-${this.status}`,
        { 'status-active': this.active }
      ];
    },
    statusLabel() {
      const labels = {
        success: 'Success',
        warning: 'Warning',
        error: 'Error',
        info: 'Info',
        neutral: 'Neutral'
      };
      
      return labels[this.status] || 'Unknown';
    }
  }
};
</script>
