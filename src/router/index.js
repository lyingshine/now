import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/jobs',
    name: 'Jobs',
    component: () => import('../views/Jobs.vue')
  },
  {
    path: '/growth',
    name: 'Growth',
    component: () => import('../views/Growth.vue')
  },
  {
    path: '/growth/:id',
    name: 'GrowthDetail',
    component: () => import('../views/GrowthDetail.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
