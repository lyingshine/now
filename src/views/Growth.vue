<template>
  <div class="growth">
    <div class="container">
      <h1 class="page-title">🎮 冒险进度</h1>
      <p class="page-subtitle">查看你的任务进度，继续你的职业冒险！</p>
      
      <StatsGrid :stats="stats" />

      <EmptyState v-if="jobsStore.learningPlans.length === 0" />
      <TasksList 
        v-else 
        :plans="jobsStore.learningPlans" 
        @continue="goToDetail"
        @abandon="handleAbandon"
      />
    </div>

    <SettingsModal 
      :isOpen="isSettingsOpen"
      @close="isSettingsOpen = false"
      @save="handleSettingsSave"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useJobsStore } from '../stores/jobs'
import { useQuestStore } from '../stores/quest'
import { useGrowthStats } from '../composables/useGrowthStats'
import StatsGrid from '../components/growth/StatsGrid.vue'
import EmptyState from '../components/growth/EmptyState.vue'
import TasksList from '../components/growth/TasksList.vue'
import SettingsModal from '../components/SettingsModal.vue'

const router = useRouter()
const jobsStore = useJobsStore()
const questStore = useQuestStore()
const { stats } = useGrowthStats(jobsStore)
const isSettingsOpen = ref(false)

const goToDetail = (jobId) => {
  router.push(`/growth/${jobId}`)
}

const handleAbandon = (jobId) => {
  if (confirm('确定要放弃这个任务吗？所有学习进度将被清除。')) {
    // 同时更新两个 store 以保持兼容性
    jobsStore.abandonJob(jobId)
    questStore.abandonQuest()
  }
}

const handleSettingsSave = () => {
  location.reload()
}

onMounted(() => {
  jobsStore.loadFromStorage()
  questStore.loadFromStorage()
  
  window.addEventListener('openSettings', () => {
    isSettingsOpen.value = true
  })
})

onUnmounted(() => {
  window.removeEventListener('openSettings', () => {})
})
</script>

<style scoped>
.growth {
  padding: 3rem 2rem;
  min-height: 100vh;
  background: linear-gradient(135deg, #ecfdf5 0%, #dbeafe 50%, #fef3c7 100%);
  position: relative;
}

.growth::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 30%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.1) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

body.dark-mode .growth {
  background: linear-gradient(135deg, #0f172a 0%, #064e3b 50%, #1e293b 100%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.page-title {
  font-size: 3.5rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, var(--growth-primary) 0%, var(--growth-secondary) 50%, var(--color-accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

.page-subtitle {
  text-align: center;
  color: var(--text-secondary);
  margin-bottom: 3rem;
  font-size: 1.125rem;
  font-weight: 500;
}
</style>
