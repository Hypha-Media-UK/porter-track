<template>
  <div :class="['card', cardClass]">
    <div v-if="$slots.header || title" class="card-header">
      <h3 v-if="title" class="card-title">{{ title }}</h3>
      <p v-if="subtitle" class="card-subtitle">{{ subtitle }}</p>
      <slot name="header"></slot>
    </div>
    <div class="card-body">
      <slot></slot>
    </div>
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Card',
  props: {
    title: {
      type: String,
      default: ''
    },
    subtitle: {
      type: String,
      default: ''
    },
    cardClass: {
      type: String,
      default: ''
    },
    flat: {
      type: Boolean,
      default: false
    },
    hover: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      default: '',
      validator: (value) => ['', 'primary', 'secondary', 'accent', 'warning', 'error'].includes(value)
    },
    accent: {
      type: String,
      default: '',
      validator: (value) => ['', 'primary', 'secondary', 'accent', 'warning', 'error'].includes(value)
    }
  },
  computed: {
    cardClasses() {
      return [
        'card',
        this.cardClass,
        {
          'card-flat': this.flat,
          'card-hover': this.hover,
          [`card-status status-${this.status}`]: this.status,
          [`card-accent-${this.accent}`]: this.accent
        }
      ];
    }
  }
};
</script>
