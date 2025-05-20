<template>
  <div class="settings-view">
    <!-- Page Header -->
    <header class="page-header">
      <h1 class="page-title">Settings</h1>
    </header>

    <!-- Tab Navigation -->
    <div class="settings-tabs">
      <ul class="tab-list">
        <li 
          v-for="tab in tabs" 
          :key="tab.value"
          class="tab-item"
          :class="{ 'active': currentTab === tab.value }"
          @click="currentTab = tab.value"
        >
          {{ tab.label }}
        </li>
      </ul>
    </div>

    <!-- Tab Contents -->
    <div class="tab-content">
      <div v-show="currentTab === 'buildings'" class="tab-panel">
        <BuildingsTab />
      </div>
      
      <div v-show="currentTab === 'tasks'" class="tab-panel">
        <TasksTab />
      </div>
      
      <div v-show="currentTab === 'staff'" class="tab-panel">
        <StaffTab />
      </div>
      
      <div v-show="currentTab === 'app'" class="tab-panel">
        <AppSettingsTab />
      </div>
    </div>
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

// Tab definitions
const tabs = [
  { value: 'buildings', label: 'Buildings' },
  { value: 'tasks', label: 'Tasks' },
  { value: 'staff', label: 'Staff' },
  { value: 'app', label: 'App Settings' }
]

// Watch for direct URL navigation with query params
watch(() => route.query.tab, (newTab) => {
  if (newTab && tabs.some(tab => tab.value === newTab)) {
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
  if (tabParam && tabs.some(tab => tab.value === tabParam)) {
    currentTab.value = tabParam
  }
})
</script>

<style lang="scss" scoped>
.settings-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: $spacing-4;
  height: 100%;
  
  @include responsive(md) {
    padding: $spacing-6;
  }
}

.page-header {
  padding: $spacing-4 0;
  text-align: center;
  
  @include responsive(md) {
    padding: $spacing-6 0;
  }
}

.page-title {
  font-size: $font-size-2xl;
  font-weight: $font-weight-medium;
  margin: 0;
}

.settings-tabs {
  margin-bottom: $spacing-6;
}

.tab-list {
  display: flex;
  align-items: center;
  justify-content: center;
  list-style: none;
  padding: 0;
  margin: 0;
  border-bottom: 1px solid $color-gray-200;
  overflow-x: auto;
  
  // Allow overflow scrolling on smaller screens
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
}

.tab-item {
  padding: $spacing-3 $spacing-4;
  min-width: 120px;
  font-weight: $font-weight-normal;
  color: $color-gray-600;
  cursor: pointer;
  text-align: center;
  transition: $transition-base;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: transparent;
    transition: $transition-base;
  }
  
  &.active {
    color: $color-primary;
    font-weight: $font-weight-medium;
    
    &::after {
      background-color: $color-primary;
    }
  }
  
  &:hover:not(.active) {
    color: $color-gray-800;
  }
}

.tab-content {
  min-height: 400px;
}

.tab-panel {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
