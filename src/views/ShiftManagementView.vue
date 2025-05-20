<template>
  <div class="shift-management">
    <div class="shift-management__header">
      <h1 class="text-h4 font-weight-medium mb-1">Shift Management</h1>
      <p class="text-body-1 text-medium-emphasis">Manage porter shifts and tasks</p>
    </div>
    
    <!-- Loading State -->
    <div v-if="shiftsStore.isLoading" class="text-center py-6">
      <LoadingIndicator size="large" />
      <p class="mt-2 text-medium-emphasis">Loading shift data...</p>
    </div>
    
    <!-- Shift Details -->
    <template v-else-if="shiftDetails">
      <div class="shift-management__overview">
        <IOSCard>
          <div class="ios-card-header">
            <div class="d-flex justify-space-between align-center">
              <h2 class="text-h5 font-weight-medium">{{ shiftDetails.shift_type }}</h2>
              <StatusBadge :status="shiftDetails.is_active ? 'success' : 'completed'" :label="shiftDetails.is_active ? 'Active' : 'Completed'" />
            </div>
          </div>
          
          <div class="ios-card-content">
            <div class="grid-container">
              <div class="grid-item">
                <p class="text-subtitle-2 text-medium-emphasis mb-1">Supervisor</p>
                <p class="text-h6">{{ shiftDetails.supervisor?.name || 'N/A' }}</p>
              </div>
              
              <div class="grid-item">
                <p class="text-subtitle-2 text-medium-emphasis mb-1">Start Time</p>
                <p class="text-h6">{{ formatDateTime(shiftDetails.start_time) }}</p>
              </div>
              
              <div class="grid-item">
                <p class="text-subtitle-2 text-medium-emphasis mb-1">End Time</p>
                <p class="text-h6">{{ shiftDetails.end_time ? formatDateTime(shiftDetails.end_time) : 'Ongoing' }}</p>
              </div>
              
              <div class="grid-item">
                <p class="text-subtitle-2 text-medium-emphasis mb-1">Duration</p>
                <p class="text-h6">{{ calculateDuration(shiftDetails.start_time, shiftDetails.end_time) }}</p>
              </div>
            </div>
            
            <div v-if="shiftDetails.is_active" class="mt-4 d-flex justify-end">
              <IOSButton
                color="error"
                variant="outlined"
                @click="confirmEndShift"
              >
                End Shift
              </IOSButton>
            </div>
          </div>
        </IOSCard>
      </div>
      
      <!-- Stats Section -->
      <div class="shift-management__stats mt-4">
        <div class="stats-grid">
          <StatisticCard
            title="Porters on Shift"
            :value="shiftDetails.porters?.length || 0"
            icon="mdi-account-group"
            color="primary"
          />
          
          <StatisticCard
            title="Pending Tasks"
            :value="pendingTasks.length"
            icon="mdi-clock-outline"
            color="warning"
          >
            <template #action>
              <v-btn
                v-if="pendingTasks.length > 0"
                variant="text"
                color="warning"
                size="small"
                @click="activeTab = 'pending'"
              >
                View All
              </v-btn>
            </template>
          </StatisticCard>
          
          <StatisticCard
            title="Completed Tasks"
            :value="completedTasks.length"
            icon="mdi-check-circle-outline"
            color="success"
          >
            <template #action>
              <v-btn
                v-if="completedTasks.length > 0"
                variant="text"
                color="success"
                size="small"
                @click="activeTab = 'completed'"
              >
                View All
              </v-btn>
            </template>
          </StatisticCard>
        </div>
      </div>
      
      <!-- Tabs for different sections -->
      <div class="shift-management__tabs mt-4">
        <v-tabs v-model="activeTab" color="primary" align-tabs="center">
          <v-tab value="porters">Porters</v-tab>
          <v-tab value="pending">Pending Tasks</v-tab>
          <v-tab value="completed">Completed Tasks</v-tab>
        </v-tabs>
        
        <v-window v-model="activeTab" class="mt-4">
          <!-- Porters Tab -->
          <v-window-item value="porters">
            <p class="text-subtitle-1 font-weight-medium mb-3">Porter Assignments</p>
            <div class="text-center py-6">
              <v-icon icon="mdi-account-hard-hat" size="x-large" color="primary" class="mb-4"></v-icon>
              <h3 class="text-h5 mb-2">Porter management coming soon</h3>
              <p class="mb-4">This feature is under development</p>
            </div>
          </v-window-item>
          
          <!-- Pending Tasks Tab -->
          <v-window-item value="pending">
            <p class="text-subtitle-1 font-weight-medium mb-3">Pending Tasks</p>
            <div class="text-center py-6">
              <v-icon icon="mdi-clipboard-text-clock" size="x-large" color="warning" class="mb-4"></v-icon>
              <h3 class="text-h5 mb-2">Task management coming soon</h3>
              <p class="mb-4">This feature is under development</p>
            </div>
          </v-window-item>
          
          <!-- Completed Tasks Tab -->
          <v-window-item value="completed">
            <p class="text-subtitle-1 font-weight-medium mb-3">Completed Tasks</p>
            <div class="text-center py-6">
              <v-icon icon="mdi-clipboard-check" size="x-large" color="success" class="mb-4"></v-icon>
              <h3 class="text-h5 mb-2">Task history coming soon</h3>
              <p class="mb-4">This feature is under development</p>
            </div>
          </v-window-item>
        </v-window>
      </div>
    </template>
    
    <!-- No Active Shift State -->
    <template v-else>
      <div class="text-center py-6">
        <v-icon icon="mdi-calendar-clock" size="x-large" color="primary" class="mb-4"></v-icon>
        <h3 class="text-h5 mb-2">No shift selected</h3>
        <p class="mb-4">Please start a new shift or select an existing one</p>
        <IOSButton
          color="primary"
          @click="startNewShift"
        >
          Start New Shift
        </IOSButton>
      </div>
    </template>
    
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
    
    <!-- End Shift Confirmation Dialog -->
    <DialogConfirm
      v-model="endShiftDialogVisible"
      title="Confirm End Shift"
      message="Are you sure you want to end this shift? This action cannot be undone."
      cancel-text="Cancel"
      confirm-text="End Shift"
      confirm-color="error"
      @confirm="endShift"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useShiftsStore } from '../stores/shifts'
import { useStaffStore } from '../stores/staff'
import IOSCard from '../components/common/IOSCard.vue'
import IOSButton from '../components/common/IOSButton.vue'
import LoadingIndicator from '../components/common/LoadingIndicator.vue'
import DialogConfirm from '../components/common/DialogConfirm.vue'
import StatisticCard from '../components/common/StatisticCard.vue'
import StatusBadge from '../components/common/StatusBadge.vue'

const route = useRoute()
const router = useRouter()
const shiftsStore = useShiftsStore()
const staffStore = useStaffStore()

// State
const activeTab = ref('porters')
const newShiftDialogVisible = ref(false)
const endShiftDialogVisible = ref(false)
const newShift = ref({
  supervisorId: '',
  shiftType: 'Day Shift'
})
const errors = ref({
  supervisor: '',
  shiftType: ''
})

// Computed properties
const shiftId = computed(() => route.params.id)
const shiftDetails = computed(() => shiftsStore.shiftDetails)
const pendingTasks = computed(() => shiftsStore.pendingTasks)
const completedTasks = computed(() => shiftsStore.completedTasks)
const supervisors = computed(() => staffStore.getSupervisors)

// Load data
onMounted(async () => {
  await staffStore.fetchStaff()
  await shiftsStore.fetchShifts()
  
  if (shiftId.value) {
    await shiftsStore.fetchShiftDetails(shiftId.value)
  } else if (shiftsStore.activeShift) {
    // Navigate to active shift if there is one
    router.replace({ name: 'ShiftManagement', params: { id: shiftsStore.activeShift.id } })
  }
})

// Watch for route changes
watch(() => route.params.id, async (newId) => {
  if (newId) {
    await shiftsStore.fetchShiftDetails(newId)
  }
})

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

// Calculate duration between two dates
const calculateDuration = (startDateString, endDateString) => {
  const startDate = new Date(startDateString)
  const endDate = endDateString ? new Date(endDateString) : new Date()
  
  const diffInMs = endDate - startDate
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInMinutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60))
  
  return `${diffInHours}h ${diffInMinutes}m`
}

// Dialog functions
const startNewShift = () => {
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

const confirmEndShift = () => {
  endShiftDialogVisible.value = true
}

const endShift = async () => {
  try {
    await shiftsStore.endShift(shiftId.value)
    endShiftDialogVisible.value = false
    
    // Refresh shift details
    await shiftsStore.fetchShiftDetails(shiftId.value)
  } catch (error) {
    console.error('Error ending shift:', error)
  }
}
</script>

<style scoped>
.shift-management {
  max-width: 1000px;
  margin: 0 auto;
  padding: 16px;
}

.shift-management__header {
  margin-bottom: 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 16px;
}

.grid-item {
  min-width: 0;
}

@media (max-width: 600px) {
  .grid-container {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
