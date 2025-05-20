<template>
  <section class="tasks-tab">
    <!-- Header and Actions -->
    <div class="tasks-tab__header mb-4">
      <div>
        <h1 class="text-h4 font-weight-medium mb-1">Tasks</h1>
        <p class="text-body-1 text-medium-emphasis">Manage tasks and task items</p>
      </div>
      <IOSButton 
        color="primary" 
        prependIcon="mdi-plus"
        @click="addTask"
      >
        Add Task
      </IOSButton>
    </div>
    
    <!-- Loading Indicator -->
    <div v-if="tasksStore.isLoading" class="text-center py-6">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
      <p class="mt-2 text-medium-emphasis">Loading tasks...</p>
    </div>
    
    <!-- Empty State -->
    <IOSCard v-else-if="!tasksStore.tasks.length">
      <div class="text-center py-8">
        <v-icon icon="mdi-clipboard-text-outline" size="x-large" color="secondary" class="mb-4"></v-icon>
        <h3 class="text-h5 mb-2">No tasks yet</h3>
        <p class="mb-4">Add your first task to get started</p>
        <IOSButton color="primary" prependIcon="mdi-plus" @click="addTask">
          Add Task
        </IOSButton>
      </div>
    </IOSCard>
    
    <!-- Tasks List -->
    <div v-else class="tasks-list">
      <IOSCard 
        v-for="task in tasksStore.tasks" 
        :key="task.id"
        class="task-card"
      >
        <!-- Task Header -->
        <div class="ios-card-header">
          <IOSListItem
            :model-value="task.name"
            icon="mdi-clipboard-text-outline"
            icon-color="primary"
            :editable="true"
            :deletable="true"
            placeholder="Task name"
            @update:model-value="updateTaskName(task.id, $event)"
            @delete="confirmDeleteTask(task)"
          >
            <!-- Department assignment button for task -->
            <div class="d-flex align-center ml-2">
              <v-badge
                :content="task.departments?.length || 0"
                :model-value="task.departments?.length > 0"
                color="primary"
                offset-x="8"
                offset-y="8"
              >
                <v-btn
                  icon="mdi-office-building-outline"
                  size="small"
                  variant="text"
                  color="primary"
                  @click.stop="openDepartmentAssignmentDialog(task)"
                ></v-btn>
              </v-badge>
            </div>
          </IOSListItem>
        </div>
        
        <!-- Task Items List -->
        <div class="inset-content">
          <!-- Task Item Items -->
          <div v-if="task.taskItems && task.taskItems.length">
            <IOSListItem
              v-for="item in task.taskItems"
              :key="item.id"
              :model-value="item.name"
              icon="mdi-checkbox-marked-circle-outline"
              icon-color="secondary"
              :editable="true"
              :deletable="true"
              placeholder="Task item name"
              @update:model-value="updateTaskItemName(item.id, $event)"
              @delete="confirmDeleteTaskItem(item)"
            >
              <!-- Department assignment button for task item -->
              <div class="d-flex align-center ml-2">
                <v-badge
                  :content="item.departments?.length || 0"
                  :model-value="item.departments?.length > 0"
                  color="secondary"
                  offset-x="8"
                  offset-y="8"
                >
                  <v-btn
                    icon="mdi-office-building-outline"
                    size="small"
                    variant="text"
                    color="secondary"
                    @click.stop="openTaskItemDepartmentDialog(task, item)"
                  ></v-btn>
                </v-badge>
              </div>
            </IOSListItem>
          </div>
          
          <!-- Empty Task Items State -->
          <div v-else class="text-center py-4">
            <p class="text-medium-emphasis mb-2">No task items</p>
          </div>
          
          <!-- Add Task Item Button -->
          <div class="px-4 pb-3 pt-2 text-center">
            <IOSButton
              variant="text"
              size="small"
              prependIcon="mdi-plus"
              @click="addTaskItem(task)"
            >
              Add Task Item
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
    
    <!-- New Task Dialog -->
    <v-dialog v-model="taskDialogVisible" max-width="400" persistent>
      <v-card class="ios-dialog">
        <v-card-title class="text-h5">Add Task</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="newTask.name"
            label="Task Name"
            variant="outlined"
            autofocus
            @keyup.enter="saveNewTask"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <IOSButton
            color="secondary"
            variant="text"
            @click="taskDialogVisible = false"
          >
            Cancel
          </IOSButton>
          <IOSButton
            color="primary"
            :disabled="!newTask.name"
            @click="saveNewTask"
          >
            Add
          </IOSButton>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <!-- New Task Item Dialog -->
    <v-dialog v-model="taskItemDialogVisible" max-width="400" persistent>
      <v-card class="ios-dialog">
        <v-card-title class="text-h5">Add Task Item</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="newTaskItem.name"
            label="Task Item Name"
            variant="outlined"
            autofocus
            @keyup.enter="saveNewTaskItem"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <IOSButton
            color="secondary"
            variant="text"
            @click="taskItemDialogVisible = false"
          >
            Cancel
          </IOSButton>
          <IOSButton
            color="primary"
            :disabled="!newTaskItem.name"
            @click="saveNewTaskItem"
          >
            Add
          </IOSButton>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <!-- Task Department Assignment Dialog -->
    <v-dialog v-model="departmentAssignDialogVisible" max-width="500" persistent>
      <v-card class="ios-dialog">
        <v-card-title class="text-h5">Assign to Departments</v-card-title>
        <v-card-text>
          <div v-if="!buildingsStore.buildings.length" class="text-center py-4">
            <p>No departments available. Please add buildings and departments first.</p>
          </div>
          <div v-else>
            <p class="mb-4">Select departments to assign to this task:</p>
            
            <v-expansion-panels variant="accordion">
              <v-expansion-panel
                v-for="building in buildingsStore.buildings"
                :key="building.id"
                rounded
              >
                <v-expansion-panel-title>{{ building.name }}</v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-checkbox
                    v-for="dept in building.departments"
                    :key="dept.id"
                    v-model="selectedDepartments"
                    :value="dept.id"
                    :label="dept.name"
                    color="primary"
                    hide-details
                    class="mb-2"
                  ></v-checkbox>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <IOSButton
            color="secondary"
            variant="text"
            @click="departmentAssignDialogVisible = false"
          >
            Cancel
          </IOSButton>
          <IOSButton
            color="primary"
            @click="saveDepartmentAssignments"
          >
            Save
          </IOSButton>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <!-- Task Item Department Assignment Dialog -->
    <v-dialog v-model="taskItemDepartmentDialogVisible" max-width="500" persistent>
      <TaskItemDepartmentAssociation
        v-if="taskItemDepartmentDialogVisible"
        :task-item-id="currentTaskItem?.id"
        :task-item-name="currentTaskItem?.name"
        :buildings="buildingsStore.buildings"
        :selected-departments="currentTaskItem?.departments || []"
        @save="saveTaskItemDepartments"
        @cancel="taskItemDepartmentDialogVisible = false"
      />
    </v-dialog>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTasksStore } from '../../stores/tasks'
import { useBuildingsStore } from '../../stores/buildings'
import IOSCard from '../common/IOSCard.vue'
import IOSListItem from '../common/IOSListItem.vue'
import IOSButton from '../common/IOSButton.vue'
import TaskItemDepartmentAssociation from '../task-items/TaskItemDepartmentAssociation.vue'

// Stores
const tasksStore = useTasksStore()
const buildingsStore = useBuildingsStore()

// State for dialogs and editing
const deleteDialogVisible = ref(false)
const taskDialogVisible = ref(false)
const taskItemDialogVisible = ref(false)
const departmentAssignDialogVisible = ref(false)
const taskItemDepartmentDialogVisible = ref(false)
const deleteType = ref('item')
const itemToDelete = ref(null)
const newTask = ref({ name: '' })
const newTaskItem = ref({ name: '', task_id: null })
const currentTask = ref(null)
const currentTaskItem = ref(null)
const selectedDepartments = ref([])

// Fetch data
onMounted(async () => {
  await Promise.all([
    tasksStore.fetchTasks(),
    buildingsStore.fetchBuildings()
  ])
})

// Task operations
const addTask = () => {
  newTask.value = { name: '' }
  taskDialogVisible.value = true
}

const saveNewTask = async () => {
  if (newTask.value.name.trim()) {
    try {
      await tasksStore.createTask(newTask.value)
      taskDialogVisible.value = false
    } catch (error) {
      console.error('Error creating task:', error)
    }
  }
}

const updateTaskName = async (id, newName) => {
  try {
    await tasksStore.updateTask({ id, name: newName })
  } catch (error) {
    console.error('Error updating task:', error)
  }
}

const confirmDeleteTask = (task) => {
  deleteType.value = 'task'
  itemToDelete.value = task
  deleteDialogVisible.value = true
}

// Task Item operations
const addTaskItem = (task) => {
  newTaskItem.value = { 
    name: '',
    task_id: task.id,
    order_index: task.taskItems ? task.taskItems.length : 0
  }
  currentTask.value = task
  taskItemDialogVisible.value = true
}

const saveNewTaskItem = async () => {
  if (newTaskItem.value.name.trim()) {
    try {
      await tasksStore.createTaskItem(newTaskItem.value)
      taskItemDialogVisible.value = false
    } catch (error) {
      console.error('Error creating task item:', error)
    }
  }
}

const updateTaskItemName = async (id, newName) => {
  try {
    await tasksStore.updateTaskItem({ id, name: newName })
  } catch (error) {
    console.error('Error updating task item:', error)
  }
}

const confirmDeleteTaskItem = (taskItem) => {
  deleteType.value = 'task item'
  itemToDelete.value = taskItem
  deleteDialogVisible.value = true
}

// Department assignment operations for tasks
const openDepartmentAssignmentDialog = (task) => {
  currentTask.value = task
  selectedDepartments.value = task.departments 
    ? task.departments.map(dept => dept.id) 
    : []
  departmentAssignDialogVisible.value = true
}

const saveDepartmentAssignments = async () => {
  try {
    await tasksStore.updateTaskDepartments(currentTask.value.id, selectedDepartments.value)
    departmentAssignDialogVisible.value = false
  } catch (error) {
    console.error('Error updating department assignments:', error)
  }
}

// Department assignment operations for task items
const openTaskItemDepartmentDialog = (task, taskItem) => {
  currentTask.value = task
  currentTaskItem.value = taskItem
  taskItemDepartmentDialogVisible.value = true
}

const saveTaskItemDepartments = async (data) => {
  try {
    await tasksStore.updateTaskItemDepartments(data.taskItemId, data.departmentIds)
    taskItemDepartmentDialogVisible.value = false
  } catch (error) {
    console.error('Error updating task item departments:', error)
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
    deleteDialogVisible.value = false
  } catch (error) {
    console.error(`Error deleting ${deleteType.value}:`, error)
  }
}
</script>

<style scoped>
.tasks-tab {
  max-width: 800px;
  margin: 0 auto;
  padding: 16px;
}

.tasks-tab__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.task-departments {
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}

.ios-dialog {
  border-radius: 16px;
  overflow: hidden;
}

@media (prefers-color-scheme: dark) {
  .ios-dialog {
    background-color: #2C2C2E;
  }
  
  .task-departments {
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }
}

@media (max-width: 600px) {
  .tasks-tab__header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .tasks-tab__header > div:first-child {
    margin-bottom: 8px;
  }
}
</style>
