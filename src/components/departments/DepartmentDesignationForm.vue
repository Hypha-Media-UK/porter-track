<template>
  <div class="designation-form">
    <v-form @submit.prevent="submitForm">
      <v-text-field
        v-model="form.name"
        label="Designation Name"
        variant="outlined"
        density="comfortable"
        :error-messages="errors.name"
        required
        @update:model-value="errors.name = ''"
        autofocus
      ></v-text-field>
      
      <div class="designation-form__actions">
        <v-spacer></v-spacer>
        <IOSButton
          variant="text"
          color="secondary"
          class="mr-2"
          @click="$emit('cancel')"
        >
          Cancel
        </IOSButton>
        <IOSButton
          color="primary"
          :disabled="!form.name"
          @click="submitForm"
        >
          {{ isEdit ? 'Update' : 'Add' }}
        </IOSButton>
      </div>
    </v-form>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import IOSButton from '../common/IOSButton.vue'

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

const emit = defineEmits(['submit', 'cancel'])

const form = ref({
  name: props.designation?.name || ''
})

const errors = ref({
  name: ''
})

// Watch for changes to the designation prop
watch(() => props.designation, (newVal) => {
  form.value.name = newVal?.name || ''
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

<style scoped>
.designation-form {
  max-width: 600px;
}

.designation-form__actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
