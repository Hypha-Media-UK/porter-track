<template>
  <v-card>
    <v-card-title>Assign Task to Departments</v-card-title>
    <v-card-text>
      <div v-if="buildings.length && taskName">
        <p class="mb-4">Select departments to associate with "{{ taskName }}":</p>
        
        <v-expansion-panels>
          <v-expansion-panel v-for="building in buildings" :key="building.id">
            <v-expansion-panel-title>
              {{ building.name }}
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-checkbox
                v-for="dept in building.departments"
                :key="dept.id"
                v-model="selected"
                :value="dept.id"
                :label="dept.name"
              ></v-checkbox>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
      
      <EmptyState
        v-else
        icon="mdi-office-building-outline"
        message="No departments available. Please add buildings and departments first."
      />
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="grey-darken-1" variant="text" @click="cancel">Cancel</v-btn>
      <v-btn color="primary" variant="text" @click="save">Save</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue'
import EmptyState from '../common/EmptyState.vue'

const props = defineProps({
  // Task data
  taskId: {
    type: String,
    required: true
  },
  taskName: {
    type: String,
    default: ''
  },
  // Departments data
  buildings: {
    type: Array,
    default: () => []
  },
  // Selected department IDs
  selectedDepartments: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['save', 'cancel'])

// Local state for selected departments
const selected = ref([...props.selectedDepartments])

// Watch for changes in props.selectedDepartments
watch(() => props.selectedDepartments, (newVal) => {
  selected.value = [...newVal]
})

const save = () => {
  emit('save', {
    taskId: props.taskId,
    departmentIds: selected.value
  })
}

const cancel = () => {
  emit('cancel')
}
</script>
