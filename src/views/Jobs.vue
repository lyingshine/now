<template>
  <div class="jobs">
    <div class="container">
      <h1 class="page-title">💼 任务大厅</h1>
      <p class="page-subtitle">选择你的职业目标，开启成长之旅</p>
      
      <div class="jobs-grid">
        <div v-for="job in jobsStore.jobs" :key="job.id" class="job-card">
          <div class="job-header">
            <div class="job-title">{{ job.title }}</div>
            <div class="job-salary">¥{{ job.salary.toLocaleString() }}/月</div>
          </div>
          <div class="job-info">
            <span class="info-item">📚 {{ job.education }}</span>
            <span class="info-item">💼 {{ job.experience }}</span>
          </div>
          <div class="job-tags">
            <span v-for="tag in job.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
          <div class="job-requirements">
            <div class="req-count">{{ job.requirements.length }} 项技能要求</div>
          </div>
          <button 
            v-if="!isJobAccepted(job.id)"
            class="btn-primary" 
            @click="handleAcceptJob(job.id)"
          >
            接取任务
          </button>
          <button 
            v-else
            class="btn-success" 
            @click="goToGrowth"
          >
            ✓ 已接取 - 查看学习计划
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useJobsStore } from '../stores/jobs'
import jobsData from '../data/jobs-data.js'

const router = useRouter()
const jobsStore = useJobsStore()

const isJobAccepted = (jobId) => {
  return jobsStore.userProgress[jobId]?.accepted || false
}

const handleAcceptJob = (jobId) => {
  jobsStore.acceptJob(jobId)
}

const goToGrowth = () => {
  router.push('/growth')
}

onMounted(() => {
  jobsStore.loadFromStorage()
  jobsStore.loadJobs(jobsData)
})
</script>

<style scoped>
.jobs {
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
}

.page-subtitle {
  text-align: center;
  color: var(--text-secondary);
  margin-bottom: 3rem;
}

.jobs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.job-card {
  background: var(--bg-secondary);
  padding: 2rem;
  border-radius: 1.5rem;
  border: 2px solid var(--border-color);
  transition: all 0.2s;
}

.job-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--growth-primary);
}

.job-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.job-title {
  font-size: 1.25rem;
  font-weight: 700;
}

.job-salary {
  font-size: 1.125rem;
  color: var(--growth-primary);
  font-weight: 700;
}

.job-info {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.info-item {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.job-tags {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.tag {
  padding: 0.25rem 0.75rem;
  background: var(--bg-primary);
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.job-requirements {
  margin-bottom: 1.5rem;
  padding: 0.75rem;
  background: var(--bg-primary);
  border-radius: 0.75rem;
}

.req-count {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.btn-primary, .btn-success {
  width: 100%;
  padding: 0.75rem;
  color: white;
  border: none;
  border-radius: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
}

.btn-primary {
  background: var(--growth-primary);
}

.btn-primary:hover {
  background: #45a049;
  transform: translateY(-2px);
}

.btn-success {
  background: #10b981;
}

.btn-success:hover {
  background: #059669;
  transform: translateY(-2px);
}
</style>
