<template>
  <div class="ios-list-item" :class="{ 'ios-list-item--editing': isEditing }">
    <!-- View Mode -->
    <div v-if="!isEditing" class="ios-list-item__content">
      <div class="ios-list-item__text" @click="startEditing">
        <div class="ios-list-item__primary">{{ modelValue }}</div>
        <div v-if="secondary" class="ios-list-item__secondary">{{ secondary }}</div>
      </div>
      
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
    <div v-else class="ios-list-item__content">
      <div class="ios-list-item__text">
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
      </div>
      
      <div class="ios-list-item__actions">
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
  </div>
</template>

<script setup>
import { ref, nextTick, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  },
  secondary: {
    type: String,
    default: ''
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
                              event.relatedTarget.closest('.ios-list-item__actions')
  
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
  justify-content: space-between;
  align-items: center;
  min-height: 44px;
  width: 100%;
}

.ios-list-item__text {
  flex: 1;
  cursor: text;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-right: 16px;
  text-align: left;
}

.ios-list-item__primary {
  font-size: 17px;
  font-weight: 400;
  color: #000000;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
}

.ios-list-item__secondary {
  font-size: 14px;
  color: #8E8E93;
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
}

.ios-list-item__actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  min-width: 100px;
  flex-shrink: 0;
}

.ios-list-item__input {
  width: 100%;
  margin: 0;
  padding: 0;
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
