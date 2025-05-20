import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../services/supabase'

export const useShiftsStore = defineStore('shifts', () => {
  // State
  const shifts = ref([])
  const activeShift = ref(null)
  const previousShift = ref(null)
  const shiftDetails = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  // Getters
  const getShiftById = computed(() => {
    return (id) => shifts.value.find(shift => shift.id === id)
  })

  const pendingTasks = computed(() => {
    if (!shiftDetails.value || !shiftDetails.value.tasks) return []
    return shiftDetails.value.tasks.filter(task => task.status === 'pending')
  })

  const completedTasks = computed(() => {
    if (!shiftDetails.value || !shiftDetails.value.tasks) return []
    return shiftDetails.value.tasks.filter(task => task.status === 'completed')
  })

  const getShiftPorters = computed(() => {
    if (!shiftDetails.value || !shiftDetails.value.porters) return []
    return shiftDetails.value.porters
  })

  const getAssignedPorters = computed(() => {
    if (!shiftDetails.value || !shiftDetails.value.porters) return []
    return shiftDetails.value.porters.filter(porter => 
      porter.departmentAssignments && porter.departmentAssignments.some(a => a.is_active)
    )
  })

  const getRunnerPorters = computed(() => {
    if (!shiftDetails.value || !shiftDetails.value.porters) return []
    return shiftDetails.value.porters.filter(porter => 
      !porter.departmentAssignments || !porter.departmentAssignments.some(a => a.is_active)
    )
  })

  // Actions
  const fetchShifts = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const { data, error: err } = await supabase
        .from('shifts')
        .select(`
          id,
          supervisor_id,
          shift_type,
          start_time,
          end_time,
          is_active,
          created_at,
          updated_at,
          staff(id, name, type)
        `)
        .order('start_time', { ascending: false })
      
      if (err) throw err
      
      // Transform to include supervisor info
      const transformedData = data?.map(shift => ({
        ...shift,
        supervisor: shift.staff
      })) || []
      
      shifts.value = transformedData
      
      // Set active and previous shifts
      activeShift.value = transformedData.find(shift => shift.is_active) || null
      
      const inactiveShifts = transformedData.filter(shift => !shift.is_active)
      previousShift.value = inactiveShifts.length > 0 ? inactiveShifts[0] : null
      
    } catch (err) {
      console.error('Error fetching shifts:', err)
      error.value = err.message || 'Failed to load shifts'
    } finally {
      isLoading.value = false
    }
  }

  const fetchShiftDetails = async (shiftId) => {
    isLoading.value = true
    error.value = null
    
    try {
      // Get shift details
      const { data: shiftData, error: shiftError } = await supabase
        .from('shifts')
        .select(`
          id,
          supervisor_id,
          shift_type,
          start_time,
          end_time,
          is_active,
          created_at,
          updated_at,
          staff!supervisor_id(id, name, type)
        `)
        .eq('id', shiftId)
        .single()
      
      if (shiftError) throw shiftError
      
      // Get porters assigned to the shift
      const { data: portersData, error: portersError } = await supabase
        .from('shift_porters')
        .select(`
          id,
          porter_id,
          staff!porter_id(id, name, type)
        `)
        .eq('shift_id', shiftId)
      
      if (portersError) throw portersError
      
      // Get department assignments for the porters
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('porter_department_assignments')
        .select(`
          id,
          porter_id,
          department_id,
          designation_id,
          start_time,
          end_time,
          is_active,
          departments!department_id(id, name, building_id),
          department_designations!designation_id(id, name)
        `)
        .eq('shift_id', shiftId)
      
      if (assignmentsError) throw assignmentsError
      
      // Get tasks for the shift
      const { data: tasksData, error: tasksError } = await supabase
        .from('shift_tasks')
        .select(`
          id,
          task_id,
          porter_id,
          time_received,
          time_allocated,
          time_completed,
          status,
          created_at,
          updated_at,
          tasks!task_id(id, name, description, estimated_duration),
          staff!porter_id(id, name, type)
        `)
        .eq('shift_id', shiftId)
        .order('time_received', { ascending: false })
      
      if (tasksError) throw tasksError
      
      // Transform data to include nested relationships
      const porters = portersData.map(porterAssignment => {
        const porter = porterAssignment.staff
        const departmentAssignments = assignmentsData.filter(a => a.porter_id === porter.id)
          .map(a => ({
            ...a,
            department: a.departments,
            designation: a.department_designations
          }))
        
        return {
          ...porter,
          departmentAssignments
        }
      })
      
      const tasks = tasksData.map(task => ({
        ...task,
        taskDetails: task.tasks,
        porter: task.staff
      }))
      
      shiftDetails.value = {
        ...shiftData,
        supervisor: shiftData.staff,
        porters,
        tasks
      }
      
    } catch (err) {
      console.error('Error fetching shift details:', err)
      error.value = err.message || 'Failed to load shift details'
    } finally {
      isLoading.value = false
    }
  }

  const createShift = async (shiftData) => {
    try {
      const { data, error: err } = await supabase
        .from('shifts')
        .insert([{
          supervisor_id: shiftData.supervisorId,
          shift_type: shiftData.shiftType,
          start_time: new Date(),
          is_active: true
        }])
        .select()
      
      if (err) throw err
      
      if (data && data[0]) {
        await fetchShifts() // Refresh the shifts list
        return data[0]
      }
      
      return null
    } catch (err) {
      console.error('Error creating shift:', err)
      error.value = err.message || 'Failed to create shift'
      throw err
    }
  }

  const endShift = async (shiftId) => {
    try {
      const { data, error: err } = await supabase
        .from('shifts')
        .update({
          end_time: new Date(),
          is_active: false,
          updated_at: new Date()
        })
        .eq('id', shiftId)
        .select()
      
      if (err) throw err
      
      if (data && data[0]) {
        const index = shifts.value.findIndex(s => s.id === shiftId)
        if (index !== -1) {
          shifts.value[index] = { ...shifts.value[index], ...data[0] }
        }
        
        activeShift.value = null
        await fetchShifts() // Refresh the shifts list
      }
      
      return data
    } catch (err) {
      console.error('Error ending shift:', err)
      error.value = err.message || 'Failed to end shift'
      throw err
    }
  }

  const addPorterToShift = async (shiftId, porterId) => {
    try {
      const { data, error: err } = await supabase
        .from('shift_porters')
        .insert([{
          shift_id: shiftId,
          porter_id: porterId
        }])
        .select()
      
      if (err) throw err
      
      // Refresh shift details if we're viewing this shift
      if (shiftDetails.value && shiftDetails.value.id === shiftId) {
        await fetchShiftDetails(shiftId)
      }
      
      return data
    } catch (err) {
      console.error('Error adding porter to shift:', err)
      error.value = err.message || 'Failed to add porter to shift'
      throw err
    }
  }

  const removePorterFromShift = async (shiftId, porterId) => {
    try {
      // First remove any department assignments
      await supabase
        .from('porter_department_assignments')
        .delete()
        .eq('shift_id', shiftId)
        .eq('porter_id', porterId)
      
      // Then remove from shift_porters
      const { error: err } = await supabase
        .from('shift_porters')
        .delete()
        .eq('shift_id', shiftId)
        .eq('porter_id', porterId)
      
      if (err) throw err
      
      // Refresh shift details if we're viewing this shift
      if (shiftDetails.value && shiftDetails.value.id === shiftId) {
        await fetchShiftDetails(shiftId)
      }
      
      return true
    } catch (err) {
      console.error('Error removing porter from shift:', err)
      error.value = err.message || 'Failed to remove porter from shift'
      throw err
    }
  }

  const assignPorterToDepartment = async (assignment) => {
    try {
      // First deactivate any existing active assignments for this porter
      await supabase
        .from('porter_department_assignments')
        .update({ is_active: false, updated_at: new Date() })
        .eq('shift_id', assignment.shiftId)
        .eq('porter_id', assignment.porterId)
        .eq('is_active', true)
      
      // Prepare assignment data object
      const assignmentData = {
        shift_id: assignment.shiftId,
        porter_id: assignment.porterId,
        designation_id: assignment.designationId || null,
        start_time: assignment.startTime || new Date(),
        end_time: assignment.endTime,
        is_active: true
      }
      
      // Handle department_id (we're not sending it anymore since we removed the field)
      // Only include department_id if we're editing and it exists in the original data
      if (assignment.departmentId) {
        assignmentData.department_id = assignment.departmentId
      } else {
        // Set department_id to null if not provided (required by the database schema)
        assignmentData.department_id = null
      }
      
      // Then create the new assignment
      const { data, error: err } = await supabase
        .from('porter_department_assignments')
        .insert([assignmentData])
        .select()
      
      if (err) throw err
      
      // Refresh shift details if we're viewing this shift
      if (shiftDetails.value && shiftDetails.value.id === assignment.shiftId) {
        await fetchShiftDetails(assignment.shiftId)
      }
      
      return data
    } catch (err) {
      console.error('Error assigning porter to department:', err)
      error.value = err.message || 'Failed to assign porter to department'
      throw err
    }
  }

  const removePorterFromDepartment = async (shiftId, porterId) => {
    try {
      const { data, error: err } = await supabase
        .from('porter_department_assignments')
        .update({ 
          is_active: false, 
          end_time: new Date(),
          updated_at: new Date() 
        })
        .eq('shift_id', shiftId)
        .eq('porter_id', porterId)
        .eq('is_active', true)
        .select()
      
      if (err) throw err
      
      // Refresh shift details if we're viewing this shift
      if (shiftDetails.value && shiftDetails.value.id === shiftId) {
        await fetchShiftDetails(shiftId)
      }
      
      return data
    } catch (err) {
      console.error('Error removing porter from department:', err)
      error.value = err.message || 'Failed to remove porter from department'
      throw err
    }
  }

  const createShiftTask = async (taskData) => {
    try {
      const now = new Date()
      const oneMinLater = new Date(now.getTime() + 60000) // 1 minute later
      const eighteenMinLater = new Date(now.getTime() + 18 * 60000) // 18 minutes later
      
      const { data, error: err } = await supabase
        .from('shift_tasks')
        .insert([{
          shift_id: taskData.shiftId,
          task_id: taskData.taskId,
          porter_id: taskData.porterId,
          time_received: taskData.timeReceived || now,
          time_allocated: taskData.timeAllocated || oneMinLater,
          time_completed: taskData.status === 'completed' ? (taskData.timeCompleted || eighteenMinLater) : null,
          status: taskData.status || 'pending'
        }])
        .select()
      
      if (err) throw err
      
      // Refresh shift details if we're viewing this shift
      if (shiftDetails.value && shiftDetails.value.id === taskData.shiftId) {
        await fetchShiftDetails(taskData.shiftId)
      }
      
      return data
    } catch (err) {
      console.error('Error creating shift task:', err)
      error.value = err.message || 'Failed to create shift task'
      throw err
    }
  }

  const updateShiftTask = async (taskData) => {
    try {
      const { data, error: err } = await supabase
        .from('shift_tasks')
        .update({
          porter_id: taskData.porterId,
          time_received: taskData.timeReceived,
          time_allocated: taskData.timeAllocated,
          time_completed: taskData.status === 'completed' ? (taskData.timeCompleted || new Date()) : null,
          status: taskData.status,
          updated_at: new Date()
        })
        .eq('id', taskData.id)
        .select()
      
      if (err) throw err
      
      // Refresh shift details if we're viewing this shift
      if (shiftDetails.value && shiftDetails.value.id === taskData.shiftId) {
        await fetchShiftDetails(taskData.shiftId)
      }
      
      return data
    } catch (err) {
      console.error('Error updating shift task:', err)
      error.value = err.message || 'Failed to update shift task'
      throw err
    }
  }

  const deleteShiftTask = async (taskId, shiftId) => {
    try {
      const { error: err } = await supabase
        .from('shift_tasks')
        .delete()
        .eq('id', taskId)
      
      if (err) throw err
      
      // Refresh shift details if we're viewing this shift
      if (shiftDetails.value && shiftDetails.value.id === shiftId) {
        await fetchShiftDetails(shiftId)
      }
      
      return true
    } catch (err) {
      console.error('Error deleting shift task:', err)
      error.value = err.message || 'Failed to delete shift task'
      throw err
    }
  }

  return {
    // State
    shifts,
    activeShift,
    previousShift,
    shiftDetails,
    isLoading,
    error,
    
    // Getters
    getShiftById,
    pendingTasks,
    completedTasks,
    getShiftPorters,
    getAssignedPorters,
    getRunnerPorters,
    
    // Actions
    fetchShifts,
    fetchShiftDetails,
    createShift,
    endShift,
    addPorterToShift,
    removePorterFromShift,
    assignPorterToDepartment,
    removePorterFromDepartment,
    createShiftTask,
    updateShiftTask,
    deleteShiftTask
  }
})
