<template>
  <div class="app">
    <!-- Top App Bar with Navigation -->
    <header class="app-header">
      <div v-if="shouldShowBackButton" class="header-with-back">
        <button class="back-button" @click="goBack">
          <span class="icon back-icon">&larr;</span>
          <span>Back</span>
        </button>
        <h1 class="app-header-title">{{ pageTitle }}</h1>
      </div>
      <div v-else class="header-with-title">
        <h1 class="app-header-title">Porter Track</h1>
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
              <span class="icon">&#8962;</span>
            </router-link>
          </li>
          
          <li class="nav-item">
            <router-link 
              class="nav-link" 
              :class="{ active: $route.path === '/shifts' && !$route.params.id }"
              :to="{ path: '/shifts' }"
            >
              <span class="icon">&#8986;</span>
            </router-link>
          </li>
          
          <li class="nav-item">
            <router-link 
              class="nav-link" 
              :class="{ active: $route.path === '/settings' }"
              :to="{ path: '/settings', query: { tab: 'app' } }"
            >
              <span class="icon">&#9881;</span>
            </router-link>
          </li>
          
          <li v-if="activeShift" class="nav-item">
            <router-link 
              class="nav-link" 
              :class="{ active: $route.path.startsWith('/shifts/') }"
              :to="{ name: 'ShiftManagement', params: { id: activeShift.id } }"
            >
              <span class="icon">&#128197;</span>
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

const route = useRoute()
const router = useRouter()
const shiftsStore = useShiftsStore()

// Get active shift for current shift button
const activeShift = computed(() => shiftsStore.activeShift)

// Determine if we should show back button (only on non-root routes)
const shouldShowBackButton = computed(() => {
  return route.path !== '/'
})

// Dynamic page title based on current route
const pageTitle = computed(() => {
  if (route.path === '/settings') {
    if (route.query.tab === 'buildings') return 'Buildings'
    if (route.query.tab === 'tasks') return 'Tasks'
    return 'Settings'
  }
  return 'Porter Track'
})

// Go back function
const goBack = () => {
  router.go(-1)
}

// Fetch shifts on app mount to have data for the header nav
onMounted(async () => {
  await shiftsStore.fetchShifts()
})
</script>

<style lang="scss" scoped>
.header-with-back {
  display: flex;
  align-items: center;
  gap: 1rem;
  
  .back-button {
    display: flex;
    align-items: center;
    background: none;
    border: none;
    color: $color-primary;
    cursor: pointer;
    padding: 0;
    
    .back-icon {
      margin-right: 0.25rem;
    }
  }
  
  .app-header-title {
    margin: 0;
  }
}

.header-with-title {
  display: flex;
  align-items: center;
  
  .app-header-title {
    margin: 0;
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
