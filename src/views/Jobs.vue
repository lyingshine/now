<template>
  <div class="jobs">
    <div class="container">
      <!-- 活跃任务警告 -->
      <div v-if="questStore.hasActiveQuest" class="active-quest-warning">
        <div class="warning-content">
          <span class="warning-icon">⚠️</span>
          <div class="warning-text">
            <h3>你已经有一个进行中的职业任务！</h3>
            <p>一次只能专注一个职业目标。请先完成或放弃当前任务。</p>
          </div>
          <router-link to="/growth" class="btn-view-current">
            查看当前任务
          </router-link>
        </div>
      </div>

      <div class="quest-hall-header">
        <h1 class="page-title">⚔️ 任务大厅</h1>
        <p class="page-subtitle">
          {{ questStore.hasActiveQuest ? '完成当前任务后可接取新任务' : '接取任务，获得奖励，升级你的职业生涯！' }}
        </p>
        <div class="quest-stats">
          <div class="quest-stat">
            <span class="stat-icon">📋</span>
            <span class="stat-text">{{ jobsStore.jobs.length }} 个可用任务</span>
          </div>
          <div class="quest-stat">
            <span class="stat-icon">🎯</span>
            <span class="stat-text">{{ questStore.hasActiveQuest ? '1 个进行中' : '0 个进行中' }}</span>
          </div>
        </div>
      </div>
      
      <JobsGrid
        :jobs="jobsStore.jobs"
        :isJobAccepted="isJobAccepted"
        :disabled="questStore.hasActiveQuest"
        @job-click="handleJobClick"
      />
    </div>

    <!-- 职位详情弹窗 -->
    <JobModal 
      :job="selectedJob"
      :isOpen="isModalOpen"
      @close="closeJobModal"
      @accept="handleAcceptJob"
    />

    <!-- 设置弹窗 -->
    <SettingsModal 
      :isOpen="isSettingsOpen"
      @close="isSettingsOpen = false"
      @save="handleSettingsSave"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useJobsStore } from '../stores/jobs'
import { useQuestStore } from '../stores/quest'
import { useJobModal } from '../composables/useJobModal'
import JobsGrid from '../components/jobs/JobsGrid.vue'
import JobModal from '../components/JobModal.vue'
import SettingsModal from '../components/SettingsModal.vue'
import jobsData from '../data/jobs-data.js'

const router = useRouter()
const jobsStore = useJobsStore()
const questStore = useQuestStore()
const { selectedJob, isModalOpen, openJobModal, closeJobModal } = useJobModal()
const isSettingsOpen = ref(false)

const isJobAccepted = (jobId) => {
  return jobsStore.userProgress[jobId]?.accepted || false
}

const handleJobClick = (job) => {
  // 检查是否有活跃任务
  if (questStore.hasActiveQuest) {
    alert('你已经有一个进行中的职业任务！请先完成或放弃当前任务。')
    return
  }
  
  openJobModal(job)
}

const handleAcceptJob = (jobId) => {
  const job = jobsStore.jobs.find(j => j.id === jobId)
  if (!job) return

  // 使用新的 quest store 接取任务
  const success = questStore.acceptQuest(jobId, job)
  
  if (success) {
    // 同时更新旧的 jobs store 以保持兼容性
    jobsStore.acceptJob(jobId)
    
    closeJobModal()
    
    // 跳转到成长中心
    router.push('/growth')
  } else {
    alert('接取任务失败，请稍后重试')
  }
}

const handleSettingsSave = () => {
  location.reload()
}

onMounted(() => {
  jobsStore.loadFromStorage()
  questStore.loadFromStorage()
  jobsStore.loadJobs(jobsData)
  questStore.loadJobs(jobsData)
  
  window.addEventListener('openSettings', () => {
    isSettingsOpen.value = true
  })
})

onUnmounted(() => {
  window.removeEventListener('openSettings', () => {})
})
</script>

<style scoped>
.jobs {
  padding: 3rem 2rem;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 50%, #fef3c7 100%);
  position: relative;
}

.jobs::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(245, 158, 11, 0.08) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

body.dark-mode .jobs {
  background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #1e293b 100%);
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
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 50%, var(--growth-primary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

.quest-hall-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-subtitle {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  font-size: 1.125rem;
  font-weight: 500;
}

.quest-stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 1rem;
}

.quest-stat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--glass-bg);
  border-radius: var(--radius-full);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-md);
  font-weight: 600;
}

.stat-icon {
  font-size: 1.25rem;
}

body.dark-mode .quest-stat {
  background: rgba(30, 41, 59, 0.7);
  border-color: rgba(255, 255, 255, 0.1);
}

/* 活跃任务警告 */
.active-quest-warning {
  margin-bottom: 2rem;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.warning-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(245, 158, 11, 0.1));
  border: 2px solid rgba(251, 191, 36, 0.3);
  border-radius: var(--radius-2xl);
  box-shadow: 0 4px 12px rgba(251, 191, 36, 0.2);
}

body.dark-mode .warning-content {
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(245, 158, 11, 0.15));
  border-color: rgba(251, 191, 36, 0.4);
}

.warning-icon {
  font-size: 2.5rem;
  flex-shrink: 0;
}

.warning-text {
  flex: 1;
}

.warning-text h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.warning-text p {
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.btn-view-current {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: #78350f;
  text-decoration: none;
  border-radius: var(--radius-xl);
  font-weight: 700;
  white-space: nowrap;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(251, 191, 36, 0.3);
}

.btn-view-current:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(251, 191, 36, 0.4);
}
</style>
