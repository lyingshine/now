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

    <!-- 设置弹窗 -->
    <SettingsModal 
      :isOpen="isSettingsOpen"
      @close="isSettingsOpen = false"
      @save="handleSettingsSave"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useJobsStore } from '../stores/jobs'
import { useLifestyle } from '../composables/useLifestyle'
import JobModal from '../components/JobModal.vue'
import SettingsModal from '../components/SettingsModal.vue'
import jobsData from '../data/jobs-data.js'

const router = useRouter()
const jobsStore = useJobsStore()
const { getRank } = useLifestyle()

const selectedJob = ref(null)
const isSettingsOpen = ref(false)
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

const handleSettingsSave = () => {
  // 设置保存后刷新页面数据
  location.reload()
}

onMounted(() => {
  jobsStore.loadFromStorage()
  jobsStore.loadJobs(jobsData)
  
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
.jobs {
  padding: 3rem 2rem;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 50%, #fef3c7 100%);
  position: relative;
}

.jobs::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(245, 158, 11, 0.08) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

body.dark-mode .jobs {
  background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #1e293b 100%);
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
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 50%, var(--growth-primary) 100%);
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

.jobs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.job-card {
  background: var(--glass-bg);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  padding: 2rem;
  border-radius: var(--radius-3xl);
  border: 1px solid var(--glass-border);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  box-shadow: var(--shadow-lg);
  position: relative;
  overflow: hidden;
}

.job-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-xl);
}

body.dark-mode .job-card {
  background: rgba(30, 41, 59, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: var(--shadow-xl);
}

body.dark-mode .job-card:hover {
  box-shadow: var(--shadow-2xl), var(--shadow-glow);
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
  gap: 8px;
  padding: 8px 16px;
  border-radius: var(--radius-full);
  font-size: 0.875rem;
  font-weight: 700;
  margin-bottom: 1rem;
  border: 2px solid;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  box-shadow: var(--shadow-sm);
}

body.dark-mode .job-rank {
  background: rgba(30, 41, 59, 0.5);
}

.job-title {
  font-size: 1.25rem;
  font-weight: 700;
}

.job-salary {
  font-size: 1.5rem;
  background: linear-gradient(135deg, var(--growth-primary) 0%, var(--color-accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
  letter-spacing: -0.025em;
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
  padding: 1rem;
  color: white;
  border: none;
  border-radius: var(--radius-xl);
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  font-size: 1rem;
  position: relative;
  overflow: hidden;
}

.btn-primary {
  background: linear-gradient(135deg, var(--growth-primary) 0%, var(--growth-secondary) 100%);
  box-shadow: var(--shadow-md);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn-success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  box-shadow: var(--shadow-md);
}

.btn-success:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
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
