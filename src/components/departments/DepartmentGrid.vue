<template>
  <div class="department-grid">
    <h3 class="text-h6 font-weight-medium mb-3">Department Assignments</h3>
    
    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-4">
      <LoadingIndicator />
      <p class="mt-2 text-medium-emphasis">Loading departments...</p>
    </div>
    
    <!-- Empty State -->
    <div v-else-if="designationDepartments.length === 0" class="text-center py-6">
      <v-icon icon="mdi-office-building" size="large" color="info" class="mb-3"></v-icon>
      <h3 class="text-h6 mb-1">No Department Designations</h3>
      <p class="text-body-2 mb-4">
        Please add department designations in the app settings.
      </p>
    </div>
    
    <!-- Department Grid -->
    <div v-else class="grid">
      <DepartmentCard
        v-for="department in designationDepartments"
        :key="department.id"
        :department="department"
        :porters="porters"
        :is-shift-active="isShiftActive"
        @unassign-porter="(porter) => $emit('unassign-porter', porter)"
        @edit-porter-times="(porter) => $emit('edit-porter-times', porter)"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import DepartmentCard from './DepartmentCard.vue'
import LoadingIndicator from '../common/LoadingIndicator.vue'

const props = defineProps({
  departments: {
    type: Array,
    default: () => []
  },
  porters: {
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
  isShiftActive: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['unassign-porter', 'edit-porter-times'])

// Computed properties
const designationDepartments = computed(() => {
  // Create a department card for each designation
  return props.designations.map(designation => {
    // Create a virtual department object for each designation
    return {
      id: designation.id,
      name: designation.name,
      isDesignation: true, // Flag to indicate this is a designation-based department
      // Include porter assignments for this designation
      assignedPorters: props.porters.filter(porter => {
        if (!porter.departmentAssignments) return false
        
        return porter.departmentAssignments.some(assignment => 
          assignment.is_active && assignment.designation_id === designation.id
        )
      })
    }
  })
})
</script>

<style scoped>
.department-grid {
  margin-top: 24px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

@media (max-width: 600px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
