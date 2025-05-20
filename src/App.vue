<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar :elevation="2" rounded>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title class="text-h5 font-weight-medium">Porter Track</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn icon="mdi-magnify"></v-btn>
      <v-btn icon="mdi-bell-outline"></v-btn>
    </v-app-bar>

    <!-- Navigation Drawer for all screens -->
    <v-navigation-drawer v-model="drawer" temporary>
      <v-list nav>
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :to="item.path"
          :active="isActive(item.path)"
          @click="drawer = false"
          rounded="xl"
          class="mb-2"
        >
          <template v-slot:prepend>
            <v-icon>{{ item.icon }}</v-icon>
          </template>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
      
      <template v-slot:append>
        <div class="pa-4">
          <v-btn block prepend-icon="mdi-help-circle-outline">
            Help & Support
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </v-main>

    <!-- Footer Navigation for Mobile -->
    <v-bottom-navigation color="primary" grow>
      <v-btn 
        v-for="item in mobileNavItems" 
        :key="item.title" 
        :to="item.path"
        :value="item.title"
      >
        <v-icon>{{ item.icon }}</v-icon>
        {{ item.title }}
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const drawer = ref(false)

// Main menu items
const menuItems = [
  { title: 'Home', path: '/', icon: 'mdi-home-outline' },
  { title: 'Settings', path: '/settings', icon: 'mdi-cog-outline' }
]

// Mobile navigation includes a shortcut to buildings and tasks tabs
const mobileNavItems = [
  { title: 'Home', path: '/', icon: 'mdi-home-outline' },
  { title: 'Buildings', path: '/settings?tab=buildings', icon: 'mdi-office-building-outline' },
  { title: 'Tasks', path: '/settings?tab=tasks', icon: 'mdi-clipboard-text-outline' },
  { title: 'Settings', path: '/settings?tab=app', icon: 'mdi-cog-outline' }
]

// Helper to check if a route is active, including query params
const isActive = (path) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path.split('?')[0])
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Hide bottom navigation on larger screens */
@media (min-width: 960px) {
  .v-bottom-navigation {
    display: none !important;
  }
}
</style>
