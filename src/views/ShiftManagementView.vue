<template>
  <div class="shift-management">
    <div class="shift-management__header">
      <h1 class="text-h4 font-weight-medium mb-1">Shift Management</h1>
      <p class="text-body-1 text-medium-emphasis">Manage porter shifts and tasks</p>
    </div>
    
    <!-- Loading State -->
    <div v-if="shiftsStore.isLoading" class="text-center py-6">
      <LoadingIndicator :size="64" />
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
          />
          
          <StatisticCard
            title="Completed Tasks"
            :value="completedTasks.length"
            icon="mdi-check-circle-outline"
            color="success"
          />
        </div>
      </div>
      
      <!-- Porter Management Section -->
      <div class="shift-management__porter-section mt-4">
        <!-- Unassigned Porters -->
        <PortersOnShift
          :porters="shiftDetails.porters || []"
          :all-staff="staffStore.staff"
          :is-loading="isLoadingPorters"
          :is-shift-active="shiftDetails.is_active"
          @add-porter="addPorterToShift"
          @assign-porter="openDepartmentSelectDialog"
          @remove-porter="confirmRemovePorter"
        />
        
      <!-- Department Assignments -->
      <DepartmentGrid
        :departments="buildingsStore.departments"
        :designations="designationsStore.designations"
        :porters="shiftDetails.porters || []"
        :is-loading="isLoadingPorters || designationsStore.isLoading"
        :is-shift-active="shiftDetails.is_active"
        @unassign-porter="confirmRemoveAssignment"
        @edit-porter-times="editPorterTimes"
      />
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
    
    <!-- Department Select Dialog -->
    <v-dialog
      v-model="departmentSelectDialogVisible"
      max-width="500"
      persistent
    >
      <v-card class="ios-dialog">
        <v-card-text>
          <DepartmentSelectForm
            :porter="selectedPorter"
            :departments="buildingsStore.departments"
            :designations="designationsStore.designations"
            :is-loading="isLoadingPorters"
            :shift-id="shiftId"
            @submit="assignPorterToDepartment"
            @cancel="departmentSelectDialogVisible = false"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
    
    <!-- Porter Assignment Dialog -->
    <PorterAssignmentForm
      v-model="assignmentDialogVisible"
      :shift-id="shiftId"
      :porter="selectedPorter"
      :is-edit="isEditingAssignment"
      :is-loading="shiftsStore.isLoading"
      @submit="assignPorterToDepartment"
      @cancel="assignmentDialogVisible = false"
    />
    
    <!-- Remove Porter Confirmation Dialog -->
    <DialogConfirm
      v-model="removePorterDialogVisible"
      title="Remove Porter"
      message="Are you sure you want to remove this porter from the shift? All their assignments will be deleted."
      cancel-text="Cancel"
      confirm-text="Remove"
      confirm-color="error"
      @confirm="removePorterFromShift"
    />
    
    <!-- Remove Assignment Confirmation Dialog -->
    <DialogConfirm
      v-model="removeAssignmentDialogVisible"
      title="End Assignment"
      message="Are you sure you want to end this porter's current department assignment?"
      cancel-text="Cancel"
      confirm-text="End Assignment"
      confirm-color="warning"
      @confirm="removePorterAssignment"
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
import PortersOnShift from '../components/porters/PortersOnShift.vue'
import AddPorterDialog from '../components/porters/AddPorterDialog.vue'
import PorterAssignmentForm from '../components/porters/PorterAssignmentForm.vue'
import DepartmentGrid from '../components/departments/DepartmentGrid.vue'
import DepartmentSelectForm from '../components/departments/DepartmentSelectForm.vue'
import { useBuildingsStore } from '../stores/buildings'
import { useDepartmentDesignationsStore } from '../stores/departmentDesignations'

const route = useRoute()
const router = useRouter()
const shiftsStore = useShiftsStore()
const staffStore = useStaffStore()
const buildingsStore = useBuildingsStore()
const designationsStore = useDepartmentDesignationsStore()

// State
const activeTab = ref('porters')
const newShiftDialogVisible = ref(false)
const endShiftDialogVisible = ref(false)
const addPorterDialogVisible = ref(false)
const departmentSelectDialogVisible = ref(false)
const assignmentDialogVisible = ref(false)
const removePorterDialogVisible = ref(false)
const removeAssignmentDialogVisible = ref(false)
const isLoadingPorters = ref(false)
const selectedPorter = ref(null)
const porterToRemove = ref(null)
const isEditingAssignment = ref(false)

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
  
  // Load department designations for the department cards
  await designationsStore.fetchDesignations()
  
  // Load departments for assignment forms
  if (!buildingsStore.buildings || buildingsStore.buildings.length === 0) {
    await buildingsStore.fetchBuildings()
  }
  
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
      // Reset the state first to avoid data from previous shifts
      shiftDetails.value = null
      await shiftsStore.fetchShiftDetails(newId)
      
      // Log shift active state for debugging
      console.log('Shift active state:', shiftsStore.shiftDetails?.is_active)
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

// Porter management methods
const openAddPorterDialog = () => {
  addPorterDialogVisible.value = true
}

// Method for adding a single porter directly from PortersOnShift dropdown
const addPorterToShift = async (porter) => {
  isLoadingPorters.value = true
  
  try {
    await shiftsStore.addPorterToShift(shiftId.value, porter.id)
    
    // Refresh shift details to show the newly added porter
    await shiftsStore.fetchShiftDetails(shiftId.value)
  } catch (error) {
    console.error('Error adding porter to shift:', error)
  } finally {
    isLoadingPorters.value = false
  }
}

// Legacy method for batch adding porters
const addPortersToShift = async (porters) => {
  if (!porters.length) return
  
  isLoadingPorters.value = true
  
  try {
    for (const porter of porters) {
      await shiftsStore.addPorterToShift(shiftId.value, porter.id)
    }
    
    // Refresh shift details to show the newly added porters
    await shiftsStore.fetchShiftDetails(shiftId.value)
  } catch (error) {
    console.error('Error adding porters to shift:', error)
  } finally {
    isLoadingPorters.value = false
  }
}

const openDepartmentSelectDialog = (porter) => {
  selectedPorter.value = porter
  
  // Load buildings (which include departments) and designations if they haven't been loaded yet
  if (!buildingsStore.buildings || !buildingsStore.buildings.length) {
    buildingsStore.fetchBuildings()
  }
  
  if (!designationsStore.designations || !designationsStore.designations.length) {
    designationsStore.fetchDesignations()
  }
  
  departmentSelectDialogVisible.value = true
}

const openAssignPorterDialog = (porter) => {
  selectedPorter.value = porter
  isEditingAssignment.value = porter.departmentAssignments && 
    porter.departmentAssignments.some(assignment => assignment.is_active)
  assignmentDialogVisible.value = true
}

const assignPorterToDepartment = async (assignment) => {
  isLoadingPorters.value = true
  
  try {
    await shiftsStore.assignPorterToDepartment(assignment)
    
    // Refresh shift details to show the new assignment
    await shiftsStore.fetchShiftDetails(shiftId.value)
    
    // Close the dialogs after successful assignment
    departmentSelectDialogVisible.value = false
    assignmentDialogVisible.value = false
  } catch (error) {
    console.error('Error assigning porter to department:', error)
  } finally {
    isLoadingPorters.value = false
  }
}

const confirmRemovePorter = (porter) => {
  porterToRemove.value = porter
  removePorterDialogVisible.value = true
}

const removePorterFromShift = async () => {
  if (!porterToRemove.value) return
  
  isLoadingPorters.value = true
  
  try {
    await shiftsStore.removePorterFromShift(shiftId.value, porterToRemove.value.id)
    
    // Refresh shift details to update the porters list
    await shiftsStore.fetchShiftDetails(shiftId.value)
    
    // Close the dialog
    removePorterDialogVisible.value = false
    porterToRemove.value = null
  } catch (error) {
    console.error('Error removing porter from shift:', error)
  } finally {
    isLoadingPorters.value = false
  }
}

const confirmRemoveAssignment = (porter) => {
  porterToRemove.value = porter
  removeAssignmentDialogVisible.value = true
}

const removePorterAssignment = async () => {
  if (!porterToRemove.value) return
  
  isLoadingPorters.value = true
  
  try {
    await shiftsStore.removePorterFromDepartment(shiftId.value, porterToRemove.value.id)
    
    // Refresh shift details to update the porter assignments
    await shiftsStore.fetchShiftDetails(shiftId.value)
    
    // Close the dialog
    removeAssignmentDialogVisible.value = false
    porterToRemove.value = null
  } catch (error) {
    console.error('Error removing porter assignment:', error)
  } finally {
    isLoadingPorters.value = false
  }
}

// Method to edit porter times when clicked from department card
const editPorterTimes = (porter) => {
  selectedPorter.value = porter
  isEditingAssignment.value = true
  assignmentDialogVisible.value = true
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
