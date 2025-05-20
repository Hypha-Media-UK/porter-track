<template>
  <div class="ios-settings-view">
    <!-- Page Header -->
    <header class="ios-settings-view__header">
      <h1 class="text-h4 font-weight-medium">Settings</h1>
    </header>

    <!-- Tab Navigation -->
    <div class="ios-settings-view__tabs">
      <v-tabs
        v-model="currentTab"
        color="primary"
        centered
        show-arrows
        class="mb-6 ios-tabs"
      >
        <v-tab value="buildings" class="ios-tab">Buildings</v-tab>
        <v-tab value="tasks" class="ios-tab">Tasks</v-tab>
        <v-tab value="staff" class="ios-tab">Staff</v-tab>
        <v-tab value="app" class="ios-tab">App Settings</v-tab>
      </v-tabs>
    </div>

    <!-- Tab Contents -->
    <v-window v-model="currentTab" class="ios-settings-view__content">
      <v-window-item value="buildings">
        <BuildingsTab />
      </v-window-item>
      
      <v-window-item value="tasks">
        <TasksTab />
      </v-window-item>
      
      <v-window-item value="staff">
        <StaffTab />
      </v-window-item>
      
      <v-window-item value="app">
        <AppSettingsTab />
      </v-window-item>
    </v-window>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BuildingsTab from '../components/settings/BuildingsTab.vue'
import TasksTab from '../components/settings/TasksTab.vue'
import StaffTab from '../components/settings/StaffTab.vue'
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
  if (newTab && ['buildings', 'tasks', 'staff', 'app'].includes(newTab)) {
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
  if (tabParam && ['buildings', 'tasks', 'staff', 'app'].includes(tabParam)) {
    currentTab.value = tabParam
  }
})
</script>

<style scoped>
.ios-settings-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
  height: 100%;
}

.ios-settings-view__header {
  padding: 16px 0;
  text-align: center;
}

.ios-tabs {
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0.03);
  padding: 4px;
}

.ios-tab {
  border-radius: 8px;
  min-width: 120px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.ios-settings-view__content {
  min-height: 400px;
}

@media (prefers-color-scheme: dark) {
  .ios-tabs {
    background-color: rgba(255, 255, 255, 0.05);
  }
}

@media (min-width: 768px) {
  .ios-settings-view {
    padding: 24px;
  }
  
  .ios-settings-view__header {
    padding: 24px 0;
  }
}
</style>
