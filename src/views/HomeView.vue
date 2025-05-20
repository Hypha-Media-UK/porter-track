<template>
  <div class="home-container">
    <!-- Welcome Banner -->
    <v-sheet 
      class="welcome-banner d-flex flex-column justify-center align-center text-center rounded-lg mb-8"
      color="primary"
      height="200"
    >
      <h1 class="text-h3 font-weight-bold text-white mb-2">Welcome to Porter Track</h1>
      <p class="text-subtitle-1 text-white">Efficiently manage hospital porter tasks and assignments</p>
    </v-sheet>

    <!-- Quick Access Cards -->
    <v-row>
      <v-col cols="12" md="4">
        <v-hover v-slot="{ isHovering, props }">
          <v-card
            v-bind="props"
            :elevation="isHovering ? 8 : 2"
            :class="{ 'on-hover': isHovering }"
            @click="navigateTo('/settings?tab=buildings')"
            height="180"
            class="d-flex flex-column align-center justify-center quick-access-card"
          >
            <v-icon icon="mdi-office-building-outline" size="x-large" color="primary" class="mb-4"></v-icon>
            <h2 class="text-h5 mb-1">Buildings</h2>
            <p class="text-body-2 text-center">Manage buildings and departments</p>
          </v-card>
        </v-hover>
      </v-col>

      <v-col cols="12" md="4">
        <v-hover v-slot="{ isHovering, props }">
          <v-card
            v-bind="props"
            :elevation="isHovering ? 8 : 2"
            :class="{ 'on-hover': isHovering }"
            @click="navigateTo('/settings?tab=tasks')"
            height="180"
            class="d-flex flex-column align-center justify-center quick-access-card"
          >
            <v-icon icon="mdi-clipboard-text-outline" size="x-large" color="secondary" class="mb-4"></v-icon>
            <h2 class="text-h5 mb-1">Tasks</h2>
            <p class="text-body-2 text-center">Manage porter tasks and assignments</p>
          </v-card>
        </v-hover>
      </v-col>

      <v-col cols="12" md="4">
        <v-hover v-slot="{ isHovering, props }">
          <v-card
            v-bind="props"
            :elevation="isHovering ? 8 : 2"
            :class="{ 'on-hover': isHovering }"
            @click="navigateTo('/settings?tab=app')"
            height="180"
            class="d-flex flex-column align-center justify-center quick-access-card"
          >
            <v-icon icon="mdi-cog-outline" size="x-large" color="accent" class="mb-4"></v-icon>
            <h2 class="text-h5 mb-1">Settings</h2>
            <p class="text-body-2 text-center">Configure application preferences</p>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>

    <!-- Features Section -->
    <v-sheet class="mt-8 pa-4 rounded-lg">
      <h2 class="text-h4 mb-4 text-center">Key Features</h2>
      
      <v-row class="mt-2">
        <v-col cols="12" md="6" lg="3">
          <div class="d-flex align-start mb-4">
            <v-icon icon="mdi-office-building-outline" color="primary" class="mr-4 mt-1"></v-icon>
            <div>
              <h3 class="text-h6 mb-1">Building Management</h3>
              <p class="text-body-2">Organize hospital buildings and departments efficiently</p>
            </div>
          </div>
        </v-col>

        <v-col cols="12" md="6" lg="3">
          <div class="d-flex align-start mb-4">
            <v-icon icon="mdi-clipboard-text-outline" color="secondary" class="mr-4 mt-1"></v-icon>
            <div>
              <h3 class="text-h6 mb-1">Task Tracking</h3>
              <p class="text-body-2">Create and manage porter tasks throughout shifts</p>
            </div>
          </div>
        </v-col>

        <v-col cols="12" md="6" lg="3">
          <div class="d-flex align-start mb-4">
            <v-icon icon="mdi-account-group-outline" color="info" class="mr-4 mt-1"></v-icon>
            <div>
              <h3 class="text-h6 mb-1">Department Assignment</h3>
              <p class="text-body-2">Assign tasks to specific hospital departments</p>
            </div>
          </div>
        </v-col>

        <v-col cols="12" md="6" lg="3">
          <div class="d-flex align-start mb-4">
            <v-icon icon="mdi-check-circle-outline" color="success" class="mr-4 mt-1"></v-icon>
            <div>
              <h3 class="text-h6 mb-1">Task Items</h3>
              <p class="text-body-2">Break down tasks into manageable steps</p>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-sheet>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateTo = (path) => {
  router.push(path)
}
</script>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
}

.welcome-banner {
  position: relative;
  overflow: hidden;
}

.welcome-banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(37, 99, 235, 0.8));
  z-index: 1;
}

.welcome-banner > * {
  position: relative;
  z-index: 2;
}

.quick-access-card {
  cursor: pointer;
  transition: all 0.3s;
}

.quick-access-card.on-hover {
  transform: translateY(-5px);
}

@media (min-width: 768px) {
  .home-container {
    padding: 24px;
  }
}
</style>
