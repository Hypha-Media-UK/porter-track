import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

// Import Material Design Icons
import '@mdi/font/css/materialdesignicons.css'

// Import our custom SCSS
import './scss/main.scss'

// Create app instance
const app = createApp(App)

// Install plugins
app.use(createPinia())
app.use(router)

// Mount app
app.mount('#app')
