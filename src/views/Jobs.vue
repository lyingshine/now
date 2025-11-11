<template>
  <div class="jobs">
    <div class="container">
      <h1 class="page-title">💼 任务大厅</h1>
      <p class="page-subtitle">选择你的职业目标，开启成长之旅</p>
      
      <div class="jobs-grid">
        <div 
          v-for="job in jobsStore.jobs" 
          :key="job.id" 
          class="job-card"
          @click="openJobModal(job)"
        >
          <div class="job-header">
            <div class="job-title">{{ job.title }}</div>
            <div class="job-salary">¥{{ job.salary.toLocaleString() }}/月</div>
          </div>
          <div class="job-rank" :style="{ borderColor: getRank(job.salary).color, color: getRank(job.salary).color }">
            {{ getRank(job.salary).icon }} {{ getRank(job.salary).name }}段位
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
          <div class="job-status" v-if="isJobAccepted(job.id)">
            <span class="status-badge">✓ 已接取</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 职位详情弹窗 -->
    <JobModal 
      :job="selectedJob"
      :isOpen="isModalOpen"
      @close="closeJobModal"
      @accept="handleAcceptJob"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useJobsStore } from '../stores/jobs'
import { useLifestyle } from '../composables/useLifestyle'
import JobModal from '../components/JobModal.vue'
import jobsData from '../data/jobs-data.js'

const router = useRouter()
const jobsStore = useJobsStore()
const { getRank } = useLifestyle()

const selectedJob = ref(null)
const isModalOpen = ref(false)

const isJobAccepted = (jobId) => {
  return jobsStore.userProgress[jobId]?.accepted || false
}

const openJobModal = (job) => {
  selectedJob.value = job
  isModalOpen.value = true
}

const closeJobModal = () => {
  isModalOpen.value = false
  setTimeout(() => {
    selectedJob.value = null
  }, 300)
}

const handleAcceptJob = (jobId) => {
  jobsStore.acceptJob(jobId)
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
  background: white;
  padding: 2rem;
  border-radius: 1.5rem;
  border: 2px solid var(--color-gray-200);
  transition: all 0.2s;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
}

.job-card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: var(--shadow-xl);
  border: 2px solid transparent;
  background-image: 
    linear-gradient(white, white),
    linear-gradient(90deg, var(--color-accent), var(--color-primary));
  background-origin: border-box;
  background-clip: padding-box, border-box;
}

body.dark-mode .job-card {
  background: var(--color-gray-800);
  border-color: var(--color-gray-700);
}

body.dark-mode .job-card:hover {
  background-image: 
    linear-gradient(var(--color-gray-800), var(--color-gray-800)),
    linear-gradient(90deg, var(--color-accent), var(--color-primary));
  background-origin: border-box;
  background-clip: padding-box, border-box;
}

.job-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.job-rank {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 1rem;
  border: 1px solid;
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

.job-status {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-gray-200);
}

body.dark-mode .job-status {
  border-top-color: var(--color-gray-700);
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: #e8f5e9;
  color: #2e7d32;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
}

body.dark-mode .status-badge {
  background: rgba(76, 175, 80, 0.2);
  color: var(--growth-primary);
}
</style>
