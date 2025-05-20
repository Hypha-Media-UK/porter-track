<template>
  <section>
    <!-- Header -->
    <div class="mb-6">
      <h2 class="text-h5 font-weight-medium">Application Settings</h2>
      <p class="text-body-1 text-medium-emphasis">Configure Porter Track application settings</p>
    </div>

    <!-- Settings Cards -->
    <v-row>
      <!-- Appearance Settings -->
      <v-col cols="12" md="6">
        <v-card class="mb-4">
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2" icon="mdi-palette-outline"></v-icon>
            Appearance
          </v-card-title>
          <v-card-text>
            <div class="mt-2">
              <v-switch
                v-model="darkMode"
                label="Dark Mode"
                color="primary"
                hide-details
                @change="toggleDarkMode"
              ></v-switch>
            </div>
            
            <v-divider class="my-4"></v-divider>
            
            <v-radio-group v-model="density" label="Interface Density" @change="updateDensity">
              <v-radio value="default" label="Default"></v-radio>
              <v-radio value="comfortable" label="Comfortable"></v-radio>
              <v-radio value="compact" label="Compact"></v-radio>
            </v-radio-group>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Notification Settings -->
      <v-col cols="12" md="6">
        <v-card class="mb-4">
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2" icon="mdi-bell-outline"></v-icon>
            Notifications
          </v-card-title>
          <v-card-text>
            <div class="mt-2">
              <v-switch
                v-model="notifications.enabled"
                label="Enable Notifications"
                color="primary"
                hide-details
              ></v-switch>
            </div>
            
            <v-divider class="my-4"></v-divider>
            
            <v-list v-if="notifications.enabled">
              <v-list-item>
                <v-switch
                  v-model="notifications.newTasks"
                  label="New Tasks"
                  color="primary"
                  hide-details
                ></v-switch>
              </v-list-item>
              
              <v-list-item>
                <v-switch
                  v-model="notifications.taskUpdates"
                  label="Task Updates"
                  color="primary"
                  hide-details
                ></v-switch>
              </v-list-item>
              
              <v-list-item>
                <v-switch
                  v-model="notifications.departmentChanges"
                  label="Department Changes"
                  color="primary"
                  hide-details
                ></v-switch>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- User Settings -->
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2" icon="mdi-account-outline"></v-icon>
            User Settings
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="userSettings.name"
                  label="Display Name"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              
              <v-col cols="12" md="6">
                <v-select
                  v-model="userSettings.defaultBuilding"
                  :items="buildingOptions"
                  label="Default Building"
                  variant="outlined"
                ></v-select>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn color="primary" @click="saveUserSettings">Save Settings</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      
      <!-- About Section -->
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2" icon="mdi-information-outline"></v-icon>
            About Porter Track
          </v-card-title>
          <v-card-text>
            <p>Version: 1.0.0</p>
            <p class="mt-2">
              Porter Track is an application designed to assist hospital porters in tracking tasks throughout their shifts.
              The app helps manage buildings, departments, tasks, and task items efficiently.
            </p>
            <p class="mt-2">
              <strong>Database:</strong> Supabase
            </p>
            <p>
              <strong>Framework:</strong> Vue.js
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTheme } from 'vuetify'
import { useBuildingsStore } from '../../stores/buildings'

const theme = useTheme()
const buildingsStore = useBuildingsStore()

// Local state
const darkMode = ref(theme.global.current.value.dark)
const density = ref('default')
const notifications = ref({
  enabled: true,
  newTasks: true,
  taskUpdates: true,
  departmentChanges: false
})
const userSettings = ref({
  name: 'Porter User',
  defaultBuilding: null
})

// Computed values
const buildingOptions = ref([])

// Fetch data
onMounted(async () => {
  // Load buildings for the dropdown
  await buildingsStore.fetchBuildings()
  updateBuildingOptions()
  
  // Load settings from localStorage
  loadSettings()
})

// Populate building options
const updateBuildingOptions = () => {
  buildingOptions.value = [
    { title: 'None', value: null },
    ...buildingsStore.buildings.map(building => ({
      title: building.name,
      value: building.id
    }))
  ]
}

// Theme toggle
const toggleDarkMode = () => {
  theme.global.name.value = darkMode.value ? 'dark' : 'light'
  saveSettings()
}

// Update interface density
const updateDensity = () => {
  // In a real app, this would update the density in Vuetify
  console.log('Density changed to:', density.value)
  saveSettings()
}

// Save user settings
const saveUserSettings = () => {
  console.log('Saving user settings:', userSettings.value)
  saveSettings()
}

// Save settings to localStorage
const saveSettings = () => {
  const settings = {
    darkMode: darkMode.value,
    density: density.value,
    notifications: notifications.value,
    userSettings: userSettings.value
  }
  localStorage.setItem('porterTrackSettings', JSON.stringify(settings))
}

// Load settings from localStorage
const loadSettings = () => {
  try {
    const savedSettings = localStorage.getItem('porterTrackSettings')
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      darkMode.value = settings.darkMode
      density.value = settings.density || 'default'
      notifications.value = settings.notifications || notifications.value
      userSettings.value = settings.userSettings || userSettings.value
      
      // Apply theme
      theme.global.name.value = darkMode.value ? 'dark' : 'light'
    }
  } catch (error) {
    console.error('Error loading settings:', error)
  }
}
</script>
