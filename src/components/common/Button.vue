<template>
  <button
    :class="buttonClasses"
    :disabled="disabled"
    :type="type"
    @click="$emit('click', $event)"
  >
    <Icon v-if="iconLeft" :name="iconLeft" class="icon-left" />
    <slot></slot>
    <Icon v-if="iconRight" :name="iconRight" class="icon-right" />
  </button>
</template>

<script setup>
import { computed } from 'vue';
import Icon from './Icon.vue';

const props = defineProps({
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
});

const buttonClasses = computed(() => {
  return [
    'btn',
    `btn-${props.variant}`,
    {
      'btn-sm': props.size === 'sm',
      'btn-lg': props.size === 'lg',
      'btn-block': props.block,
      'btn-icon': props.iconLeft || props.iconRight,
    }
  ];
});
</script>

<style lang="scss" scoped>
.icon-left {
  margin-right: $spacing-2;
}

.icon-right {
  margin-left: $spacing-2;
}
</style>
