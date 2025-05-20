<template>
  <div class="ios-home">
    <!-- Welcome Header -->
    <div class="ios-home__header">
      <h1 class="text-h4 font-weight-medium mb-2">Welcome</h1>
      <p class="text-subtitle-1 text-medium-emphasis">
        Track hospital porter tasks efficiently
      </p>
    </div>
    
    <!-- Quick Access Cards -->
    <div class="ios-home__cards">
      <IOSCard
        v-for="item in menuItems"
        :key="item.title"
        class="ios-home__card"
        @click="navigateTo(item.path)"
      >
        <div class="ios-home__card-content">
          <v-icon
            :icon="item.icon"
            size="x-large"
            :color="item.color"
            class="mb-3"
          ></v-icon>
          <h2 class="text-h6 mb-1">{{ item.title }}</h2>
          <p class="text-body-2 text-center text-medium-emphasis">
            {{ item.description }}
          </p>
        </div>
      </IOSCard>
    </div>
    
    <!-- App Information -->
    <div class="ios-home__info">
      <p class="text-center text-caption text-medium-emphasis">
        Porter Track v1.0.0
      </p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import IOSCard from '../components/common/IOSCard.vue'

const router = useRouter()

// Menu items for quick access
const menuItems = [
  {
    title: 'Buildings',
    description: 'Manage hospital buildings and departments',
    path: '/settings?tab=buildings',
    icon: 'mdi-office-building-outline',
    color: 'primary'
  },
  {
    title: 'Tasks',
    description: 'Create and manage porter tasks',
    path: '/settings?tab=tasks',
    icon: 'mdi-clipboard-text-outline',
    color: 'secondary'
  },
  {
    title: 'Settings',
    description: 'Configure application preferences',
    path: '/settings?tab=app',
    icon: 'mdi-cog-outline',
    color: 'info'
  }
]

// Navigation function
const navigateTo = (path) => {
  router.push(path)
}
</script>

<style scoped>
.ios-home {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.ios-home__header {
  text-align: center;
  margin-bottom: 32px;
}

.ios-home__cards {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
}

.ios-home__card {
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.ios-home__card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.ios-home__card:active {
  transform: translateY(0);
  opacity: 0.9;
}

.ios-home__card-content {
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.ios-home__info {
  margin-top: 24px;
  padding: 16px;
}

@media (min-width: 768px) {
  .ios-home__cards {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .ios-home__card {
    flex: 0 0 calc(33.333% - 16px);
    max-width: calc(33.333% - 16px);
  }
}
</style>
