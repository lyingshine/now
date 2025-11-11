<template>
  <div class="growth-detail">
    <div class="container">
      <div v-if="!plan" class="empty-state">
        <h2>未找到学习计划</h2>
        <router-link to="/growth" class="btn-primary">返回成长中心</router-link>
      </div>

      <div v-else>
        <ProgressHeader :plan="plan" @back="goBack" />
        <PlanInfoCards :plan="plan" />

        <div class="skills-section">
          <h2 class="section-title">📚 学习技能</h2>
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

const toggleTask = (skillIndex, stepIndex, taskIndex) => {
  const jobId = plan.value.jobId
  jobsStore.toggleTask(jobId, skillIndex, stepIndex, taskIndex)
}

const goBack = () => {
  router.push('/growth')
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

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
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
