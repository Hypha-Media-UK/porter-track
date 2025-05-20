import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../services/supabase'

export const useStaffStore = defineStore('staff', () => {
  // State
  const staff = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  // Getters
  const getStaffById = computed(() => {
    return (id) => staff.value.find(member => member.id === id)
  })

  const getSupervisors = computed(() => {
    return staff.value.filter(member => member.type === 'supervisor')
  })

  const getPorters = computed(() => {
    return staff.value.filter(member => member.type === 'porter')
  })

  // Actions
  const fetchStaff = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      // Fetch all staff members
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('*')
        .order('name')
      
      if (staffError) throw staffError
      
      staff.value = staffData || []
    } catch (err) {
      console.error('Error fetching staff:', err)
      error.value = err.message || 'Failed to load staff'
    } finally {
      isLoading.value = false
    }
  }

  const createStaff = async (staffMember) => {
    try {
      const { data, error: err } = await supabase
        .from('staff')
        .insert([{ 
          name: staffMember.name,
          type: staffMember.type
        }])
        .select()
      
      if (err) throw err
      
      if (data && data[0]) {
        staff.value.push(data[0])
      }
      
      return data
    } catch (err) {
      console.error('Error creating staff member:', err)
      error.value = err.message || 'Failed to create staff member'
      throw err
    }
  }

  const updateStaff = async (staffMember) => {
    try {
      const { data, error: err } = await supabase
        .from('staff')
        .update({ 
          name: staffMember.name,
          updated_at: new Date()
        })
        .eq('id', staffMember.id)
        .select()
      
      if (err) throw err
      
      if (data && data[0]) {
        const index = staff.value.findIndex(s => s.id === staffMember.id)
        if (index !== -1) {
          staff.value[index] = data[0]
        }
      }
      
      return data
    } catch (err) {
      console.error('Error updating staff member:', err)
      error.value = err.message || 'Failed to update staff member'
      throw err
    }
  }

  const deleteStaff = async (staffId) => {
    try {
      const { error: err } = await supabase
        .from('staff')
        .delete()
        .eq('id', staffId)
      
      if (err) throw err
      
      // Remove from local state
      staff.value = staff.value.filter(s => s.id !== staffId)
      
      return true
    } catch (err) {
      console.error('Error deleting staff member:', err)
      error.value = err.message || 'Failed to delete staff member'
      throw err
    }
  }

  return {
    // State
    staff,
    isLoading,
    error,
    
    // Getters
    getStaffById,
    getSupervisors,
    getPorters,
    
    // Actions
    fetchStaff,
    createStaff,
    updateStaff,
    deleteStaff
  }
})
