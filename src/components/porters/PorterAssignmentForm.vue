<template>
  <DialogConfirm
    v-model="isVisible"
    :title="isEdit ? 'Update Porter Assignment Times' : 'Add Porter to Department'"
    :showCancelButton="true"
    :showConfirmButton="!isLoading"
    confirmText="Save"
    @update:modelValue="updateVisibility"
    @confirm="submitForm"
    @cancel="cancel"
  >
    <div v-if="isLoading" class="text-center py-4">
      <LoadingIndicator label="Loading data..." />
    </div>
    
    <div v-else>
      <!-- Porter Info -->
      <div class="porter-info mb-4 border-bottom pb-3">
        <div class="flex-start">
          <div class="porter-avatar">
            <span class="icon">👤</span>
          </div>
          <div>
            <div class="porter-name">{{ porter?.name }}</div>
            <div class="porter-type text-gray-600">{{ porter?.type }}</div>
          </div>
        </div>
      </div>
      
      <!-- Time Fields -->
      <div class="time-fields">
        <TimeInput
          v-model="form.startTime"
          label="Start Time (Optional)"
          :error="errors.startTime"
          class="mb-3"
        />
        
        <TimeInput
          v-model="form.endTime"
          label="End Time (Optional)"
          :show-now-button="false"
        />
      </div>
    </div>
  </DialogConfirm>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useBuildingsStore } from '../../stores/buildings'
import Button from '../common/Button.vue'
import TimeInput from '../common/TimeInput.vue'
import LoadingIndicator from '../common/LoadingIndicator.vue'
import DialogConfirm from '../common/DialogConfirm.vue'

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

// Local state
const isVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const form = ref({
  shiftId: props.shiftId,
  porterId: props.porter?.id || '',
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

// Load data
onMounted(async () => {
  // Check if buildings array exists and if not, fetch it
  if (!buildingsStore.buildings || !buildingsStore.buildings.length) {
    await buildingsStore.fetchBuildings()
  }
  
  // If editing, pre-fill form with current assignment data
  if (props.isEdit && props.porter) {
    const activeAssignment = props.porter.departmentAssignments?.find(a => a.is_active)
    if (activeAssignment) {
      form.value = {
        shiftId: props.shiftId,
        porterId: props.porter.id,
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
    startTime: new Date(),
    endTime: null
  }
  
  errors.value = {
    startTime: ''
  }
}

const validateForm = () => {
  let isValid = true
  
  // Time validation could be added here if needed in the future
  
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

<style lang="scss" scoped>
.porter-info {
  display: flex;
  align-items: center;
}

.border-bottom {
  border-bottom: 1px solid $color-gray-200;
}

.porter-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: $color-primary;
  color: $color-white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: $spacing-3;
}

.porter-name {
  font-weight: $font-weight-medium;
  font-size: $font-size-md;
}

.porter-type {
  font-size: $font-size-xs;
}

.time-fields {
  margin-bottom: $spacing-4;
}
</style>
