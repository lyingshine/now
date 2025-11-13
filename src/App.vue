<template>
  <div id="app" :class="{ 'dark': isDark }" :style="{ '--rank-color': rankColor }">
    <!-- 欢迎向导 -->
    <WelcomeWizard 
      :isOpen="showWelcomeWizard" 
      @close="showWelcomeWizard = false"
      @complete="handleWizardComplete"
    />
    
    <Navbar />
    <router-view />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Navbar from './components/Navbar.vue'
import WelcomeWizard from './components/WelcomeWizard.vue'
import { useUserStore } from './stores/user'
import { useQuestStore } from './stores/quest'
import { useJobsStore } from './stores/jobs'
import { useLifestyle } from './composables/useLifestyle'
import { needsMigration, migrateOldData, cleanupOldData } from './utils/dataMigration'
import jobsData from './data/jobs-data.js'

const isDark = ref(false)
const showWelcomeWizard = ref(false)
const { getRankInfo } = useLifestyle()

// 计算段位颜色
const rankColor = computed(() => {
  const userStore = useUserStore()
  const salary = userStore.userInfo.currentSalary || 10000
  const rankInfo = getRankInfo(salary)
  return rankInfo.current.color
})

onMounted(() => {
  // 初始化所有 store
  initializeStores()
  
  // 执行数据迁移
  performDataMigration()
  
  // 检查是否需要显示欢迎向导
  checkFirstTimeUser()
})

function initializeStores() {
  const userStore = useUserStore()
  const jobsStore = useJobsStore()
  const questStore = useQuestStore()
  
  // 加载用户数据
  userStore.loadFromStorage()
  
  // 加载任务数据
  jobsStore.loadFromStorage()
  questStore.loadFromStorage()
  
  // 设置主题
  const theme = userStore.userInfo.theme || localStorage.getItem('theme') || 'light'
  isDark.value = theme === 'dark'
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  }
  
  // 更新连续学习天数
  userStore.updateStreakDays()
  
  console.log('✅ 用户数据已加载:', userStore.userInfo.name)
}

function checkFirstTimeUser() {
  const userStore = useUserStore()
  const user = userStore.userInfo
  
  // 只检查是否已初始化
  if (!user.isInitialized) {
    // 延迟显示，让页面先渲染
    setTimeout(() => {
      showWelcomeWizard.value = true
      console.log('👋 首次使用，显示欢迎向导')
    }, 500)
  }
}

function handleWizardComplete() {
  showWelcomeWizard.value = false
  console.log('🎉 欢迎向导完成！')
  
  // 可以在这里添加一些欢迎提示或引导
  setTimeout(() => {
    alert('🎉 欢迎！你已经完成设置，现在可以开始探索职场成长之旅了！')
  }, 300)
}

function performDataMigration() {
  try {
    if (needsMigration()) {
      console.log('检测到旧数据，开始迁移...')
      
      const jobsStore = useJobsStore()
      const questStore = useQuestStore()
      
      // 加载旧数据
      jobsStore.loadFromStorage()
      
      // 迁移数据
      const migratedQuest = migrateOldData(jobsStore.learningPlans, jobsData)
      
      if (migratedQuest) {
        questStore.currentQuest = migratedQuest
        questStore.saveToStorage()
        console.log('数据迁移成功！')
        
        // 清理旧数据
        cleanupOldData()
      }
    }
  } catch (error) {
    console.error('数据迁移失败:', error)
  }
}
</script>

<style>
#app {
  min-height: 100vh;
  background: var(--bg-primary);
  color: var(--text-primary);
  transition: background 0.2s ease-out, color 0.2s ease-out;
}
</style>
