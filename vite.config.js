import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "@/scss/_variables.scss";
          @import "@/scss/_mixins.scss";
        `
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Add alias for MDI fonts
      '@mdi/font': path.resolve(__dirname, 'node_modules/@mdi/font')
    }
  },
  // Ensure node_modules files are properly served
  server: {
    fs: {
      // Allow serving files from one level up from project root
      allow: ['..']
    }
  },
  optimizeDeps: {
    include: ['@mdi/font']
  }
})
