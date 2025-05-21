<template>
  <div class="app">
    <!-- Top App Bar with Navigation -->
    <header class="app-header">
      <div class="header-with-title">
        <h1 class="app-header-title">{{ pageTitle }}</h1>
      </div>
      
      <!-- Header Navigation Icons -->
      <nav class="app-nav">
        <ul class="nav-list">
          <li class="nav-item">
            <router-link 
              class="nav-link" 
              :class="{ active: $route.path === '/' }"
              :to="{ path: '/' }"
            >
              <Icon name="view-dashboard" type="md" size="24" />
            </router-link>
          </li>
          
          <li class="nav-item">
            <router-link 
              class="nav-link" 
              :class="{ active: $route.path === '/shifts' && !$route.params.id }"
              :to="{ path: '/shifts' }"
            >
              <Icon name="calendar-clock" type="md" size="24" />
            </router-link>
          </li>
          
          <li class="nav-item">
            <router-link 
              class="nav-link" 
              :class="{ active: $route.path === '/settings' }"
              :to="{ path: '/settings', query: { tab: 'app' } }"
            >
              <Icon name="cog-box" type="md" size="24" />
            </router-link>
          </li>
          
          <li v-if="activeShift" class="nav-item">
            <router-link 
              class="nav-link" 
              :class="{ active: $route.path.startsWith('/shifts/') }"
              :to="{ name: 'ShiftManagement', params: { id: activeShift.id } }"
            >
              <Icon name="clipboard-check" type="md" size="24" />
            </router-link>
          </li>
        </ul>
      </nav>
    </header>

    <!-- Main Content -->
    <main class="app-main">
      <div class="container">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useShiftsStore } from './stores/shifts'
import Icon from './components/common/Icon.vue'

const route = useRoute()
const router = useRouter()
const shiftsStore = useShiftsStore()

// Get active shift for current shift button
const activeShift = computed(() => shiftsStore.activeShift)

// Dynamic page title based on current route
const pageTitle = computed(() => {
  if (route.path === '/settings') {
    if (route.query.tab === 'buildings') return 'Buildings'
    if (route.query.tab === 'tasks') return 'Tasks'
    if (route.query.tab === 'staff') return 'Staff'
    return 'Settings'
  } else if (route.path === '/shifts' && !route.params.id) {
    return 'Shift Archive'
  } else if (route.path.startsWith('/shifts/')) {
    return 'Shift Management'
  }
  return 'Porter Track'
})

// Fetch shifts on app mount to have data for the header nav
onMounted(async () => {
  await shiftsStore.fetchShifts()
})
</script>

<style lang="scss" scoped>
@use './scss/index' as s;

.header-with-title {
  display: flex;
  align-items: center;
  
  .app-header-title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
  }
}

// Fade transition
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
