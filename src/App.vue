<template>
  <div id="app" :class="{ 'dark': isDark }">
    <Navbar />
    <router-view />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Navbar from './components/Navbar.vue'
import { useQuestStore } from './stores/quest'
import { useJobsStore } from './stores/jobs'
import { needsMigration, migrateOldData, cleanupOldData } from './utils/dataMigration'
import jobsData from './data/jobs-data.js'

const isDark = ref(false)

onMounted(() => {
  const theme = localStorage.getItem('theme') || 'light'
  isDark.value = theme === 'dark'
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  }

  // 执行数据迁移
  performDataMigration()
})

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
  transition: background 0.3s, color 0.3s;
}
</style>
