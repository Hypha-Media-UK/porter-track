<template>
  <v-dialog
    v-model="isVisible"
    max-width="500"
    persistent
    @update:model-value="updateVisibility"
  >
    <v-card class="ios-dialog">
      <v-card-title class="text-h5">
        {{ isEdit ? 'Update Porter Assignment' : 'Assign Porter Designation' }}
      </v-card-title>
      
      <v-card-text>
        <div v-if="isLoading" class="text-center py-4">
          <LoadingIndicator />
          <p class="mt-2 text-medium-emphasis">Loading data...</p>
        </div>
        
        <v-form v-else @submit.prevent="submitForm">
          <!-- Porter Info -->
          <div class="porter-info mb-4 pb-2 border-bottom">
            <div class="d-flex align-center">
              <v-avatar size="32" color="primary" class="mr-2">
                <v-icon icon="mdi-account" color="white"></v-icon>
              </v-avatar>
              <div class="text-h6">{{ porter?.name }}</div>
            </div>
          </div>
          
          <!-- Department field removed as requested -->
          
          <!-- Designation Selection -->
          <v-autocomplete
            v-model="form.designationId"
            :items="designations"
            item-title="name"
            item-value="id"
            label="Designation (Optional)"
            variant="outlined"
            density="comfortable"
            clearable
            class="mb-4"
            :disabled="!designations.length"
          >
            <template #prepend>
              <v-tooltip location="bottom" v-if="!designations.length">
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
          
          <!-- Time Fields -->
          <div class="time-fields">
            <TimeInput
              v-model="form.startTime"
              label="Start Time (Optional)"
              :error="errors.startTime"
              class="mb-2"
            />
            
            <TimeInput
              v-model="form.endTime"
              label="End Time (Optional)"
              :show-now-button="false"
            />
          </div>
        </v-form>
      </v-card-text>
      
      <v-card-actions>
        <v-spacer></v-spacer>
        <IOSButton
          variant="text"
          color="secondary"
          @click="cancel"
        >
          Cancel
        </IOSButton>
        <IOSButton
          color="primary"
          :disabled="isLoading"
          @click="submitForm"
        >
          Assign
        </IOSButton>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useBuildingsStore } from '../../stores/buildings'
import { useDepartmentDesignationsStore } from '../../stores/departmentDesignations'
import IOSButton from '../common/IOSButton.vue'
import TimeInput from '../common/TimeInput.vue'
import LoadingIndicator from '../common/LoadingIndicator.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  shiftId: {
    type: String,
    default: ''
  },
  porter: {
    type: Object,
    default: null
  },
  isEdit: {
    type: Boolean,
    default: false
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'submit', 'cancel'])

// Stores
const buildingsStore = useBuildingsStore()
const designationsStore = useDepartmentDesignationsStore()

// Local state
const isVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const form = ref({
  shiftId: props.shiftId,
  porterId: props.porter?.id || '',
  designationId: '',
  startTime: new Date(),
  endTime: null
})

const errors = ref({
  startTime: ''
})

// Computed properties
const departments = computed(() => {
  return buildingsStore.departments.map(dept => ({
    ...dept,
    building: buildingsStore.buildings.find(b => b.id === dept.building_id)
  }))
})

const designations = computed(() => {
  return designationsStore.designations
})

// Load data
onMounted(async () => {
  // Check if buildings array exists and if not, fetch it
  if (!buildingsStore.buildings || !buildingsStore.buildings.length) {
    await buildingsStore.fetchBuildings()
  }
  
  // The buildings store doesn't have a fetchDepartments method
  // Departments are loaded as part of fetchBuildings
  
  // Check if designations array exists and if not, fetch it
  if (!designationsStore.designations || !designationsStore.designations.length) {
    await designationsStore.fetchDesignations()
  }
  
  // If editing, pre-fill form with current assignment data
  if (props.isEdit && props.porter) {
    const activeAssignment = props.porter.departmentAssignments?.find(a => a.is_active)
    if (activeAssignment) {
      form.value = {
        shiftId: props.shiftId,
        porterId: props.porter.id,
        departmentId: activeAssignment.department_id,
        designationId: activeAssignment.designation_id || '',
        startTime: new Date(activeAssignment.start_time),
        endTime: activeAssignment.end_time ? new Date(activeAssignment.end_time) : null
      }
    }
  }
})

// Watch for props changes
watch(() => props.porter, (newPorter) => {
  if (newPorter) {
    form.value.porterId = newPorter.id
  }
})

watch(() => props.shiftId, (newShiftId) => {
  form.value.shiftId = newShiftId
})

// Methods
const updateVisibility = (value) => {
  if (!value) {
    // Reset state when dialog closes
    resetForm()
  }
}

const resetForm = () => {
  form.value = {
    shiftId: props.shiftId,
    porterId: props.porter?.id || '',
    designationId: '',
    startTime: new Date(),
    endTime: null
  }
  
  errors.value = {
    startTime: ''
  }
}

const validateForm = () => {
  let isValid = true
  
  // Department validation removed as the field is no longer present
  
  // Start time is now optional, so no validation needed
  
  return isValid
}

const submitForm = () => {
  if (!validateForm()) return
  
  emit('submit', { ...form.value })
  isVisible.value = false
}

const cancel = () => {
  emit('cancel')
  isVisible.value = false
}
</script>

<style scoped>
.border-bottom {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

@media (prefers-color-scheme: dark) {
  .border-bottom {
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  }
}
</style>
