<template>
  <section class="staff-tab">
    <!-- Actions -->
    <div class="d-flex justify-end mb-4"></div>
    
    <!-- Loading Indicator -->
    <div v-if="staffStore.isLoading" class="text-center py-6">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
      <p class="mt-2 text-medium-emphasis">Loading staff...</p>
    </div>
    
    <!-- Empty State (when no staff at all) -->
    <IOSCard v-else-if="!staffStore.staff.length">
      <div class="text-center py-8">
        <v-icon icon="mdi-account-group" size="x-large" color="secondary" class="mb-4"></v-icon>
        <h3 class="text-h5 mb-2">No staff yet</h3>
        <p class="mb-4">Add your first staff member to get started</p>
        <div class="d-flex justify-center gap-2">
          <IOSButton color="primary" prependIcon="mdi-plus" @click="addStaff('supervisor')">
            Add Supervisor
          </IOSButton>
          <IOSButton color="secondary" prependIcon="mdi-plus" @click="addStaff('porter')">
            Add Porter
          </IOSButton>
        </div>
      </div>
    </IOSCard>
    
    <!-- Staff Lists -->
    <div v-else class="staff-lists">
      <!-- Supervisors Section -->
      <IOSCard class="staff-card">
        <div class="ios-card-header">
          <div class="d-flex justify-space-between align-center pa-4">
            <div class="d-flex align-center">
              <h2 class="text-h5 font-weight-medium">Supervisors</h2>
              <v-badge
                :content="supervisors.length"
                color="primary"
                class="ml-3"
              ></v-badge>
            </div>
            <IOSButton 
              color="primary" 
              prependIcon="mdi-plus"
              @click="addStaff('supervisor')"
            >
              Add
            </IOSButton>
          </div>
        </div>
        
        <div class="inset-content">
          <!-- Supervisor Items -->
          <div v-if="supervisors.length">
            <IOSListItem
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
          <div v-else class="text-center py-4">
            <p class="text-medium-emphasis mb-2">No supervisors added yet</p>
          </div>
        </div>
      </IOSCard>
      
      <!-- Porters Section -->
      <IOSCard class="staff-card">
        <div class="ios-card-header">
          <div class="d-flex justify-space-between align-center pa-4">
            <div class="d-flex align-center">
              <h2 class="text-h5 font-weight-medium">Porters</h2>
              <v-badge
                :content="porters.length"
                color="secondary"
                class="ml-3"
              ></v-badge>
            </div>
            <IOSButton 
              color="secondary" 
              prependIcon="mdi-plus"
              @click="addStaff('porter')"
            >
              Add
            </IOSButton>
          </div>
        </div>
        
        <div class="inset-content">
          <!-- Porter Items -->
          <div v-if="porters.length">
            <IOSListItem
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
          <div v-else class="text-center py-4">
            <p class="text-medium-emphasis mb-2">No porters added yet</p>
          </div>
        </div>
      </IOSCard>
    </div>
    
    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialogVisible" max-width="400" persistent>
      <v-card class="ios-dialog">
        <v-card-title class="text-h5">Confirm Deletion</v-card-title>
        <v-card-text>
          Are you sure you want to delete this staff member? This action cannot be undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <IOSButton
            color="secondary"
            variant="text"
            @click="deleteDialogVisible = false"
          >
            Cancel
          </IOSButton>
          <IOSButton
            color="error"
            @click="confirmDelete"
          >
            Delete
          </IOSButton>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <!-- New Staff Dialog -->
    <v-dialog v-model="staffDialogVisible" max-width="400" persistent>
      <v-card class="ios-dialog">
        <v-card-title class="text-h5">
          Add {{ newStaff.type === 'supervisor' ? 'Supervisor' : 'Porter' }}
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="newStaff.name"
            :label="newStaff.type === 'supervisor' ? 'Supervisor Name' : 'Porter Name'"
            variant="outlined"
            autofocus
            @keyup.enter="saveNewStaff"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <IOSButton
            color="secondary"
            variant="text"
            @click="staffDialogVisible = false"
          >
            Cancel
          </IOSButton>
          <IOSButton
            :color="newStaff.type === 'supervisor' ? 'primary' : 'secondary'"
            :disabled="!newStaff.name"
            @click="saveNewStaff"
          >
            Add
          </IOSButton>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useStaffStore } from '../../stores/staff'
import IOSCard from '../common/IOSCard.vue'
import IOSListItem from '../common/IOSListItem.vue'
import IOSButton from '../common/IOSButton.vue'

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

<style scoped>
.staff-tab {
  max-width: 800px;
  margin: 0 auto;
  padding: 16px;
}

.staff-tab__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.staff-lists {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.staff-card {
  background-color: white;
}

.ios-dialog {
  border-radius: 16px;
  overflow: hidden;
}

@media (prefers-color-scheme: dark) {
  .ios-dialog {
    background-color: #2C2C2E;
  }
  
  .staff-card {
    background-color: #1C1C1E;
  }
}

@media (max-width: 600px) {
  .staff-tab__header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .staff-tab__header > div:first-child {
    margin-bottom: 8px;
  }
}
</style>
