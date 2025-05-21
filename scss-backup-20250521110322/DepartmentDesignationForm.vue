<template>
  <div class="designation-form">
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="designation-name" class="form-label">Designation Name</label>
        <input
          id="designation-name"
          v-model="form.name"
          class="form-control"
          :class="{ 'is-invalid': errors.name }"
          placeholder="Enter designation name"
          @input="errors.name = ''"
          ref="nameInput"
        />
        <div v-if="errors.name" class="invalid-feedback">
          {{ errors.name }}
        </div>
      </div>
      
      <div class="form-actions">
        <Button
          variant="text"
          class="mr-2"
          @click="$emit('cancel')"
        >
          Cancel
        </Button>
        
        <Button
          variant="primary"
          :disabled="!form.name.trim()"
          @click="submitForm"
        >
          {{ isEdit ? 'Update' : 'Add' }}
        </Button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import Button from '../common/Button.vue'

const props = defineProps({
  designation: {
    type: Object,
    default: () => ({})
  },
  isEdit: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'cancel', 'update:designation'])

const form = ref({
  name: props.designation?.name || ''
})

const errors = ref({
  name: ''
})

const nameInput = ref(null)

// Focus input field when mounted
nextTick(() => {
  if (nameInput.value) {
    nameInput.value.focus()
  }
})

// Watch for changes to the designation prop
watch(() => props.designation, (newVal) => {
  form.value.name = newVal?.name || ''
}, { deep: true })

// Watch for form changes to emit updates
watch(() => form.value, (newVal) => {
  emit('update:designation', { ...props.designation, ...newVal })
}, { deep: true })

// Submit form handler
const submitForm = () => {
  if (!validateForm()) return
  
  emit('submit', {
    ...props.designation,
    name: form.value.name
  })
}

// Form validation
const validateForm = () => {
  let isValid = true
  
  if (!form.value.name.trim()) {
    errors.value.name = 'Designation name is required'
    isValid = false
  }
  
  return isValid
}
</script>

<style lang="scss" scoped>
.designation-form {
  max-width: 600px;
  
  .form-group {
    margin-bottom: $spacing-4;
  }
  
  .form-label {
    display: block;
    font-weight: $font-weight-medium;
    margin-bottom: $spacing-2;
  }
  
  .form-control {
    width: 100%;
    padding: $spacing-2 $spacing-3;
    border: 1px solid $color-gray-300;
    border-radius: $border-radius;
    font-size: $font-size-md;
    transition: $transition-base;
    
    &:focus {
      border-color: $color-primary;
      outline: none;
      box-shadow: 0 0 0 2px rgba($color-primary, 0.25);
    }
    
    &.is-invalid {
      border-color: $color-error;
    }
  }
  
  .invalid-feedback {
    color: $color-error;
    font-size: $font-size-sm;
    margin-top: $spacing-1;
  }
  
  .form-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: $spacing-4;
  }
  
  .mr-2 {
    margin-right: $spacing-2;
  }
}
</style>
