<template>
  <div class="time-input">
    <label v-if="label" :for="id" class="time-input__label">{{ label }}</label>
    
    <div class="time-input__field">
      <v-text-field
        :id="id"
        type="datetime-local"
        :model-value="formattedValue"
        :placeholder="placeholder"
        :hint="hint"
        :disabled="disabled"
        :density="density"
        :readonly="readonly"
        :variant="variant"
        :color="color"
        :hide-details="hideDetails"
        @update:model-value="updateValue"
        @blur="$emit('blur', $event)"
        class="time-input__control"
      ></v-text-field>
      
      <div v-if="showNowButton" class="time-input__now-button">
        <v-btn
          size="small"
          variant="text"
          density="compact"
          color="primary"
          @click="setToNow"
        >
          Now
        </v-btn>
      </div>
    </div>
    
    <div v-if="error" class="time-input__error">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: [Date, String],
    default: null
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  hint: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  showNowButton: {
    type: Boolean,
    default: true
  },
  hideDetails: {
    type: Boolean,
    default: false
  },
  variant: {
    type: String,
    default: 'outlined'
  },
  color: {
    type: String,
    default: 'primary'
  },
  density: {
    type: String,
    default: 'comfortable'
  }
})

const emit = defineEmits(['update:modelValue', 'blur'])

// Generate a unique ID for the input field
const id = ref(`time-input-${Math.random().toString(36).substr(2, 9)}`)

// Format the value for the input
const formattedValue = computed(() => {
  if (!props.modelValue) return ''
  
  const date = props.modelValue instanceof Date 
    ? props.modelValue 
    : new Date(props.modelValue)
  
  if (isNaN(date.getTime())) return ''
  
  // Format as yyyy-MM-ddThh:mm (format required by datetime-local input)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  
  return `${year}-${month}-${day}T${hours}:${minutes}`
})

// Update the model value when the input changes
const updateValue = (newValue) => {
  if (!newValue) {
    emit('update:modelValue', null)
    return
  }
  
  const date = new Date(newValue)
  if (!isNaN(date.getTime())) {
    emit('update:modelValue', date)
  }
}

// Set the time to the current time
const setToNow = () => {
  const now = new Date()
  emit('update:modelValue', now)
}
</script>

<style scoped>
.time-input {
  margin-bottom: 16px;
}

.time-input__label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
  color: rgba(0, 0, 0, 0.6);
}

.time-input__field {
  display: flex;
  align-items: center;
}

.time-input__control {
  flex: 1;
}

.time-input__now-button {
  margin-left: 8px;
}

.time-input__error {
  color: #FF3B30;
  font-size: 12px;
  margin-top: 4px;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .time-input__label {
    color: rgba(255, 255, 255, 0.7);
  }
  
  .time-input__error {
    color: #FF453A;
  }
}
</style>
