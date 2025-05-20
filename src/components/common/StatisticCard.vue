<template>
  <Card class="statistic-card" hover>
    <div class="statistic-card__content">
      <div class="statistic-card__icon" :class="`bg-${color || 'primary'}`">
        <span class="icon">{{ icon }}</span>
      </div>
      <div class="statistic-card__info">
        <h3 class="statistic-card__title">{{ title }}</h3>
        <p class="statistic-card__value">{{ value }}</p>
      </div>
    </div>
  </Card>
</template>

<script>
import Card from './Card.vue';

export default {
  name: 'StatisticCard',
  components: {
    Card
  },
  props: {
    title: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      required: true
    },
    icon: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: 'primary',
      validator: value => ['primary', 'secondary', 'accent', 'warning', 'error'].includes(value)
    }
  }
};
</script>

<style lang="scss" scoped>
.statistic-card {
  &__content {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3rem;
    height: 3rem;
    border-radius: 0.5rem;
    color: white;
    
    .icon {
      font-size: 1.5rem;
    }
  }
  
  &__info {
    flex: 1;
  }
  
  &__title {
    font-size: 0.875rem;
    color: #6c757d;
    margin-bottom: 0.25rem;
  }
  
  &__value {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
  }
}
</style>
