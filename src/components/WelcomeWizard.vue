<template>
  <div v-if="isOpen" class="unified-modal-overlay wizard-overlay">
    <div class="unified-modal wizard-container">
      <!-- 进度指示器 -->
      <div class="progress-bar">
        <div 
          v-for="(step, index) in steps" 
          :key="index"
          :class="['progress-step', { 
            active: currentStep === index,
            completed: currentStep > index 
          }]"
        >
          <div class="step-circle">{{ index + 1 }}</div>
          <div class="step-label">{{ step.label }}</div>
        </div>
      </div>

      <!-- 步骤内容 -->
      <div class="wizard-content">
        <!-- 欢迎页 -->
        <div v-if="currentStep === 0" class="step-content">
          <div class="welcome-icon">👋</div>
          <h2>欢迎来到职场成长模拟器！</h2>
          <p class="welcome-text">
            让我们花 1 分钟时间，设置你的个人信息，<br>
            开启你的职场成长之旅！
          </p>
          <div class="feature-list">
            <div class="feature-item">
              <span class="feature-icon">🎯</span>
              <span>规划职业发展路径</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">📚</span>
              <span>系统化技能学习</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">💰</span>
              <span>模拟收入增长</span>
            </div>
          </div>
        </div>

        <!-- 个人信息 -->
        <div v-if="currentStep === 1" class="step-content">
          <h2>👤 个人信息</h2>
          <p class="step-desc">告诉我们一些关于你的基本信息</p>

          <div class="input-group">
            <label>你的昵称 <span class="required">*</span></label>
            <input 
              type="text" 
              v-model="formData.name" 
              placeholder="请输入昵称"
              class="unified-input"
              @input="validateStep"
            >
            <small v-if="errors.name" class="error-text">{{ errors.name }}</small>
          </div>

          <div class="input-group">
            <label>选择你的头像</label>
            <div class="avatar-grid">
              <button 
                v-for="emoji in avatarOptions" 
                :key="emoji"
                :class="['avatar-btn', { selected: formData.avatar === emoji }]"
                @click="formData.avatar = emoji"
              >
                {{ emoji }}
              </button>
            </div>
          </div>

          <div class="input-group">
            <label>所在城市</label>
            <select v-model="formData.city" class="unified-input">
              <option value="杭州">杭州</option>
              <option value="北京">北京</option>
              <option value="上海">上海</option>
              <option value="深圳">深圳</option>
              <option value="广州">广州</option>
              <option value="成都">成都</option>
              <option value="其他">其他</option>
            </select>
          </div>
        </div>

        <!-- 工作信息 -->
        <div v-if="currentStep === 2" class="step-content">
          <h2>💼 工作信息</h2>
          <p class="step-desc">设置你的工作时间和制度</p>

          <div class="input-group">
            <label>上班时间</label>
            <input type="time" v-model="formData.workStart" class="unified-input">
          </div>

          <div class="input-group">
            <label>下班时间</label>
            <input type="time" v-model="formData.workEnd" class="unified-input">
          </div>

          <div class="input-group">
            <label>工作制度</label>
            <select v-model="formData.workSchedule" class="unified-input">
              <option value="double">双休（周六日休息）</option>
              <option value="alternate">大小休（隔周单休）</option>
              <option value="single">单休（仅周日休息）</option>
              <option value="full">全勤（无休息日）</option>
            </select>
          </div>

          <div class="info-box">
            <div class="info-item">
              <span class="info-label">每日工作</span>
              <span class="info-value">{{ dailyWorkHours }} 小时</span>
            </div>
            <div class="info-item">
              <span class="info-label">每月工作</span>
              <span class="info-value">{{ monthlyWorkDays }} 天</span>
            </div>
          </div>
        </div>

        <!-- 生活信息 -->
        <div v-if="currentStep === 3" class="step-content">
          <h2>🏠 生活信息</h2>
          <p class="step-desc">设置你的收入和支出情况</p>

          <div class="input-group">
            <label>当前职业（可选）</label>
            <input 
              type="text" 
              v-model="formData.currentJob" 
              placeholder="例如：前端开发工程师"
              class="unified-input"
            >
            <small class="input-hint">如果你已经有工作，可以填写当前职业</small>
          </div>

          <!-- 如果填写了当前职业，显示入职时间和休息制度 -->
          <template v-if="formData.currentJob && formData.currentJob.trim()">
            <div class="input-group">
              <label>入职时间 <span class="required">*</span></label>
              <input 
                type="date" 
                v-model="formData.joinDate"
                class="unified-input"
                @input="validateStep"
              >
              <small v-if="errors.joinDate" class="error-text">{{ errors.joinDate }}</small>
            </div>

            <div class="input-group">
              <label>休息制度 <span class="required">*</span></label>
              <select v-model="formData.workSchedule" class="unified-input">
                <option value="double">双休（周六日休息）</option>
                <option value="alternate">大小休（隔周单休）</option>
                <option value="single">单休（仅周日休息）</option>
                <option value="full">全勤（无休息日）</option>
              </select>
            </div>
          </template>

          <div class="input-group">
            <label>月薪（元）<span class="required">*</span></label>
            <input 
              type="number" 
              v-model.number="formData.salary" 
              placeholder="请输入月薪"
              class="unified-input"
              @input="validateStep"
            >
            <small v-if="errors.salary" class="error-text">{{ errors.salary }}</small>
          </div>

          <div class="input-group">
            <label>每月房租（元）</label>
            <input type="number" v-model.number="formData.rent" placeholder="0" class="unified-input">
          </div>

          <div class="input-group">
            <label>每月水电网费（元）</label>
            <input type="number" v-model.number="formData.utilities" placeholder="0" class="unified-input">
          </div>

          <div class="input-group">
            <label>储蓄率（%）</label>
            <input 
              type="number" 
              v-model.number="formData.savingsRate" 
              placeholder="建议 20-40%"
              min="0"
              max="100"
              class="unified-input"
            >
            <small class="input-hint">建议储蓄率 20-40%，设置为 0 表示月光族</small>
          </div>
        </div>

        <!-- 完成页 -->
        <div v-if="currentStep === 4" class="step-content">
          <div class="success-icon">🎉</div>
          <h2>设置完成！</h2>
          <p class="welcome-text">
            你已经完成了所有设置，<br>
            现在可以开始你的职场成长之旅了！
          </p>

          <div class="summary-card">
            <div class="summary-item">
              <span class="summary-label">昵称</span>
              <span class="summary-value">{{ formData.avatar }} {{ formData.name }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">城市</span>
              <span class="summary-value">{{ formData.city }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">工作时间</span>
              <span class="summary-value">{{ formData.workStart }} - {{ formData.workEnd }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">月薪</span>
              <span class="summary-value">¥{{ formData.salary }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 导航按钮 -->
      <div class="wizard-footer">
        <button 
          v-if="currentStep > 0 && currentStep < 4"
          class="unified-btn btn-secondary"
          @click="prevStep"
        >
          <span>上一步</span>
        </button>
        <div v-else></div>

        <button 
          v-if="currentStep < 4"
          class="unified-btn unified-btn-primary btn-primary"
          :disabled="!canProceed"
          @click="nextStep"
        >
          <span>{{ currentStep === 0 ? '开始设置' : '下一步' }}</span>
        </button>
        <button 
          v-else
          class="unified-btn unified-btn-primary btn-primary"
          @click="complete"
        >
          <span>开始使用</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '../stores/user'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'complete'])

const userStore = useUserStore()

const currentStep = ref(0)

const steps = [
  { label: '欢迎' },
  { label: '个人信息' },
  { label: '工作信息' },
  { label: '生活信息' },
  { label: '完成' }
]

const avatarOptions = ['🎮', '👨‍💻', '👩‍💻', '🧑‍💼', '👨‍🎓', '👩‍🎓', '🦸', '🦹', '🧙', '🧑‍🚀', '🤖', '👾']

const formData = ref({
  name: '',
  avatar: '🎮',
  city: '杭州',
  workStart: '09:00',
  workEnd: '18:00',
  workSchedule: 'double',
  currentJob: '',
  joinDate: '',
  salary: null,
  rent: 2000,
  utilities: 300,
  savingsRate: 30
})

const errors = ref({
  name: '',
  salary: '',
  joinDate: ''
})

// 计算每日工作时长
const dailyWorkHours = computed(() => {
  if (!formData.value.workStart || !formData.value.workEnd) return 0
  const [startHour, startMin] = formData.value.workStart.split(':').map(Number)
  const [endHour, endMin] = formData.value.workEnd.split(':').map(Number)
  const hours = endHour - startHour + (endMin - startMin) / 60
  return hours.toFixed(1)
})

// 计算每月工作天数
const monthlyWorkDays = computed(() => {
  const scheduleMap = {
    double: 22,
    alternate: 24,
    single: 26,
    full: 30
  }
  return scheduleMap[formData.value.workSchedule] || 22
})

// 验证当前步骤
const validateStep = () => {
  errors.value = { name: '', salary: '', joinDate: '' }
  
  if (currentStep.value === 1) {
    if (!formData.value.name || formData.value.name.trim() === '') {
      errors.value.name = '请输入昵称'
      return false
    }
    if (formData.value.name.length > 20) {
      errors.value.name = '昵称不能超过 20 个字符'
      return false
    }
  }
  
  if (currentStep.value === 3) {
    if (!formData.value.salary || formData.value.salary <= 0) {
      errors.value.salary = '请输入有效的月薪'
      return false
    }
    
    // 如果填写了当前职业，必须填写入职时间
    if (formData.value.currentJob && formData.value.currentJob.trim()) {
      if (!formData.value.joinDate) {
        errors.value.joinDate = '请选择入职时间'
        return false
      }
    }
  }
  
  return true
}

// 是否可以继续
const canProceed = computed(() => {
  if (currentStep.value === 0) return true
  if (currentStep.value === 1) {
    return formData.value.name && formData.value.name.trim() !== ''
  }
  if (currentStep.value === 2) return true
  if (currentStep.value === 3) {
    // 必须填写月薪
    if (!formData.value.salary || formData.value.salary <= 0) return false
    
    // 如果填写了当前职业，必须填写入职时间
    if (formData.value.currentJob && formData.value.currentJob.trim()) {
      if (!formData.value.joinDate) return false
    }
    
    return true
  }
  return true
})

const nextStep = () => {
  if (validateStep()) {
    currentStep.value++
  }
}

const prevStep = () => {
  currentStep.value--
}

const complete = () => {
  // 保存用户信息
  const updates = {
    name: formData.value.name,
    avatar: formData.value.avatar,
    city: formData.value.city,
    workStart: formData.value.workStart,
    workEnd: formData.value.workEnd,
    workSchedule: formData.value.workSchedule,
    currentSalary: formData.value.salary,
    rent: formData.value.rent,
    utilities: formData.value.utilities,
    savingsRate: formData.value.savingsRate,
    isInitialized: true // 标记已完成初始化
  }
  
  // 如果填写了当前职业，也保存入职时间和休息制度
  if (formData.value.currentJob && formData.value.currentJob.trim()) {
    updates.currentJob = {
      title: formData.value.currentJob,
      salary: formData.value.salary,
      startDate: formData.value.joinDate
    }
    updates.joinDate = formData.value.joinDate
  }
  
  userStore.updateUserInfo(updates)

  emit('complete')
  emit('close')
}
</script>

<style scoped>
/* 使用统一设计系统的模态框样式 */
.wizard-overlay {
  z-index: 2000;
}

.wizard-container {
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow: hidden !important;
  display: flex;
  flex-direction: column;
  padding: 0 !important;
  background: var(--immersive-bg-primary) !important;
}

/* 进度条 */
.progress-bar {
  display: flex;
  justify-content: space-between;
  padding: var(--space-8) var(--space-8) var(--space-6);
  background: var(--immersive-bg-secondary);
  border-bottom: 1px solid var(--immersive-border);
}

.progress-step {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  position: relative;
}

.progress-step:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 16px;
  left: 50%;
  width: 100%;
  height: 2px;
  background: var(--immersive-border);
  z-index: 0;
}

.progress-step.completed:not(:last-child)::after {
  background: var(--rank-color, var(--neon-purple));
}

.step-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--immersive-bg-tertiary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
  position: relative;
  z-index: 1;
  transition: all var(--transition-fast);
}

.progress-step.active .step-circle {
  background: var(--rank-color, var(--neon-purple));
  transform: scale(1.1);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--rank-color, var(--neon-purple)) 20%, transparent);
}

.progress-step.completed .step-circle {
  background: var(--rank-color, var(--neon-purple));
}

.step-label {
  font-size: 0.75rem;
  color: var(--immersive-text-secondary);
  font-weight: 500;
}

.progress-step.active .step-label {
  color: var(--rank-color, var(--neon-purple));
  font-weight: 600;
}

/* 内容区域 */
.wizard-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-10) var(--space-8);
}

.wizard-content::-webkit-scrollbar {
  width: 6px;
}

.wizard-content::-webkit-scrollbar-thumb {
  background: var(--immersive-bg-tertiary);
  border-radius: 3px;
}

.step-content {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.step-content h2 {
  margin: 0 0 var(--space-3) 0;
  font-size: 1.75rem;
  color: var(--immersive-text-primary);
  font-weight: 700;
}

.step-desc {
  margin: 0 0 var(--space-8) 0;
  color: var(--immersive-text-secondary);
  font-size: 0.9375rem;
}

/* 欢迎页 */
.welcome-icon,
.success-icon {
  font-size: 4rem;
  text-align: center;
  margin-bottom: 24px;
  animation: bounce 1s ease infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.welcome-text {
  text-align: center;
  color: var(--immersive-text-secondary);
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: var(--space-8);
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.feature-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
  background: var(--immersive-bg-secondary);
  border-radius: var(--radius-xl);
}

.feature-icon {
  font-size: 1.5rem;
}

/* 表单 */
.input-group {
  margin-bottom: var(--space-6);
}

label {
  display: block;
  margin-bottom: var(--space-2);
  color: var(--immersive-text-primary);
  font-weight: 600;
  font-size: 0.875rem;
}

.required {
  color: var(--color-error);
}

.error-text {
  display: block;
  margin-top: var(--space-1);
  color: var(--color-error);
  font-size: 0.8125rem;
}

.input-hint {
  display: block;
  margin-top: var(--space-1);
  color: var(--immersive-text-tertiary);
  font-size: 0.8125rem;
}

/* 头像网格 */
.avatar-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: var(--space-2);
}

.avatar-btn {
  aspect-ratio: 1;
  font-size: 1.5rem;
  border: 2px solid var(--immersive-border);
  border-radius: var(--radius-xl);
  background: var(--immersive-bg-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-btn:hover {
  border-color: var(--rank-color, var(--neon-purple));
  transform: scale(1.05);
}

.avatar-btn.selected {
  border-color: var(--rank-color, var(--neon-purple));
  background: color-mix(in srgb, var(--rank-color, var(--neon-purple)) 10%, transparent);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--rank-color, var(--neon-purple)) 15%, transparent);
}

/* 信息框 */
.info-box {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
  margin-top: var(--space-6);
  padding: var(--space-4);
  background: var(--immersive-bg-secondary);
  border-radius: var(--radius-xl);
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.info-label {
  font-size: 0.75rem;
  color: var(--immersive-text-secondary);
}

.info-value {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--rank-color, var(--neon-purple));
}

/* 摘要卡片 */
.summary-card {
  background: var(--immersive-bg-secondary);
  border-radius: var(--radius-2xl);
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--immersive-border);
}

.summary-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.summary-label {
  color: var(--immersive-text-secondary);
  font-size: 0.875rem;
}

.summary-value {
  font-weight: 700;
  color: var(--immersive-text-primary);
}

/* 底部按钮 */
.wizard-footer {
  display: flex;
  justify-content: space-between;
  padding: var(--space-6) var(--space-8);
  border-top: 1px solid var(--immersive-border);
  background: var(--immersive-bg-secondary);
}

.btn-secondary {
  background: var(--immersive-bg-primary) !important;
  color: var(--immersive-text-primary) !important;
  border: 2px solid var(--immersive-border) !important;
}

.btn-secondary:hover {
  background: var(--immersive-bg-secondary) !important;
}

/* 响应式 */
@media (max-width: 640px) {
  .wizard-container {
    width: 95%;
    max-height: 95vh;
  }

  .progress-bar {
    padding: var(--space-6) var(--space-4) var(--space-4);
  }

  .step-label {
    font-size: 0.625rem;
  }

  .wizard-content {
    padding: var(--space-6) var(--space-4);
  }

  .wizard-footer {
    padding: var(--space-4);
  }

  .avatar-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
