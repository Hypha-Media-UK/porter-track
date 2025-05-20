<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar color="primary" app dark>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title>Porter Track</v-app-bar-title>
    </v-app-bar>

    <!-- Navigation Drawer for larger screens -->
    <v-navigation-drawer v-model="drawer" app temporary>
      <v-list>
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :to="item.path"
          @click="drawer = false"
        >
          <template v-slot:prepend>
            <v-icon>{{ item.icon }}</v-icon>
          </template>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>

    <!-- Bottom Navigation for Mobile -->
    <v-bottom-navigation color="primary" grow>
      <v-btn 
        v-for="item in menuItems" 
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
import { ref } from 'vue'

const drawer = ref(false)

const menuItems = [
  { title: 'Home', path: '/', icon: 'mdi-home' },
  { title: 'Buildings', path: '/buildings', icon: 'mdi-office-building' },
  { title: 'Tasks', path: '/tasks', icon: 'mdi-clipboard-list' },
  { title: 'Settings', path: '/settings', icon: 'mdi-cog' }
]
</script>

<style>
html, body {
  overflow-x: hidden;
  margin: 0;
  padding: 0;
}

.v-application {
  font-family: Roboto, sans-serif;
}

/* Hide bottom navigation on larger screens */
@media (min-width: 960px) {
  .v-bottom-navigation {
    display: none !important;
  }
}
</style>
