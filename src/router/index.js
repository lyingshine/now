import { createRouter, createWebHistory } from 'vue-router'
import { useQuestStore } from '../stores/quest'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: { requiresNoActiveQuest: false }
  },
  {
    path: '/jobs',
    name: 'Jobs',
    component: () => import('../views/Jobs.vue'),
    meta: { 
      requiresNoActiveQuest: false,
      redirectIfActiveQuest: true 
    }
  },
  {
    path: '/growth',
    name: 'Growth',
    component: () => import('../views/Growth.vue'),
    meta: { requiresNoActiveQuest: false }
  },
  {
    path: '/growth/:id',
    name: 'GrowthDetail',
    component: () => import('../views/GrowthDetail.vue'),
    meta: { requiresNoActiveQuest: false }
  },
  {
    path: '/quest-history',
    name: 'QuestHistory',
    component: () => import('../views/QuestHistory.vue'),
    meta: { requiresNoActiveQuest: false }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫：当有活跃任务时，访问任务大厅会重定向到成长中心
router.beforeEach((to, from, next) => {
  const questStore = useQuestStore()
  
  // 如果路由设置了 redirectIfActiveQuest 且有活跃任务
  if (to.meta.redirectIfActiveQuest && questStore.hasActiveQuest) {
    // 重定向到成长中心
    next({ name: 'Growth' })
  } else {
    next()
  }
})

export default router
