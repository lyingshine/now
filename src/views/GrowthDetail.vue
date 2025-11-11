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
              <div class="stat-badge">
                <span class="stat-icon">💰</span>
                <span>{{ totalReward }} 金币奖励</span>
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

    <SettingsModal 
      :isOpen="isSettingsOpen"
      @close="isSettingsOpen = false"
      @save="handleSettingsSave"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useJobsStore } from '../stores/jobs'
import { useSkillExpansion } from '../composables/useSkillExpansion'
import ProgressHeader from '../components/growth-detail/ProgressHeader.vue'
import PlanInfoCards from '../components/growth-detail/PlanInfoCards.vue'
import SkillCard from '../components/growth-detail/SkillCard.vue'
import SettingsModal from '../components/SettingsModal.vue'

const route = useRoute()
const router = useRouter()
const jobsStore = useJobsStore()
const { expandedSkills, toggleSkill, initializeExpansion } = useSkillExpansion()
const isSettingsOpen = ref(false)

const plan = computed(() => {
  const jobId = parseInt(route.params.id)
  return jobsStore.learningPlans.find(p => p.jobId === jobId)
})

const completedSkills = computed(() => {
  if (!plan.value) return 0
  return plan.value.skills.filter(s => s.status === 'completed').length
})

const totalReward = computed(() => {
  if (!plan.value) return 0
  return plan.value.skills.reduce((sum, skill) => sum + skill.reward, 0)
})

const toggleTask = (skillIndex, stepIndex, taskIndex) => {
  const jobId = plan.value.jobId
  jobsStore.toggleTask(jobId, skillIndex, stepIndex, taskIndex)
}

const goBack = () => {
  router.push('/growth')
}

const handleAbandon = () => {
  if (confirm('确定要放弃这个任务吗？所有学习进度将被清除。')) {
    jobsStore.abandonJob(plan.value.jobId)
    router.push('/growth')
  }
}

const handleSettingsSave = () => {
  location.reload()
}

onMounted(() => {
  jobsStore.loadFromStorage()
  
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
</script>

<style scoped>
.growth-detail {
  padding: 3rem 2rem;
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
  max-width: 1200px;
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
</style>
