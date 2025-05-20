<template>
  <div class="porters-list">
    <div v-if="isLoading" class="text-center py-4">
      <LoadingIndicator />
    </div>
    
    <div v-else-if="!porters.length" class="text-center py-4">
      <EmptyState
        icon="mdi-account-group"
        title="No Porters on Shift"
        message="Add porters to this shift to begin tracking assignments"
      >
        <IOSButton
          color="primary"
          prependIcon="mdi-account-plus"
          @click="$emit('add-porter')"
        >
          Add Porter
        </IOSButton>
      </EmptyState>
    </div>
    
    <div v-else>
      <div class="d-flex justify-end mb-4">
        <IOSButton
          color="primary"
          prependIcon="mdi-account-plus"
          @click="$emit('add-porter')"
        >
          Add Porter
        </IOSButton>
      </div>
      
      <v-expansion-panels>
        <v-expansion-panel
          v-for="porter in porters"
          :key="porter.id"
          :value="porter.id"
          :title="porter.name"
        >
          <template #title>
            <div class="d-flex align-center porter-header">
              <v-avatar size="36" color="primary" class="mr-3">
                <v-icon icon="mdi-account" color="white"></v-icon>
              </v-avatar>
              <div>
                <div class="text-subtitle-1 font-weight-medium">{{ porter.name }}</div>
                <div class="text-caption porter-status">
                  <template v-if="hasActiveAssignment(porter)">
                    <v-icon icon="mdi-office-building-marker" size="small" class="mr-1"></v-icon>
                    {{ getActiveAssignment(porter).department.name }}
                    <StatusBadge 
                      v-if="getActiveAssignment(porter).designation" 
                      :label="getActiveAssignment(porter).designation.name"
                      status="info"
                      class="ml-2"
                    />
                  </template>
                  <template v-else>
                    <v-icon icon="mdi-account-hard-hat" size="small" class="mr-1"></v-icon>
                    Runner
                  </template>
                </div>
              </div>
            </div>
          </template>
          
          <v-expansion-panel-text>
            <div class="porter-details">
              <!-- Assignment Details (if assigned) -->
              <div v-if="hasActiveAssignment(porter)" class="mb-4 pb-2 border-bottom">
                <div class="d-flex justify-space-between align-center">
                  <div>
                    <p class="text-subtitle-2 font-weight-medium mb-1">Current Assignment</p>
                    <p class="text-body-2">
                      {{ getActiveAssignment(porter).department.name }}
                      <span v-if="getActiveAssignment(porter).designation" class="ml-1">
                        ({{ getActiveAssignment(porter).designation.name }})
                      </span>
                    </p>
                    <p class="text-caption text-medium-emphasis">
                      Start: {{ formatDateTime(getActiveAssignment(porter).start_time) }}
                    </p>
                  </div>
                  
                  <div>
                    <IOSButton
                      color="warning"
                      variant="text"
                      @click="$emit('remove-assignment', porter)"
                    >
                      End Assignment
                    </IOSButton>
                  </div>
                </div>
              </div>
              
              <!-- Assignment History -->
              <div v-if="getInactiveAssignments(porter).length > 0" class="mb-4">
                <p class="text-subtitle-2 font-weight-medium mb-1">Previous Assignments</p>
                <v-list density="compact" class="assignment-history">
                  <v-list-item
                    v-for="assignment in getInactiveAssignments(porter)"
                    :key="assignment.id"
                    :title="assignment.department.name"
                    :subtitle="`${formatDateTime(assignment.start_time)} - ${formatDateTime(assignment.end_time)}`"
                  >
                    <template #prepend>
                      <v-icon icon="mdi-office-building" size="small"></v-icon>
                    </template>
                    
                    <template #append>
                      <StatusBadge 
                        v-if="assignment.designation" 
                        :label="assignment.designation.name"
                        status="info"
                        icon="false"
                        class="ml-2"
                      />
                    </template>
                  </v-list-item>
                </v-list>
              </div>
              
              <!-- Actions -->
              <div class="d-flex justify-space-between">
                <IOSButton
                  color="error"
                  variant="text"
                  prependIcon="mdi-account-remove"
                  @click="$emit('remove-porter', porter)"
                >
                  Remove from Shift
                </IOSButton>
                
                <IOSButton
                  color="primary"
                  :disabled="!isShiftActive"
                  @click="$emit('assign-porter', porter)"
                >
                  {{ hasActiveAssignment(porter) ? 'Reassign' : 'Assign to Department' }}
                </IOSButton>
              </div>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import IOSButton from '../common/IOSButton.vue'
import LoadingIndicator from '../common/LoadingIndicator.vue'
import EmptyState from '../common/EmptyState.vue'
import StatusBadge from '../common/StatusBadge.vue'

const props = defineProps({
  porters: {
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

const emit = defineEmits(['add-porter', 'remove-porter', 'assign-porter', 'remove-assignment'])

// Check if porter has an active assignment
const hasActiveAssignment = (porter) => {
  return porter.departmentAssignments && 
    porter.departmentAssignments.some(assignment => assignment.is_active)
}

// Get porter's active assignment
const getActiveAssignment = (porter) => {
  if (!porter.departmentAssignments) return null
  return porter.departmentAssignments.find(assignment => assignment.is_active)
}

// Get all inactive assignments for a porter
const getInactiveAssignments = (porter) => {
  if (!porter.departmentAssignments) return []
  return porter.departmentAssignments
    .filter(assignment => !assignment.is_active)
    .sort((a, b) => new Date(b.start_time) - new Date(a.start_time))
}

// Format date and time
const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A'
  
  const date = new Date(dateString)
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.porter-header {
  min-height: 48px;
}

.porter-status {
  display: flex;
  align-items: center;
}

.porter-details {
  padding: 8px 0;
}

.border-bottom {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.assignment-history {
  background-color: transparent;
  padding: 0;
}

@media (prefers-color-scheme: dark) {
  .border-bottom {
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  }
}
</style>
