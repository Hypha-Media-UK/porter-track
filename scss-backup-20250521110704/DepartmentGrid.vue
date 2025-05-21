<template>
  <div class="department-grid">
    <h3 class="section-title mb-4">Department Assignments</h3>
    
    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-4">
      <LoadingIndicator label="Loading departments..." />
    </div>
    
    <!-- Empty State -->
    <div v-else-if="designationDepartments.length === 0" class="empty-state py-6">
      <span class="icon empty-state-icon">🏢</span>
      <h3 class="empty-state-title mb-1">No Department Designations</h3>
      <p class="empty-state-message mb-4">
        Please add department designations in the app settings.
      </p>
    </div>
    
    <!-- Department Grid -->
    <div v-else class="departments-grid">
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
        
        // Check for assignments where the designation_id matches
        // and is_active is true (regardless of department_id)
        return porter.departmentAssignments.some(assignment => 
          assignment.is_active && 
          assignment.designation_id === designation.id
        )
      })
    }
  })
})
</script>

<style lang="scss" scoped>
.department-grid {
  margin-top: $spacing-6;
}

.section-title {
  font-size: $font-size-lg;
  font-weight: $font-weight-medium;
}

.departments-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: $spacing-4;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: $spacing-6;
  
  .empty-state-icon {
    font-size: 2.5rem;
    margin-bottom: $spacing-3;
    color: $color-info;
  }
  
  .empty-state-title {
    font-size: $font-size-lg;
    font-weight: $font-weight-medium;
  }
  
  .empty-state-message {
    font-size: $font-size-sm;
    color: $color-gray-600;
  }
}

@include responsive(sm) {
  .departments-grid {
    grid-template-columns: 1fr;
  }
}
</style>
