<template>
  <Card class="department-card">
    <template #header>
      <div class="flex-between">
        <div>
          <h3 class="card-title">{{ department.name }}</h3>
          <p v-if="department.building" class="card-subtitle text-gray-600">
            {{ department.building.name }}
          </p>
        </div>
        <Badge 
          v-if="assignedPorters.length > 0"
          variant="primary"
          size="sm"
          class="ml-2"
        >
          {{ assignedPorters.length }}
        </Badge>
      </div>
    </template>
    
    <div class="card-body">
      <!-- Empty State -->
      <div v-if="assignedPorters.length === 0" class="empty-state py-3">
        <span class="icon text-info fs-xl mb-1">🧑</span>
        <p class="text-gray-600 fs-sm">No porters assigned</p>
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
          <div class="flex-between">
            <div class="porter-info-container">
              <div class="porter-avatar">
                <span class="icon">👤</span>
              </div>
              <div class="porter-info">
                <div class="porter-name">{{ porter.name }}</div>
                <div v-if="getPorterDesignation(porter)" class="mt-1">
                  <StatusBadge 
                    :label="getPorterDesignation(porter).name" 
                    status="info"
                  />
                </div>
              </div>
            </div>
            
            <div class="porter-actions">
              <Button
                variant="text"
                size="sm"
                iconLeft="❌"
                @click.stop="$emit('unassign-porter', porter)"
                :disabled="!isShiftActive"
                title="Return to Porters Pool"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup>
import { computed } from 'vue'
import Card from '../common/Card.vue'
import StatusBadge from '../common/StatusBadge.vue'
import Badge from '../common/Badge.vue'
import Button from '../common/Button.vue'

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

<style lang="scss" scoped>
.department-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-title {
  font-size: $font-size-md;
  font-weight: $font-weight-medium;
  margin-bottom: 0.25rem;
}

.card-subtitle {
  font-size: $font-size-xs;
}

.assigned-porters-list {
  max-height: 200px;
  overflow-y: auto;
}

.porter-item {
  padding: $spacing-2 0;
  border-bottom: 1px solid $color-gray-200;
  
  &:last-child {
    border-bottom: none;
  }
}

.clickable {
  cursor: pointer;
  transition: background-color 0.2s;
  border-radius: $border-radius;
  padding: $spacing-2 $spacing-1;
  
  &:hover {
    background-color: $color-gray-100;
  }
}

.porter-info-container {
  display: flex;
  align-items: center;
  gap: $spacing-2;
}

.porter-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: $color-primary;
  color: $color-white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
}

.porter-info {
  flex: 1;
  min-width: 0;
}

.porter-name {
  font-weight: $font-weight-medium;
  font-size: $font-size-sm;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $spacing-3;
  text-align: center;
}
</style>
