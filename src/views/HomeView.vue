<template>
  <div class="ios-home">
    <!-- Welcome Header -->
    <div class="ios-home__header">
      <h1 class="text-h4 font-weight-medium mb-2">Welcome</h1>
      <p class="text-subtitle-1 text-medium-emphasis">
        Track hospital porter tasks efficiently
      </p>
    </div>
    
    <!-- Shift Management Section -->
    <div class="ios-home__shift-section mb-4">
      <div v-if="shiftsStore.isLoading" class="text-center py-4">
        <LoadingIndicator />
        <p class="mt-2 text-medium-emphasis">Loading shift data...</p>
      </div>
      
      <template v-else>
        <!-- Active Shift Panel -->
        <IOSCard v-if="activeShift" class="mb-4">
          <div class="ios-card-header d-flex justify-space-between align-center">
            <h2 class="text-h6 font-weight-medium">Current Shift</h2>
            <StatusBadge status="success" label="Active" />
          </div>
          
          <div class="ios-card-content">
            <div class="d-flex justify-space-between align-center mb-2">
              <div>
                <h3 class="text-h5">{{ activeShift.shift_type }}</h3>
                <p class="text-subtitle-2 text-medium-emphasis">
                  Supervisor: {{ activeShift.supervisor?.name || 'N/A' }}
                </p>
                <p class="text-subtitle-2 text-medium-emphasis">
                  Started: {{ formatDateTime(activeShift.start_time) }}
                </p>
              </div>
              
              <IOSButton
                color="primary"
                @click="navigateTo(`/shifts/${activeShift.id}`)"
              >
                Manage Shift
              </IOSButton>
            </div>
          </div>
        </IOSCard>
        
        <!-- Previous Shift Panel -->
        <IOSCard v-if="previousShift" class="mb-4">
          <div class="ios-card-header d-flex justify-space-between align-center">
            <h2 class="text-h6 font-weight-medium">Previous Shift</h2>
            <StatusBadge status="completed" label="Completed" />
          </div>
          
          <div class="ios-card-content">
            <div class="d-flex justify-space-between align-center mb-2">
              <div>
                <h3 class="text-h5">{{ previousShift.shift_type }}</h3>
                <p class="text-subtitle-2 text-medium-emphasis">
                  Supervisor: {{ previousShift.supervisor?.name || 'N/A' }}
                </p>
                <p class="text-subtitle-2 text-medium-emphasis">
                  Ended: {{ formatDateTime(previousShift.end_time) }}
                </p>
              </div>
              
              <IOSButton
                color="secondary"
                variant="text"
                @click="navigateTo(`/shifts/${previousShift.id}`)"
              >
                View Details
              </IOSButton>
            </div>
          </div>
        </IOSCard>
        
        <!-- Start New Shift Button -->
        <div v-if="!activeShift" class="d-flex justify-center mb-4">
          <IOSButton
            color="primary"
            prependIcon="mdi-calendar-plus"
            @click="openNewShiftDialog"
          >
            Start New Shift
          </IOSButton>
        </div>
        
        <!-- View All Shifts Button -->
        <div class="d-flex justify-center mb-4">
          <IOSButton
            color="secondary"
            variant="text"
            prependIcon="mdi-history"
            @click="navigateTo('/shifts')"
          >
            View All Archived Shifts
          </IOSButton>
        </div>
      </template>
    </div>
    
    <!-- Quick Access Cards -->
    <div class="ios-home__cards">
      <IOSCard
        v-for="item in menuItems"
        :key="item.title"
        class="ios-home__card"
        @click="navigateTo(item.path)"
      >
        <div class="ios-home__card-content">
          <v-icon
            :icon="item.icon"
            size="x-large"
            :color="item.color"
            class="mb-3"
          ></v-icon>
          <h2 class="text-h6 mb-1">{{ item.title }}</h2>
          <p class="text-body-2 text-center text-medium-emphasis">
            {{ item.description }}
          </p>
        </div>
      </IOSCard>
    </div>
    
    <!-- App Information -->
    <div class="ios-home__info">
      <p class="text-center text-caption text-medium-emphasis">
        Porter Track v1.0.0
      </p>
    </div>
    
    <!-- New Shift Dialog -->
    <v-dialog v-model="newShiftDialogVisible" max-width="500" persistent>
      <v-card class="ios-dialog">
        <v-card-title class="text-h5">Start New Shift</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="createShift">
            <v-select
              v-model="newShift.supervisorId"
              :items="supervisors"
              item-title="name"
              item-value="id"
              label="Supervisor"
              variant="outlined"
              :error-messages="errors.supervisor"
              required
            ></v-select>
            
            <v-select
              v-model="newShift.shiftType"
              :items="['Day Shift', 'Night Shift']"
              label="Shift Type"
              variant="outlined"
              :error-messages="errors.shiftType"
              required
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <IOSButton
            variant="text"
            color="secondary"
            @click="newShiftDialogVisible = false"
          >
            Cancel
          </IOSButton>
          <IOSButton
            color="primary"
            :disabled="!newShift.supervisorId || !newShift.shiftType"
            @click="createShift"
          >
            Start Shift
          </IOSButton>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useShiftsStore } from '../stores/shifts'
import { useStaffStore } from '../stores/staff'
import IOSCard from '../components/common/IOSCard.vue'
import IOSButton from '../components/common/IOSButton.vue'
import LoadingIndicator from '../components/common/LoadingIndicator.vue'
import StatusBadge from '../components/common/StatusBadge.vue'

const router = useRouter()
const shiftsStore = useShiftsStore()
const staffStore = useStaffStore()

// State
const newShiftDialogVisible = ref(false)
const newShift = ref({
  supervisorId: '',
  shiftType: 'Day Shift'
})
const errors = ref({
  supervisor: '',
  shiftType: ''
})

// Computed properties
const activeShift = computed(() => shiftsStore.activeShift)
const previousShift = computed(() => shiftsStore.previousShift)
const supervisors = computed(() => staffStore.getSupervisors)

// Fetch shifts on component mount
onMounted(async () => {
  await staffStore.fetchStaff()
  await shiftsStore.fetchShifts()
})

// New shift dialog methods
const openNewShiftDialog = () => {
  // Initialize with first supervisor if available
  newShift.value = {
    supervisorId: supervisors.value.length > 0 ? supervisors.value[0].id : '',
    shiftType: 'Day Shift'
  }
  newShiftDialogVisible.value = true
}

const createShift = async () => {
  // Reset errors
  errors.value = { supervisor: '', shiftType: '' }
  
  // Validate form
  let isValid = true
  if (!newShift.value.supervisorId) {
    errors.value.supervisor = 'Supervisor is required'
    isValid = false
  }
  if (!newShift.value.shiftType) {
    errors.value.shiftType = 'Shift type is required'
    isValid = false
  }
  
  if (!isValid) return
  
  try {
    const shift = await shiftsStore.createShift(newShift.value)
    newShiftDialogVisible.value = false
    
    if (shift) {
      router.push({ name: 'ShiftManagement', params: { id: shift.id } })
    }
  } catch (error) {
    console.error('Error creating shift:', error)
  }
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

// Menu items for quick access
const menuItems = [
  {
    title: 'Buildings',
    description: 'Manage hospital buildings and departments',
    path: '/settings?tab=buildings',
    icon: 'mdi-office-building-outline',
    color: 'primary'
  },
  {
    title: 'Tasks',
    description: 'Create and manage porter tasks',
    path: '/settings?tab=tasks',
    icon: 'mdi-clipboard-text-outline',
    color: 'secondary'
  },
  {
    title: 'Staff',
    description: 'Manage porters and supervisors',
    path: '/settings?tab=staff',
    icon: 'mdi-account-group-outline',
    color: 'success'
  },
  {
    title: 'Settings',
    description: 'Configure application preferences',
    path: '/settings?tab=app',
    icon: 'mdi-cog-outline',
    color: 'info'
  }
]

// Navigation function
const navigateTo = (path) => {
  router.push(path)
}
</script>

<style scoped>
.ios-home {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.ios-home__header {
  text-align: center;
  margin-bottom: 32px;
}

.ios-home__cards {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
}

.ios-home__card {
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.ios-home__card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.ios-home__card:active {
  transform: translateY(0);
  opacity: 0.9;
}

.ios-home__card-content {
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.ios-home__info {
  margin-top: 24px;
  padding: 16px;
}

@media (min-width: 768px) {
  .ios-home__cards {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .ios-home__card {
    flex: 0 0 calc(33.333% - 16px);
    max-width: calc(33.333% - 16px);
  }
}
</style>
