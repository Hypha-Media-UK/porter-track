<template>
  <section class="app-settings-tab">
    <!-- Header -->
    <div class="app-settings-tab__header mb-6">
      <h1 class="text-h4 font-weight-medium mb-1">App Settings</h1>
      <p class="text-body-1 text-medium-emphasis">Application settings and information</p>
    </div>
    
    <!-- App Info -->
    <IOSCard>
      <div class="ios-card-header">
        <span>About Porter Track</span>
      </div>
      
      <div class="ios-card-content">
        <div class="app-info">
          <p class="mb-2">Version: 1.0.0</p>
          <p class="mb-2">Porter Track is an application designed to assist hospital porters in tracking tasks throughout their shifts.</p>
          <p>The app helps manage buildings, departments, tasks, and task items efficiently.</p>
        </div>
      </div>
    </IOSCard>
  </section>
</template>

<script setup>
import IOSCard from '../common/IOSCard.vue'
</script>

<style scoped>
.app-settings-tab {
  max-width: 800px;
  margin: 0 auto;
  padding: 16px;
}

.app-info {
  line-height: 1.5;
}
</style>
