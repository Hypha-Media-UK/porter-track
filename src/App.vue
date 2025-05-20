<template>
  <v-app class="ios-app">
    <!-- Top App Bar with Navigation -->
    <v-app-bar flat class="ios-app-bar">
      <template v-if="shouldShowBackButton">
        <v-btn icon @click="goBack">
          <v-icon>mdi-chevron-left</v-icon>
          <span class="ml-1 ios-back-text">Back</span>
        </v-btn>
        <v-app-bar-title class="text-center font-weight-medium">
          {{ pageTitle }}
        </v-app-bar-title>
      </template>
      <template v-else>
        <v-app-bar-title class="text-center font-weight-medium">
          Porter Track
        </v-app-bar-title>
      </template>
      
      <!-- Header Navigation Icons -->
      <template v-slot:append>
        <div class="d-flex align-center">
          <v-btn
            icon
            :color="$route.path === '/' ? 'primary' : ''"
            :to="{ path: '/' }"
          >
            <v-icon>mdi-home-outline</v-icon>
          </v-btn>
          
          <v-btn
            icon
            :color="$route.path === '/shifts' && !$route.params.id ? 'primary' : ''"
            :to="{ path: '/shifts' }"
          >
            <v-icon>mdi-history</v-icon>
          </v-btn>
          
          <v-btn
            icon
            :color="$route.path === '/settings' ? 'primary' : ''"
            :to="{ path: '/settings', query: { tab: 'app' } }"
          >
            <v-icon>mdi-cog-outline</v-icon>
          </v-btn>
          
          <v-btn
            v-if="activeShift"
            icon
            :color="$route.path.startsWith('/shifts/') ? 'primary' : ''"
            :to="{ name: 'ShiftManagement', params: { id: activeShift.id } }"
          >
            <v-icon>mdi-clipboard-clock-outline</v-icon>
          </v-btn>
        </div>
      </template>
    </v-app-bar>

    <!-- Main Content -->
    <v-main class="ios-main">
      <v-container fluid class="pa-0 fill-height">
        <router-view v-slot="{ Component }">
          <transition name="ios-fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </v-container>
    </v-main>
  </v-app>
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

<style>
/* Global iOS-style app styles */
.ios-app {
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color-scheme: light dark;
}

/* iOS-style app bar */
.ios-app-bar {
  font-weight: 500;
  height: 56px !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

/* iOS-style back button */
.ios-back-text {
  margin-left: 4px;
  font-weight: 500;
}

/* iOS-style transitions */
.ios-fade-enter-active,
.ios-fade-leave-active {
  transition: opacity 0.2s ease;
}

.ios-fade-enter-from,
.ios-fade-leave-to {
  opacity: 0;
}

/* iOS-style bottom navigation */
.ios-bottom-nav {
  height: 65px !important;
  box-shadow: 0 -1px 2px rgba(0, 0, 0, 0.05) !important;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.ios-bottom-nav .v-btn {
  font-weight: 500;
  border-radius: 0;
}

/* iOS main content area */
.ios-main {
  background-color: #F2F2F7;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .ios-app-bar {
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
  
  .ios-bottom-nav {
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    box-shadow: 0 -1px 2px rgba(0, 0, 0, 0.2) !important;
  }
  
  .ios-main {
    background-color: #1C1C1E;
  }
}

/* Remove extra padding from vuetify */
.v-main__wrap {
  padding: 0 !important;
}

/* Clean up vuetify defaults for iOS look */
:root {
  --v-card-border-radius: 14px;
}

.v-card {
  border-radius: var(--v-card-border-radius) !important;
}
</style>
