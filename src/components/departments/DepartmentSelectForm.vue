<template>
  <div class="department-select-form">
    <form @submit.prevent="submitForm">
      <h3 class="form-title mb-4">Assign Porter to Department</h3>
      
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
      
      <!-- Designation Selection -->
      <div class="form-group mb-4">
        <label for="designation" class="form-label">Designation (Required)</label>
        <div class="select-wrapper">
          <select
            id="designation"
            v-model="form.designationId"
            class="form-control"
            :class="{ 'is-invalid': errors.designation }"
            :disabled="designations.length === 0 || isLoading"
            required
            @change="errors.designation = ''"
          >
            <option value="">Select Designation</option>
            <option 
              v-for="designation in designations" 
              :key="designation.id" 
              :value="designation.id"
            >
              {{ designation.name }}
            </option>
          </select>
          
          <div v-if="designations.length === 0" class="input-info-icon" title="No designations available. You can add them in Settings.">
            <span class="icon">ℹ️</span>
          </div>
        </div>
        
        <div v-if="errors.designation" class="invalid-feedback">
          {{ errors.designation }}
        </div>
      </div>
    </form>
    
    <!-- Action Buttons -->
    <div class="form-actions flex-end">
      <Button
        variant="text"
        class="mr-2"
        @click="$emit('cancel')"
      >
        Cancel
      </Button>
      
      <Button
        variant="primary"
        :disabled="!form.designationId || isLoading"
        @click="submitForm"
      >
        Assign
      </Button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import Button from '../common/Button.vue'

const route = useRoute()

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
  },
  shiftId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['submit', 'cancel'])

const form = ref({
  designationId: ''
})

const errors = ref({
  designation: ''
})

// Methods
const submitForm = () => {
  if (!validateForm()) return
  
  emit('submit', {
    porterId: props.porter.id,
    shiftId: props.shiftId,
    ...form.value
  })
}

const validateForm = () => {
  let isValid = true
  
  if (!form.value.designationId) {
    errors.value.designation = 'Designation is required'
    isValid = false
  }
  
  return isValid
}
</script>

<style lang="scss" scoped>
.department-select-form {
  padding: $spacing-4;
}

.form-title {
  font-size: $font-size-lg;
  font-weight: $font-weight-medium;
}

.border-bottom {
  border-bottom: 1px solid $color-gray-200;
}

.porter-info {
  display: flex;
  align-items: center;
}

.porter-avatar {
  width: 36px;
  height: 36px;
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
  font-size: $font-size-sm;
}

.porter-type {
  font-size: $font-size-xs;
}

.select-wrapper {
  position: relative;
  
  .input-info-icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 0.5rem;
    color: $color-info;
    font-size: $font-size-sm;
  }
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: $spacing-4;
}
</style>
