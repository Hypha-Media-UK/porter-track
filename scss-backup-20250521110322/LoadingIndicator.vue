<template>
  <div class="loading-container" :class="{ 'text-center': center }">
    <div v-if="type === 'spinner'" :class="spinnerClasses"></div>
    <div v-else-if="type === 'dots'" :class="dotsClasses">
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
    </div>
    <div v-if="label" class="loading-label mt-2">{{ label }}</div>
  </div>
</template>

<script>
export default {
  name: 'LoadingIndicator',
  props: {
    type: {
      type: String,
      default: 'spinner',
      validator: (value) => ['spinner', 'dots'].includes(value)
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg'].includes(value)
    },
    variant: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'secondary', 'accent', 'warning', 'error'].includes(value)
    },
    label: {
      type: String,
      default: ''
    },
    center: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    spinnerClasses() {
      return [
        'loading-spinner',
        `spinner-${this.variant}`,
        {
          'spinner-sm': this.size === 'sm',
          'spinner-lg': this.size === 'lg'
        }
      ];
    },
    dotsClasses() {
      return [
        'loading-dots',
        `dots-${this.variant}`,
        {
          'dots-sm': this.size === 'sm',
          'dots-lg': this.size === 'lg'
        }
      ];
    }
  }
};
</script>
