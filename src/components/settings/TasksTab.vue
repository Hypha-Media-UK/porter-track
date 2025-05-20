<template>
  <section>
    <!-- Header with Action Button -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h2 class="text-h5 font-weight-medium">Tasks Management</h2>
        <p class="text-body-1 text-medium-emphasis">Manage tasks and task items</p>
      </div>
      <v-btn color="primary" prepend-icon="mdi-plus" @click="openTaskDialog()">
        Add Task
      </v-btn>
    </div>

    <!-- Loading State -->
    <LoadingIndicator :show="tasksStore.isLoading" message="Loading tasks..." />

    <!-- Empty State -->
    <EmptyState
      v-if="!tasksStore.isLoading && !tasksStore.tasks.length"
      icon="mdi-clipboard-text-outline"
      message="No tasks found. Add your first task to get started."
      actionText="Add Task"
      actionIcon="mdi-plus"
      @action="openTaskDialog()"
    />

    <!-- Tasks List -->
    <v-expansion-panels
      v-else-if="!tasksStore.isLoading"
      multiple
      variant="accordion"
    >
      <v-expansion-panel
        v-for="task in tasksStore.tasks"
        :key="task.id"
        class="mb-4"
      >
        <v-expansion-panel-title>
          <div class="d-flex align-center">
            <v-icon class="mr-2" icon="mdi-clipboard-text-outline"></v-icon>
            <span>{{ task.name }}</span>
          </div>
        </v-expansion-panel-title>
        
        <v-expansion-panel-text>
          <!-- Task Details -->
          <div class="mb-4">
            <p v-if="task.description">{{ task.description }}</p>
            <p v-if="task.estimated_duration" class="d-flex align-center">
              <v-icon small class="mr-1">mdi-clock-outline</v-icon>
              Estimated time: {{ task.estimated_duration }} minutes
            </p>
          </div>
          
          <!-- Task Actions -->
          <div class="d-flex mb-4 justify-end">
            <v-btn
              variant="text"
              color="primary"
              class="mr-2"
              prepend-icon="mdi-pencil-outline"
              @click.stop="openTaskDialog(task)"
            >
              Edit
            </v-btn>
            <v-btn
              variant="text"
              color="error"
              class="mr-2"
              prepend-icon="mdi-delete-outline"
              @click.stop="confirmDeleteTask(task)"
            >
              Delete
            </v-btn>
            <v-btn
              variant="text"
              color="primary"
              class="mr-2"
              prepend-icon="mdi-plus"
              @click.stop="openTaskItemDialog(task)"
            >
              Add Task Item
            </v-btn>
            <v-btn
              variant="text"
              color="secondary"
              prepend-icon="mdi-office-building-outline"
              @click.stop="openDepartmentAssociationDialog(task)"
            >
              Assign Departments
            </v-btn>
          </div>
          
          <!-- Task Items Section -->
          <div class="task-section mb-4">
            <h3 class="text-h6 mb-3">Task Items</h3>
            
            <v-list v-if="task.taskItems && task.taskItems.length">
              <v-list-item
                v-for="item in task.taskItems"
                :key="item.id"
                class="mb-2 rounded-lg"
              >
                <template v-slot:prepend>
                  <v-icon icon="mdi-checkbox-marked-circle-outline"></v-icon>
                </template>
                
                <v-list-item-title>{{ item.name }}</v-list-item-title>
                <v-list-item-subtitle v-if="item.description">
                  {{ item.description }}
                </v-list-item-subtitle>
                
                <template v-slot:append>
                  <v-btn icon="mdi-pencil-outline" variant="text" size="small" @click.stop="openTaskItemDialog(task, item)"></v-btn>
                  <v-btn icon="mdi-delete-outline" variant="text" size="small" color="error" @click.stop="confirmDeleteTaskItem(item)"></v-btn>
                </template>
              </v-list-item>
            </v-list>
            
            <!-- Empty Task Items State -->
            <EmptyState
              v-else
              icon="mdi-checkbox-marked-circle-outline"
              message="No task items for this task. Add your first task item."
              actionText="Add Task Item"
              actionIcon="mdi-plus"
              @action="openTaskItemDialog(task)"
            />
          </div>
          
          <!-- Department Associations Section -->
          <div class="task-section">
            <h3 class="text-h6 mb-3">Assigned Departments</h3>
            
            <v-list v-if="task.departments && task.departments.length">
              <v-list-item
                v-for="dept in task.departments"
                :key="dept.id"
                class="mb-2 rounded-lg"
              >
                <template v-slot:prepend>
                  <v-icon icon="mdi-office-building-outline"></v-icon>
                </template>
                
                <v-list-item-title>{{ dept.name }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ getBuildingName(dept.building_id) }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
            
            <!-- Empty Departments State -->
            <EmptyState
              v-else
              icon="mdi-office-building-outline"
              message="This task is not assigned to any departments."
              actionText="Assign Departments"
              actionIcon="mdi-office-building-outline"
              @action="openDepartmentAssociationDialog(task)"
            />
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <!-- Task Dialog -->
    <v-dialog v-model="taskDialogVisible" max-width="500">
      <TaskForm
        :task="currentTask"
        :isEdit="editMode"
        @save="saveTask"
        @cancel="taskDialogVisible = false"
      />
    </v-dialog>
    
    <!-- Task Item Dialog -->
    <v-dialog v-model="taskItemDialogVisible" max-width="500">
      <TaskItemForm
        :taskItem="currentTaskItem"
        :taskId="currentTask?.id"
        :orderIndex="currentTask?.taskItems?.length || 0"
        :isEdit="editMode"
        @save="saveTaskItem"
        @cancel="taskItemDialogVisible = false"
      />
    </v-dialog>
    
    <!-- Department Association Dialog -->
    <v-dialog v-model="departmentAssociationDialogVisible" max-width="600">
      <DepartmentAssociationForm
        :taskId="currentTask?.id"
        :taskName="currentTask?.name"
        :buildings="buildingsStore.buildings"
        :selectedDepartments="selectedDepartments"
        @save="saveDepartmentAssociations"
        @cancel="departmentAssociationDialogVisible = false"
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
import { useTasksStore } from '../../stores/tasks'
import { useBuildingsStore } from '../../stores/buildings'
import TaskForm from '../tasks/TaskForm.vue'
import TaskItemForm from '../task-items/TaskItemForm.vue'
import DepartmentAssociationForm from '../tasks/DepartmentAssociationForm.vue'
import DialogConfirm from '../common/DialogConfirm.vue'
import LoadingIndicator from '../common/LoadingIndicator.vue'
import EmptyState from '../common/EmptyState.vue'

// Stores
const tasksStore = useTasksStore()
const buildingsStore = useBuildingsStore()

// Local state
const taskDialogVisible = ref(false)
const taskItemDialogVisible = ref(false)
const deleteDialogVisible = ref(false)
const departmentAssociationDialogVisible = ref(false)
const editMode = ref(false)
const deleteType = ref('item')
const currentTask = ref(null)
const currentTaskItem = ref(null)
const itemToDelete = ref(null)
const selectedDepartments = ref([])

// Fetch data
Promise.all([tasksStore.fetchTasks(), buildingsStore.fetchBuildings()])

// Helper function to get building name
const getBuildingName = (buildingId) => {
  const building = buildingsStore.getBuildingById(buildingId)
  return building ? building.name : 'Unknown Building'
}

// Task dialog operations
const openTaskDialog = (task = null) => {
  if (task) {
    editMode.value = true
    currentTask.value = { ...task }
  } else {
    editMode.value = false
    currentTask.value = { 
      name: '',
      description: '',
      estimated_duration: null
    }
  }
  taskDialogVisible.value = true
}

const saveTask = async (task) => {
  try {
    if (editMode.value) {
      await tasksStore.updateTask(task)
    } else {
      await tasksStore.createTask(task)
    }
    taskDialogVisible.value = false
  } catch (error) {
    console.error('Error saving task:', error)
  }
}

const confirmDeleteTask = (task) => {
  deleteType.value = 'task'
  itemToDelete.value = task
  deleteDialogVisible.value = true
}

// Task Item dialog operations
const openTaskItemDialog = (task, taskItem = null) => {
  currentTask.value = task
  
  if (taskItem) {
    editMode.value = true
    currentTaskItem.value = { ...taskItem }
  } else {
    editMode.value = false
    currentTaskItem.value = { 
      name: '',
      description: '',
      task_id: task.id,
      order_index: task.taskItems ? task.taskItems.length : 0
    }
  }
  
  taskItemDialogVisible.value = true
}

const saveTaskItem = async (taskItem) => {
  try {
    if (editMode.value) {
      await tasksStore.updateTaskItem(taskItem)
    } else {
      await tasksStore.createTaskItem(taskItem)
    }
    taskItemDialogVisible.value = false
  } catch (error) {
    console.error('Error saving task item:', error)
  }
}

const confirmDeleteTaskItem = (taskItem) => {
  deleteType.value = 'task item'
  itemToDelete.value = taskItem
  deleteDialogVisible.value = true
}

// Department association operations
const openDepartmentAssociationDialog = (task) => {
  currentTask.value = task
  
  // Reset and pre-select already associated departments
  selectedDepartments.value = task.departments 
    ? task.departments.map(dept => dept.id) 
    : []
    
  departmentAssociationDialogVisible.value = true
}

const saveDepartmentAssociations = async (data) => {
  try {
    await tasksStore.updateTaskDepartments(data.taskId, data.departmentIds)
    departmentAssociationDialogVisible.value = false
  } catch (error) {
    console.error('Error saving department associations:', error)
  }
}

// Common delete operation
const confirmDelete = async () => {
  try {
    if (deleteType.value === 'task') {
      await tasksStore.deleteTask(itemToDelete.value.id)
    } else if (deleteType.value === 'task item') {
      await tasksStore.deleteTaskItem(itemToDelete.value.id)
    }
  } catch (error) {
    console.error(`Error deleting ${deleteType.value}:`, error)
  }
}
</script>

<style scoped>
.task-section {
  border-top: 1px solid rgba(0, 0, 0, 0.12);
  padding-top: 16px;
}
</style>
