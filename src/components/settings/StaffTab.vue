<template>
  <section class="staff-tab">
    <!-- Actions -->
    <div class="flex-end mb-4"></div>
    
    <!-- Loading Indicator -->
    <div v-if="staffStore.isLoading" class="text-center py-6">
      <LoadingIndicator label="Loading staff..." />
    </div>
    
    <!-- Empty State (when no staff at all) -->
    <Card v-else-if="!staffStore.staff.length">
      <div class="empty-state py-8">
        <span class="icon empty-state-icon">👥</span>
        <h3 class="empty-state-title mb-2">No staff yet</h3>
        <p class="mb-4">Add your first staff member to get started</p>
        <div class="button-group">
          <Button variant="primary" iconLeft="+" @click="addStaff('supervisor')">
            Add Supervisor
          </Button>
          <Button variant="secondary" iconLeft="+" @click="addStaff('porter')">
            Add Porter
          </Button>
        </div>
      </div>
    </Card>
    
    <!-- Staff Lists -->
    <div v-else class="staff-lists">
      <!-- Supervisors Section -->
      <Card class="staff-card">
        <template #header>
          <div class="flex-between">
            <div class="flex-start">
              <h2 class="card-title">Supervisors</h2>
              <Badge variant="primary" class="ml-3">
                {{ supervisors.length }}
              </Badge>
            </div>
            <Button 
              variant="primary" 
              size="sm"
              iconLeft="+"
              @click="addStaff('supervisor')"
              title="Add supervisor"
            />
          </div>
        </template>
        
        <div class="inset-content">
          <!-- Supervisor Items -->
          <div v-if="supervisors.length">
            <ListItem
              v-for="supervisor in supervisors"
              :key="supervisor.id"
              :model-value="supervisor.name"
              :editable="true"
              :deletable="true"
              placeholder="Supervisor name"
              @update:model-value="updateStaffName(supervisor.id, $event)"
              @delete="confirmDeleteStaff(supervisor)"
            />
          </div>
          
          <!-- Empty Supervisors State -->
          <div v-else class="empty-state py-4">
            <p class="text-gray-600 mb-2">No supervisors added yet</p>
          </div>
        </div>
      </Card>
      
      <!-- Porters Section -->
      <Card class="staff-card">
        <template #header>
          <div class="flex-between">
            <div class="flex-start">
              <h2 class="card-title">Porters</h2>
              <Badge variant="secondary" class="ml-3">
                {{ porters.length }}
              </Badge>
            </div>
            <Button 
              variant="secondary" 
              size="sm"
              iconLeft="+"
              @click="addStaff('porter')"
              title="Add porter"
            />
          </div>
        </template>
        
        <div class="inset-content">
          <!-- Porter Items -->
          <div v-if="porters.length">
            <ListItem
              v-for="porter in porters"
              :key="porter.id"
              :model-value="porter.name"
              :editable="true"
              :deletable="true"
              placeholder="Porter name"
              @update:model-value="updateStaffName(porter.id, $event)"
              @delete="confirmDeleteStaff(porter)"
            />
          </div>
          
          <!-- Empty Porters State -->
          <div v-else class="empty-state py-4">
            <p class="text-gray-600 mb-2">No porters added yet</p>
          </div>
        </div>
      </Card>
    </div>
    
    <!-- Delete Confirmation Dialog -->
    <DialogConfirm
      v-model="deleteDialogVisible"
      title="Confirm Deletion"
      message="Are you sure you want to delete this staff member? This action cannot be undone."
      cancelText="Cancel"
      confirmText="Delete"
      confirmVariant="error"
      @confirm="confirmDelete"
      @cancel="deleteDialogVisible = false"
    />
    
    <!-- New Staff Dialog -->
    <DialogConfirm
      v-model="staffDialogVisible"
      :title="`Add ${newStaff.type === 'supervisor' ? 'Supervisor' : 'Porter'}`"
      :showConfirmButton="!!newStaff.name.trim()"
      confirmText="Add"
      @confirm="saveNewStaff"
      @cancel="staffDialogVisible = false"
    >
      <div class="form-group">
        <label for="staff-name" class="form-label">
          {{ newStaff.type === 'supervisor' ? 'Supervisor Name' : 'Porter Name' }}
        </label>
        <input
          id="staff-name"
          v-model="newStaff.name"
          class="form-control"
          :placeholder="`Enter ${newStaff.type} name`"
          @keyup.enter="saveNewStaff"
        />
      </div>
    </DialogConfirm>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useStaffStore } from '../../stores/staff'
import Card from '../common/Card.vue'
import ListItem from '../common/ListItem.vue'
import Button from '../common/Button.vue'
import Badge from '../common/Badge.vue'
import DialogConfirm from '../common/DialogConfirm.vue'
import LoadingIndicator from '../common/LoadingIndicator.vue'

// Store
const staffStore = useStaffStore()

// Computed properties
const supervisors = computed(() => staffStore.getSupervisors)
const porters = computed(() => staffStore.getPorters)

// State for dialogs and editing
const deleteDialogVisible = ref(false)
const staffDialogVisible = ref(false)
const itemToDelete = ref(null)
const newStaff = ref({ name: '', type: 'supervisor' })

// Fetch data
onMounted(async () => {
  await staffStore.fetchStaff()
})

// Staff operations
const addStaff = (type) => {
  newStaff.value = { name: '', type }
  staffDialogVisible.value = true
}

const saveNewStaff = async () => {
  if (newStaff.value.name.trim()) {
    try {
      await staffStore.createStaff(newStaff.value)
      staffDialogVisible.value = false
    } catch (error) {
      console.error('Error creating staff member:', error)
    }
  }
}

const updateStaffName = async (id, newName) => {
  try {
    await staffStore.updateStaff({ id, name: newName })
  } catch (error) {
    console.error('Error updating staff member:', error)
  }
}

const confirmDeleteStaff = (staff) => {
  itemToDelete.value = staff
  deleteDialogVisible.value = true
}

const confirmDelete = async () => {
  try {
    await staffStore.deleteStaff(itemToDelete.value.id)
    deleteDialogVisible.value = false
  } catch (error) {
    console.error('Error deleting staff member:', error)
  }
}
</script>

<style lang="scss" scoped>
.staff-tab {
  max-width: 800px;
  margin: 0 auto;
  padding: $spacing-4;
}

.staff-lists {
  display: flex;
  flex-direction: column;
  gap: $spacing-6;
}

.staff-card {
  background-color: $color-white;
}

.inset-content {
  padding: $spacing-2;
  background-color: $color-gray-100;
  border-radius: $border-radius;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  
  .empty-state-icon {
    font-size: 2.5rem;
    margin-bottom: $spacing-4;
    color: $color-gray-400;
  }
  
  .empty-state-title {
    font-size: $font-size-xl;
    font-weight: $font-weight-medium;
    margin-bottom: $spacing-2;
  }
}

.button-group {
  display: flex;
  gap: $spacing-3;
  justify-content: center;
}

.ml-3 {
  margin-left: $spacing-3;
}

@include responsive(sm) {
  .staff-tab {
    padding: $spacing-3;
  }
  
  .button-group {
    flex-direction: column;
    gap: $spacing-2;
  }
}
</style>
