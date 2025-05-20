<template>
  <section class="buildings-tab">
    <!-- Header and Actions -->
    <div class="buildings-tab__header mb-4">
      <div>
        <h1 class="text-h4 font-weight-medium mb-1">Buildings</h1>
        <p class="text-body-1 text-medium-emphasis">Manage buildings and departments</p>
      </div>
      <IOSButton 
        color="primary" 
        prependIcon="mdi-plus"
        @click="addBuilding"
      >
        Add Building
      </IOSButton>
    </div>
    
    <!-- Loading Indicator -->
    <div v-if="buildingsStore.isLoading" class="text-center py-6">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
      <p class="mt-2 text-medium-emphasis">Loading buildings...</p>
    </div>
    
    <!-- Empty State -->
    <IOSCard v-else-if="!buildingsStore.buildings.length">
      <div class="text-center py-8">
        <v-icon icon="mdi-office-building-outline" size="x-large" color="secondary" class="mb-4"></v-icon>
        <h3 class="text-h5 mb-2">No buildings yet</h3>
        <p class="mb-4">Add your first building to get started</p>
        <IOSButton color="primary" prependIcon="mdi-plus" @click="addBuilding">
          Add Building
        </IOSButton>
      </div>
    </IOSCard>
    
    <!-- Buildings List -->
    <div v-else class="buildings-list">
      <IOSCard 
        v-for="building in buildingsStore.buildings" 
        :key="building.id"
        class="building-card"
      >
        <!-- Building Header -->
        <div class="ios-card-header">
          <IOSListItem
            :model-value="building.name"
            icon="mdi-office-building-outline"
            icon-color="primary"
            :editable="true"
            :deletable="true"
            placeholder="Building name"
            @update:model-value="updateBuildingName(building.id, $event)"
            @delete="confirmDeleteBuilding(building)"
          />
        </div>
        
        <!-- Departments List -->
        <div class="inset-content">
          <!-- Department Items -->
          <div v-if="building.departments && building.departments.length">
            <IOSListItem
              v-for="dept in building.departments"
              :key="dept.id"
              :model-value="dept.name"
              icon="mdi-door-outline"
              icon-color="secondary"
              :editable="true"
              :deletable="true"
              placeholder="Department name"
              @update:model-value="updateDepartmentName(dept.id, $event)"
              @delete="confirmDeleteDepartment(dept)"
            />
          </div>
          
          <!-- Empty Department State -->
          <div v-else class="text-center py-4">
            <p class="text-medium-emphasis mb-2">No departments in this building</p>
          </div>
          
          <!-- Add Department Button -->
          <div class="px-4 pb-3 pt-2 text-center">
            <IOSButton
              variant="text"
              size="small"
              prependIcon="mdi-plus"
              @click="addDepartment(building)"
            >
              Add Department
            </IOSButton>
          </div>
        </div>
      </IOSCard>
    </div>
    
    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialogVisible" max-width="400" persistent>
      <v-card class="ios-dialog">
        <v-card-title class="text-h5">Confirm Deletion</v-card-title>
        <v-card-text>
          Are you sure you want to delete this {{ deleteType }}? This action cannot be undone.
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
    
    <!-- New Building Dialog -->
    <v-dialog v-model="buildingDialogVisible" max-width="400" persistent>
      <v-card class="ios-dialog">
        <v-card-title class="text-h5">Add Building</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="newBuilding.name"
            label="Building Name"
            variant="outlined"
            autofocus
            @keyup.enter="saveNewBuilding"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <IOSButton
            color="secondary"
            variant="text"
            @click="buildingDialogVisible = false"
          >
            Cancel
          </IOSButton>
          <IOSButton
            color="primary"
            :disabled="!newBuilding.name"
            @click="saveNewBuilding"
          >
            Add
          </IOSButton>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <!-- New Department Dialog -->
    <v-dialog v-model="departmentDialogVisible" max-width="400" persistent>
      <v-card class="ios-dialog">
        <v-card-title class="text-h5">Add Department</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="newDepartment.name"
            label="Department Name"
            variant="outlined"
            autofocus
            @keyup.enter="saveNewDepartment"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <IOSButton
            color="secondary"
            variant="text"
            @click="departmentDialogVisible = false"
          >
            Cancel
          </IOSButton>
          <IOSButton
            color="primary"
            :disabled="!newDepartment.name"
            @click="saveNewDepartment"
          >
            Add
          </IOSButton>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useBuildingsStore } from '../../stores/buildings'
import IOSCard from '../common/IOSCard.vue'
import IOSListItem from '../common/IOSListItem.vue'
import IOSButton from '../common/IOSButton.vue'

// Store
const buildingsStore = useBuildingsStore()

// State for dialogs and editing
const deleteDialogVisible = ref(false)
const buildingDialogVisible = ref(false)
const departmentDialogVisible = ref(false)
const deleteType = ref('item')
const itemToDelete = ref(null)
const newBuilding = ref({ name: '' })
const newDepartment = ref({ name: '', building_id: null })
const currentBuilding = ref(null)

// Fetch data
onMounted(async () => {
  await buildingsStore.fetchBuildings()
})

// Building operations
const addBuilding = () => {
  newBuilding.value = { name: '' }
  buildingDialogVisible.value = true
}

const saveNewBuilding = async () => {
  if (newBuilding.value.name.trim()) {
    try {
      await buildingsStore.createBuilding(newBuilding.value)
      buildingDialogVisible.value = false
    } catch (error) {
      console.error('Error creating building:', error)
    }
  }
}

const updateBuildingName = async (id, newName) => {
  try {
    await buildingsStore.updateBuilding({ id, name: newName })
  } catch (error) {
    console.error('Error updating building:', error)
  }
}

const confirmDeleteBuilding = (building) => {
  deleteType.value = 'building'
  itemToDelete.value = building
  deleteDialogVisible.value = true
}

// Department operations
const addDepartment = (building) => {
  newDepartment.value = { 
    name: '',
    building_id: building.id
  }
  currentBuilding.value = building
  departmentDialogVisible.value = true
}

const saveNewDepartment = async () => {
  if (newDepartment.value.name.trim()) {
    try {
      await buildingsStore.createDepartment(newDepartment.value)
      departmentDialogVisible.value = false
    } catch (error) {
      console.error('Error creating department:', error)
    }
  }
}

const updateDepartmentName = async (id, newName) => {
  try {
    await buildingsStore.updateDepartment({ id, name: newName })
  } catch (error) {
    console.error('Error updating department:', error)
  }
}

const confirmDeleteDepartment = (department) => {
  deleteType.value = 'department'
  itemToDelete.value = department
  deleteDialogVisible.value = true
}

// Common delete operation
const confirmDelete = async () => {
  try {
    if (deleteType.value === 'building') {
      await buildingsStore.deleteBuilding(itemToDelete.value.id)
    } else if (deleteType.value === 'department') {
      await buildingsStore.deleteDepartment(itemToDelete.value.id)
    }
    deleteDialogVisible.value = false
  } catch (error) {
    console.error(`Error deleting ${deleteType.value}:`, error)
  }
}
</script>

<style scoped>
.buildings-tab {
  max-width: 800px;
  margin: 0 auto;
  padding: 16px;
}

.buildings-tab__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.buildings-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ios-dialog {
  border-radius: 16px;
  overflow: hidden;
}

@media (prefers-color-scheme: dark) {
  .ios-dialog {
    background-color: #2C2C2E;
  }
}

@media (max-width: 600px) {
  .buildings-tab__header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .buildings-tab__header > div:first-child {
    margin-bottom: 8px;
  }
}
</style>
