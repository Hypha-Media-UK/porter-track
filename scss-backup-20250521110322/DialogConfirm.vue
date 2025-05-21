<template>
  <div v-if="modelValue" class="modal-wrapper">
    <div class="modal-overlay" @click="closeIfClickOutside && $emit('update:modelValue', false)">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">{{ title }}</h3>
          <button 
            v-if="showCloseButton" 
            class="modal-close" 
            @click="$emit('update:modelValue', false)"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        
        <div class="modal-body">
          <p v-if="message">{{ message }}</p>
          <slot></slot>
        </div>
        
        <div class="modal-footer">
          <Button 
            v-if="showCancelButton" 
            :variant="cancelVariant" 
            @click="onCancel"
          >
            {{ cancelText }}
          </Button>
          
          <Button 
            v-if="showConfirmButton" 
            :variant="confirmVariant" 
            @click="onConfirm"
          >
            {{ confirmText }}
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Button from './Button.vue';

export default {
  name: 'DialogConfirm',
  components: {
    Button
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Confirm'
    },
    message: {
      type: String,
      default: ''
    },
    confirmText: {
      type: String,
      default: 'Confirm'
    },
    cancelText: {
      type: String,
      default: 'Cancel'
    },
    confirmVariant: {
      type: String,
      default: 'primary'
    },
    cancelVariant: {
      type: String,
      default: 'secondary'
    },
    showConfirmButton: {
      type: Boolean,
      default: true
    },
    showCancelButton: {
      type: Boolean,
      default: true
    },
    showCloseButton: {
      type: Boolean,
      default: true
    },
    closeIfClickOutside: {
      type: Boolean,
      default: true
    }
  },
  emits: ['update:modelValue', 'confirm', 'cancel'],
  methods: {
    onConfirm() {
      this.$emit('confirm');
      this.$emit('update:modelValue', false);
    },
    onCancel() {
      this.$emit('cancel');
      this.$emit('update:modelValue', false);
    }
  }
};
</script>
