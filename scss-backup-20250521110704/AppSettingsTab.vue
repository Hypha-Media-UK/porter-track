<template>
  <section class="app-settings-tab">
    <!-- Header -->
    <div class="section-header mb-6">
      <h2 class="section-title">App Settings</h2>
      <p class="section-description text-gray-600">Application settings and information</p>
    </div>
    
    <!-- Department Designations -->
    <DepartmentDesignationsList class="mb-6" />
    
    <!-- App Info -->
    <Card>
      <template #header>
        <h3 class="card-title">About Porter Track</h3>
      </template>
      
      <div class="app-info">
        <p class="mb-2">Version: 1.0.0</p>
        <p class="mb-2">Porter Track is an application designed to assist hospital porters in tracking tasks throughout their shifts.</p>
        <p>The app helps manage buildings, departments, tasks, and task items efficiently.</p>
      </div>
    </Card>
  </section>
</template>

<script setup>
import Card from '../common/Card.vue'
import DepartmentDesignationsList from '../departments/DepartmentDesignationsList.vue'
</script>

<style lang="scss" scoped>
.app-settings-tab {
  max-width: 800px;
  margin: 0 auto;
  padding: $spacing-4;
}

.section-header {
  margin-bottom: $spacing-6;
}

.section-title {
  font-size: $font-size-2xl;
  font-weight: $font-weight-medium;
  margin-bottom: $spacing-2;
}

.section-description {
  font-size: $font-size-md;
}

.app-info {
  line-height: $line-height-base;
  
  p {
    margin-bottom: $spacing-3;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
