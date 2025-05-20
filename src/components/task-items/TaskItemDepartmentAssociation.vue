<template>
  <DialogConfirm
    v-model="isVisible"
    :title="`Assign Departments to '${taskItemName}'`"
    confirmText="Save"
    @confirm="save"
    @cancel="$emit('cancel')"
  >
    <div v-if="!buildings.length" class="empty-state py-4">
      <p class="text-gray-600">No departments available. Please add buildings and departments first.</p>
    </div>
    
    <div v-else>
      <p class="mb-4">Select departments to assign to this task item:</p>
      
      <div class="departments-accordion">
        <div 
          v-for="building in buildings" 
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
                  v-model="selectedDepartmentId"
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
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import DialogConfirm from '../common/DialogConfirm.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  taskItemId: {
    type: String,
    required: true
  },
  taskItemName: {
    type: String,
    required: true
  },
  buildings: {
    type: Array,
    required: true
  },
  selectedDepartments: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'save', 'cancel'])

// Local state
const isVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const selectedDepartmentId = ref(null)
const expandedBuildings = ref([])

// Set up initial state
onMounted(() => {
  // Initialize selected department from props
  if (props.selectedDepartments && props.selectedDepartments.length > 0) {
    selectedDepartmentId.value = 
      typeof props.selectedDepartments[0] === 'object' 
        ? props.selectedDepartments[0].id 
        : props.selectedDepartments[0]
  }
  
  // Expand all building accordions initially
  expandedBuildings.value = props.buildings.map(b => b.id)
})

// Update selected department when props change
watch(() => props.selectedDepartments, (newDepts) => {
  if (newDepts && newDepts.length > 0) {
    selectedDepartmentId.value = 
      typeof newDepts[0] === 'object' 
        ? newDepts[0].id 
        : newDepts[0]
  } else {
    selectedDepartmentId.value = null
  }
}, { deep: true })

// Accordion toggle
const toggleAccordion = (buildingId) => {
  const index = expandedBuildings.value.indexOf(buildingId)
  if (index === -1) {
    expandedBuildings.value.push(buildingId)
  } else {
    expandedBuildings.value.splice(index, 1)
  }
}

// Save department assignment
const save = () => {
  // Create an array with a single department ID (or empty if none selected)
  const departmentIds = selectedDepartmentId.value ? [selectedDepartmentId.value] : []
  
  emit('save', {
    taskItemId: props.taskItemId,
    departmentIds: departmentIds
  })
}
</script>

<style lang="scss" scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
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
</style>
