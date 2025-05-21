<template>
  <v-card>
    <v-card-title>{{ isEdit ? 'Edit Building' : 'Add Building' }}</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="save">
        <v-text-field 
          v-model="form.name" 
          label="Building Name" 
          required
          :error-messages="errors.name"
          @input="errors.name = ''"
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
import { ref, computed, defineProps, defineEmits } from 'vue'

const props = defineProps({
  building: {
    type: Object,
    default: () => ({ name: '' })
  },
  isEdit: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['save', 'cancel'])

const form = ref({
  id: props.building.id || null,
  name: props.building.name || ''
})

const errors = ref({
  name: ''
})

const validate = () => {
  let isValid = true
  
  // Reset errors
  errors.value.name = ''
  
  // Validate name
  if (!form.value.name.trim()) {
    errors.value.name = 'Building name is required'
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
