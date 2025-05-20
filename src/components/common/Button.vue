<template>
  <button
    :class="buttonClasses"
    :disabled="disabled"
    :type="type"
    @click="$emit('click', $event)"
  >
    <span v-if="iconLeft" class="icon icon-left">{{ iconLeft }}</span>
    <slot></slot>
    <span v-if="iconRight" class="icon icon-right">{{ iconRight }}</span>
  </button>
</template>

<script>
export default {
  name: 'Button',
  props: {
    variant: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'secondary', 'accent', 'warning', 'error', 'outline', 'text'].includes(value)
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg'].includes(value)
    },
    type: {
      type: String,
      default: 'button'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    iconLeft: {
      type: String,
      default: ''
    },
    iconRight: {
      type: String,
      default: ''
    },
    block: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    buttonClasses() {
      return [
        'btn',
        `btn-${this.variant}`,
        {
          'btn-sm': this.size === 'sm',
          'btn-lg': this.size === 'lg',
          'btn-block': this.block,
          'btn-icon': this.iconLeft || this.iconRight,
        }
      ];
    }
  }
};
</script>
