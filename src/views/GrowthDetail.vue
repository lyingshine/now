<template>
  <div class="growth-detail">
    <div class="container">
      <div v-if="!plan" class="empty-state">
        <h2>未找到学习计划</h2>
        <router-link to="/growth" class="btn-primary">返回成长中心</router-link>
      </div>

      <div v-else>
        <ProgressHeader :plan="plan" @back="goBack" @abandon="handleAbandon" />
        <PlanInfoCards :plan="plan" />

        <div class="skills-section">
          <div class="quest-progress-header">
            <h2 class="section-title">⚔️ 技能任务树</h2>
            <div class="quest-stats">
              <div class="stat-badge">
                <span class="stat-icon">✅</span>
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
import { useSkillExpansion } from '../composables/useSkillExpansion'
import { getLevelMilestone } from '../utils/expCalculator'
import ProgressHeader from '../components/growth-detail/ProgressHeader.vue'
import PlanInfoCards from '../components/growth-detail/PlanInfoCards.vue'
import SkillCard from '../components/growth-detail/SkillCard.vue'
import LevelUpModal from '../components/game/LevelUpModal.vue'
import SettingsModal from '../components/SettingsModal.vue'

const route = useRoute()
const router = useRouter()
const jobsStore = useJobsStore()
const questStore = useQuestStore()
const { expandedSkills, toggleSkill, initializeExpansion } = useSkillExpansion()
const isSettingsOpen = ref(false)
const showLevelUp = ref(false)
const levelUpData = ref({
  newLevel: 1,
  expGained: 0,
  milestone: null
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
  padding: var(--page-padding);
  min-height: 100vh;
  background: linear-gradient(135deg, #ecfdf5 0%, #dbeafe 50%, #fef3c7 100%);
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
    radial-gradient(circle at 20% 30%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.1) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

body.dark-mode .growth-detail {
  background: linear-gradient(135deg, #0f172a 0%, #064e3b 50%, #1e293b 100%);
}

.container {
  max-width: var(--container-max-width);
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.skills-section {
  margin-top: 2rem;
}

.quest-progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  background: var(--glass-bg);
  border-radius: var(--radius-2xl);
  border: 1px solid var(--glass-border);
}

body.dark-mode .quest-progress-header {
  background: rgba(30, 41, 59, 0.5);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.quest-stats {
  display: flex;
  gap: 1rem;
}

.stat-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: var(--bg-primary);
  border-radius: var(--radius-full);
  font-weight: 600;
  font-size: 0.875rem;
  box-shadow: var(--shadow-sm);
}

.stat-icon {
  font-size: 1.125rem;
}

.skills-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.btn-primary {
  display: inline-block;
  padding: 1.25rem 2.5rem;
  background: linear-gradient(135deg, var(--growth-primary) 0%, var(--growth-secondary) 100%);
  color: white;
  text-decoration: none;
  border-radius: var(--radius-xl);
  font-weight: 700;
  font-size: 1.125rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: var(--shadow-lg);
  border: none;
  cursor: pointer;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-xl);
}

/* 响应式 */
@media (max-width: 768px) {
  .quest-header {
    flex-direction: column;
    text-align: center;
  }
  
  .quest-actions {
    width: 100%;
    justify-content: center;
  }
  
  .sub-quests-grid {
    grid-template-columns: 1fr;
  }
}
</style>
