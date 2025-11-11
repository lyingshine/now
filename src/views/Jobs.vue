<template>
  <div class="jobs">
    <div class="container">
      <h1 class="page-title">💼 任务大厅</h1>
      <p class="page-subtitle">选择你的职业目标，开启成长之旅</p>
      
      <JobsGrid
        :jobs="jobsStore.jobs"
        :isJobAccepted="isJobAccepted"
        @job-click="openJobModal"
      />
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
import { useJobsStore } from '../stores/jobs'
import { useJobModal } from '../composables/useJobModal'
import JobsGrid from '../components/jobs/JobsGrid.vue'
import JobModal from '../components/JobModal.vue'
import SettingsModal from '../components/SettingsModal.vue'
import jobsData from '../data/jobs-data.js'

const jobsStore = useJobsStore()
const { selectedJob, isModalOpen, openJobModal, closeJobModal } = useJobModal()
const isSettingsOpen = ref(false)

const isJobAccepted = (jobId) => {
  return jobsStore.userProgress[jobId]?.accepted || false
}

const handleAcceptJob = (jobId) => {
  jobsStore.acceptJob(jobId)
}

const handleSettingsSave = () => {
  location.reload()
}

onMounted(() => {
  jobsStore.loadFromStorage()
  jobsStore.loadJobs(jobsData)
  
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
</style>
