<template>
  <div class="growth-detail" :style="{ '--rank-color': rankColor }">
    <div class="unified-container">
      <div v-if="!plan" class="empty-state">
        <h2>未找到学习计划</h2>
        <router-link to="/growth" class="unified-btn unified-btn-primary unified-btn-large">返回成长中心</router-link>
      </div>

      <div v-else>
        <ProgressHeader :plan="plan" @back="goBack" @abandon="handleAbandon" />
        <PlanInfoCards :plan="plan" />

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

        <div class="skills-section">
          <div class="section-header">
            <h2 class="unified-section-title">⚔️ 技能任务树</h2>
            <div class="quest-stats">
              <div class="unified-tag unified-tag-primary" style="padding: var(--space-3) var(--space-5);">
                <span class="unified-icon-small">✅</span>
                <span>{{ completedSkills }}/{{ plan.skills.length }} 完成</span>
              </div>
            </div>
          </div>
          <div class="skills-list">
            <SkillCard
              v-for="(skill, skillIndex) in plan.skills"
              :key="skill.skillId"
              :skill="skill"
              :isExpanded="expandedSkills[skillIndex]"
              @toggle="toggleSkill(skillIndex)"
              @toggle-task="(stepIndex, taskIndex) => toggleTask(skillIndex, stepIndex, taskIndex)"
            />
          </div>
        </div>
      </div>
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

    <!-- 升级动画 -->
    <LevelUpModal 
      :isOpen="showLevelUp"
      :newLevel="levelUpData.newLevel"
      :expGained="levelUpData.expGained"
      :milestone="levelUpData.milestone"
      @close="showLevelUp = false"
    />

    <SettingsModal 
      :isOpen="isSettingsOpen"
      @close="isSettingsOpen = false"
      @save="handleSettingsSave"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useJobsStore } from '../stores/jobs'
import { useQuestStore } from '../stores/quest'
import { useUserStore } from '../stores/user'
import { useLifestyle } from '../composables/useLifestyle'
import { useSkillExpansion } from '../composables/useSkillExpansion'
import { getLevelMilestone } from '../utils/expCalculator'
import { checkAchievements } from '../utils/achievements'
import ProgressHeader from '../components/growth-detail/ProgressHeader.vue'
import PlanInfoCards from '../components/growth-detail/PlanInfoCards.vue'
import SkillCard from '../components/growth-detail/SkillCard.vue'
import QuestCompletionModal from '../components/quest/QuestCompletionModal.vue'
import LevelUpModal from '../components/game/LevelUpModal.vue'
import SettingsModal from '../components/SettingsModal.vue'

const route = useRoute()
const router = useRouter()
const jobsStore = useJobsStore()
const questStore = useQuestStore()
const userStore = useUserStore()
const { getRankInfo } = useLifestyle()
const { expandedSkills, toggleSkill, initializeExpansion } = useSkillExpansion()
const isSettingsOpen = ref(false)
const showLevelUp = ref(false)
const showCompletionModal = ref(false)
const levelUpData = ref({
  newLevel: 1,
  expGained: 0,
  milestone: null
})

// 计算段位颜色
const rankColor = computed(() => {
  const salary = userStore.userInfo.currentSalary || 10000
  const rankInfo = getRankInfo(salary)
  return rankInfo.current.color
})

// 使用 questStore 的当前任务
const plan = computed(() => {
  if (!questStore.currentQuest) return null
  
  const quest = questStore.currentQuest
  
  // 计算预计完成日期
  const startDate = new Date(quest.startDate)
  const estimatedEndDate = new Date(startDate)
  estimatedEndDate.setDate(estimatedEndDate.getDate() + quest.estimatedDuration)
  
  // 将 quest 格式转换为旧的 plan 格式以兼容现有组件
  return {
    jobId: quest.jobId,
    jobTitle: quest.jobTitle,
    salary: quest.salary,
    startDate: startDate.toISOString().split('T')[0],
    estimatedEndDate: estimatedEndDate.toISOString().split('T')[0],
    estimatedWeeks: Math.ceil(quest.estimatedDuration / 7),
    weeklyHours: 10, // 默认每周10小时
    overallProgress: quest.overallProgress,
    skills: quest.subQuests.map(sq => ({
      skillId: sq.id,
      skillName: sq.title,
      status: sq.status === 'completed' ? 'completed' : sq.status === 'active' ? 'in_progress' : 'not_started',
      progress: sq.progress,
      expReward: sq.expReward, // 添加经验值奖励
      steps: [{
        title: sq.title,
        tasks: sq.tasks.map(t => ({
          id: t.id,
          text: t.title,
          completed: t.completed,
          estimatedHours: t.estimatedHours
        }))
      }]
    }))
  }
})

const completedSkills = computed(() => {
  if (!questStore.currentQuest) return 0
  return questStore.currentQuest.subQuests.filter(sq => sq.status === 'completed').length
})

// 检查是否可以完成任务
const canComplete = computed(() => {
  if (!questStore.currentQuest) return false
  const allSubQuestsCompleted = questStore.currentQuest.subQuests.every(
    sq => sq.status === 'completed'
  )
  return allSubQuestsCompleted && questStore.currentLevel >= 100
})

// 当前成就
const currentAchievements = computed(() => {
  if (!questStore.currentQuest) return []
  return checkAchievements(questStore.currentQuest, questStore.questHistory)
})

const toggleTask = (skillIndex, stepIndex, taskIndex) => {
  if (!questStore.currentQuest) return
  
  const subQuest = questStore.currentQuest.subQuests[skillIndex]
  if (!subQuest) return
  
  const task = subQuest.tasks[taskIndex]
  if (!task) return
  
  // 使用新的 questStore 方法
  questStore.completeTask(subQuest.id, task.id)
  
  // 同时更新旧的 jobsStore 以保持兼容性
  jobsStore.toggleTask(questStore.currentQuest.jobId, skillIndex, stepIndex, taskIndex)
}

const goBack = () => {
  router.push('/growth')
}

const handleAbandon = () => {
  if (confirm('确定要放弃这个任务吗？所有学习进度将被清除。')) {
    if (questStore.currentQuest) {
      questStore.abandonQuest()
      jobsStore.abandonJob(questStore.currentQuest.jobId)
    }
    router.push('/growth')
  }
}

const handleCompleteQuest = () => {
  if (!questStore.currentQuest) return
  
  const oldSalary = userStore.userInfo.currentSalary
  const newSalary = questStore.currentQuest.salary
  
  // 完成任务
  const result = questStore.confirmQuestCompletion()
  
  if (result) {
    // 更新用户薪资
    userStore.updateUserInfo({
      currentSalary: newSalary,
      currentJob: {
        title: result.jobData.title,
        salary: newSalary,
        startDate: new Date().toISOString().split('T')[0]
      }
    })
    
    showCompletionModal.value = false
    
    // 跳转回成长中心
    router.push('/growth')
  } else {
    alert('完成任务失败，请确保所有子任务都已完成')
  }
}

const handleSettingsSave = () => {
  location.reload()
}

onMounted(() => {
  jobsStore.loadFromStorage()
  questStore.loadFromStorage()
  
  if (plan.value && plan.value.skills.length > 0) {
    initializeExpansion()
  }
  
  window.addEventListener('openSettings', () => {
    isSettingsOpen.value = true
  })
})

onUnmounted(() => {
  window.removeEventListener('openSettings', () => {})
})

// 监听 questStore 变化，自动重新初始化展开状态
watch(() => questStore.currentQuest, (newQuest) => {
  if (newQuest && newQuest.subQuests.length > 0) {
    initializeExpansion()
  }
}, { deep: true })

// 监听等级变化，显示升级动画
let previousLevel = questStore.currentLevel
watch(() => questStore.currentLevel, (newLevel) => {
  if (newLevel > previousLevel) {
    const milestone = getLevelMilestone(newLevel)
    levelUpData.value = {
      newLevel,
      expGained: questStore.lastExpGain.expGained, // 使用实际获得的经验值
      milestone: milestone.message
    }
    showLevelUp.value = true
    previousLevel = newLevel
  }
})
</script>

<style scoped>
.growth-detail {
  padding: 100px var(--space-8) var(--space-8);
  min-height: 100vh;
  background: var(--immersive-bg-primary);
  position: relative;
}

.growth-detail::before {
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

.completion-section {
  margin-top: var(--space-8);
  margin-bottom: var(--space-8);
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
}

.skills-section {
  margin-top: var(--space-8);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-6);
}

.quest-stats {
  display: flex;
  gap: var(--space-3);
}

.skills-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.empty-state {
  text-align: center;
  padding: var(--space-12) var(--space-8);
}

/* 响应式 */
@media (max-width: 768px) {
  .growth-detail {
    padding: 80px var(--space-4) var(--space-4);
  }
  
  .section-header {
    flex-direction: column;
    gap: var(--space-3);
    align-items: flex-start;
  }
  
  .quest-stats {
    width: 100%;
  }
}
</style>
