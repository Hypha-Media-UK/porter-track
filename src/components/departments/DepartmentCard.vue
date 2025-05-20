<template>
  <IOSCard class="department-card">
    <div class="ios-card-header">
      <div class="d-flex justify-space-between align-center">
        <div>
          <h3 class="text-subtitle-1 font-weight-medium">{{ department.name }}</h3>
          <p v-if="department.building" class="text-caption text-medium-emphasis">
            {{ department.building.name }}
          </p>
        </div>
        <v-chip
          v-if="assignedPorters.length > 0"
          size="small"
          color="primary"
          class="ml-2"
        >
          {{ assignedPorters.length }}
        </v-chip>
      </div>
    </div>
    
    <div class="ios-card-content">
      <!-- Empty State -->
      <div v-if="assignedPorters.length === 0" class="text-center py-3">
        <v-icon icon="mdi-account-off" color="info" size="small" class="mb-1"></v-icon>
        <p class="text-caption text-medium-emphasis">No porters assigned</p>
      </div>
      
      <!-- Assigned Porters List -->
      <div v-else class="assigned-porters-list">
        <div 
          v-for="porter in assignedPorters" 
          :key="porter.id"
          class="porter-item"
          @click="$emit('edit-porter-times', porter)"
          :class="{'clickable': isShiftActive}"
        >
          <div class="d-flex align-center justify-space-between">
            <div class="d-flex align-center">
              <v-avatar size="28" color="primary" class="mr-2">
                <v-icon icon="mdi-account" color="white" size="small"></v-icon>
              </v-avatar>
              <div class="porter-info">
                <div class="text-body-1">{{ porter.name }}</div>
                <div class="designation-badge" v-if="getPorterDesignation(porter)">
                  <StatusBadge 
                    :label="getPorterDesignation(porter).name" 
                    status="info"
                    :icon="false"
                    class="mt-1"
                  />
                </div>
              </div>
            </div>
            
            <div class="porter-actions" v-if="isShiftActive">
              <v-btn
                variant="text"
                color="warning"
                size="x-small"
                icon="mdi-account-convert"
                @click="$emit('unassign-porter', porter)"
              >
                <v-tooltip activator="parent" location="top">
                  Return to Porters Pool
                </v-tooltip>
              </v-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  </IOSCard>
</template>

<script setup>
import { computed } from 'vue'
import IOSCard from '../common/IOSCard.vue'
import StatusBadge from '../common/StatusBadge.vue'

const props = defineProps({
  department: {
    type: Object,
    required: true
  },
  porters: {
    type: Array,
    default: () => []
  },
  isShiftActive: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['unassign-porter', 'edit-porter-times'])

// Computed properties
const assignedPorters = computed(() => {
  // If department has pre-computed assigned porters (for designation-based departments)
  if (props.department.assignedPorters) {
    return props.department.assignedPorters;
  }
  
  // Otherwise filter porters by department assignment (for regular departments)
  return props.porters.filter(porter => {
    if (!porter.departmentAssignments) return false
    
    if (props.department.isDesignation) {
      // For designation-based departments, filter by designation_id
      return porter.departmentAssignments.some(assignment => 
        assignment.is_active && assignment.designation_id === props.department.id
      )
    } else {
      // For regular departments, filter by department_id
      return porter.departmentAssignments.some(assignment => 
        assignment.is_active && assignment.department_id === props.department.id
      )
    }
  })
})

// Methods
const getPorterDesignation = (porter) => {
  if (!porter.departmentAssignments) return null
  
  let activeAssignment;
  
  if (props.department.isDesignation) {
    // For designation-based departments (Department Cover), find by designation_id
    activeAssignment = porter.departmentAssignments.find(assignment => 
      assignment.is_active && assignment.designation_id === props.department.id
    )
  } else {
    // For regular departments, find by department_id
    activeAssignment = porter.departmentAssignments.find(assignment => 
      assignment.is_active && assignment.department_id === props.department.id
    )
  }
  
  return activeAssignment?.designation || null
}
</script>

<style scoped>
.department-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.ios-card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.assigned-porters-list {
  max-height: 200px;
  overflow-y: auto;
}

.porter-item {
  padding: 8px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.porter-item:last-child {
  border-bottom: none;
}

.clickable {
  cursor: pointer;
  transition: background-color 0.2s;
  border-radius: 4px;
  padding: 8px 4px;
}

.clickable:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.porter-info {
  flex: 1;
  min-width: 0;
}

.designation-badge {
  margin-top: -4px;
}

@media (prefers-color-scheme: dark) {
  .porter-item {
    border-bottom-color: rgba(255, 255, 255, 0.08);
  }
}
</style>
