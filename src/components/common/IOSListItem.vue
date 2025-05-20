<template>
  <div class="ios-list-item" :class="{ 'ios-list-item--editing': isEditing }">
    <!-- View Mode -->
    <div v-if="!isEditing" class="ios-list-item__content">
      <!-- Left Icon -->
      <v-icon 
        v-if="icon" 
        :icon="icon" 
        :color="iconColor"
        class="ios-list-item__icon mr-3"
      ></v-icon>
      
      <!-- Content Area -->
      <div class="ios-list-item__text" @click="startEditing">
        <div class="ios-list-item__primary">{{ modelValue }}</div>
        <div v-if="secondary" class="ios-list-item__secondary">{{ secondary }}</div>
      </div>
      
      <!-- Actions -->
      <div class="ios-list-item__actions">
        <slot name="actions">
          <v-btn 
            v-if="departmentAssignable" 
            icon="mdi-office-building-outline" 
            density="comfortable" 
            variant="text" 
            size="small" 
            :color="hasDepartment ? departmentColor : 'grey'"
            @click.stop="$emit('assign-department')"
          ></v-btn>
          <v-btn 
            v-if="editable" 
            icon="mdi-pencil-outline" 
            density="comfortable" 
            variant="text" 
            size="small" 
            color="primary" 
            @click.stop="startEditing"
          ></v-btn>
          <v-btn 
            v-if="deletable" 
            icon="mdi-delete-outline" 
            density="comfortable" 
            variant="text" 
            size="small" 
            color="error" 
            @click.stop="$emit('delete')"
          ></v-btn>
        </slot>
      </div>
    </div>
    
    <!-- Edit Mode -->
    <div v-else class="ios-list-item__edit">
      <v-text-field
        ref="inputField"
        v-model="editValue"
        :placeholder="placeholder"
        variant="underlined"
        color="primary"
        hide-details
        density="comfortable"
        bg-color="transparent"
        class="ios-list-item__input"
        @keyup.enter="saveEdit"
        @keyup.esc="cancelEdit"
        @blur="handleBlur"
      ></v-text-field>
      
      <div class="ios-list-item__edit-actions">
        <v-btn
          icon="mdi-close"
          variant="text"
          density="comfortable"
          size="small" 
          color="error"
          @click.stop="cancelEdit"
        ></v-btn>
        <v-btn
          icon="mdi-check"
          variant="text"
          density="comfortable"
          size="small"
          color="success"
          @click.stop="saveEdit"
        ></v-btn>
      </div>
    </div>
    
    <!-- Extra Slot for Additional Content -->
    <slot></slot>
  </div>
</template>

<script setup>
import { ref, nextTick, computed, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  },
  secondary: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  iconColor: {
    type: String,
    default: 'primary'
  },
  editable: {
    type: Boolean,
    default: true
  },
  deletable: {
    type: Boolean,
    default: true
  },
  placeholder: {
    type: String,
    default: 'Enter text'
  },
  departmentAssignable: {
    type: Boolean,
    default: false
  },
  hasDepartment: {
    type: Boolean,
    default: false
  },
  departmentColor: {
    type: String,
    default: 'primary'
  }
})

const emit = defineEmits(['update:modelValue', 'delete', 'edit:start', 'edit:cancel', 'edit:save', 'assign-department'])

const isEditing = ref(false)
const editValue = ref('')
const inputField = ref(null)

// Watchers
watch(() => props.modelValue, (newValue) => {
  if (!isEditing.value) {
    editValue.value = newValue
  }
})

// Methods
const startEditing = () => {
  if (!props.editable) return
  
  editValue.value = props.modelValue
  isEditing.value = true
  emit('edit:start')
  
  // Focus the input field after the DOM updates
  nextTick(() => {
    if (inputField.value) {
      inputField.value.focus()
    }
  })
}

const saveEdit = () => {
  if (editValue.value.trim()) {
    emit('update:modelValue', editValue.value)
    emit('edit:save', editValue.value)
  }
  isEditing.value = false
}

const cancelEdit = () => {
  editValue.value = props.modelValue
  isEditing.value = false
  emit('edit:cancel')
}

const handleBlur = (event) => {
  // Only cancel if clicking outside both the input and the edit buttons
  const isClickOnEditButtons = event.relatedTarget && 
                              event.relatedTarget.closest('.ios-list-item__edit-actions')
  
  if (!isClickOnEditButtons) {
    cancelEdit()
  }
}
</script>

<style scoped>
.ios-list-item {
  padding: 12px 16px;
  transition: background-color 0.2s ease;
  border-radius: 8px;
  margin-bottom: 1px;
}

.ios-list-item:hover {
  background-color: rgba(0, 0, 0, 0.03);
}

.ios-list-item__content {
  display: flex;
  align-items: center;
  min-height: 44px;
  position: relative;
  width: 100%;
  justify-content: space-between;
}

.ios-list-item__text {
  flex: 1;
  cursor: text;
  text-align: left;
  max-width: calc(100% - 120px); /* Reserve space for action buttons */
  overflow: hidden;
  text-overflow: ellipsis;
}

.ios-list-item__primary {
  font-size: 17px;
  font-weight: 400;
  color: #000000;
  line-height: 1.3;
  text-align: left;
}

.ios-list-item__secondary {
  font-size: 14px;
  color: #8E8E93;
  margin-top: 2px;
  text-align: left;
}

.ios-list-item__actions {
  display: flex;
  gap: 8px;
  margin-left: 16px; /* Fixed spacing from text */
  justify-content: flex-end; /* Ensure right alignment */
  min-width: 100px; /* Minimum width for action buttons */
  position: relative; /* Allow for absolute positioning if needed */
  flex-shrink: 0; /* Prevent shrinking */
}

.ios-list-item__edit {
  display: flex;
  align-items: center;
}

.ios-list-item__input {
  flex: 1;
}

.ios-list-item__edit-actions {
  display: flex;
  gap: 4px;
}

.ios-list-item--editing {
  background-color: rgba(0, 122, 255, 0.05);
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .ios-list-item__primary {
    color: #FFFFFF;
  }
  
  .ios-list-item__secondary {
    color: #98989D;
  }
  
  .ios-list-item:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
  
  .ios-list-item--editing {
    background-color: rgba(10, 132, 255, 0.1);
  }
}
</style>
