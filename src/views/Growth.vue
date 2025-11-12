<template>
  <div class="growth" :style="{ '--rank-color': rankColor }">
    <div class="unified-container">
      <div class="section-header-text">
        <h1 class="unified-title">🎮 职业冒险</h1>
        <p class="unified-subtitle">查看你的任务进度，继续你的职业冒险！</p>
      </div>
      
      <!-- 当前任务进度卡片 -->
      <div v-if="questStore.hasActiveQuest">
        <QuestProgressCard 
          :quest="questStore.currentQuest"
          @continue="goToDetail"
        />
        
        <!-- 任务完成确认按钮 -->
        <div v-if="canComplete" class="completion-section">
          <div class="unified-card" style="background: rgba(251, 191, 36, 0.1); border-color: rgba(251, 191, 36, 0.3); animation: pulse 2s ease-in-out infinite;">
            <div class="flex items-center gap-6">
              <span class="unified-icon-large">🎉</span>
              <div class="flex-1">
                <h3 class="unified-card-title mb-2">恭喜！你已完成所有子任务！</h3>
                <p style="color: var(--immersive-text-secondary);">
                  达到 {{ questStore.currentLevel }} 级，可以确认完成任务了
                </p>
              </div>
            </div>
          </div>
          <button @click="showCompletionModal = true" class="unified-btn unified-btn-large w-full mb-4" style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: #78350f; font-size: var(--text-xl);">
            🏆 确认完成任务
          </button>
        </div>
        
        <!-- 放弃任务按钮 -->
        <button @click="showAbandonModal = true" class="unified-btn w-full mt-8" style="background: rgba(239, 68, 68, 0.1); color: #ef4444; border-color: rgba(239, 68, 68, 0.3);">
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
import { useLifestyle } from '../composables/useLifestyle'
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
const { getRankInfo } = useLifestyle()
const isSettingsOpen = ref(false)
const showCompletionModal = ref(false)
const showAbandonModal = ref(false)
const showJobCompletionModal = ref(false)

// 计算段位颜色
const rankColor = computed(() => {
  const salary = userStore.userInfo.currentSalary || 10000
  const rankInfo = getRankInfo(salary)
  return rankInfo.current.color
})
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
  console.log('🎯 handleCompleteQuest 被调用')
  
  // 在确认完成前保存当前任务数据
  const currentQuestData = questStore.currentQuest
  if (!currentQuestData) {
    console.error('❌ 没有当前任务数据')
    return
  }
  
  console.log('📋 当前任务数据:', currentQuestData)
  
  // 确认完成任务
  const result = questStore.confirmQuestCompletion()
  console.log('✅ 完成结果:', result)
  
  if (result.success) {
    showCompletionModal.value = false
    
    // 获取岗位数据
    const jobData = jobsData.find(j => j.id === result.jobData.id)
    if (jobData) {
      // 计算学习时长
      const startDate = new Date(currentQuestData.startDate)
      const endDate = new Date()
      const days = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24))
      
      // 更新用户职业信息
      const oldSalary = userStore.userInfo.currentSalary
      const careerResult = userStore.updateCareer(jobData, endDate)
      
      // 增加经验值
      if (result.jobData.totalExp) {
        userStore.addExp(result.jobData.totalExp)
      }
      
      // 更新连续学习天数
      userStore.updateStreakDays()
      
      // 准备完成弹窗数据
      jobCompletionData.value = {
        jobData,
        oldSalary,
        newSalary: careerResult.newSalary,
        learningDuration: days > 0 ? `${days}天` : '不足1天',
        completedTasks: currentQuestData.completedSubQuests,
        totalSkills: currentQuestData.subQuests.length
      }
      
      // 显示任务完成弹窗
      showJobCompletionModal.value = true
      
      console.log('🎉 任务完成！职业已更新:', careerResult.message)
    } else {
      // 如果找不到岗位数据，直接跳转
      alert('恭喜完成任务！')
      router.push('/')
    }
  } else {
    alert(result.message || '无法完成任务')
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
  padding: 100px var(--space-8) var(--space-8);
  min-height: 100vh;
  background: var(--immersive-bg-primary);
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
    radial-gradient(circle at 20% 30%, color-mix(in srgb, var(--rank-color, #10b981) 10%, transparent) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, color-mix(in srgb, var(--rank-color, #10b981) 10%, transparent) 0%, transparent 50%);
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

.completion-section {
  margin-top: var(--space-8);
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
}

/* 响应式 */
@media (max-width: 768px) {
  .growth {
    padding: 80px var(--space-4) var(--space-4);
  }
  
  .completion-section .flex {
    flex-direction: column;
    text-align: center;
  }
}
</style>
