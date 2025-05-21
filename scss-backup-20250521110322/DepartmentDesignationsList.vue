<template>
  <div class="designations-list">
    <Card>
      <template #header>
        <div class="flex-between">
          <h2 class="card-title">Department Designations</h2>
          <Button
            variant="primary"
            iconLeft="+"
            @click="openAddDesignationDialog"
            title="Add new designation"
          />
        </div>
      </template>
      
      <div class="inset-content">
        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-4">
          <LoadingIndicator label="Loading designations..." />
        </div>
        
        <!-- Empty State -->
        <div v-else-if="!designations.length" class="empty-state py-4">
          <Icon name="department" type="md" size="24" class="empty-state-icon" />
          <h3 class="empty-state-title">No Designations</h3>
          <p class="text-gray-600 mb-3">Department designations help classify porter assignments</p>
          <Button
            variant="primary"
            iconLeft="+"
            @click="openAddDesignationDialog"
          >
            Add Designation
          </Button>
        </div>
        
        <!-- Designations List -->
        <div v-else>
          <ListItem
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
    </Card>
    
    <!-- Add/Edit Dialog -->
    <DialogConfirm
      v-if="currentDesignation"
      v-model="designationDialogVisible"
      :title="isEditMode ? 'Edit Designation' : 'Add Designation'"
      :showConfirmButton="!!currentDesignation.name"
      confirmText="Save"
      @confirm="saveDesignation(currentDesignation)"
      @cancel="designationDialogVisible = false"
    >
      <DepartmentDesignationForm
        :designation="currentDesignation"
        :is-edit="isEditMode"
        @update:designation="currentDesignation = $event"
      />
    </DialogConfirm>
    
    <!-- Delete Confirmation Dialog -->
    <DialogConfirm
      v-model="deleteDialogVisible"
      title="Confirm Deletion"
      message="Are you sure you want to delete this department designation? This action cannot be undone."
      cancelText="Cancel"
      confirmText="Delete"
      confirmVariant="error"
      @confirm="deleteDesignation"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDepartmentDesignationsStore } from '../../stores/departmentDesignations'
import Card from '../common/Card.vue'
import ListItem from '../common/ListItem.vue'
import Button from '../common/Button.vue'
import Icon from '../common/Icon.vue'
import LoadingIndicator from '../common/LoadingIndicator.vue'
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

<style lang="scss" scoped>
@use '../../scss/index' as s;

.designations-list {
  margin-bottom: s.$spacing-6;
}

.inset-content {
  padding: s.$spacing-2;
  background-color: s.$color-gray-100;
  border-radius: s.$border-radius;
}

.card-title {
  font-size: s.$font-size-lg;
  font-weight: s.$font-weight-medium;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  
  .empty-state-icon {
    font-size: 2rem;
    margin-bottom: s.$spacing-3;
    color: s.$color-gray-400;
  }
  
  .empty-state-title {
    font-size: s.$font-size-lg;
    font-weight: s.$font-weight-medium;
    margin-bottom: s.$spacing-2;
  }
}
</style>
