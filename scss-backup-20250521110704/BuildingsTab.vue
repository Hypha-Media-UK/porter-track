<template>
  <section class="buildings-tab">
    <!-- Actions -->
    <div class="flex-end mb-4">
      <Button 
        variant="primary" 
        iconLeft="+"
        @click="addBuilding"
        title="Add new building"
      >
        Add Building
      </Button>
    </div>
    
    <!-- Loading Indicator -->
    <div v-if="buildingsStore.isLoading" class="text-center py-6">
      <LoadingIndicator label="Loading buildings..." />
    </div>
    
    <!-- Empty State -->
    <Card v-else-if="!buildingsStore.buildings.length">
      <div class="empty-state py-8">
        <span class="icon empty-state-icon">🏢</span>
        <h3 class="empty-state-title mb-2">No buildings yet</h3>
        <p class="mb-4">Add your first building to get started</p>
        <Button variant="primary" iconLeft="+" @click="addBuilding">
          Add Building
        </Button>
      </div>
    </Card>
    
    <!-- Buildings List -->
    <div v-else class="buildings-list">
      <Card 
        v-for="building in buildingsStore.buildings" 
        :key="building.id"
        class="building-card"
      >
        <!-- Building Header -->
        <template #header>
          <ListItem
            :model-value="building.name"
            :editable="true"
            :deletable="true"
            placeholder="Building name"
            @update:model-value="updateBuildingName(building.id, $event)"
            @delete="confirmDeleteBuilding(building)"
          />
        </template>
        
        <!-- Departments List -->
        <div class="inset-content">
          <!-- Department Items -->
          <div v-if="building.departments && building.departments.length">
            <ListItem
              v-for="dept in building.departments"
              :key="dept.id"
              :model-value="dept.name"
              :editable="true"
              :deletable="true"
              placeholder="Department name"
              @update:model-value="updateDepartmentName(dept.id, $event)"
              @delete="confirmDeleteDepartment(dept)"
            />
          </div>
          
          <!-- Empty Department State -->
          <div v-else class="empty-state py-4">
            <p class="text-gray-600 mb-2">No departments in this building</p>
          </div>
          
          <!-- Add Department Button -->
          <div class="px-4 pb-3 pt-2 d-flex justify-center">
            <Button
              variant="secondary"
              size="sm"
              iconLeft="+"
              @click="addDepartment(building)"
            >
              Add Department
            </Button>
          </div>
        </div>
      </Card>
    </div>
    
    <!-- Delete Confirmation Dialog -->
    <DialogConfirm
      v-model="deleteDialogVisible"
      title="Confirm Deletion"
      :message="`Are you sure you want to delete this ${deleteType}? This action cannot be undone.`"
      cancelText="Cancel"
      confirmText="Delete"
      confirmVariant="error"
      @confirm="confirmDelete"
      @cancel="deleteDialogVisible = false"
    />
    
    <!-- New Building Dialog -->
    <DialogConfirm
      v-model="buildingDialogVisible"
      title="Add Building"
      :showConfirmButton="!!newBuilding.name.trim()"
      confirmText="Add"
      @confirm="saveNewBuilding"
      @cancel="buildingDialogVisible = false"
    >
      <div class="form-group">
        <label for="building-name" class="form-label">Building Name</label>
        <input
          id="building-name"
          v-model="newBuilding.name"
          class="form-control"
          placeholder="Enter building name"
          @keyup.enter="saveNewBuilding"
        />
      </div>
    </DialogConfirm>
    
    <!-- New Department Dialog -->
    <DialogConfirm
      v-model="departmentDialogVisible"
      title="Add Department"
      :showConfirmButton="!!newDepartment.name.trim()"
      confirmText="Add"
      @confirm="saveNewDepartment"
      @cancel="departmentDialogVisible = false"
    >
      <div class="form-group">
        <label for="department-name" class="form-label">Department Name</label>
        <input
          id="department-name"
          v-model="newDepartment.name"
          class="form-control"
          placeholder="Enter department name"
          @keyup.enter="saveNewDepartment"
        />
      </div>
    </DialogConfirm>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useBuildingsStore } from '../../stores/buildings'
import Card from '../common/Card.vue'
import ListItem from '../common/ListItem.vue'
import Button from '../common/Button.vue'
import DialogConfirm from '../common/DialogConfirm.vue'
import LoadingIndicator from '../common/LoadingIndicator.vue'

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

<style lang="scss" scoped>
.buildings-tab {
  max-width: 800px;
  margin: 0 auto;
  padding: $spacing-4;
}

.buildings-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-4;
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

.justify-center {
  display: flex;
  justify-content: center;
}

@include responsive(sm) {
  .buildings-tab {
    padding: $spacing-3;
  }
}
</style>
