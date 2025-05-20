<template>
  <span class="icon" :class="classes" aria-hidden="true">
    <!-- Different icon types -->
    <template v-if="type === 'svg'">
      <svg 
        :width="size" 
        :height="size" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round"
      >
        <component :is="svgPath" />
      </svg>
    </template>
    
    <!-- HTML entity or Unicode symbols -->
    <template v-else>
      {{ getIconSymbol() }}
    </template>
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  size: {
    type: [String, Number],
    default: '1em'
  },
  type: {
    type: String,
    default: 'symbol',
    validator: (value) => ['symbol', 'svg'].includes(value)
  },
  color: {
    type: String,
    default: 'currentColor'
  }
})

const classes = computed(() => {
  return {
    [`icon-${props.name}`]: true,
    [`text-${props.color}`]: props.color !== 'currentColor'
  }
})

const svgPath = computed(() => {
  // This would map icon names to SVG path components
  // For now we're using a simple approach with symbols
  return null
})

// Get the icon symbol based on name
function getIconSymbol() {
  // Map icon names to simple line-based symbols (Unicode)
  const iconMap = {
    // Navigation icons
    'home': '⌂',
    'back': '←',
    'forward': '→',
    'settings': '⚙',
    'menu': '☰',
    'add': '+',
    'remove': '−',
    'close': '×',
    'search': '⚲',
    
    // Action icons
    'check': '✓',
    'calendar': '⎙',
    'clock': '◷',
    'edit': '✎',
    'delete': '⌫',
    'save': '↓',
    'download': '↓',
    'upload': '↑',
    'refresh': '↻',
    
    // Status icons
    'info': 'ⓘ',
    'warning': '△',
    'error': '✕',
    'success': '✓',
    
    // Content icons
    'user': '◯',
    'users': '◯◯',
    'message': '◱',
    'notification': '◉',
    'favorite': '☆',
    'heart': '♡',
    'mail': '✉',
    'phone': '☏',
    'location': '◎',
    'file': '▣',
    'folder': '▢',
    'building': '⌷',
    'department': '□'
  }
  
  return iconMap[props.name] || props.name
}
</script>

<style lang="scss" scoped>
.icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1em;
  height: 1em;
  line-height: 0;
  vertical-align: middle;
  font-style: normal;
}
</style>
