<template>
  <div v-if="isOpen" class="modal" @click.self="close">
    <div class="modal-content">
      <button class="close-btn" @click="close">×</button>
      
      <div class="modal-header">
        <div class="modal-title">{{ job.title }}</div>
        <div class="modal-salary">¥{{ job.salary.toLocaleString() }}/月</div>
        <div class="job-rank" :style="{ borderColor: rankInfo.current.color, color: rankInfo.current.color }">
          {{ rankInfo.current.icon }} {{ rankInfo.current.name }}段位 · {{ rankInfo.current.percentage }}
        </div>
      </div>

      <!-- 进度信息 -->
      <div class="progress-info">
        <div class="progress-text">岗位胜任度: <span>{{ progressPercent }}%</span></div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
        </div>
      </div>

      <!-- 已接取信息 -->
      <div v-if="isAccepted" class="accepted-info">
        <div class="accepted-title">✓ 已接取此任务</div>
        <div class="accepted-date">接取日期: {{ acceptedDate }}</div>
        <div class="accepted-note">可以重新接取以更新入职日期</div>
      </div>

      <!-- 生活水平对比 -->
      <LifestyleComparison 
        v-if="showLifestyleComparison"
        :currentSalary="currentSalary"
        :futureSalary="job.salary"
      />

      <!-- 岗位要求 -->
      <div class="section">
        <div class="section-title">📋 岗位要求</div>
        <div class="requirements-list">
          <div 
            v-for="req in job.requirements" 
            :key="req.id"
            class="requirement-item"
            :class="{ checked: isRequirementChecked(req.id) }"
          >
            <input 
              type="checkbox"
              class="requirement-checkbox"
              :checked="isRequirementChecked(req.id)"
              @change="toggleRequirement(req.id)"
            />
            <div class="requirement-text">
              <span>{{ req.text }}</span>
              <span v-if="req.reward" class="requirement-reward">{{ req.reward }}</span>
            </div>
          </div>
        </div>
      </div>


      <!-- 接取按钮 -->
      <button 
        class="accept-btn" 
        @click="handleAccept"
        :disabled="isAccepting"
      >
        {{ isAccepted ? '重新接取任务' : '接取任务' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useJobsStore } from '../stores/jobs'
import { useLifestyle } from '../composables/useLifestyle'
import LifestyleComparison from './LifestyleComparison.vue'

const props = defineProps({
  job: {
    type: Object,
    default: null
  },
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'accept'])

const jobsStore = useJobsStore()
const { getRankInfo, getProgress } = useLifestyle()

const isAccepting = ref(false)
const checkedRequirements = ref({})

// 计算属性
const isAccepted = computed(() => {
  return props.job && jobsStore.userProgress[props.job.id]?.accepted
})

const acceptedDate = computed(() => {
  return props.job && jobsStore.userProgress[props.job.id]?.acceptedDate || ''
})

const rankInfo = computed(() => {
  return props.job ? getRankInfo(props.job.salary) : { current: {}, next: null }
})

const progressPercent = computed(() => {
  if (!props.job) return 0
  const total = props.job.requirements.length
  const checked = Object.values(checkedRequirements.value).filter(Boolean).length
  return Math.round((checked / total) * 100)
})

const currentSalary = computed(() => {
  const salaryData = JSON.parse(localStorage.getItem('salaryData') || '{}')
  return salaryData.salary || 0
})

const showLifestyleComparison = computed(() => {
  return currentSalary.value > 0 && props.job && currentSalary.value !== props.job.salary
})

// 方法
const close = () => {
  emit('close')
}

const isRequirementChecked = (reqId) => {
  return checkedRequirements.value[reqId] || false
}

const toggleRequirement = (reqId) => {
  checkedRequirements.value[reqId] = !checkedRequirements.value[reqId]
  saveProgress()
}

const saveProgress = () => {
  if (!props.job) return
  localStorage.setItem(`job_${props.job.id}_requirements`, JSON.stringify(checkedRequirements.value))
}

const loadProgress = () => {
  if (!props.job) return
  const saved = localStorage.getItem(`job_${props.job.id}_requirements`)
  if (saved) {
    checkedRequirements.value = JSON.parse(saved)
  } else {
    checkedRequirements.value = {}
  }
}

const handleAccept = () => {
  if (!props.job) return
  isAccepting.value = true
  
  setTimeout(() => {
    emit('accept', props.job.id)
    isAccepting.value = false
    close()
  }, 300)
}

// 监听 job 变化，加载进度
watch(() => props.job, (newJob) => {
  if (newJob) {
    loadProgress()
  }
}, { immediate: true })
</script>

<style scoped>
.modal {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
  padding: 20px;
  backdrop-filter: blur(5px);
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: white;
  border-radius: 24px;
  padding: 40px;
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: slideUp 0.4s ease;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

/* 美化滚动条 - 内嵌样式 */
.modal-content::-webkit-scrollbar {
  width: 8px;
}

.modal-content::-webkit-scrollbar-track {
  background: transparent;
  margin: 20px 0;
}

.modal-content::-webkit-scrollbar-thumb {
  background: var(--color-gray-300);
  border-radius: 4px;
  transition: background 0.3s ease;
}

.modal-content::-webkit-scrollbar-thumb:hover {
  background: var(--color-gray-400);
}

body.dark-mode .modal-content {
  background: var(--color-gray-800);
  color: var(--color-gray-100);
}

body.dark-mode .modal-content::-webkit-scrollbar-thumb {
  background: var(--color-gray-600);
}

body.dark-mode .modal-content::-webkit-scrollbar-thumb:hover {
  background: var(--color-gray-500);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: var(--color-gray-100);
  border: none;
  font-size: 28px;
  color: var(--color-gray-600);
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.close-btn:hover {
  background: var(--color-gray-200);
  transform: rotate(90deg);
}

body.dark-mode .close-btn {
  background: var(--color-gray-700);
  color: var(--color-gray-300);
}

.modal-header {
  margin-bottom: 30px;
}

.modal-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 10px;
  color: var(--color-gray-900);
}

body.dark-mode .modal-title {
  color: var(--color-gray-100);
}

.modal-salary {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 12px;
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-primary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.job-rank {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  border: 2px solid;
}

.progress-info {
  background: var(--color-gray-100);
  padding: 20px;
  border-radius: 16px;
  margin-bottom: 20px;
}

body.dark-mode .progress-info {
  background: var(--color-gray-700);
}

.progress-text {
  font-size: 16px;
  color: var(--color-gray-700);
  margin-bottom: 12px;
  font-weight: 600;
}

body.dark-mode .progress-text {
  color: var(--color-gray-300);
}

.progress-text span {
  color: var(--growth-primary);
  font-weight: 700;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background: var(--color-gray-200);
  border-radius: 999px;
  overflow: hidden;
}

body.dark-mode .progress-bar {
  background: var(--color-gray-600);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--growth-primary), var(--growth-secondary));
  transition: width 0.3s ease;
  border-radius: 999px;
}

.accepted-info {
  background: #e8f5e9;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 20px;
  border-left: 4px solid #4caf50;
}

.accepted-title {
  font-size: 14px;
  color: #2e7d32;
  font-weight: 700;
  margin-bottom: 4px;
}

.accepted-date {
  font-size: 13px;
  color: #666;
  margin-bottom: 4px;
}

.accepted-note {
  font-size: 12px;
  color: #999;
}

.section {
  margin-bottom: 30px;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-gray-900);
  margin-bottom: 16px;
  padding-bottom: 10px;
  border-bottom: 2px solid var(--color-gray-200);
}

body.dark-mode .section-title {
  color: var(--color-gray-100);
  border-bottom-color: var(--color-gray-700);
}

.requirements-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.requirement-item {
  display: flex;
  align-items: flex-start;
  padding: 16px;
  background: var(--color-gray-50);
  border-radius: 12px;
  transition: all 0.3s;
  border: 2px solid transparent;
}

body.dark-mode .requirement-item {
  background: var(--color-gray-700);
}

.requirement-item:hover {
  background: var(--color-gray-100);
  border-color: var(--color-gray-300);
}

body.dark-mode .requirement-item:hover {
  background: var(--color-gray-600);
  border-color: var(--color-gray-500);
}

.requirement-item.checked {
  background: #e8f5e9;
  border-color: #4caf50;
}

body.dark-mode .requirement-item.checked {
  background: rgba(76, 175, 80, 0.2);
}

.requirement-item.checked .requirement-text {
  text-decoration: line-through;
  opacity: 0.6;
}

.requirement-checkbox {
  width: 22px;
  height: 22px;
  margin-right: 14px;
  cursor: pointer;
  flex-shrink: 0;
  margin-top: 2px;
}

.requirement-text {
  flex: 1;
  font-size: 15px;
  color: var(--color-gray-900);
  line-height: 1.6;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

body.dark-mode .requirement-text {
  color: var(--color-gray-100);
}

.requirement-reward {
  font-size: 13px;
  color: var(--growth-primary);
  font-weight: 600;
}

.accept-btn {
  width: 100%;
  padding: 18px;
  background: linear-gradient(135deg, var(--growth-primary) 0%, var(--growth-secondary) 100%);
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.accept-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
}

.accept-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 600px) {
  .modal-content {
    padding: 32px 24px;
  }

  .modal-title {
    font-size: 24px;
  }

  .modal-salary {
    font-size: 28px;
  }
}
</style>
