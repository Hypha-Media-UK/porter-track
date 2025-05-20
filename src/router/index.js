import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/SettingsView.vue'),
    props: (route) => ({ activeTab: route.query.tab || 'app' })
  },
  {
    path: '/shifts',
    name: 'Shifts',
    component: () => import('../views/ShiftManagementView.vue')
  },
  {
    path: '/shifts/:id',
    name: 'ShiftManagement',
    component: () => import('../views/ShiftManagementView.vue')
  },
  // Redirect legacy routes to the new tabbed settings
  {
    path: '/buildings',
    redirect: to => {
      return { path: '/settings', query: { tab: 'buildings' } }
    }
  },
  {
    path: '/tasks',
    redirect: to => {
      return { path: '/settings', query: { tab: 'tasks' } }
    }
  },
  // Catch-all redirect to home
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
