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
          primary: '#2563EB',    // Modern blue
          secondary: '#0D9488',  // Teal
          accent: '#8B5CF6',     // Purple
          error: '#EF4444',      // Modern red
          info: '#3B82F6',       // Light blue
          success: '#10B981',    // Green
          warning: '#F59E0B',    // Amber
          background: '#F9FAFB', // Light gray background
        },
      },
      dark: {
        colors: {
          primary: '#3B82F6',    // Lighter blue for dark mode
          secondary: '#14B8A6',  // Lighter teal for dark mode
          accent: '#A78BFA',     // Lighter purple for dark mode
          error: '#F87171',      // Light red
          info: '#60A5FA',       // Very light blue
          success: '#34D399',    // Light green
          warning: '#FBBF24',    // Light amber
          background: '#1F2937', // Dark background
        },
      },
    },
  },
  display: {
    mobileBreakpoint: 'sm',
  },
  // Defaults for components to reduce nesting
  defaults: {
    VCard: {
      flat: true,
      elevation: 2,
      rounded: 'lg',
    },
    VBtn: {
      variant: 'elevated',
      rounded: 'pill',
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
    },
    VSelect: {
      variant: 'outlined',
      density: 'comfortable',
    },
    VList: {
      elevation: 0,
      rounded: 'lg',
    },
  },
})

export default vuetify
