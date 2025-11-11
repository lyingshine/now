<template>
  <div class="growth-detail">
    <div class="container">
      <div v-if="!plan" class="empty-state">
        <h2>未找到学习计划</h2>
        <router-link to="/growth" class="btn-primary">返回成长中心</router-link>
      </div>

      <div v-else>
        <!-- 头部信息 -->
        <div class="detail-header">
          <button class="btn-back" @click="goBack">← 返回</button>
          <div class="header-content">
            <h1 class="job-title">{{ plan.jobTitle }}</h1>
            <div class="job-salary">目标薪资：¥{{ plan.salary.toLocaleString() }}/月</div>
          </div>
          <div class="header-progress">
            <div class="progress-circle">
              <svg width="120" height="120">
                <circle cx="60" cy="60" r="54" fill="none" stroke="#e5e7eb" stroke-width="8"/>
                <circle 
                  cx="60" cy="60" r="54" fill="none" 
                  stroke="url(#gradient)" 
                  stroke-width="8"
                  stroke-linecap="round"
                  :stroke-dasharray="circumference"
                  :stroke-dashoffset="circumference - (circumference * plan.overallProgress) / 100"
                  transform="rotate(-90 60 60)"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#4caf50;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#2196f3;stop-opacity:1" />
                  </linearGradient>
                </defs>
              </svg>
              <div class="progress-text">{{ plan.overallProgress }}%</div>
            </div>
          </div>
        </div>

        <!-- 学习计划信息 -->
        <div class="plan-info">
          <div class="info-card">
            <div class="info-label">开始日期</div>
            <div class="info-value">{{ plan.startDate }}</div>
          </div>
          <div class="info-card">
            <div class="info-label">预计完成</div>
            <div class="info-value">{{ plan.estimatedEndDate }}</div>
          </div>
          <div class="info-card">
            <div class="info-label">预计周数</div>
            <div class="info-value">{{ plan.estimatedWeeks }} 周</div>
          </div>
          <div class="info-card">
            <div class="info-label">每周学习</div>
            <div class="info-value">{{ plan.weeklyHours }} 小时</div>
          </div>
        </div>

        <!-- 技能列表 -->
        <div class="skills-section">
          <h2 class="section-title">📚 学习技能</h2>
          <div class="skills-list">
            <div 
              v-for="(skill, skillIndex) in plan.skills" 
              :key="skill.skillId" 
              class="skill-card"
              :class="{ 'skill-completed': skill.status === 'completed' }"
            >
              <div class="skill-header" @click="toggleSkill(skillIndex)">
                <div class="skill-info">
                  <div class="skill-status">
                    <span v-if="skill.status === 'completed'" class="status-icon">✓</span>
                    <span v-else-if="skill.status === 'in_progress'" class="status-icon">⏳</span>
                    <span v-else class="status-icon">○</span>
                  </div>
                  <div>
                    <h3 class="skill-name">{{ skill.skillName }}</h3>
                    <div class="skill-reward">+{{ skill.reward }}元</div>
                  </div>
                </div>
                <div class="skill-progress-info">
                  <div class="progress-percent">{{ skill.progress }}%</div>
                  <div class="expand-icon">{{ expandedSkills[skillIndex] ? '▼' : '▶' }}</div>
                </div>
              </div>

              <div class="skill-progress-bar">
                <div class="progress-fill" :style="{ width: skill.progress + '%' }"></div>
              </div>

              <!-- 学习步骤 -->
              <div v-if="expandedSkills[skillIndex]" class="steps-list">
                <div 
                  v-for="(step, stepIndex) in skill.steps" 
                  :key="stepIndex" 
                  class="step-card"
                >
                  <h4 class="step-title">{{ step.title }}</h4>
                  <p class="step-description">{{ step.description }}</p>
                  
                  <!-- 任务列表 -->
                  <div class="tasks-list">
                    <div 
                      v-for="(task, taskIndex) in step.tasks" 
                      :key="task.id" 
                      class="task-item"
                      :class="{ 'task-completed': task.completed }"
                    >
                      <input 
                        type="checkbox" 
                        :checked="task.completed"
                        @change="toggleTask(skillIndex, stepIndex, taskIndex)"
                        class="task-checkbox"
                      />
                      <span class="task-text">{{ task.text }}</span>
                      <span class="task-hours">{{ task.estimatedHours }}h</span>
                    </div>
                  </div>

                  <!-- 学习资源 -->
                  <div class="resources-section">
                    <h5 class="resources-title">📖 推荐资源</h5>
                    <div class="resources-list">
                      <div v-for="(resource, idx) in step.resources" :key="idx" class="resource-item">
                        <span class="resource-icon">{{ resource.type === 'doc' ? '📄' : '🎥' }}</span>
                        <span class="resource-name">{{ resource.name }}</span>
                        <span class="resource-rating">⭐ {{ resource.rating }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

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
import { useRoute, useRouter } from 'vue-router'
import { useJobsStore } from '../stores/jobs'
import SettingsModal from '../components/SettingsModal.vue'

const route = useRoute()
const router = useRouter()
const jobsStore = useJobsStore()

const expandedSkills = ref({})
const isSettingsOpen = ref(false)
const circumference = 2 * Math.PI * 54

const plan = computed(() => {
  const jobId = parseInt(route.params.id)
  return jobsStore.learningPlans.find(p => p.jobId === jobId)
})

const toggleSkill = (skillIndex) => {
  expandedSkills.value[skillIndex] = !expandedSkills.value[skillIndex]
}

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
  // 默认展开第一个技能
  if (plan.value && plan.value.skills.length > 0) {
    expandedSkills.value[0] = true
  }
  
  // 监听设置按钮点击
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
  padding: 2rem;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.detail-header {
  background: var(--bg-secondary);
  padding: 2rem;
  border-radius: 1.5rem;
  margin-bottom: 2rem;
  border: 2px solid var(--border-color);
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 2rem;
  align-items: center;
}

.btn-back {
  padding: 0.75rem 1.5rem;
  background: var(--bg-primary);
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-back:hover {
  background: var(--border-color);
}

.header-content {
  flex: 1;
}

.job-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.job-salary {
  font-size: 1.125rem;
  color: var(--growth-primary);
  font-weight: 600;
}

.progress-circle {
  position: relative;
  width: 120px;
  height: 120px;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--growth-primary);
}

.plan-info {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.info-card {
  background: var(--bg-secondary);
  padding: 1.5rem;
  border-radius: 1rem;
  border: 2px solid var(--border-color);
  text-align: center;
}

.info-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.info-value {
  font-size: 1.125rem;
  font-weight: 700;
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

.skill-card {
  background: var(--bg-secondary);
  padding: 1.5rem;
  border-radius: 1rem;
  border: 2px solid var(--border-color);
  transition: all 0.2s;
}

.skill-card:hover {
  border-color: var(--growth-primary);
}

.skill-completed {
  opacity: 0.7;
}

.skill-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  margin-bottom: 0.75rem;
}

.skill-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.skill-status {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--bg-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.skill-name {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.skill-reward {
  font-size: 0.875rem;
  color: var(--growth-primary);
  font-weight: 600;
}

.skill-progress-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.progress-percent {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--growth-primary);
}

.expand-icon {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.skill-progress-bar {
  height: 6px;
  background: var(--bg-primary);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--growth-primary), var(--growth-secondary));
  transition: width 0.3s ease;
}

.steps-list {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.step-card {
  background: var(--bg-primary);
  padding: 1.5rem;
  border-radius: 0.75rem;
}

.step-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.step-description {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: var(--bg-secondary);
  border-radius: 0.5rem;
  transition: all 0.2s;
}

.task-item:hover {
  background: var(--border-color);
}

.task-completed {
  opacity: 0.6;
}

.task-completed .task-text {
  text-decoration: line-through;
}

.task-checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.task-text {
  flex: 1;
  font-size: 0.875rem;
}

.task-hours {
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-weight: 600;
}

.resources-section {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.resources-title {
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.resources-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.resource-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.resource-icon {
  font-size: 1rem;
}

.resource-name {
  flex: 1;
}

.resource-rating {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.btn-primary {
  display: inline-block;
  padding: 1rem 2rem;
  background: var(--growth-primary);
  color: white;
  text-decoration: none;
  border-radius: 1rem;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: #45a049;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .detail-header {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .plan-info {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .progress-circle {
    margin: 0 auto;
  }
}
</style>
