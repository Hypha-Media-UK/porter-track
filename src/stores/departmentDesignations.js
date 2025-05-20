import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../services/supabase'

export const useDepartmentDesignationsStore = defineStore('departmentDesignations', () => {
  // State
  const designations = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  // Getters
  const getDesignationById = computed(() => {
    return (id) => designations.value.find(designation => designation.id === id)
  })

  // Actions
  const fetchDesignations = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const { data, error: err } = await supabase
        .from('department_designations')
        .select('*')
        .order('name')
      
      if (err) throw err
      
      designations.value = data || []
    } catch (err) {
      console.error('Error fetching department designations:', err)
      error.value = err.message || 'Failed to load department designations'
    } finally {
      isLoading.value = false
    }
  }

  const createDesignation = async (designation) => {
    try {
      const { data, error: err } = await supabase
        .from('department_designations')
        .insert([{ name: designation.name }])
        .select()
      
      if (err) throw err
      
      if (data && data[0]) {
        designations.value.push(data[0])
      }
      
      return data
    } catch (err) {
      console.error('Error creating department designation:', err)
      error.value = err.message || 'Failed to create department designation'
      throw err
    }
  }

  const updateDesignation = async (designation) => {
    try {
      const { data, error: err } = await supabase
        .from('department_designations')
        .update({ 
          name: designation.name,
          updated_at: new Date()
        })
        .eq('id', designation.id)
        .select()
      
      if (err) throw err
      
      if (data && data[0]) {
        const index = designations.value.findIndex(d => d.id === designation.id)
        if (index !== -1) {
          designations.value[index] = data[0]
        }
      }
      
      return data
    } catch (err) {
      console.error('Error updating department designation:', err)
      error.value = err.message || 'Failed to update department designation'
      throw err
    }
  }

  const deleteDesignation = async (designationId) => {
    try {
      const { error: err } = await supabase
        .from('department_designations')
        .delete()
        .eq('id', designationId)
      
      if (err) throw err
      
      // Remove from local state
      designations.value = designations.value.filter(d => d.id !== designationId)
      
      return true
    } catch (err) {
      console.error('Error deleting department designation:', err)
      error.value = err.message || 'Failed to delete department designation'
      throw err
    }
  }

  return {
    // State
    designations,
    isLoading,
    error,
    
    // Getters
    getDesignationById,
    
    // Actions
    fetchDesignations,
    createDesignation,
    updateDesignation,
    deleteDesignation
  }
})
