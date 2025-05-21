<template>
  <span :class="badgeClasses">
    <span v-if="dot" class="status-indicator" :class="`status-${variant}`"></span>
    <slot></slot>
  </span>
</template>

<script>
export default {
  name: 'Badge',
  props: {
    variant: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'secondary', 'accent', 'warning', 'error'].includes(value)
    },
    subtle: {
      type: Boolean,
      default: false
    },
    outline: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg'].includes(value)
    },
    dot: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    badgeClasses() {
      return [
        'badge',
        {
          [`badge-${this.variant}`]: !this.subtle && !this.outline,
          [`badge-subtle-${this.variant}`]: this.subtle,
          [`badge-outline-${this.variant}`]: this.outline,
          'badge-sm': this.size === 'sm',
          'badge-lg': this.size === 'lg',
          'badge-dot': this.dot
        }
      ];
    }
  }
};
</script>
