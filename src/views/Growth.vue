<template>
  <div class="growth">
    <div class="container">
      <h1 class="page-title">🎮 职业冒险</h1>
      <p class="page-subtitle">查看你的任务进度，继续你的职业冒险！</p>
      
      <!-- 当前任务进度卡片 -->
      <div v-if="questStore.hasActiveQuest">
        <QuestProgressCard 
          :quest="questStore.currentQuest"
          @continue="goToDetail"
        />
        
        <!-- 任务完成确认按钮 -->
        <div v-if="canComplete" class="completion-section">
          <div class="completion-banner">
            <div class="banner-icon">🎉</div>
            <div class="banner-content">
              <h3>恭喜！你已完成所有子任务！</h3>
              <p>达到 {{ questStore.currentLevel }} 级，可以确认完成任务了</p>
            </div>
          </div>
          <button @click="showCompletionModal = true" class="btn-complete-quest">
            🏆 确认完成任务
          </button>
        </div>
        
        <!-- 放弃任务按钮 -->
        <button @click="showAbandonModal = true" class="btn-abandon-quest">
          放弃任务
        </button>
      </div>

      <!-- 无任务状态 -->
      <EmptyState v-else />
    </div>

    <!-- 任务完成确认弹窗 -->
    <QuestCompletionModal 
      v-if="questStore.currentQuest"
      :isOpen="showCompletionModal"
      :quest="questStore.currentQuest"
      :achievements="currentAchievements"
      @confirm="handleCompleteQuest"
      @close="showCompletionModal = false"
    />

    <!-- 任务放弃确认弹窗 -->
    <AbandonQuestModal 
      v-if="questStore.currentQuest"
      :isOpen="showAbandonModal"
      :quest="questStore.currentQuest"
      @confirm="handleAbandonQuest"
      @close="showAbandonModal = false"
    />

    <!-- 岗位完成弹窗 -->
    <JobCompletionModal 
      v-if="jobCompletionData"
      :isOpen="showJobCompletionModal"
      :jobData="jobCompletionData.jobData"
      :oldSalary="jobCompletionData.oldSalary"
      :newSalary="jobCompletionData.newSalary"
      :learningDuration="jobCompletionData.learningDuration"
      :completedTasks="jobCompletionData.completedTasks"
      :totalSkills="jobCompletionData.totalSkills"
      @close="handleJobCompletionClose"
    />

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
import { checkAchievements } from '../utils/achievements'
import EmptyState from '../components/growth/EmptyState.vue'
import QuestProgressCard from '../components/quest/QuestProgressCard.vue'
import QuestCompletionModal from '../components/quest/QuestCompletionModal.vue'
import AbandonQuestModal from '../components/quest/AbandonQuestModal.vue'
import SettingsModal from '../components/SettingsModal.vue'
import JobCompletionModal from '../components/JobCompletionModal.vue'
import jobsData from '../data/jobs-data.js'

const router = useRouter()
const jobsStore = useJobsStore()
const questStore = useQuestStore()
const userStore = useUserStore()
const isSettingsOpen = ref(false)
const showCompletionModal = ref(false)
const showAbandonModal = ref(false)
const showJobCompletionModal = ref(false)
const jobCompletionData = ref(null)

// 检查是否可以完成任务
const canComplete = computed(() => {
  const result = questStore.canCompleteQuest()
  return result.canComplete
})

// 当前成就
const currentAchievements = computed(() => {
  if (!questStore.currentQuest) return []
  return checkAchievements(questStore.currentQuest, questStore.questHistory)
})

const goToDetail = () => {
  if (questStore.currentQuest) {
    router.push(`/growth/${questStore.currentQuest.jobId}`)
  }
}

const handleCompleteQuest = () => {
  const success = questStore.confirmQuestCompletion()
  if (success && questStore.currentQuest) {
    showCompletionModal.value = false
    
    // 获取岗位数据
    const jobData = jobsData.find(j => j.id === questStore.currentQuest.jobId)
    if (jobData) {
      // 计算学习时长
      const startDate = new Date(questStore.currentQuest.acceptedDate)
      const endDate = new Date()
      const days = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24))
      
      // 更新用户职业信息
      const oldSalary = userStore.userInfo.currentSalary
      const result = userStore.updateCareer(jobData, endDate)
      
      // 增加经验值
      if (jobData.expReward) {
        userStore.addExp(jobData.expReward)
      }
      
      // 更新连续学习天数
      userStore.updateStreakDays()
      
      // 准备完成弹窗数据
      jobCompletionData.value = {
        jobData,
        oldSalary,
        newSalary: result.newSalary,
        learningDuration: days > 0 ? `${days}天` : '不足1天',
        completedTasks: questStore.completedSubQuestsCount,
        totalSkills: questStore.currentQuest.subQuests.length
      }
      
      // 显示任务完成弹窗
      showJobCompletionModal.value = true
    } else {
      // 如果找不到岗位数据，直接跳转
      router.push('/')
    }
  }
}

const handleAbandonQuest = () => {
  const success = questStore.abandonQuest()
  if (success) {
    // 同时更新旧的 jobs store 以保持兼容性
    if (questStore.currentQuest) {
      jobsStore.abandonJob(questStore.currentQuest.jobId)
    }
    showAbandonModal.value = false
    // 刷新页面
    location.reload()
  }
}

const handleSettingsSave = () => {
  location.reload()
}

const handleJobCompletionClose = () => {
  showJobCompletionModal.value = false
  jobCompletionData.value = null
  // 跳转到首页
  router.push('/')
}

onMounted(() => {
  jobsStore.loadFromStorage()
  questStore.loadFromStorage()
  userStore.loadFromStorage()
  
  window.addEventListener('openSettings', () => {
    isSettingsOpen.value = true
  })
  
  // 监听任务完成事件（从 jobs store 触发）
  window.addEventListener('job-completed', (event) => {
    const { jobData, completedDate } = event.detail
    
    // 更新用户职业信息
    const oldSalary = userStore.userInfo.currentSalary
    const result = userStore.updateCareer(jobData, new Date(completedDate))
    
    // 增加经验值
    if (jobData.expReward) {
      userStore.addExp(jobData.expReward)
    }
    
    // 更新连续学习天数
    userStore.updateStreakDays()
    
    // 显示完成提示
    console.log('职业更新成功:', result.message)
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

.completion-section {
  margin-top: 2rem;
}

.completion-banner {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(245, 158, 11, 0.1));
  border: 2px solid rgba(251, 191, 36, 0.3);
  border-radius: var(--radius-2xl);
  margin-bottom: 1.5rem;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
}

.banner-icon {
  font-size: 3rem;
  flex-shrink: 0;
}

.banner-content h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.banner-content p {
  color: var(--text-secondary);
}

.btn-complete-quest {
  width: 100%;
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: #78350f;
  border: none;
  border-radius: var(--radius-xl);
  font-size: 1.25rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(251, 191, 36, 0.3);
  margin-bottom: 1rem;
}

.btn-complete-quest:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(251, 191, 36, 0.4);
}

.btn-abandon-quest {
  width: 100%;
  padding: 1rem 2rem;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: var(--radius-xl);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 2rem;
}

.btn-abandon-quest:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.5);
}
</style>
