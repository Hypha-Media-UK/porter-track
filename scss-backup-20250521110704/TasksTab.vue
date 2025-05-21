<template>
  <section class="tasks-tab">
    <!-- Actions -->
    <div class="flex-end mb-4">
      <Button 
        variant="primary" 
        iconLeft="+"
        @click="addTask"
        title="Add new task"
      >
        Add Task
      </Button>
    </div>
    
    <!-- Loading Indicator -->
    <div v-if="tasksStore.isLoading" class="text-center py-6">
      <LoadingIndicator label="Loading tasks..." />
    </div>
    
    <!-- Empty State -->
    <Card v-else-if="!tasksStore.tasks.length">
      <div class="empty-state py-8">
        <span class="icon empty-state-icon">📋</span>
        <h3 class="empty-state-title mb-2">No tasks yet</h3>
        <p class="mb-4">Add your first task to get started</p>
        <Button variant="primary" iconLeft="+" @click="addTask">
          Add Task
        </Button>
      </div>
    </Card>
    
    <!-- Tasks List -->
    <div v-else class="tasks-list">
      <Card 
        v-for="task in tasksStore.tasks" 
        :key="task.id"
        class="task-card"
      >
        <!-- Task Header -->
        <template #header>
          <ListItem
            :model-value="task.name"
            :editable="true"
            :deletable="true"
            :department-assignable="true"
            :has-department="task.departments?.length > 0"
            placeholder="Task name"
            @update:model-value="updateTaskName(task.id, $event)"
            @delete="confirmDeleteTask(task)"
            @assign-department="openDepartmentAssignmentDialog(task)"
          />
        </template>
        
        <!-- Task Items List -->
        <div class="inset-content">
          <!-- Task Item Items -->
          <div v-if="task.taskItems && task.taskItems.length">
            <ListItem
              v-for="item in task.taskItems"
              :key="item.id"
              :model-value="item.name"
              :editable="true"
              :deletable="true"
              :department-assignable="true"
              :has-department="item.departments?.length > 0"
              placeholder="Task item name"
              @update:model-value="updateTaskItemName(item.id, $event)"
              @delete="confirmDeleteTaskItem(item)"
              @assign-department="openTaskItemDepartmentDialog(task, item)"
            />
          </div>
          
          <!-- Empty Task Items State -->
          <div v-else class="empty-state py-4">
            <p class="text-gray-600 mb-2">No task items</p>
          </div>
          
          <!-- Add Task Item Button -->
          <div class="px-4 pb-3 pt-2 d-flex justify-center">
            <Button
              variant="secondary"
              size="sm"
              iconLeft="+"
              @click="addTaskItem(task)"
            >
              Add Item
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
    
    <!-- New Task Dialog -->
    <DialogConfirm
      v-model="taskDialogVisible"
      title="Add Task"
      :showConfirmButton="!!newTask.name.trim()"
      confirmText="Add"
      @confirm="saveNewTask"
      @cancel="taskDialogVisible = false"
    >
      <div class="form-group">
        <label for="task-name" class="form-label">Task Name</label>
        <input
          id="task-name"
          v-model="newTask.name"
          class="form-control"
          placeholder="Enter task name"
          @keyup.enter="saveNewTask"
        />
      </div>
    </DialogConfirm>
    
    <!-- New Task Item Dialog -->
    <DialogConfirm
      v-model="taskItemDialogVisible"
      title="Add Task Item"
      :showConfirmButton="!!newTaskItem.name.trim()"
      confirmText="Add"
      @confirm="saveNewTaskItem"
      @cancel="taskItemDialogVisible = false"
    >
      <div class="form-group">
        <label for="task-item-name" class="form-label">Task Item Name</label>
        <input
          id="task-item-name"
          v-model="newTaskItem.name"
          class="form-control"
          placeholder="Enter task item name"
          @keyup.enter="saveNewTaskItem"
        />
      </div>
    </DialogConfirm>
    
    <!-- Department Assignment Dialog -->
    <DialogConfirm
      v-model="departmentAssignDialogVisible"
      title="Assign to Department"
      confirmText="Save"
      @confirm="saveDepartmentAssignments"
      @cancel="departmentAssignDialogVisible = false"
    >
      <div v-if="!buildingsStore.buildings.length" class="empty-state py-4">
        <p class="text-gray-600">No departments available. Please add buildings and departments first.</p>
      </div>
      <div v-else>
        <p class="mb-4">Select a department to assign to this task:</p>
        
        <div class="departments-accordion">
          <div 
            v-for="building in buildingsStore.buildings" 
            :key="building.id"
            class="accordion-item"
          >
            <div 
              class="accordion-header" 
              @click="toggleAccordion(building.id)"
            >
              <span>{{ building.name }}</span>
              <span class="icon">{{ expandedBuildings.includes(building.id) ? '▼' : '▶' }}</span>
            </div>
            
            <div 
              v-if="expandedBuildings.includes(building.id)"
              class="accordion-content"
            >
              <div 
                v-for="dept in building.departments" 
                :key="dept.id"
                class="radio-item"
              >
                <label :for="`dept-${dept.id}`" class="radio-label">
                  <input 
                    type="radio" 
                    :id="`dept-${dept.id}`" 
                    :value="dept.id" 
                    v-model="selectedDepartment"
                    name="department"
                    class="radio-input"
                  />
                  <span class="radio-text">{{ dept.name }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DialogConfirm>
    
    <!-- Task Item Department Assignment Dialog -->
    <TaskItemDepartmentAssociation
      v-if="taskItemDepartmentDialogVisible"
      v-model="taskItemDepartmentDialogVisible"
      :task-item-id="currentTaskItem?.id"
      :task-item-name="currentTaskItem?.name"
      :buildings="buildingsStore.buildings"
      :selected-departments="currentTaskItem?.departments || []"
      @save="saveTaskItemDepartments"
      @cancel="taskItemDepartmentDialogVisible = false"
    />
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTasksStore } from '../../stores/tasks'
import { useBuildingsStore } from '../../stores/buildings'
import Card from '../common/Card.vue'
import ListItem from '../common/ListItem.vue'
import Button from '../common/Button.vue'
import DialogConfirm from '../common/DialogConfirm.vue'
import LoadingIndicator from '../common/LoadingIndicator.vue'
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
const selectedDepartment = ref(null)
const expandedBuildings = ref([])

// Fetch data
onMounted(async () => {
  await Promise.all([
    tasksStore.fetchTasks(),
    buildingsStore.fetchBuildings()
  ])
})

// Accordion toggle
const toggleAccordion = (buildingId) => {
  const index = expandedBuildings.value.indexOf(buildingId)
  if (index === -1) {
    expandedBuildings.value.push(buildingId)
  } else {
    expandedBuildings.value.splice(index, 1)
  }
}

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
  // Set the selected department to the first one in the list (for single selection)
  selectedDepartment.value = task.departments && task.departments.length > 0 
    ? task.departments[0].id 
    : null
  
  // Expand all buildings on dialog open
  expandedBuildings.value = buildingsStore.buildings.map(b => b.id)
  
  departmentAssignDialogVisible.value = true
}

const saveDepartmentAssignments = async () => {
  try {
    // Create an array with the single department ID or empty array
    const departmentIds = selectedDepartment.value ? [selectedDepartment.value] : []
    await tasksStore.updateTaskDepartments(currentTask.value.id, departmentIds)
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

<style lang="scss" scoped>
.tasks-tab {
  max-width: 800px;
  margin: 0 auto;
  padding: $spacing-4;
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-4;
}

.task-card {
  background-color: $color-white;
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

// Departments accordion styles
.departments-accordion {
  border: 1px solid $color-gray-200;
  border-radius: $border-radius;
  overflow: hidden;
}

.accordion-item {
  border-bottom: 1px solid $color-gray-200;
  
  &:last-child {
    border-bottom: none;
  }
}

.accordion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-3 $spacing-4;
  background-color: $color-white;
  cursor: pointer;
  transition: $transition-base;
  font-weight: $font-weight-medium;
  
  &:hover {
    background-color: $color-gray-100;
  }
  
  .icon {
    font-size: $font-size-sm;
    color: $color-gray-600;
  }
}

.accordion-content {
  padding: $spacing-2 $spacing-4;
  background-color: $color-gray-50;
}

.radio-item {
  margin-bottom: $spacing-2;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.radio-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.radio-input {
  margin-right: $spacing-2;
}

.radio-text {
  font-size: $font-size-sm;
}

@include responsive(sm) {
  .tasks-tab {
    padding: $spacing-3;
  }
}
</style>
