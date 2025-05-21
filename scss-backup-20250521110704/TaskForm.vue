<template>
  <v-card>
    <v-card-title>{{ isEdit ? 'Edit Task' : 'Add Task' }}</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="save">
        <v-text-field 
          v-model="form.name" 
          label="Task Name" 
          required
          :error-messages="errors.name"
          @input="errors.name = ''"
        ></v-text-field>
        
        <v-textarea 
          v-model="form.description" 
          label="Description" 
          rows="3"
          :error-messages="errors.description"
          @input="errors.description = ''"
        ></v-textarea>
        
        <v-text-field 
          v-model="form.estimated_duration" 
          label="Estimated Duration (minutes)" 
          type="number"
          :error-messages="errors.estimated_duration"
          @input="errors.estimated_duration = ''"
        ></v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="grey-darken-1" variant="text" @click="cancel">Cancel</v-btn>
      <v-btn color="primary" variant="text" @click="save" :disabled="!form.name">Save</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'

const props = defineProps({
  task: {
    type: Object,
    default: () => ({ name: '', description: '', estimated_duration: null })
  },
  isEdit: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['save', 'cancel'])

const form = ref({
  id: props.task.id || null,
  name: props.task.name || '',
  description: props.task.description || '',
  estimated_duration: props.task.estimated_duration || null
})

const errors = ref({
  name: '',
  description: '',
  estimated_duration: ''
})

const validate = () => {
  let isValid = true
  
  // Reset errors
  errors.value.name = ''
  errors.value.description = ''
  errors.value.estimated_duration = ''
  
  // Validate name
  if (!form.value.name.trim()) {
    errors.value.name = 'Task name is required'
    isValid = false
  }
  
  // Validate estimated duration (if provided)
  if (form.value.estimated_duration !== null && form.value.estimated_duration !== '') {
    const duration = Number(form.value.estimated_duration)
    if (isNaN(duration) || duration <= 0) {
      errors.value.estimated_duration = 'Duration must be a positive number'
      isValid = false
    }
  }
  
  return isValid
}

const save = () => {
  if (validate()) {
    // Convert estimated_duration to number if it's not null
    const taskData = { ...form.value }
    if (taskData.estimated_duration) {
      taskData.estimated_duration = Number(taskData.estimated_duration)
    }
    
    emit('save', taskData)
  }
}

const cancel = () => {
  emit('cancel')
}
</script>
