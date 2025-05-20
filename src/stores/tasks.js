import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../services/supabase'

export const useTasksStore = defineStore('tasks', () => {
  // State
  const tasks = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  // Getters
  const getTaskById = computed(() => {
    return (id) => tasks.value.find(task => task.id === id)
  })

  const getTaskItemById = computed(() => {
    return (id) => {
      for (const task of tasks.value) {
        if (task.taskItems) {
          const taskItem = task.taskItems.find(item => item.id === id)
          if (taskItem) return taskItem
        }
      }
      return null
    }
  })

  // Actions
  const fetchTasks = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      // Fetch tasks
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .order('name')
      
      if (tasksError) throw tasksError

      // Fetch task items for each task
      for (const task of tasksData) {
        const { data: taskItemsData, error: taskItemsError } = await supabase
          .from('task_items')
          .select('*')
          .eq('task_id', task.id)
          .order('order_index')
        
        if (taskItemsError) throw taskItemsError
        
        task.taskItems = taskItemsData || []
        
        // Fetch department associations for the task
        const { data: departmentTasksData, error: departmentTasksError } = await supabase
          .from('department_tasks')
          .select(`
            id,
            department_id,
            departments:department_id (
              id,
              name,
              floor,
              building_id
            )
          `)
          .eq('task_id', task.id)
        
        if (departmentTasksError) throw departmentTasksError
        
        // Extract departments from the join result
        task.departments = departmentTasksData?.map(item => item.departments) || []
        
        // Fetch department associations for each task item
        for (const taskItem of task.taskItems) {
          const { data: itemDepartmentsData, error: itemDepartmentsError } = await supabase
            .from('task_item_departments')
            .select(`
              id,
              department_id,
              departments:department_id (
                id,
                name,
                floor,
                building_id
              )
            `)
            .eq('task_item_id', taskItem.id)
          
          if (itemDepartmentsError) throw itemDepartmentsError
          
          // Extract departments from the join result
          taskItem.departments = itemDepartmentsData?.map(item => item.departments) || []
        }
      }
      
      tasks.value = tasksData
    } catch (err) {
      console.error('Error fetching tasks:', err)
      error.value = err.message || 'Failed to load tasks'
    } finally {
      isLoading.value = false
    }
  }

  const createTask = async (task) => {
    try {
      const { data, error: err } = await supabase
        .from('tasks')
        .insert([{ 
          name: task.name,
          description: task.description,
          estimated_duration: task.estimated_duration
        }])
        .select()
      
      if (err) throw err
      
      if (data && data[0]) {
        data[0].taskItems = []
        data[0].departments = []
        tasks.value.push(data[0])
      }
      
      return data
    } catch (err) {
      console.error('Error creating task:', err)
      error.value = err.message || 'Failed to create task'
      throw err
    }
  }

  const updateTask = async (task) => {
    try {
      const { data, error: err } = await supabase
        .from('tasks')
        .update({ 
          name: task.name,
          description: task.description,
          estimated_duration: task.estimated_duration,
          updated_at: new Date()
        })
        .eq('id', task.id)
        .select()
      
      if (err) throw err
      
      if (data && data[0]) {
        const index = tasks.value.findIndex(t => t.id === task.id)
        if (index !== -1) {
          // Preserve taskItems and departments when updating
          data[0].taskItems = tasks.value[index].taskItems
          data[0].departments = tasks.value[index].departments
          tasks.value[index] = data[0]
        }
      }
      
      return data
    } catch (err) {
      console.error('Error updating task:', err)
      error.value = err.message || 'Failed to update task'
      throw err
    }
  }

  const deleteTask = async (taskId) => {
    try {
      const { error: err } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)
      
      if (err) throw err
      
      // Remove from local state
      tasks.value = tasks.value.filter(t => t.id !== taskId)
      
      return true
    } catch (err) {
      console.error('Error deleting task:', err)
      error.value = err.message || 'Failed to delete task'
      throw err
    }
  }

  const createTaskItem = async (taskItem) => {
    try {
      const { data, error: err } = await supabase
        .from('task_items')
        .insert([{
          name: taskItem.name,
          description: taskItem.description,
          task_id: taskItem.task_id,
          order_index: taskItem.order_index
        }])
        .select()
      
      if (err) throw err
      
      if (data && data[0]) {
        // Add to local state
        const taskIndex = tasks.value.findIndex(t => t.id === taskItem.task_id)
        if (taskIndex !== -1) {
          if (!tasks.value[taskIndex].taskItems) {
            tasks.value[taskIndex].taskItems = []
          }
          // Initialize departments array for the new task item
          data[0].departments = []
          tasks.value[taskIndex].taskItems.push(data[0])
        }
      }
      
      return data
    } catch (err) {
      console.error('Error creating task item:', err)
      error.value = err.message || 'Failed to create task item'
      throw err
    }
  }

  const updateTaskItem = async (taskItem) => {
    try {
      const { data, error: err } = await supabase
        .from('task_items')
        .update({
          name: taskItem.name,
          description: taskItem.description,
          order_index: taskItem.order_index,
          updated_at: new Date()
        })
        .eq('id', taskItem.id)
        .select()
      
      if (err) throw err
      
      if (data && data[0]) {
        // Update in local state
        for (const task of tasks.value) {
          if (task.taskItems) {
            const taskItemIndex = task.taskItems.findIndex(i => i.id === taskItem.id)
            if (taskItemIndex !== -1) {
              // Preserve departments when updating
              data[0].departments = task.taskItems[taskItemIndex].departments
              task.taskItems[taskItemIndex] = data[0]
              break
            }
          }
        }
      }
      
      return data
    } catch (err) {
      console.error('Error updating task item:', err)
      error.value = err.message || 'Failed to update task item'
      throw err
    }
  }

  const deleteTaskItem = async (taskItemId) => {
    try {
      const { error: err } = await supabase
        .from('task_items')
        .delete()
        .eq('id', taskItemId)
      
      if (err) throw err
      
      // Remove from local state
      for (const task of tasks.value) {
        if (task.taskItems) {
          task.taskItems = task.taskItems.filter(i => i.id !== taskItemId)
        }
      }
      
      return true
    } catch (err) {
      console.error('Error deleting task item:', err)
      error.value = err.message || 'Failed to delete task item'
      throw err
    }
  }

  const updateTaskDepartments = async (taskId, departmentIds) => {
    try {
      // First, delete all existing associations for this task
      const { error: deleteError } = await supabase
        .from('department_tasks')
        .delete()
        .eq('task_id', taskId)
      
      if (deleteError) throw deleteError
      
      // Create new associations
      if (departmentIds.length > 0) {
        const departmentTasksToInsert = departmentIds.map(departmentId => ({
          department_id: departmentId,
          task_id: taskId
        }))
        
        const { error: insertError } = await supabase
          .from('department_tasks')
          .insert(departmentTasksToInsert)
        
        if (insertError) throw insertError
      }
      
      // Update local state - we need to fetch the updated departments data
      await fetchTasks() // Refresh the full tasks data
      
      return true
    } catch (err) {
      console.error('Error updating task departments:', err)
      error.value = err.message || 'Failed to update task departments'
      throw err
    }
  }

  const updateTaskItemDepartments = async (taskItemId, departmentIds) => {
    try {
      // First, delete all existing associations for this task item
      const { error: deleteError } = await supabase
        .from('task_item_departments')
        .delete()
        .eq('task_item_id', taskItemId)
      
      if (deleteError) throw deleteError
      
      // Create new associations
      if (departmentIds.length > 0) {
        const taskItemDepartmentsToInsert = departmentIds.map(departmentId => ({
          department_id: departmentId,
          task_item_id: taskItemId
        }))
        
        const { error: insertError } = await supabase
          .from('task_item_departments')
          .insert(taskItemDepartmentsToInsert)
        
        if (insertError) throw insertError
      }
      
      // Update local state - we need to fetch the updated departments data
      await fetchTasks() // Refresh the full tasks data
      
      return true
    } catch (err) {
      console.error('Error updating task item departments:', err)
      error.value = err.message || 'Failed to update task item departments'
      throw err
    }
  }

  return {
    // State
    tasks,
    isLoading,
    error,
    
    // Getters
    getTaskById,
    getTaskItemById,
    
    // Actions
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    createTaskItem,
    updateTaskItem,
    deleteTaskItem,
    updateTaskDepartments,
    updateTaskItemDepartments
  }
})
