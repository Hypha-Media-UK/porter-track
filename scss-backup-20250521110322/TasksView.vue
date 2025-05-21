<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex">
            <span class="text-h5">Tasks Management</span>
            <v-spacer></v-spacer>
            <v-btn color="primary" prepend-icon="mdi-plus" @click="openTaskDialog()">
              Add Task
            </v-btn>
          </v-card-title>
          
          <v-card-text>
            <p class="text-subtitle-1 mb-4">Manage tasks and task items</p>
            
            <!-- Loading indicator -->
            <LoadingIndicator 
              :show="tasksStore.isLoading" 
              message="Loading tasks..."
            />
            
            <!-- Empty state -->
            <EmptyState
              v-if="!tasksStore.isLoading && !tasksStore.tasks.length"
              icon="mdi-clipboard-list"
              message="No tasks found. Add your first task to get started."
              actionText="Add Task"
              actionIcon="mdi-plus"
              @action="openTaskDialog()"
            />
            
            <!-- Tasks list -->
            <v-expansion-panels v-else-if="!tasksStore.isLoading && tasksStore.tasks.length">
              <v-expansion-panel v-for="task in tasksStore.tasks" :key="task.id">
                <v-expansion-panel-title>
                  <div class="d-flex align-center">
                    <v-icon class="mr-2">mdi-clipboard-list</v-icon>
                    {{ task.name }}
                  </div>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <div class="mb-2">
                    <p v-if="task.description">{{ task.description }}</p>
                    <p v-if="task.estimated_duration">
                      <v-icon small>mdi-clock-outline</v-icon>
                      Estimated time: {{ task.estimated_duration }} minutes
                    </p>
                  </div>
                  
                  <div class="d-flex mb-3">
                    <v-spacer></v-spacer>
                    <v-btn
                      density="comfortable"
                      variant="text"
                      prepend-icon="mdi-pencil"
                      @click.stop="openTaskDialog(task)"
                    >
                      Edit
                    </v-btn>
                    <v-btn 
                      density="comfortable"
                      variant="text"
                      color="error" 
                      prepend-icon="mdi-delete" 
                      @click.stop="confirmDeleteTask(task)"
                    >
                      Delete
                    </v-btn>
                    <v-btn
                      density="comfortable"
                      variant="text"
                      color="primary"
                      prepend-icon="mdi-plus"
                      @click.stop="openTaskItemDialog(task)"
                    >
                      Add Task Item
                    </v-btn>
                    <v-btn
                      density="comfortable"
                      variant="text"
                      color="secondary"
                      prepend-icon="mdi-office-building"
                      @click.stop="openDepartmentAssociationDialog(task)"
                    >
                      Assign to Departments
                    </v-btn>
                  </div>
                  
                  <!-- Task items list -->
                  <v-card variant="outlined" class="mt-2">
                    <v-card-title class="text-subtitle-1">Task Items</v-card-title>
                    <v-list v-if="task.taskItems && task.taskItems.length">
                      <v-list-item v-for="item in task.taskItems" :key="item.id">
                        <template v-slot:prepend>
                          <v-icon>mdi-checkbox-marked-circle-outline</v-icon>
                        </template>
                        <v-list-item-title>{{ item.name }}</v-list-item-title>
                        <v-list-item-subtitle v-if="item.description">
                          {{ item.description }}
                        </v-list-item-subtitle>
                        <template v-slot:append>
                          <v-btn icon="mdi-pencil" variant="text" size="small" @click.stop="openTaskItemDialog(task, item)"></v-btn>
                          <v-btn icon="mdi-delete" variant="text" size="small" color="error" @click.stop="confirmDeleteTaskItem(item)"></v-btn>
                        </template>
                      </v-list-item>
                    </v-list>
                    
                    <!-- Empty task items state -->
                    <v-card-text v-else>
                      <EmptyState
                        icon="mdi-checkbox-marked-circle-outline"
                        message="No task items for this task. Add your first task item."
                        actionText="Add Task Item"
                        actionIcon="mdi-plus"
                        @action="openTaskItemDialog(task)"
                      />
                    </v-card-text>
                  </v-card>
                  
                  <!-- Department associations -->
                  <v-card variant="outlined" class="mt-4">
                    <v-card-title class="text-subtitle-1">Assigned Departments</v-card-title>
                    <v-list v-if="task.departments && task.departments.length">
                      <v-list-item v-for="dept in task.departments" :key="dept.id">
                        <template v-slot:prepend>
                          <v-icon>mdi-office-building</v-icon>
                        </template>
                        <v-list-item-title>{{ dept.name }}</v-list-item-title>
                        <v-list-item-subtitle>
                          {{ getBuildingName(dept.building_id) }}
                        </v-list-item-subtitle>
                      </v-list-item>
                    </v-list>
                    
                    <v-card-text v-else>
                      <EmptyState
                        icon="mdi-office-building-outline"
                        message="This task is not assigned to any departments."
                        actionText="Assign to Departments"
                        actionIcon="mdi-office-building"
                        @action="openDepartmentAssociationDialog(task)"
                      />
                    </v-card-text>
                  </v-card>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    
    <!-- Task dialog -->
    <v-dialog v-model="taskDialogVisible" max-width="500">
      <TaskForm
        :task="currentTask"
        :isEdit="editMode"
        @save="saveTask"
        @cancel="taskDialogVisible = false"
      />
    </v-dialog>
    
    <!-- Task Item dialog -->
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
    
    <!-- Department Association dialog -->
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
import { useTasksStore } from '../stores/tasks'
import { useBuildingsStore } from '../stores/buildings'
import TaskForm from '../components/tasks/TaskForm.vue'
import TaskItemForm from '../components/task-items/TaskItemForm.vue'
import DepartmentAssociationForm from '../components/tasks/DepartmentAssociationForm.vue'
import DialogConfirm from '../components/common/DialogConfirm.vue'
import LoadingIndicator from '../components/common/LoadingIndicator.vue'
import EmptyState from '../components/common/EmptyState.vue'

// State
const tasksStore = useTasksStore()
const buildingsStore = useBuildingsStore()
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

// Fetch tasks and buildings
onMounted(async () => {
  await Promise.all([tasksStore.fetchTasks(), buildingsStore.fetchBuildings()])
})

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
    // Could add error handling UI here
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
    // Could add error handling UI here
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
    // Could add error handling UI here
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
    // Could add error handling UI here
  }
}
</script>
