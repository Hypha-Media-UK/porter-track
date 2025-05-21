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
    
    <!-- Material Design Icons -->
    <template v-else-if="type === 'md'">
      <i class="mdi" :class="`mdi-${getMaterialIcon()}`" :style="{ fontSize: size + 'px' }"></i>
    </template>
    
    <!-- HTML entity or Unicode symbols -->
    <template v-else>
      {{ getIconSymbol() }}
    </template>
  </span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  size: {
    type: [String, Number],
    default: '24'
  },
  type: {
    type: String,
    default: 'md',
    validator: (value) => ['symbol', 'svg', 'md'].includes(value)
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

// Get the material design icon name
function getMaterialIcon() {
  // Map our icon names to Material Design icon names
  const mdIconMap = {
    // Navigation icons
    'home': 'home',
    'back': 'arrow-left',
    'forward': 'arrow-right',
    'settings': 'cog',
    'menu': 'menu',
    'add': 'plus',
    'remove': 'minus',
    'close': 'close',
    'search': 'magnify',
    
    // Added new navigation icons
    'view-dashboard': 'view-dashboard',
    'calendar-clock': 'calendar-clock',
    'cog-box': 'cog-box',
    'clipboard-check': 'clipboard-check',
    
    // Action icons
    'check': 'check',
    'calendar': 'calendar',
    'clock': 'clock-outline',
    'edit': 'pencil',
    'delete': 'delete',
    'save': 'content-save',
    'download': 'download',
    'upload': 'upload',
    'refresh': 'refresh',
    
    // Status icons
    'info': 'information',
    'warning': 'alert',
    'error': 'alert-circle',
    'success': 'check-circle',
    
    // Content icons
    'user': 'account',
    'users': 'account-group',
    'message': 'message',
    'notification': 'bell',
    'favorite': 'star',
    'heart': 'heart',
    'mail': 'email',
    'phone': 'phone',
    'location': 'map-marker',
    'file': 'file',
    'folder': 'folder',
    'building': 'office-building',
    'department': 'sitemap',
    
    // Additional directional icons
    'arrow-down': 'chevron-down',
    'arrow-up': 'chevron-up'
  }
  
  return mdIconMap[props.name] || `${props.name}`
}

// Get the icon symbol based on name (for backward compatibility)
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
@use '../../scss/index' as s;

.icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  
  i.mdi {
    font-size: 24px; // Default size if none provided
    line-height: 1;
    width: 1em;
    height: 1em;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
