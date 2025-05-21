<template>
  <div class="home">
    <!-- Welcome Header -->
    <div class="page-header text-center">
      <h1 class="page-title">Welcome</h1>
      <p class="page-description text-gray-600">
        Track hospital porter tasks efficiently
      </p>
    </div>
    
    <!-- Shift Management Section -->
    <div class="shift-section mb-8">
      <div v-if="shiftsStore.isLoading" class="text-center py-4">
        <LoadingIndicator label="Loading shift data..." />
      </div>
      
      <template v-else>
        <!-- Active Shift Panel -->
        <Card v-if="activeShift" class="mb-4">
          <template #header>
            <div class="flex-between">
              <h2 class="card-title">Current Shift</h2>
              <StatusBadge status="success" label="Active" />
            </div>
          </template>
          
          <div class="flex-between mb-2">
            <div>
              <h3 class="fs-xl fw-medium">{{ activeShift.shift_type }}</h3>
              <p class="fs-sm text-gray-600">
                Supervisor: {{ activeShift.supervisor?.name || 'N/A' }}
              </p>
              <p class="fs-sm text-gray-600">
                Started: {{ formatDateTime(activeShift.start_time) }}
              </p>
            </div>
            
            <Button
              variant="primary"
              @click="navigateTo(`/shifts/${activeShift.id}`)"
            >
              Manage Shift
            </Button>
          </div>
        </Card>
        
        <!-- Start New Shift Button -->
        <div v-if="!activeShift" class="d-flex justify-center mb-5">
          <Button
            variant="primary"
            iconLeft="+"
            @click="openNewShiftDialog"
          >
            Start New Shift
          </Button>
        </div>
        
        <!-- Previous Shifts Section -->
        <h2 class="fs-2xl fw-medium mb-3">Previous Shifts</h2>
        
        <div v-if="recentShifts.length === 0" class="empty-state">
          <p class="text-gray-600">No previous shifts found</p>
        </div>
        
        <div v-else class="card-group mb-5">
          <Card 
            v-for="shift in recentShifts" 
            :key="shift.id" 
            class="mb-3"
            hover
          >
            <div class="flex-between">
              <div>
                <h3 class="fs-lg fw-medium">{{ shift.shift_type }}</h3>
                <p class="fs-sm text-gray-600">
                  Supervisor: {{ shift.supervisor?.name || 'N/A' }}
                </p>
                <p class="fs-xs text-gray-500">
                  Ended: {{ formatDateTime(shift.end_time) }}
                </p>
              </div>
              
              <Button
                variant="secondary"
                @click="navigateTo(`/shifts/${shift.id}`)"
              >
                View Details
              </Button>
            </div>
          </Card>
        </div>
        
        <!-- View All Shifts Button -->
        <div class="text-center mb-4">
          <Button
            variant="text"
            iconLeft="&#8986;"
            @click="navigateTo('/shifts')"
          >
            View All Archived Shifts
          </Button>
        </div>
      </template>
    </div>
    
    <!-- App Information -->
    <div class="text-center text-gray-500 fs-xs mt-8">
      Porter Track v1.0.0
    </div>
    
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
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useShiftsStore } from '../stores/shifts'
import { useStaffStore } from '../stores/staff'
import Card from '../components/common/Card.vue'
import Button from '../components/common/Button.vue'
import LoadingIndicator from '../components/common/LoadingIndicator.vue'
import StatusBadge from '../components/common/StatusBadge.vue'
import DialogConfirm from '../components/common/DialogConfirm.vue'

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

// Navigation function
const navigateTo = (path) => {
  router.push(path)
}
</script>

<style lang="scss" scoped>
.home {
  max-width: 800px;
  margin: 0 auto;
  padding: $spacing-6 $spacing-4;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.shift-section {
  @include grid(1, $spacing-4);
}

@include responsive(md) {
  .home {
    padding: $spacing-8 $spacing-6;
  }
}
</style>
