import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../services/supabase'

export const useBuildingsStore = defineStore('buildings', () => {
  // State
  const buildings = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  // Getters
  const getBuildingById = computed(() => {
    return (id) => buildings.value.find(building => building.id === id)
  })

  const getDepartmentById = computed(() => {
    return (id) => {
      for (const building of buildings.value) {
        if (building.departments) {
          const department = building.departments.find(dept => dept.id === id)
          if (department) return department
        }
      }
      return null
    }
  })

  // Actions
  const fetchBuildings = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      // Fetch buildings
      const { data: buildingsData, error: buildingsError } = await supabase
        .from('buildings')
        .select('*')
        .order('name')
      
      if (buildingsError) throw buildingsError

      // Fetch departments for each building
      for (const building of buildingsData) {
        const { data: departmentsData, error: departmentsError } = await supabase
          .from('departments')
          .select('*')
          .eq('building_id', building.id)
          .order('name')
        
        if (departmentsError) throw departmentsError
        
        building.departments = departmentsData || []
      }
      
      buildings.value = buildingsData
    } catch (err) {
      console.error('Error fetching buildings:', err)
      error.value = err.message || 'Failed to load buildings'
    } finally {
      isLoading.value = false
    }
  }

  const createBuilding = async (building) => {
    try {
      const { data, error: err } = await supabase
        .from('buildings')
        .insert([{ name: building.name }])
        .select()
      
      if (err) throw err
      
      if (data && data[0]) {
        data[0].departments = []
        buildings.value.push(data[0])
      }
      
      return data
    } catch (err) {
      console.error('Error creating building:', err)
      error.value = err.message || 'Failed to create building'
      throw err
    }
  }

  const updateBuilding = async (building) => {
    try {
      const { data, error: err } = await supabase
        .from('buildings')
        .update({ name: building.name, updated_at: new Date() })
        .eq('id', building.id)
        .select()
      
      if (err) throw err
      
      if (data && data[0]) {
        const index = buildings.value.findIndex(b => b.id === building.id)
        if (index !== -1) {
          // Preserve departments when updating
          data[0].departments = buildings.value[index].departments
          buildings.value[index] = data[0]
        }
      }
      
      return data
    } catch (err) {
      console.error('Error updating building:', err)
      error.value = err.message || 'Failed to update building'
      throw err
    }
  }

  const deleteBuilding = async (buildingId) => {
    try {
      const { error: err } = await supabase
        .from('buildings')
        .delete()
        .eq('id', buildingId)
      
      if (err) throw err
      
      // Remove from local state
      buildings.value = buildings.value.filter(b => b.id !== buildingId)
      
      return true
    } catch (err) {
      console.error('Error deleting building:', err)
      error.value = err.message || 'Failed to delete building'
      throw err
    }
  }

  const createDepartment = async (department) => {
    try {
      const { data, error: err } = await supabase
        .from('departments')
        .insert([{
          name: department.name,
          floor: department.floor,
          building_id: department.building_id
        }])
        .select()
      
      if (err) throw err
      
      if (data && data[0]) {
        // Add to local state
        const buildingIndex = buildings.value.findIndex(b => b.id === department.building_id)
        if (buildingIndex !== -1) {
          if (!buildings.value[buildingIndex].departments) {
            buildings.value[buildingIndex].departments = []
          }
          buildings.value[buildingIndex].departments.push(data[0])
        }
      }
      
      return data
    } catch (err) {
      console.error('Error creating department:', err)
      error.value = err.message || 'Failed to create department'
      throw err
    }
  }

  const updateDepartment = async (department) => {
    try {
      const { data, error: err } = await supabase
        .from('departments')
        .update({
          name: department.name,
          floor: department.floor,
          updated_at: new Date()
        })
        .eq('id', department.id)
        .select()
      
      if (err) throw err
      
      if (data && data[0]) {
        // Update in local state
        for (const building of buildings.value) {
          if (building.departments) {
            const departmentIndex = building.departments.findIndex(d => d.id === department.id)
            if (departmentIndex !== -1) {
              building.departments[departmentIndex] = data[0]
              break
            }
          }
        }
      }
      
      return data
    } catch (err) {
      console.error('Error updating department:', err)
      error.value = err.message || 'Failed to update department'
      throw err
    }
  }

  const deleteDepartment = async (departmentId) => {
    try {
      const { error: err } = await supabase
        .from('departments')
        .delete()
        .eq('id', departmentId)
      
      if (err) throw err
      
      // Remove from local state
      for (const building of buildings.value) {
        if (building.departments) {
          building.departments = building.departments.filter(d => d.id !== departmentId)
        }
      }
      
      return true
    } catch (err) {
      console.error('Error deleting department:', err)
      error.value = err.message || 'Failed to delete department'
      throw err
    }
  }

  return {
    // State
    buildings,
    isLoading,
    error,
    
    // Getters
    getBuildingById,
    getDepartmentById,
    
    // Actions
    fetchBuildings,
    createBuilding,
    updateBuilding,
    deleteBuilding,
    createDepartment,
    updateDepartment,
    deleteDepartment
  }
})
