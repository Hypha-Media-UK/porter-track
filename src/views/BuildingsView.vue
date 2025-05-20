<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex">
            <span class="text-h5">Buildings and Departments</span>
            <v-spacer></v-spacer>
            <v-btn color="primary" prepend-icon="mdi-plus" @click="openBuildingDialog()">
              Add Building
            </v-btn>
          </v-card-title>
          
          <v-card-text>
            <p class="text-subtitle-1 mb-4">Manage buildings and departments</p>
            
            <!-- Loading indicator -->
            <LoadingIndicator 
              :show="buildingsStore.isLoading" 
              message="Loading buildings..."
            />
            
            <!-- Empty state -->
            <EmptyState
              v-if="!buildingsStore.isLoading && !buildingsStore.buildings.length"
              icon="mdi-office-building"
              message="No buildings found. Add your first building to get started."
              actionText="Add Building"
              actionIcon="mdi-plus"
              @action="openBuildingDialog()"
            />
            
            <!-- Buildings list -->
            <v-expansion-panels v-else-if="!buildingsStore.isLoading && buildingsStore.buildings.length">
              <v-expansion-panel v-for="building in buildingsStore.buildings" :key="building.id">
                <v-expansion-panel-title>
                  <div class="d-flex align-center">
                    <v-icon class="mr-2">mdi-office-building</v-icon>
                    {{ building.name }}
                  </div>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <div class="d-flex mb-2">
                    <v-spacer></v-spacer>
                    <v-btn
                      density="comfortable"
                      variant="text"
                      prepend-icon="mdi-pencil"
                      @click.stop="openBuildingDialog(building)"
                    >
                      Edit
                    </v-btn>
                    <v-btn 
                      density="comfortable"
                      variant="text"
                      color="error" 
                      prepend-icon="mdi-delete" 
                      @click.stop="confirmDeleteBuilding(building)"
                    >
                      Delete
                    </v-btn>
                    <v-btn
                      density="comfortable"
                      variant="text"
                      color="primary"
                      prepend-icon="mdi-plus"
                      @click.stop="openDepartmentDialog(building)"
                    >
                      Add Department
                    </v-btn>
                  </div>
                  
                  <!-- Departments list -->
                  <v-list v-if="building.departments && building.departments.length">
                    <v-list-item v-for="dept in building.departments" :key="dept.id">
                      <template v-slot:prepend>
                        <v-icon>mdi-door</v-icon>
                      </template>
                      <v-list-item-title>{{ dept.name }}</v-list-item-title>
                      <v-list-item-subtitle v-if="dept.floor">Floor: {{ dept.floor }}</v-list-item-subtitle>
                      <template v-slot:append>
                        <v-btn icon="mdi-pencil" variant="text" size="small" @click.stop="openDepartmentDialog(building, dept)"></v-btn>
                        <v-btn icon="mdi-delete" variant="text" size="small" color="error" @click.stop="confirmDeleteDepartment(dept)"></v-btn>
                      </template>
                    </v-list-item>
                  </v-list>
                  
                  <!-- Empty departments state -->
                  <EmptyState
                    v-else
                    icon="mdi-door"
                    message="No departments in this building. Add your first department."
                    actionText="Add Department"
                    actionIcon="mdi-plus"
                    @action="openDepartmentDialog(building)"
                  />
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    
    <!-- Building dialog -->
    <v-dialog v-model="buildingDialogVisible" max-width="500">
      <BuildingForm
        :building="currentBuilding"
        :isEdit="editMode"
        @save="saveBuilding"
        @cancel="buildingDialogVisible = false"
      />
    </v-dialog>
    
    <!-- Department dialog -->
    <v-dialog v-model="departmentDialogVisible" max-width="500">
      <DepartmentForm
        :department="currentDepartment"
        :buildingId="currentBuilding?.id"
        :isEdit="editMode"
        @save="saveDepartment"
        @cancel="departmentDialogVisible = false"
      />
    </v-dialog>
    
    <!-- Delete confirmation dialog -->
    <DialogConfirm
      v-model="deleteDialogVisible"
      :title="`Confirm Deletion`"
      :message="`Are you sure you want to delete this ${deleteType}? This action cannot be undone.`"
      confirm-text="Delete"
      confirm-color="error"
      @confirm="confirmDelete"
    />
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useBuildingsStore } from '../stores/buildings'
import BuildingForm from '../components/buildings/BuildingForm.vue'
import DepartmentForm from '../components/departments/DepartmentForm.vue'
import DialogConfirm from '../components/common/DialogConfirm.vue'
import LoadingIndicator from '../components/common/LoadingIndicator.vue'
import EmptyState from '../components/common/EmptyState.vue'

// State
const buildingsStore = useBuildingsStore()
const buildingDialogVisible = ref(false)
const departmentDialogVisible = ref(false)
const deleteDialogVisible = ref(false)
const editMode = ref(false)
const deleteType = ref('item')
const currentBuilding = ref(null)
const currentDepartment = ref(null)
const itemToDelete = ref(null)

// Fetch buildings and departments
onMounted(async () => {
  await buildingsStore.fetchBuildings()
})

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
    // Could add error handling UI here
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
    // Could add error handling UI here
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
    // Could add error handling UI here
  }
}
</script>
