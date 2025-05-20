import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          // iOS-inspired colors
          primary: '#007AFF',      // iOS blue
          secondary: '#8E8E93',    // iOS gray
          error: '#FF3B30',        // iOS red
          info: '#5AC8FA',         // iOS light blue
          success: '#34C759',      // iOS green
          warning: '#FF9500',      // iOS orange
          background: '#F2F2F7',   // iOS light gray background
          surface: '#FFFFFF',      // White
        },
      },
      dark: {
        colors: {
          // iOS dark mode colors
          primary: '#0A84FF',      // iOS blue (dark mode)
          secondary: '#98989D',    // iOS gray (dark mode)
          error: '#FF453A',        // iOS red (dark mode)
          info: '#64D2FF',         // iOS light blue (dark mode)
          success: '#30D158',      // iOS green (dark mode)
          warning: '#FF9F0A',      // iOS orange (dark mode)
          background: '#1C1C1E',   // iOS dark background
          surface: '#2C2C2E',      // iOS dark surface
        },
      },
    },
  },
  defaults: {
    // iOS-inspired default component styles
    VCard: {
      elevation: 0,           // Flat design
      rounded: 'lg',          // Rounded corners
      class: 'ios-card',      // Custom class for additional styling
    },
    VBtn: {
      variant: 'tonal',       // Subtle styling
      rounded: 'pill',        // Rounded buttons
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
      color: 'primary',
    },
    VList: {
      elevation: 0,
      rounded: 'lg',
      bg: 'surface',
    },
    VListItem: {
      rounded: 'lg',
      class: 'ios-list-item',
    },
    VTabs: {
      color: 'primary',
      alignTabs: 'center',
      sliderColor: 'primary',
    },
    VDivider: {
      class: 'ios-divider',
    },
    VSnackbar: {
      location: 'top',
    },
    VNavigationDrawer: {
      bgColor: 'background',
    },
    VAppBar: {
      flat: true,
      color: 'background',
      height: 56,
    },
  },
})

export default vuetify
