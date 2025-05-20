<template>
  <v-card class="ios-dialog">
    <v-card-title class="text-h5">
      Assign Departments to "{{ taskItemName }}"
    </v-card-title>
    
    <v-card-text>
      <div v-if="!buildings.length" class="text-center py-4">
        <p>No departments available. Please add buildings and departments first.</p>
      </div>
      
      <div v-else>
        <p class="mb-4">Select departments to assign to this task item:</p>
        
        <v-expansion-panels variant="accordion">
          <v-expansion-panel
            v-for="building in buildings"
            :key="building.id"
            rounded
          >
            <v-expansion-panel-title>{{ building.name }}</v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-checkbox
                v-for="dept in building.departments"
                :key="dept.id"
                v-model="selectedDepartmentIds"
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
        @click="$emit('cancel')"
      >
        Cancel
      </IOSButton>
      <IOSButton
        color="primary"
        @click="save"
      >
        Save
      </IOSButton>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import IOSButton from '../common/IOSButton.vue'

const props = defineProps({
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

const emit = defineEmits(['save', 'cancel'])

const selectedDepartmentIds = ref([])

onMounted(() => {
  // Initialize with the selected departments
  selectedDepartmentIds.value = props.selectedDepartments.map(dept => dept.id || dept)
})

const save = () => {
  emit('save', {
    taskItemId: props.taskItemId,
    departmentIds: selectedDepartmentIds.value
  })
}
</script>

<style scoped>
.ios-dialog {
  border-radius: 16px;
  overflow: hidden;
}

@media (prefers-color-scheme: dark) {
  .ios-dialog {
    background-color: #2C2C2E;
  }
}
</style>
