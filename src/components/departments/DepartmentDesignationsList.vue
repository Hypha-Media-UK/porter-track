<template>
  <div class="designations-list">
    <IOSCard>
      <div class="ios-card-header">
        <h2 class="text-h6 font-weight-medium">Department Designations</h2>
        <AddButton
          color="primary"
          @click="openAddDesignationDialog"
        />
      </div>
      
      <div class="inset-content">
        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-4">
          <LoadingIndicator />
        </div>
        
        <!-- Empty State -->
        <div v-else-if="!designations.length" class="text-center py-4">
          <EmptyState
            icon="mdi-tag-outline"
            title="No Designations"
            message="Department designations help classify porter assignments"
          >
            <IOSButton
              color="primary"
              prependIcon="mdi-plus"
              @click="openAddDesignationDialog"
            >
              Add Designation
            </IOSButton>
          </EmptyState>
        </div>
        
        <!-- Designations List -->
        <div v-else>
          <IOSListItem
            v-for="designation in designations"
            :key="designation.id"
            :model-value="designation.name"
            :editable="true"
            :deletable="true"
            placeholder="Designation name"
            @update:model-value="updateDesignation(designation.id, $event)"
            @delete="confirmDeleteDesignation(designation)"
          />
        </div>
      </div>
    </IOSCard>
    
    <!-- Add/Edit Dialog -->
    <v-dialog v-model="designationDialogVisible" max-width="500" persistent>
      <v-card class="ios-dialog">
        <v-card-title class="text-h5">
          {{ isEditMode ? 'Edit Designation' : 'Add Designation' }}
        </v-card-title>
        <v-card-text>
          <DepartmentDesignationForm
            :designation="currentDesignation"
            :is-edit="isEditMode"
            @submit="saveDesignation"
            @cancel="designationDialogVisible = false"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
    
    <!-- Delete Confirmation Dialog -->
    <DialogConfirm
      v-model="deleteDialogVisible"
      title="Confirm Deletion"
      message="Are you sure you want to delete this department designation? This action cannot be undone."
      cancel-text="Cancel"
      confirm-text="Delete"
      confirm-color="error"
      @confirm="deleteDesignation"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDepartmentDesignationsStore } from '../../stores/departmentDesignations'
import IOSCard from '../common/IOSCard.vue'
import IOSListItem from '../common/IOSListItem.vue'
import IOSButton from '../common/IOSButton.vue'
import AddButton from '../common/AddButton.vue'
import LoadingIndicator from '../common/LoadingIndicator.vue'
import EmptyState from '../common/EmptyState.vue'
import DialogConfirm from '../common/DialogConfirm.vue'
import DepartmentDesignationForm from './DepartmentDesignationForm.vue'

// Store
const designationsStore = useDepartmentDesignationsStore()

// Computed properties
const designations = computed(() => designationsStore.designations)
const isLoading = computed(() => designationsStore.isLoading)

// State for dialogs and editing
const designationDialogVisible = ref(false)
const deleteDialogVisible = ref(false)
const currentDesignation = ref(null)
const designationToDelete = ref(null)
const isEditMode = computed(() => !!currentDesignation.value?.id)

// Fetch data
onMounted(async () => {
  await designationsStore.fetchDesignations()
})

// Open add designation dialog
const openAddDesignationDialog = () => {
  currentDesignation.value = { name: '' }
  designationDialogVisible.value = true
}

// Open edit designation dialog
const openEditDesignationDialog = (designation) => {
  currentDesignation.value = { ...designation }
  designationDialogVisible.value = true
}

// Save designation (create or update)
const saveDesignation = async (designation) => {
  try {
    if (designation.id) {
      await designationsStore.updateDesignation(designation)
    } else {
      await designationsStore.createDesignation(designation)
    }
    designationDialogVisible.value = false
  } catch (error) {
    console.error('Error saving designation:', error)
  }
}

// Update designation name (inline)
const updateDesignation = async (id, newName) => {
  try {
    await designationsStore.updateDesignation({ id, name: newName })
  } catch (error) {
    console.error('Error updating designation:', error)
  }
}

// Confirm delete designation
const confirmDeleteDesignation = (designation) => {
  designationToDelete.value = designation
  deleteDialogVisible.value = true
}

// Delete designation
const deleteDesignation = async () => {
  try {
    await designationsStore.deleteDesignation(designationToDelete.value.id)
    deleteDialogVisible.value = false
  } catch (error) {
    console.error('Error deleting designation:', error)
  }
}
</script>

<style scoped>
.designations-list {
  margin-bottom: 24px;
}
</style>
