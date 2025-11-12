<template>
  <div v-if="isOpen" class="unified-modal-overlay" @click.self="close">
    <div class="unified-modal modal-content" :class="{ 'wide': showRewardSetup }">
      <button class="close-btn" @click="close">×</button>
      
      <!-- 奖励设置界面 -->
      <div v-if="showRewardSetup" class="reward-setup-container">
        <RewardSetup 
          :subtasks="tempSubtasks"
          :jobSalary="job.salary"
          @save="handleRewardSave"
          @cancel="handleRewardCancel"
        />
      </div>
      
      <!-- 任务详情界面 -->
      <div v-else class="job-details" :style="{ '--rank-color': rankInfo.current.color }">
      <!-- 头部信息 -->
      <div class="modal-header">
        <div class="header-top">
          <div class="job-icon">💼</div>
          <div class="header-info">
            <div class="modal-title">{{ job.title }}</div>
            <div class="job-meta">
              <span class="meta-item">
                <span class="meta-icon">💰</span>
                <span class="meta-value">¥{{ formatSalary(job.salary) }}/月</span>
              </span>
              <span class="meta-divider">·</span>
              <span class="meta-item">
                <span class="meta-icon">{{ rankInfo.current.icon }}</span>
                <span class="meta-value">{{ rankInfo.current.name }}段位</span>
              </span>
            </div>
          </div>
        </div>
        
        <!-- 薪资卡片 -->
        <div class="salary-card">
          <div class="salary-label">目标月薪</div>
          <div class="salary-amount">¥{{ formatSalary(job.salary) }}</div>
          <div class="salary-annual">年薪约 ¥{{ (job.salary * 12 / 10000).toFixed(1) }}万</div>
        </div>
      </div>

      <!-- 进度信息 -->
      <div class="progress-section">
        <div class="progress-header">
          <span class="progress-label">学习进度</span>
          <span class="progress-value">{{ progressPercent }}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
        </div>
        <div class="progress-stats">
          <span>已完成 {{ Object.values(checkedRequirements).filter(Boolean).length }} / {{ job.requirements.length }} 项</span>
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
      <div class="requirements-section">
        <div class="section-header">
          <div class="section-title">
            <span class="title-icon">📋</span>
            <span>技能要求</span>
          </div>
          <div class="section-badge">{{ job.requirements.length }} 项</div>
        </div>
        
        <div class="requirements-grid">
          <div 
            v-for="(req, index) in job.requirements" 
            :key="req.id"
            class="requirement-card"
            :class="{ checked: isRequirementChecked(req.id) }"
            @click="toggleRequirement(req.id)"
          >
            <div class="requirement-number">{{ index + 1 }}</div>
            <div class="requirement-content">
              <div class="requirement-text">{{ req.text }}</div>
              <div v-if="req.reward" class="requirement-reward">{{ req.reward }}</div>
            </div>
            <div class="requirement-check">
              <span v-if="isRequirementChecked(req.id)" class="check-icon">✓</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部操作区 -->
      <div class="modal-footer">
        <button 
          class="action-btn action-btn-primary" 
          @click="handleAccept"
          :disabled="isAccepting"
        >
          <span class="btn-icon">🚀</span>
          <span>{{ isAccepted ? '重新接取任务' : '开始学习之旅' }}</span>
        </button>
      </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useJobsStore } from '../stores/jobs'
import { useQuestStore } from '../stores/quest'
import { useLifestyle } from '../composables/useLifestyle'
import LifestyleComparison from './LifestyleComparison.vue'
import RewardSetup from './quest/RewardSetup.vue'

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
const questStore = useQuestStore()
const { getRankInfo, getProgress } = useLifestyle()

const isAccepting = ref(false)
const checkedRequirements = ref({})
const showRewardSetup = ref(false)
const tempSubtasks = ref([])
const customRewards = ref(null)

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
  
  // 生成临时子任务用于奖励设置
  tempSubtasks.value = generateTempSubtasks()
  
  // 显示奖励设置界面
  showRewardSetup.value = true
}

const generateTempSubtasks = () => {
  if (!props.job.requirements) return []
  
  const totalReqs = props.job.requirements.length
  return props.job.requirements.map((req, index) => {
    let difficulty
    if (index < totalReqs / 3) {
      difficulty = 'basic'
    } else if (index < (totalReqs * 2) / 3) {
      difficulty = 'intermediate'
    } else {
      difficulty = 'advanced'
    }
    
    return {
      id: `${props.job.id}-${index}`,
      title: req.skill || req.text,
      difficulty,
      expReward: 0, // 将由经验值分配算法计算
      goldReward: Math.floor(props.job.salary * 0.05),
      customGoldReward: null,
      customReward: null
    }
  })
}

const handleRewardSave = (rewardData) => {
  customRewards.value = rewardData.globalRewards
  tempSubtasks.value = rewardData.subtasks
  
  // 关闭奖励设置，执行接取任务
  showRewardSetup.value = false
  isAccepting.value = true
  
  setTimeout(() => {
    emit('accept', props.job.id, customRewards.value)
    isAccepting.value = false
    close()
  }, 300)
}

const handleRewardCancel = () => {
  showRewardSetup.value = false
}

// 格式化薪资显示
const formatSalary = (salary) => {
  if (salary >= 10000) {
    return (salary / 1000).toFixed(1) + 'K'
  }
  return salary.toLocaleString('zh-CN')
}

// 监听 job 变化，加载进度
watch(() => props.job, (newJob) => {
  if (newJob) {
    loadProgress()
  }
}, { immediate: true })
</script>

<style scoped>
/* 模态框容器 */
.modal-content {
  max-width: 800px;
  width: 100%;
  transition: all var(--duration-normal) var(--ease-smooth);
  border: 2px solid rgba(255, 255, 255, 0.1);
  background: var(--bg-secondary);
  backdrop-filter: blur(var(--blur-xl));
  box-shadow: var(--shadow-2xl);
}

.modal-content.wide {
  max-width: 900px;
}

.job-details {
  position: relative;
  padding: var(--space-6);
  max-height: 85vh;
  overflow-y: auto;
}

.job-details::-webkit-scrollbar {
  width: 6px;
}

.job-details::-webkit-scrollbar-track {
  background: transparent;
}

.job-details::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

/* 关闭按钮 */
.close-btn {
  position: absolute;
  top: var(--space-6);
  right: var(--space-6);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 24px;
  color: var(--text-secondary);
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--duration-fast) var(--ease-smooth);
  z-index: 10;
}

.close-btn:hover {
  background: var(--color-error);
  color: white;
  transform: rotate(90deg);
  border-color: transparent;
}

/* 头部区域 */
.modal-header {
  margin-bottom: var(--space-6);
}

.header-top {
  display: flex;
  align-items: flex-start;
  gap: var(--space-4);
  margin-bottom: var(--space-4);
}

.job-icon {
  font-size: var(--text-5xl);
  line-height: 1;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

.header-info {
  flex: 1;
}

.modal-title {
  font-size: var(--text-3xl);
  font-weight: var(--font-black);
  color: var(--text-primary);
  line-height: var(--leading-tight);
  margin-bottom: var(--space-2);
  letter-spacing: -0.02em;
}

.job-meta {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.meta-icon {
  font-size: var(--text-base);
}

.meta-value {
  font-weight: var(--font-semibold);
}

.meta-divider {
  opacity: 0.5;
}

/* 薪资卡片 */
.salary-card {
  background: linear-gradient(135deg, 
    rgba(102, 126, 234, 0.1) 0%, 
    rgba(102, 126, 234, 0.05) 100%
  );
  border: 2px solid rgba(102, 126, 234, 0.2);
  border-radius: var(--radius-2xl);
  padding: var(--space-4);
  text-align: center;
  position: relative;
  overflow: hidden;
}

.salary-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.5) 50%, transparent 100%);
}

.salary-label {
  font-size: var(--text-xs);
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: var(--font-semibold);
  margin-bottom: var(--space-2);
}

.salary-amount {
  font-size: var(--text-4xl);
  font-weight: var(--font-black);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.03em;
  margin-bottom: var(--space-1);
  font-variant-numeric: tabular-nums;
}

.salary-annual {
  font-size: var(--text-sm);
  color: var(--text-tertiary);
  font-weight: var(--font-medium);
}

/* 进度区域 */
.progress-section {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-2xl);
  padding: var(--space-4);
  margin-bottom: var(--space-6);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-3);
}

.progress-label {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  font-weight: var(--font-semibold);
}

.progress-value {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--color-primary);
  font-variant-numeric: tabular-nums;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: var(--radius-full);
  overflow: hidden;
  box-shadow: var(--shadow-inner);
  margin-bottom: var(--space-2);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
  border-radius: var(--radius-full);
  transition: width 0.8s var(--ease-out-quint);
  position: relative;
  box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
}

.progress-fill::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.3), transparent);
  border-radius: var(--radius-full) var(--radius-full) 0 0;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.progress-stats {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  text-align: center;
}

.accepted-info {
  background: color-mix(in srgb, var(--color-success) 10%, transparent);
  padding: var(--space-4);
  border-radius: var(--radius-xl);
  margin-bottom: var(--space-5);
  border-left: 4px solid var(--color-success);
}

.accepted-title {
  font-size: 0.875rem;
  color: var(--color-success);
  font-weight: 700;
  margin-bottom: var(--space-1);
}

.accepted-date {
  font-size: 0.8125rem;
  color: var(--immersive-text-secondary);
  margin-bottom: var(--space-1);
}

.accepted-note {
  font-size: 0.75rem;
  color: var(--immersive-text-tertiary);
}

/* 需求区域 */
.requirements-section {
  margin-bottom: var(--space-6);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
}

.section-title {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
}

.title-icon {
  font-size: var(--text-2xl);
}

.section-badge {
  padding: var(--space-1) var(--space-3);
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  color: var(--color-primary);
}

.requirements-grid {
  display: grid;
  gap: var(--space-2);
  max-height: 40vh;
  overflow-y: auto;
  padding-right: var(--space-2);
}

.requirements-grid::-webkit-scrollbar {
  width: 4px;
}

.requirements-grid::-webkit-scrollbar-track {
  background: transparent;
}

.requirements-grid::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}

.requirement-card {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  transition: all var(--duration-fast) var(--ease-smooth);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.requirement-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: var(--color-primary);
  transform: scaleY(0);
  transition: transform var(--duration-fast) var(--ease-smooth);
}

.requirement-card:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(102, 126, 234, 0.3);
  transform: translateX(4px);
}

.requirement-card:hover::before {
  transform: scaleY(1);
}

.requirement-card.checked {
  background: rgba(16, 185, 129, 0.1);
  border-color: var(--color-success);
}

.requirement-card.checked::before {
  background: var(--color-success);
  transform: scaleY(1);
}

.requirement-card.checked .requirement-text {
  text-decoration: line-through;
  opacity: 0.6;
}

.requirement-number {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  background: rgba(102, 126, 234, 0.1);
  border: 2px solid rgba(102, 126, 234, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  color: var(--color-primary);
  flex-shrink: 0;
  transition: all var(--duration-fast);
}

.requirement-card.checked .requirement-number {
  background: var(--color-success);
  border-color: var(--color-success);
  color: white;
}

.requirement-content {
  flex: 1;
  min-width: 0;
}

.requirement-text {
  font-size: var(--text-sm);
  color: var(--text-primary);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--space-1);
}

.requirement-reward {
  font-size: var(--text-xs);
  color: var(--color-primary);
  font-weight: var(--font-semibold);
}

.requirement-check {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-full);
  border: 2px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all var(--duration-fast);
}

.requirement-card.checked .requirement-check {
  background: var(--color-success);
  border-color: var(--color-success);
}

.check-icon {
  font-size: var(--text-base);
  color: white;
  font-weight: var(--font-bold);
}

.reward-setup-container {
  margin: calc(var(--space-5) * -1);
}

/* 底部操作区 */
.modal-footer {
  padding-top: var(--space-4);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  bottom: 0;
  background: var(--bg-secondary);
  margin: 0 calc(var(--space-6) * -1) calc(var(--space-6) * -1);
  padding: var(--space-4) var(--space-6);
}

.action-btn {
  width: 100%;
  padding: var(--space-4) var(--space-6);
  border: none;
  border-radius: var(--radius-xl);
  font-size: var(--text-base);
  font-weight: var(--font-bold);
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-smooth);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  position: relative;
  overflow: hidden;
}

.action-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  transform: translate(-50%, -50%);
  transition: width 0.6s ease, height 0.6s ease;
}

.action-btn:hover::before {
  width: 400px;
  height: 400px;
}

.action-btn-primary {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  color: white;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
}

.action-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}

.action-btn-primary:active {
  transform: translateY(0);
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.btn-icon {
  font-size: var(--text-xl);
  line-height: 1;
}

/* 响应式 */
@media (max-width: 768px) {
  .job-details {
    padding: var(--space-6) var(--space-4);
  }
  
  .close-btn {
    top: var(--space-4);
    right: var(--space-4);
  }
  
  .header-top {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .modal-title {
    font-size: var(--text-2xl);
  }
  
  .salary-amount {
    font-size: var(--text-4xl);
  }
  
  .requirements-grid {
    gap: var(--space-2);
  }
  
  .requirement-card {
    padding: var(--space-3);
  }
}
</style>
