<template>
  <div class="jobs" :style="{ '--rank-color': rankColor }">
    <div class="unified-container">
      <!-- 活跃任务警告 -->
      <div v-if="questStore.hasActiveQuest" class="active-quest-warning">
        <div class="unified-card" style="background: rgba(251, 191, 36, 0.1); border-color: rgba(251, 191, 36, 0.3);">
          <div class="flex items-center gap-6">
            <span class="unified-icon-large">⚠️</span>
            <div class="flex-1">
              <h3 class="unified-card-title mb-2">你已经有一个进行中的职业任务！</h3>
              <p style="color: var(--immersive-text-secondary); font-size: var(--text-sm);">
                一次只能专注一个职业目标。请先完成或放弃当前任务。
              </p>
            </div>
            <router-link to="/growth" class="unified-btn unified-btn-primary" style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: #78350f;">
              查看当前任务
            </router-link>
          </div>
        </div>
      </div>

      <div class="section-header-text">
        <h1 class="unified-title">⚔️ 任务大厅</h1>
        <p class="unified-subtitle">
          {{ questStore.hasActiveQuest ? '完成当前任务后可接取新任务' : '接取任务，提升技能，升级你的职业生涯！' }}
        </p>
        <div class="flex justify-center gap-6 mt-6">
          <div class="unified-tag unified-tag-primary" style="padding: var(--space-3) var(--space-6); font-size: var(--text-sm);">
            <span class="unified-icon-small">📋</span>
            <span>{{ jobsStore.jobs.length }} 个可用任务</span>
          </div>
          <div class="unified-tag unified-tag-primary" style="padding: var(--space-3) var(--space-6); font-size: var(--text-sm);">
            <span class="unified-icon-small">🎯</span>
            <span>{{ questStore.hasActiveQuest ? '1 个进行中' : '0 个进行中' }}</span>
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
import { useUserStore } from '../stores/user'
import { useLifestyle } from '../composables/useLifestyle'
import { useJobModal } from '../composables/useJobModal'
import JobsGrid from '../components/jobs/JobsGrid.vue'
import JobModal from '../components/JobModal.vue'
import SettingsModal from '../components/SettingsModal.vue'
import jobsData from '../data/jobs-data.js'

const router = useRouter()
const jobsStore = useJobsStore()
const questStore = useQuestStore()
const userStore = useUserStore()
const { getRankInfo } = useLifestyle()
const { selectedJob, isModalOpen, openJobModal, closeJobModal } = useJobModal()
const isSettingsOpen = ref(false)

// 计算段位颜色
const rankColor = computed(() => {
  const salary = userStore.userInfo.currentSalary || 10000
  const rankInfo = getRankInfo(salary)
  return rankInfo.current.color
})

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

const handleAcceptJob = (jobId, customRewards = null) => {
  const job = jobsStore.jobs.find(j => j.id === jobId)
  if (!job) return

  // 使用新的 quest store 接取任务，传入自定义奖励
  const success = questStore.acceptQuest(jobId, job, customRewards)
  
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
  padding: 100px var(--space-8) var(--space-8);
  min-height: 100vh;
  background: var(--immersive-bg-primary);
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
    radial-gradient(circle at 20% 30%, color-mix(in srgb, var(--rank-color, #667eea) 8%, transparent) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, color-mix(in srgb, var(--rank-color, #667eea) 8%, transparent) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

.unified-container {
  position: relative;
  z-index: 1;
}

.section-header-text {
  margin-bottom: var(--space-12);
}

/* 活跃任务警告 */
.active-quest-warning {
  margin-bottom: var(--space-8);
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

/* 响应式 */
@media (max-width: 768px) {
  .jobs {
    padding: 80px var(--space-4) var(--space-4);
  }
  
  .active-quest-warning .flex {
    flex-direction: column;
    text-align: center;
  }
  
  .active-quest-warning .unified-btn {
    width: 100%;
  }
}
</style>
