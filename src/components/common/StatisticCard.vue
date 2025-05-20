<template>
  <IOSCard class="statistic-card" :class="[`statistic-card--${color}`]">
    <div class="statistic-card__content">
      <div class="statistic-card__header">
        <h3 class="statistic-card__title">{{ title }}</h3>
        <v-icon v-if="icon" :icon="icon" :color="color" class="statistic-card__icon"></v-icon>
      </div>
      
      <div class="statistic-card__value">
        {{ value }}
      </div>
      
      <div v-if="description" class="statistic-card__description">
        {{ description }}
      </div>
      
      <div v-if="$slots.action" class="statistic-card__action">
        <slot name="action"></slot>
      </div>
    </div>
  </IOSCard>
</template>

<script setup>
import IOSCard from './IOSCard.vue'

defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'success', 'info', 'warning', 'error'].includes(value)
  }
})
</script>

<style scoped>
.statistic-card {
  height: 100%;
}

.statistic-card__content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.statistic-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.statistic-card__title {
  font-size: 16px;
  font-weight: 500;
  color: #666666;
  margin: 0;
}

.statistic-card__icon {
  font-size: 24px;
}

.statistic-card__value {
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 8px;
}

.statistic-card__description {
  font-size: 14px;
  color: #666666;
  margin-top: auto;
}

.statistic-card__action {
  margin-top: 16px;
}

/* Color variants */
.statistic-card--primary .statistic-card__value {
  color: #007AFF;
}

.statistic-card--secondary .statistic-card__value {
  color: #5856D6;
}

.statistic-card--success .statistic-card__value {
  color: #34C759;
}

.statistic-card--info .statistic-card__value {
  color: #64D2FF;
}

.statistic-card--warning .statistic-card__value {
  color: #FF9500;
}

.statistic-card--error .statistic-card__value {
  color: #FF3B30;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .statistic-card__title {
    color: #A0A0A5;
  }
  
  .statistic-card__description {
    color: #A0A0A5;
  }
  
  .statistic-card--primary .statistic-card__value {
    color: #0A84FF;
  }
  
  .statistic-card--secondary .statistic-card__value {
    color: #5E5CE6;
  }
  
  .statistic-card--success .statistic-card__value {
    color: #30D158;
  }
  
  .statistic-card--info .statistic-card__value {
    color: #64D2FF;
  }
  
  .statistic-card--warning .statistic-card__value {
    color: #FF9F0A;
  }
  
  .statistic-card--error .statistic-card__value {
    color: #FF453A;
  }
}
</style>
