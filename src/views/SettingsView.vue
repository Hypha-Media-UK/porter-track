<template>
  <div class="settings-container">
    <!-- Page Header -->
    <header class="mb-4">
      <h1 class="text-h4 font-weight-medium mb-1">Settings</h1>
      <p class="text-subtitle-1 text-medium-emphasis">Configure Porter Track</p>
    </header>

    <!-- Tab Navigation -->
    <v-tabs
      v-model="currentTab"
      color="primary"
      align-tabs="center"
      class="mb-6"
      grow
    >
      <v-tab value="buildings" class="text-subtitle-1" prepend-icon="mdi-office-building-outline">
        Buildings
      </v-tab>
      <v-tab value="tasks" class="text-subtitle-1" prepend-icon="mdi-clipboard-text-outline">
        Tasks
      </v-tab>
      <v-tab value="app" class="text-subtitle-1" prepend-icon="mdi-cog-outline">
        App Settings
      </v-tab>
    </v-tabs>

    <!-- Tab Contents -->
    <v-window v-model="currentTab" class="settings-content">
      <!-- Buildings Tab Content -->
      <v-window-item value="buildings">
        <div class="tab-content">
          <BuildingsTab />
        </div>
      </v-window-item>
      
      <!-- Tasks Tab Content -->
      <v-window-item value="tasks">
        <div class="tab-content">
          <TasksTab />
        </div>
      </v-window-item>
      
      <!-- App Settings Tab Content -->
      <v-window-item value="app">
        <div class="tab-content">
          <AppSettingsTab />
        </div>
      </v-window-item>
    </v-window>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BuildingsTab from '../components/settings/BuildingsTab.vue'
import TasksTab from '../components/settings/TasksTab.vue'
import AppSettingsTab from '../components/settings/AppSettingsTab.vue'

const props = defineProps({
  activeTab: {
    type: String,
    default: 'app'
  }
})

const route = useRoute()
const router = useRouter()
const currentTab = ref(props.activeTab)

// Watch for direct URL navigation with query params
watch(() => route.query.tab, (newTab) => {
  if (newTab && ['buildings', 'tasks', 'app'].includes(newTab)) {
    currentTab.value = newTab
  }
})

// Update URL when tab changes
watch(currentTab, (newTab) => {
  if (route.query.tab !== newTab) {
    router.replace({ query: { ...route.query, tab: newTab } })
  }
})

// Set initial tab on mount
onMounted(() => {
  // If URL has a tab query param, use it
  const tabParam = route.query.tab
  if (tabParam && ['buildings', 'tasks', 'app'].includes(tabParam)) {
    currentTab.value = tabParam
  }
})
</script>

<style scoped>
.settings-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
}

.tab-content {
  min-height: 400px;
}

/* Add some tablet/desktop-specific styling */
@media (min-width: 768px) {
  .settings-container {
    padding: 24px;
  }
}
</style>
