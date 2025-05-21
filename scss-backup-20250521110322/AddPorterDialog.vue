<template>
  <v-dialog
    v-model="isVisible"
    max-width="500"
    persistent
    @update:model-value="updateVisibility"
  >
    <v-card class="ios-dialog">
      <v-card-title class="text-h5">Add Porter to Shift</v-card-title>
      
      <v-card-text>
        <div v-if="isLoading" class="text-center py-4">
          <LoadingIndicator />
          <p class="mt-2 text-medium-emphasis">Loading available porters...</p>
        </div>
        
        <div v-else-if="availablePorters.length === 0" class="text-center py-4">
          <v-icon icon="mdi-account-search" size="large" color="info" class="mb-3"></v-icon>
          <h3 class="text-h6 mb-1">No Porters Available</h3>
          <p class="text-body-2">All porters are already assigned to this shift or there are no porters in the system.</p>
        </div>
        
        <div v-else>
          <v-text-field
            v-model="search"
            label="Search Porters"
            variant="outlined"
            density="comfortable"
            append-inner-icon="mdi-magnify"
            clearable
            class="mb-4"
          ></v-text-field>
          
          <div class="available-porters">
            <div 
              v-for="porter in filteredPorters" 
              :key="porter.id"
              class="porter-item"
              :class="{ 'porter-item--selected': isPorterSelected(porter) }"
              @click="togglePorterSelection(porter)"
            >
              <div class="d-flex align-center">
                <v-checkbox
                  v-model="selectedPorters"
                  :value="porter.id"
                  density="compact"
                  hide-details
                ></v-checkbox>
                
                <div class="porter-info">
                  <div class="text-subtitle-1">{{ porter.name }}</div>
                  <div class="text-caption">{{ porter.type }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
          :disabled="selectedPorters.length === 0"
          @click="confirm"
        >
          Add Selected
        </IOSButton>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import IOSButton from '../common/IOSButton.vue'
import LoadingIndicator from '../common/LoadingIndicator.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  currentPorters: {
    type: Array,
    default: () => []
  },
  allPorters: {
    type: Array,
    default: () => []
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

// Local state
const isVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const search = ref('')
const selectedPorters = ref([])

// Computed properties
const availablePorters = computed(() => {
  // Filter out porters that are already on the shift
  const currentPorterIds = props.currentPorters.map(p => p.id)
  return props.allPorters.filter(p => 
    p.type === 'porter' && !currentPorterIds.includes(p.id)
  )
})

const filteredPorters = computed(() => {
  if (!search.value) return availablePorters.value
  
  const searchTerm = search.value.toLowerCase()
  return availablePorters.value.filter(porter => 
    porter.name.toLowerCase().includes(searchTerm)
  )
})

// Methods
const updateVisibility = (value) => {
  if (!value) {
    // Reset state when dialog closes
    search.value = ''
    selectedPorters.value = []
  }
}

const isPorterSelected = (porter) => {
  return selectedPorters.value.includes(porter.id)
}

const togglePorterSelection = (porter) => {
  const index = selectedPorters.value.indexOf(porter.id)
  if (index === -1) {
    selectedPorters.value.push(porter.id)
  } else {
    selectedPorters.value.splice(index, 1)
  }
}

const confirm = () => {
  // Find the full porter objects for the selected IDs
  const selectedPorterObjects = availablePorters.value.filter(
    porter => selectedPorters.value.includes(porter.id)
  )
  
  emit('confirm', selectedPorterObjects)
  isVisible.value = false
}

const cancel = () => {
  emit('cancel')
  isVisible.value = false
}
</script>

<style scoped>
.available-porters {
  max-height: 350px;
  overflow-y: auto;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 4px;
}

.porter-item {
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.porter-item:last-child {
  border-bottom: none;
}

.porter-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.porter-item--selected {
  background-color: rgba(0, 122, 255, 0.08);
}

.porter-info {
  margin-left: 12px;
}

@media (prefers-color-scheme: dark) {
  .available-porters {
    border-color: rgba(255, 255, 255, 0.12);
  }
  
  .porter-item {
    border-bottom-color: rgba(255, 255, 255, 0.12);
  }
  
  .porter-item:hover {
    background-color: rgba(255, 255, 255, 0.04);
  }
  
  .porter-item--selected {
    background-color: rgba(10, 132, 255, 0.15);
  }
}
</style>
