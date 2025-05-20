<template>
  <div class="department-select-form">
    <v-form @submit.prevent="submitForm">
      <h3 class="text-h6 mb-3">Assign Porter to Department</h3>
      
      <!-- Porter Info -->
      <div class="porter-info mb-4 pb-3 border-bottom">
        <div class="d-flex align-center">
          <v-avatar size="36" color="primary" class="mr-3">
            <v-icon icon="mdi-account" color="white"></v-icon>
          </v-avatar>
          <div>
            <div class="text-subtitle-1 font-weight-medium">{{ porter?.name }}</div>
            <div class="text-caption text-medium-emphasis">{{ porter?.type }}</div>
          </div>
        </div>
      </div>
      
      <!-- Department Selection -->
      <v-autocomplete
        v-model="form.departmentId"
        :items="departments"
        item-title="name"
        item-value="id"
        label="Department"
        variant="outlined"
        density="comfortable"
        :error-messages="errors.department"
        :loading="isLoading"
        required
        class="mb-4"
        @update:model-value="errors.department = ''"
      >
        <template #item="{ item, props }">
          <v-list-item v-bind="props" :title="item.name">
            <template #prepend>
              <v-icon icon="mdi-office-building"></v-icon>
            </template>
            <template #subtitle>
              <span v-if="item.building?.name">{{ item.building.name }}</span>
            </template>
          </v-list-item>
        </template>
      </v-autocomplete>
      
  <!-- Designation Selection -->
  <v-autocomplete
    v-model="form.designationId"
    :items="designations"
    item-title="name"
    item-value="id"
    label="Designation (Required)"
    variant="outlined"
    density="comfortable"
    :loading="isLoading"
    :disabled="designations.length === 0"
    :error-messages="errors.designation"
    required
    class="mb-4"
    @update:model-value="errors.designation = ''"
  >
        <template #prepend>
          <v-tooltip location="bottom" v-if="designations.length === 0">
            <template #activator="{ props }">
              <v-icon
                icon="mdi-information-outline"
                color="info"
                size="small"
                v-bind="props"
              ></v-icon>
            </template>
            <span>No designations available. You can add them in Settings.</span>
          </v-tooltip>
        </template>
      </v-autocomplete>
    </v-form>
    
    <!-- Action Buttons -->
    <div class="d-flex justify-end">
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
      :disabled="!form.departmentId || !form.designationId || isLoading"
      @click="submitForm"
    >
      Assign
    </IOSButton>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import IOSButton from '../common/IOSButton.vue'

const props = defineProps({
  porter: {
    type: Object,
    required: true
  },
  departments: {
    type: Array,
    default: () => []
  },
  designations: {
    type: Array,
    default: () => []
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'cancel'])

const form = ref({
  departmentId: '',
  designationId: ''
})

const errors = ref({
  department: '',
  designation: ''
})

// Methods
const submitForm = () => {
  if (!validateForm()) return
  
  emit('submit', {
    porterId: props.porter.id,
    ...form.value
  })
}

const validateForm = () => {
  let isValid = true
  
  if (!form.value.departmentId) {
    errors.value.department = 'Department is required'
    isValid = false
  }
  
  if (!form.value.designationId) {
    errors.value.designation = 'Designation is required'
    isValid = false
  }
  
  return isValid
}
</script>

<style scoped>
.department-select-form {
  padding: 16px;
}

.border-bottom {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

@media (prefers-color-scheme: dark) {
  .border-bottom {
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  }
}
</style>
