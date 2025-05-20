<template>
  <section>
    <!-- Header with Action Button -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h2 class="text-h5 font-weight-medium">Buildings and Departments</h2>
        <p class="text-body-1 text-medium-emphasis">Manage hospital buildings and departments</p>
      </div>
      <v-btn color="primary" prepend-icon="mdi-plus" @click="openBuildingDialog()">
        Add Building
      </v-btn>
    </div>

    <!-- Loading State -->
    <LoadingIndicator :show="buildingsStore.isLoading" message="Loading buildings..." />

    <!-- Empty State -->
    <EmptyState
      v-if="!buildingsStore.isLoading && !buildingsStore.buildings.length"
      icon="mdi-office-building-outline"
      message="No buildings found. Add your first building to get started."
      actionText="Add Building"
      actionIcon="mdi-plus"
      @action="openBuildingDialog()"
    />

    <!-- Buildings List -->
    <v-expansion-panels
      v-else-if="!buildingsStore.isLoading"
      multiple
      variant="accordion"
    >
      <v-expansion-panel
        v-for="building in buildingsStore.buildings"
        :key="building.id"
        class="mb-4"
      >
        <v-expansion-panel-title>
          <div class="d-flex align-center">
            <v-icon class="mr-2" icon="mdi-office-building-outline"></v-icon>
            <span>{{ building.name }}</span>
          </div>
        </v-expansion-panel-title>
        
        <v-expansion-panel-text>
          <!-- Building Actions -->
          <div class="d-flex mb-4 justify-end">
            <v-btn
              variant="text"
              color="primary"
              class="mr-2"
              prepend-icon="mdi-pencil-outline"
              @click.stop="openBuildingDialog(building)"
            >
              Edit
            </v-btn>
            <v-btn
              variant="text"
              color="error"
              class="mr-2"
              prepend-icon="mdi-delete-outline"
              @click.stop="confirmDeleteBuilding(building)"
            >
              Delete
            </v-btn>
            <v-btn
              variant="text"
              color="primary"
              prepend-icon="mdi-plus"
              @click.stop="openDepartmentDialog(building)"
            >
              Add Department
            </v-btn>
          </div>
          
          <!-- Departments List -->
          <h3 class="text-h6 mb-3">Departments</h3>
          
          <v-list v-if="building.departments && building.departments.length">
            <v-list-item
              v-for="dept in building.departments"
              :key="dept.id"
              class="mb-2 rounded-lg"
            >
              <template v-slot:prepend>
                <v-icon icon="mdi-door-outline"></v-icon>
              </template>
              
              <v-list-item-title>{{ dept.name }}</v-list-item-title>
              <v-list-item-subtitle v-if="dept.floor">Floor: {{ dept.floor }}</v-list-item-subtitle>
              
              <template v-slot:append>
                <v-btn icon="mdi-pencil-outline" variant="text" size="small" @click.stop="openDepartmentDialog(building, dept)"></v-btn>
                <v-btn icon="mdi-delete-outline" variant="text" size="small" color="error" @click.stop="confirmDeleteDepartment(dept)"></v-btn>
              </template>
            </v-list-item>
          </v-list>
          
          <!-- Empty Department State -->
          <EmptyState
            v-else
            icon="mdi-door-outline"
            message="No departments in this building. Add your first department."
            actionText="Add Department"
            actionIcon="mdi-plus"
            @action="openDepartmentDialog(building)"
          />
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <!-- Building Dialog -->
    <v-dialog v-model="buildingDialogVisible" max-width="500">
      <BuildingForm
        :building="currentBuilding"
        :isEdit="editMode"
        @save="saveBuilding"
        @cancel="buildingDialogVisible = false"
      />
    </v-dialog>
    
    <!-- Department Dialog -->
    <v-dialog v-model="departmentDialogVisible" max-width="500">
      <DepartmentForm
        :department="currentDepartment"
        :buildingId="currentBuilding?.id"
        :isEdit="editMode"
        @save="saveDepartment"
        @cancel="departmentDialogVisible = false"
      />
    </v-dialog>
    
    <!-- Delete Confirmation Dialog -->
    <DialogConfirm
      v-model="deleteDialogVisible"
      :title="`Confirm Deletion`"
      :message="`Are you sure you want to delete this ${deleteType}? This action cannot be undone.`"
      confirm-text="Delete"
      confirm-color="error"
      @confirm="confirmDelete"
    />
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useBuildingsStore } from '../../stores/buildings'
import BuildingForm from '../buildings/BuildingForm.vue'
import DepartmentForm from '../departments/DepartmentForm.vue'
import DialogConfirm from '../common/DialogConfirm.vue'
import LoadingIndicator from '../common/LoadingIndicator.vue'
import EmptyState from '../common/EmptyState.vue'

// Store
const buildingsStore = useBuildingsStore()

// Local state
const buildingDialogVisible = ref(false)
const departmentDialogVisible = ref(false)
const deleteDialogVisible = ref(false)
const editMode = ref(false)
const deleteType = ref('item')
const currentBuilding = ref(null)
const currentDepartment = ref(null)
const itemToDelete = ref(null)

// Fetch data
buildingsStore.fetchBuildings()

// Building dialog operations
const openBuildingDialog = (building = null) => {
  if (building) {
    editMode.value = true
    currentBuilding.value = { ...building }
  } else {
    editMode.value = false
    currentBuilding.value = { name: '' }
  }
  buildingDialogVisible.value = true
}

const saveBuilding = async (building) => {
  try {
    if (editMode.value) {
      await buildingsStore.updateBuilding(building)
    } else {
      await buildingsStore.createBuilding(building)
    }
    buildingDialogVisible.value = false
  } catch (error) {
    console.error('Error saving building:', error)
  }
}

const confirmDeleteBuilding = (building) => {
  deleteType.value = 'building'
  itemToDelete.value = building
  deleteDialogVisible.value = true
}

// Department dialog operations
const openDepartmentDialog = (building, department = null) => {
  currentBuilding.value = building
  
  if (department) {
    editMode.value = true
    currentDepartment.value = { ...department }
  } else {
    editMode.value = false
    currentDepartment.value = { 
      name: '',
      floor: '',
      building_id: building.id
    }
  }
  
  departmentDialogVisible.value = true
}

const saveDepartment = async (department) => {
  try {
    if (editMode.value) {
      await buildingsStore.updateDepartment(department)
    } else {
      await buildingsStore.createDepartment(department)
    }
    departmentDialogVisible.value = false
  } catch (error) {
    console.error('Error saving department:', error)
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
  } catch (error) {
    console.error(`Error deleting ${deleteType.value}:`, error)
  }
}
</script>
