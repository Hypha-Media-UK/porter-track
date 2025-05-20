<template>
  <Card class="porters-on-shift">
    <template #header>
      <div class="flex-between">
        <h2 class="card-title">Porters on Shift</h2>
        <div class="porter-controls">
          <div class="form-group mb-0 mr-2">
            <select
              v-model="selectedPorterId"
              class="form-control form-control-sm"
              :disabled="!isShiftActive || isLoading || availablePorters.length === 0"
            >
              <option value="">Select Porter</option>
              <option 
                v-for="porter in availablePorters" 
                :key="porter.id" 
                :value="porter.id"
              >
                {{ porter.name }}
              </option>
            </select>
          </div>
          <Button
            variant="primary"
            size="sm"
            :disabled="!isShiftActive || !selectedPorterId || isLoading"
            @click="addPorter"
          >
            Add Porter
          </Button>
        </div>
      </div>
    </template>
    
    <div class="card-body">
      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-4">
        <LoadingIndicator label="Loading porters..." />
      </div>
      
      <!-- Empty State -->
      <div v-else-if="unassignedPorters.length === 0" class="empty-state">
        <span class="empty-state-icon">👤</span>
        <h3 class="empty-state-title">No Unassigned Porters</h3>
        <p class="empty-state-message">
          {{ availablePorters.length === 0 ? 
            'Use the dropdown above to add porters to this shift.' : 
            'All porters are currently assigned to departments.' }}
        </p>
      </div>
      
      <!-- Porters List -->
      <div v-else class="porters-list">
        <div 
          v-for="porter in unassignedPorters" 
          :key="porter.id"
          class="porter-item"
        >
          <div class="flex-between">
            <div class="porter-info">
              <div class="porter-avatar">
                <span class="icon">👤</span>
              </div>
              <div>
                <div class="porter-name">{{ porter.name }}</div>
                <div class="porter-type">{{ porter.type }}</div>
              </div>
            </div>
            
            <div class="porter-actions">
              <Button
                v-if="isShiftActive"
                variant="text"
                size="sm"
                iconLeft="📍"
                @click="$emit('assign-porter', porter)"
                :disabled="isLoading"
                title="Assign to Department"
              />
              
              <Button
                v-if="isShiftActive"
                variant="text"
                size="sm"
                iconLeft="❌"
                @click="$emit('remove-porter', porter)"
                :disabled="isLoading"
                title="Remove from Shift"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import Card from '../common/Card.vue'
import Button from '../common/Button.vue'
import LoadingIndicator from '../common/LoadingIndicator.vue'

const props = defineProps({
  porters: {
    type: Array,
    default: () => []
  },
  allStaff: {
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

const emit = defineEmits(['add-porter', 'assign-porter', 'remove-porter'])

// State
const selectedPorterId = ref('')

// Computed properties
const unassignedPorters = computed(() => {
  return props.porters.filter(porter => {
    return !porter.departmentAssignments || 
      !porter.departmentAssignments.some(assignment => assignment.is_active)
  })
})

const availablePorters = computed(() => {
  const currentPorterIds = props.porters.map(p => p.id)
  return props.allStaff
    .filter(staff => staff.type === 'porter' && !currentPorterIds.includes(staff.id))
    .map(porter => ({
      id: porter.id,
      name: porter.name,
      type: porter.type
    }))
})

// Reset selected porter when available porters change
watch(availablePorters, (newValue) => {
  if (newValue.length === 0 || !newValue.some(p => p.id === selectedPorterId.value)) {
    selectedPorterId.value = ''
  }
})

// Methods
const addPorter = () => {
  if (!selectedPorterId.value) return
  
  const porter = props.allStaff.find(p => p.id === selectedPorterId.value)
  if (porter) {
    emit('add-porter', porter)
    selectedPorterId.value = ''
  }
}
</script>

<style lang="scss" scoped>
.porters-on-shift {
  margin-bottom: $spacing-5;
}

.porter-controls {
  display: flex;
  align-items: center;
}

.porters-list {
  max-height: 250px;
  overflow-y: auto;
}

.porter-item {
  padding: $spacing-3;
  border-bottom: 1px solid $color-gray-200;
  transition: $transition-base;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: $color-gray-100;
  }
}

.porter-info {
  display: flex;
  align-items: center;
  gap: $spacing-3;
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
}

.porter-name {
  font-weight: $font-weight-medium;
  font-size: $font-size-sm;
}

.porter-type {
  font-size: $font-size-xs;
  color: $color-gray-600;
}

.porter-actions {
  display: flex;
  gap: $spacing-1;
}

@include responsive(sm) {
  .flex-between {
    flex-direction: column;
    align-items: flex-start;
    gap: $spacing-3;
  }
  
  .porter-controls {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
    gap: $spacing-2;
    
    .form-group {
      width: 100%;
      margin-right: 0;
    }
  }
}
</style>
