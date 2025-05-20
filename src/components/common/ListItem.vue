<template>
  <div class="list-item" :class="{ 'is-editing': isEditing }">
    <!-- View Mode -->
    <div v-if="!isEditing" class="list-item__content">
      <div class="list-item__text" @click="startEditing">
        <div class="list-item__primary">{{ modelValue }}</div>
        <div v-if="secondary" class="list-item__secondary text-gray-600">{{ secondary }}</div>
      </div>
      
      <div class="list-item__actions">
        <slot name="actions">
          <button 
            v-if="departmentAssignable" 
            class="btn-icon" 
            :class="{'text-primary': hasDepartment, 'text-gray-500': !hasDepartment}"
            @click.stop="$emit('assign-department')"
            title="Assign to department"
          >
            <span class="icon">🏢</span>
          </button>
          
          <button 
            v-if="editable" 
            class="btn-icon text-primary" 
            @click.stop="startEditing"
            title="Edit"
          >
            <span class="icon">✎</span>
          </button>
          
          <button 
            v-if="deletable" 
            class="btn-icon text-error" 
            @click.stop="$emit('delete')"
            title="Delete"
          >
            <span class="icon">🗑️</span>
          </button>
        </slot>
      </div>
    </div>
    
    <!-- Edit Mode -->
    <div v-else class="list-item__content">
      <div class="list-item__text">
        <input
          ref="inputField"
          v-model="editValue"
          :placeholder="placeholder"
          class="list-item__input"
          @keyup.enter="saveEdit"
          @keyup.esc="cancelEdit"
          @blur="handleBlur"
        />
      </div>
      
      <div class="list-item__actions">
        <button
          class="btn-icon text-error"
          @click.stop="cancelEdit"
          title="Cancel"
        >
          <span class="icon">✕</span>
        </button>
        
        <button
          class="btn-icon text-accent"
          @click.stop="saveEdit"
          title="Save"
        >
          <span class="icon">✓</span>
        </button>
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
                              event.relatedTarget.closest('.list-item__actions')
  
  if (!isClickOnEditButtons) {
    cancelEdit()
  }
}
</script>

<style lang="scss" scoped>
.list-item {
  padding: $spacing-3 $spacing-4;
  transition: $transition-base;
  border-radius: $border-radius;
  margin-bottom: 1px;
  
  &:hover {
    background-color: $color-gray-100;
  }
  
  &.is-editing {
    background-color: rgba($color-primary, 0.05);
  }
}

.list-item__content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 44px;
  width: 100%;
}

.list-item__text {
  flex: 1;
  cursor: text;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-right: $spacing-4;
  text-align: left;
}

.list-item__primary {
  font-size: $font-size-md;
  font-weight: $font-weight-normal;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
}

.list-item__secondary {
  font-size: $font-size-sm;
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
}

.list-item__actions {
  display: flex;
  gap: $spacing-2;
  justify-content: flex-end;
  min-width: 100px;
  flex-shrink: 0;
}

.list-item__input {
  width: 100%;
  padding: $spacing-1 0;
  background: transparent;
  border: none;
  border-bottom: 1px solid $color-primary;
  font-size: $font-size-md;
  outline: none;
  
  &:focus {
    border-bottom: 2px solid $color-primary;
  }
}

.btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: $border-radius;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: $transition-base;
  
  &:hover {
    background-color: $color-gray-200;
  }
  
  .icon {
    font-size: $font-size-md;
  }
}
</style>
