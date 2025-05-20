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
        
        <!-- Start New Shift Button -->
        <div v-if="!activeShift" class="d-flex justify-center mb-5">
          <IOSButton
            color="primary"
            prependIcon="mdi-calendar-plus"
            @click="openNewShiftDialog"
          >
            Start New Shift
          </IOSButton>
        </div>
        
        <!-- Previous Shifts Section -->
        <h2 class="text-h6 font-weight-medium mb-3">Previous Shifts</h2>
        
        <div v-if="recentShifts.length === 0" class="text-center py-4">
          <p class="text-medium-emphasis">No previous shifts found</p>
        </div>
        
        <div v-else class="previous-shifts-list mb-5">
          <IOSCard v-for="shift in recentShifts" :key="shift.id" class="mb-3">
            <div class="ios-card-content">
              <div class="d-flex justify-space-between align-center">
                <div>
                  <h3 class="text-h6">{{ shift.shift_type }}</h3>
                  <p class="text-subtitle-2 text-medium-emphasis">
                    Supervisor: {{ shift.supervisor?.name || 'N/A' }}
                  </p>
                  <p class="text-caption text-medium-emphasis">
                    Ended: {{ formatDateTime(shift.end_time) }}
                  </p>
                </div>
                
                <IOSButton
                  color="secondary"
                  variant="text"
                  @click="navigateTo(`/shifts/${shift.id}`)"
                >
                  View Details
                </IOSButton>
              </div>
            </div>
          </IOSCard>
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
const recentShifts = computed(() => shiftsStore.recentShifts)
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

// No menu items needed anymore as we removed the cards

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

/* Previous shifts list styling */
.previous-shifts-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ios-home__info {
  margin-top: 24px;
  padding: 16px;
}

/* No media queries needed for removed cards */
</style>
