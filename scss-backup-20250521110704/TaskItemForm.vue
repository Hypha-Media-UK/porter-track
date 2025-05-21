<template>
  <v-card>
    <v-card-title>{{ isEdit ? 'Edit Task Item' : 'Add Task Item' }}</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="save">
        <v-text-field 
          v-model="form.name" 
          label="Task Item Name" 
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
  taskItem: {
    type: Object,
    default: () => ({ name: '', description: '', task_id: null, order_index: 0 })
  },
  taskId: {
    type: String,
    default: null
  },
  orderIndex: {
    type: Number,
    default: 0
  },
  isEdit: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['save', 'cancel'])

const form = ref({
  id: props.taskItem.id || null,
  name: props.taskItem.name || '',
  description: props.taskItem.description || '',
  task_id: props.taskItem.task_id || props.taskId,
  order_index: props.taskItem.order_index !== undefined ? props.taskItem.order_index : props.orderIndex
})

const errors = ref({
  name: '',
  description: ''
})

const validate = () => {
  let isValid = true
  
  // Reset errors
  errors.value.name = ''
  errors.value.description = ''
  
  // Validate name
  if (!form.value.name.trim()) {
    errors.value.name = 'Task item name is required'
    isValid = false
  }
  
  // Task ID is required but provided via props
  if (!form.value.task_id) {
    console.error('Task ID is required')
    isValid = false
  }
  
  return isValid
}

const save = () => {
  if (validate()) {
    emit('save', { ...form.value })
  }
}

const cancel = () => {
  emit('cancel')
}
</script>
