<template>
  <div class="growth">
    <div class="container">
      <h1 class="page-title">🌱 成长中心</h1>
      <p class="page-subtitle">你的职业成长之旅</p>
      
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">⏱️</div>
          <div class="stat-value">{{ jobsStore.totalLearningHours }}</div>
          <div class="stat-label">学习时长（小时）</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🔥</div>
          <div class="stat-value">{{ consecutiveDays }}</div>
          <div class="stat-label">连续学习（天）</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">💻</div>
          <div class="stat-value">{{ completedProjects }}</div>
          <div class="stat-label">完成项目（个）</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🏆</div>
          <div class="stat-value">{{ achievements }}</div>
          <div class="stat-label">获得成就（个）</div>
        </div>
      </div>

      <div v-if="jobsStore.learningPlans.length === 0" class="empty-state">
        <div class="empty-icon">📚</div>
        <h2>还没有接取任务</h2>
        <p>去任务大厅接取你的第一个任务，开始成长之旅吧！</p>
        <router-link to="/jobs" class="btn-primary">前往任务大厅</router-link>
      </div>

      <div v-else class="tasks-section">
        <h2 class="section-title">📋 我的任务 ({{ jobsStore.learningPlans.length }})</h2>
        <div class="tasks-grid">
          <div v-for="plan in jobsStore.learningPlans" :key="plan.jobId" class="task-card">
            <div class="task-header">
              <h3 class="task-title">{{ plan.jobTitle }}</h3>
              <div class="task-salary">¥{{ plan.salary.toLocaleString() }}/月</div>
            </div>
            <div class="task-progress">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: plan.overallProgress + '%' }"></div>
              </div>
              <div class="progress-text">{{ plan.overallProgress }}%</div>
            </div>
            <div class="task-info">
              <div class="info-item">
                <span class="info-label">开始日期：</span>
                <span class="info-value">{{ plan.startDate }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">预计完成：</span>
                <span class="info-value">{{ plan.estimatedEndDate }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">技能数量：</span>
                <span class="info-value">{{ plan.skills.length }} 项</span>
              </div>
            </div>
            <button class="btn-primary" @click="goToDetail(plan.jobId)">
              继续学习
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useJobsStore } from '../stores/jobs'

const router = useRouter()
const jobsStore = useJobsStore()

const consecutiveDays = computed(() => {
  // 这里可以实现真实的连续学习天数计算
  return 0
})

const completedProjects = computed(() => {
  return jobsStore.learningPlans.reduce((total, plan) => {
    return total + plan.skills.filter(skill => skill.status === 'completed').length
  }, 0)
})

const achievements = computed(() => {
  // 这里可以实现真实的成就计算
  return 0
})

const goToDetail = (jobId) => {
  router.push(`/growth/${jobId}`)
}

onMounted(() => {
  jobsStore.loadFromStorage()
})
</script>

<style scoped>
.growth {
  padding: 2rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, var(--growth-primary) 0%, var(--growth-secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.page-subtitle {
  text-align: center;
  color: var(--text-secondary);
  margin-bottom: 3rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: var(--bg-secondary);
  padding: 2rem;
  border-radius: 1.5rem;
  text-align: center;
  border: 2px solid var(--border-color);
  transition: all 0.2s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--growth-primary);
}

.stat-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--growth-primary);
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: var(--bg-secondary);
  border-radius: 2rem;
  border: 2px dashed var(--border-color);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
}

.empty-state h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.empty-state p {
  color: var(--text-secondary);
  margin-bottom: 2rem;
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
  box-shadow: var(--shadow-md);
}

.tasks-section {
  margin-top: 3rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.tasks-grid {
  display: grid;
  gap: 1.5rem;
}

.task-card {
  background: var(--bg-secondary);
  padding: 2rem;
  border-radius: 1.5rem;
  border: 2px solid var(--border-color);
  transition: all 0.2s;
}

.task-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--growth-primary);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.task-title {
  font-size: 1.25rem;
  font-weight: 700;
}

.task-salary {
  font-size: 1.125rem;
  color: var(--growth-primary);
  font-weight: 700;
}

.task-progress {
  margin-bottom: 1.5rem;
}

.progress-bar {
  height: 8px;
  background: var(--bg-primary);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--growth-primary), var(--growth-secondary));
  transition: width 0.3s ease;
}

.progress-text {
  text-align: right;
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 600;
}

.task-info {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.info-value {
  font-size: 0.875rem;
  font-weight: 600;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .task-info {
    grid-template-columns: 1fr;
  }
}
</style>
