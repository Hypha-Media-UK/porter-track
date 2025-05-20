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
        slider-color="primary"
        bg-color="transparent"
      >
        <v-tab value="buildings" class="ios-tab" active-class="ios-tab--active">Buildings</v-tab>
        <v-tab value="tasks" class="ios-tab" active-class="ios-tab--active">Tasks</v-tab>
        <v-tab value="staff" class="ios-tab" active-class="ios-tab--active">Staff</v-tab>
        <v-tab value="app" class="ios-tab" active-class="ios-tab--active">App Settings</v-tab>
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
  padding: 4px;
  background-color: transparent;
  position: relative;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.ios-tab {
  min-width: 120px;
  font-weight: 400;
  transition: all 0.2s ease;
  position: relative;
  opacity: 0.7;
  border-radius: 0 !important;
  background-color: transparent !important;
}

.ios-tab--active {
  font-weight: 500;
  opacity: 1;
  color: #007AFF !important;
  background-color: transparent !important;
}

/* Override Vuetify's default tab styling */
:deep(.v-tab--selected) {
  background-color: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

:deep(.v-tab) {
  box-shadow: none !important;
  border: none !important;
  outline: none !important;
}

:deep(.v-tab:before),
:deep(.v-tab:after) {
  display: none !important;
}

:deep(.v-tabs__container),
:deep(.v-tabs-bar) {
  background-color: transparent !important;
  border: none !important;
}

/* Customizing Vuetify's tab slider */
:deep(.v-tabs-slider) {
  height: 2px !important;
  background-color: #007AFF !important;
}

.ios-settings-view__content {
  min-height: 400px;
}

@media (prefers-color-scheme: dark) {
  .ios-tabs {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .ios-tab--active {
    color: #0A84FF !important;
  }
  
  :deep(.v-tabs-slider) {
    background-color: #0A84FF !important;
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
