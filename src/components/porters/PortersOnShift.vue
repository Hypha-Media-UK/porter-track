<template>
  <IOSCard class="porters-on-shift">
    <div class="ios-card-header d-flex justify-space-between align-center">
      <h2 class="text-h6 font-weight-medium">Porters on Shift</h2>
      <div class="d-flex align-center">
        <v-select
          v-if="isShiftActive"
          v-model="selectedPorterId"
          :items="availablePorters"
          item-title="name"
          item-value="id"
          label="Select Porter"
          variant="outlined"
          density="compact"
          hide-details
          class="porter-select mr-2"
          :disabled="isLoading || availablePorters.length === 0"
        ></v-select>
        <IOSButton
          v-if="isShiftActive"
          color="primary"
          size="small"
          :disabled="!selectedPorterId || isLoading"
          @click="addPorter"
          :loading="isLoading"
        >
          Add Porter
        </IOSButton>
      </div>
    </div>
    
    <div class="ios-card-content">
      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-4">
        <LoadingIndicator />
        <p class="mt-2 text-medium-emphasis">Loading porters...</p>
      </div>
      
      <!-- Empty State -->
      <div v-else-if="unassignedPorters.length === 0" class="text-center py-4">
        <v-icon icon="mdi-account-question" size="large" color="info" class="mb-3"></v-icon>
        <h3 class="text-h6 mb-1">No Unassigned Porters</h3>
        <p class="text-body-2">
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
          <div class="d-flex align-center justify-space-between">
            <div class="d-flex align-center">
              <v-avatar size="32" color="primary" class="mr-2">
                <v-icon icon="mdi-account" color="white"></v-icon>
              </v-avatar>
              <div class="porter-info">
                <div class="text-subtitle-1">{{ porter.name }}</div>
                <div class="text-caption text-medium-emphasis">{{ porter.type }}</div>
              </div>
            </div>
            
            <div class="porter-actions">
              <v-btn
                v-if="isShiftActive"
                variant="text"
                color="primary"
                size="small"
                icon="mdi-office-building-marker"
                @click="$emit('assign-porter', porter)"
                :disabled="isLoading"
              >
                <v-tooltip activator="parent" location="top">
                  Assign to Department
                </v-tooltip>
              </v-btn>
              
              <v-btn
                v-if="isShiftActive"
                variant="text"
                color="error"
                size="small"
                icon="mdi-account-remove"
                @click="$emit('remove-porter', porter)"
                :disabled="isLoading"
              >
                <v-tooltip activator="parent" location="top">
                  Remove from Shift
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
import { ref, computed, watch } from 'vue'
import IOSCard from '../common/IOSCard.vue'
import IOSButton from '../common/IOSButton.vue'
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

<style scoped>
.porters-on-shift {
  margin-bottom: 20px;
}

.porter-select {
  width: 200px;
  max-width: 200px;
}

.porters-list {
  max-height: 250px;
  overflow-y: auto;
}

.porter-item {
  padding: 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  transition: background-color 0.2s ease;
}

.porter-item:last-child {
  border-bottom: none;
}

.porter-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.porter-info {
  flex: 1;
}

@media (prefers-color-scheme: dark) {
  .porter-item {
    border-bottom-color: rgba(255, 255, 255, 0.12);
  }
  
  .porter-item:hover {
    background-color: rgba(255, 255, 255, 0.04);
  }
}

@media (max-width: 600px) {
  .ios-card-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .porter-select {
    width: 100%;
    max-width: 100%;
    margin-bottom: 12px;
    margin-right: 0;
  }
}
</style>
