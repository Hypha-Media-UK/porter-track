<template>
  <v-card>
    <v-card-title>{{ isEdit ? 'Edit Department' : 'Add Department' }}</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="save">
        <v-text-field 
          v-model="form.name" 
          label="Department Name" 
          required
          :error-messages="errors.name"
          @input="errors.name = ''"
        ></v-text-field>
        
        <v-text-field 
          v-model="form.floor" 
          label="Floor"
          :error-messages="errors.floor"
          @input="errors.floor = ''"
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
  department: {
    type: Object,
    default: () => ({ name: '', floor: '', building_id: null })
  },
  buildingId: {
    type: String,
    default: null
  },
  isEdit: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['save', 'cancel'])

const form = ref({
  id: props.department.id || null,
  name: props.department.name || '',
  floor: props.department.floor || '',
  building_id: props.department.building_id || props.buildingId
})

const errors = ref({
  name: '',
  floor: ''
})

const validate = () => {
  let isValid = true
  
  // Reset errors
  errors.value.name = ''
  errors.value.floor = ''
  
  // Validate name
  if (!form.value.name.trim()) {
    errors.value.name = 'Department name is required'
    isValid = false
  }
  
  // Building ID is required but provided via props
  if (!form.value.building_id) {
    console.error('Building ID is required')
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
