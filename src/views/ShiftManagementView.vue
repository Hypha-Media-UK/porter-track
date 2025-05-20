<template>
  <div class="shift-management">
    <div class="page-header">
      <h1 class="page-title">Shift Management</h1>
      <p class="page-description text-gray-600">Manage porter shifts and tasks</p>
    </div>
    
    <!-- Loading State -->
    <div v-if="shiftsStore.isLoading" class="text-center py-6">
      <LoadingIndicator size="lg" variant="primary" label="Loading shift data..." />
    </div>
    
    <!-- Shift Details -->
    <template v-else-if="shiftDetails">
      <div class="shift-management__overview">
        <Card>
          <template #header>
            <div class="flex-between">
              <h2 class="card-title">{{ shiftDetails.shift_type }}</h2>
              <StatusBadge :status="shiftDetails.is_active ? 'success' : 'info'" :label="shiftDetails.is_active ? 'Active' : 'Completed'" />
            </div>
          </template>
          
          <div class="card-body">
            <div class="grid grid-cols-2 gap-4">
              <div class="grid-item">
                <p class="fs-sm text-gray-600 mb-1">Supervisor</p>
                <p class="fs-lg fw-medium">{{ shiftDetails.supervisor?.name || 'N/A' }}</p>
              </div>
              
              <div class="grid-item">
                <p class="fs-sm text-gray-600 mb-1">Start Time</p>
                <p class="fs-lg fw-medium">{{ formatDateTime(shiftDetails.start_time) }}</p>
              </div>
              
              <div class="grid-item">
                <p class="fs-sm text-gray-600 mb-1">End Time</p>
                <p class="fs-lg fw-medium">{{ shiftDetails.end_time ? formatDateTime(shiftDetails.end_time) : 'Ongoing' }}</p>
              </div>
              
              <div class="grid-item">
                <p class="fs-sm text-gray-600 mb-1">Duration</p>
                <p class="fs-lg fw-medium">{{ calculateDuration(shiftDetails.start_time, shiftDetails.end_time) }}</p>
              </div>
            </div>
            
            <div v-if="shiftDetails.is_active" class="mt-4 text-right">
              <Button
                variant="error"
                @click="confirmEndShift"
              >
                End Shift
              </Button>
            </div>
          </div>
        </Card>
      </div>
      
      <!-- Stats Section -->
      <div class="shift-management__stats mt-4">
        <div class="stats-grid">
          <StatisticCard
            title="Porters on Shift"
            :value="shiftDetails.porters?.length || 0"
            icon="users"
            color="primary"
          />
          
          <StatisticCard
            title="Pending Tasks"
            :value="pendingTasks.length"
            icon="clock"
            color="warning"
          />
          
          <StatisticCard
            title="Completed Tasks"
            :value="completedTasks.length"
            icon="check"
            color="accent"
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
      <div class="empty-state">
        <span class="empty-state-icon">📅</span>
        <h3 class="empty-state-title">No shift selected</h3>
        <p class="empty-state-message">Please start a new shift or select an existing one</p>
        <div class="empty-state-actions">
          <Button
            variant="primary"
            @click="startNewShift"
          >
            Start New Shift
          </Button>
        </div>
      </div>
    </template>
    
    <!-- New Shift Dialog -->
    <DialogConfirm
      v-model="newShiftDialogVisible"
      title="Start New Shift"
      confirmText="Start Shift"
      :showConfirmButton="newShift.supervisorId && newShift.shiftType"
      @confirm="createShift"
    >
      <form @submit.prevent="createShift" class="form">
        <div class="form-group">
          <label for="supervisor" class="form-label">Supervisor</label>
          <select
            id="supervisor"
            v-model="newShift.supervisorId"
            class="form-control"
            :class="{ 'is-invalid': errors.supervisor }"
            required
          >
            <option v-for="supervisor in supervisors" :key="supervisor.id" :value="supervisor.id">
              {{ supervisor.name }}
            </option>
          </select>
          <div v-if="errors.supervisor" class="invalid-feedback">
            {{ errors.supervisor }}
          </div>
        </div>
        
        <div class="form-group">
          <label for="shiftType" class="form-label">Shift Type</label>
          <select
            id="shiftType"
            v-model="newShift.shiftType"
            class="form-control"
            :class="{ 'is-invalid': errors.shiftType }"
            required
          >
            <option value="Day Shift">Day Shift</option>
            <option value="Night Shift">Night Shift</option>
          </select>
          <div v-if="errors.shiftType" class="invalid-feedback">
            {{ errors.shiftType }}
          </div>
        </div>
      </form>
    </DialogConfirm>
    
    <!-- End Shift Confirmation Dialog -->
    <DialogConfirm
      v-model="endShiftDialogVisible"
      title="Confirm End Shift"
      message="Are you sure you want to end this shift? This action cannot be undone."
      cancel-text="Cancel"
      confirm-text="End Shift"
      confirm-variant="error"
      @confirm="endShift"
    />
    
    <!-- Department Select Dialog -->
    <DialogConfirm
      v-model="departmentSelectDialogVisible"
      title="Select Department"
      showCloseButton
    >
      <DepartmentSelectForm
        :porter="selectedPorter"
        :departments="buildingsStore.departments"
        :designations="designationsStore.designations"
        :is-loading="isLoadingPorters"
        :shift-id="shiftId"
        @submit="assignPorterToDepartment"
        @cancel="departmentSelectDialogVisible = false"
      />
    </DialogConfirm>
    
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
      confirm-variant="error"
      @confirm="removePorterFromShift"
    />
    
    <!-- Remove Assignment Confirmation Dialog -->
    <DialogConfirm
      v-model="removeAssignmentDialogVisible"
      title="End Assignment"
      message="Are you sure you want to end this porter's current department assignment?"
      cancel-text="Cancel"
      confirm-text="End Assignment"
      confirm-variant="warning"
      @confirm="removePorterAssignment"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useShiftsStore } from '../stores/shifts'
import { useStaffStore } from '../stores/staff'
import Card from '../components/common/Card.vue'
import Button from '../components/common/Button.vue'
import LoadingIndicator from '../components/common/LoadingIndicator.vue'
import DialogConfirm from '../components/common/DialogConfirm.vue'
import StatisticCard from '../components/common/StatisticCard.vue'
import StatusBadge from '../components/common/StatusBadge.vue'
import PortersOnShift from '../components/porters/PortersOnShift.vue'
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
    await shiftsStore.endShift(shiftId.value, router)
    endShiftDialogVisible.value = false
    
    // We don't need to fetch shift details or do anything else here
    // since the user will be redirected to the home page
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

<style lang="scss" scoped>
.shift-management {
  max-width: 1000px;
  margin: 0 auto;
  padding: $spacing-4;
  
  @include responsive(md) {
    padding: $spacing-6;
  }
}

.stats-grid {
  @include grid-responsive(300px, $spacing-4);
  margin-top: $spacing-6;
  margin-bottom: $spacing-6;
}

.shift-management__porter-section {
  margin-top: $spacing-8;
}

.grid-item {
  min-width: 0;
}
</style>
