<template>
  <div v-if="isOpen" class="unified-modal-overlay" @click.self="close">
    <div class="unified-modal">
      <div class="unified-modal-header">
        <h2 class="unified-card-title">⚙️ 设置</h2>
        <button class="close-btn" @click="close">×</button>
      </div>

      <!-- 标签页导航 -->
      <div class="tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          :class="['tab', { active: activeTab === tab.id }]"
          @click="activeTab = tab.id"
        >
          {{ tab.icon }} {{ tab.label }}
        </button>
      </div>

      <!-- 个人信息标签 -->
      <div v-show="activeTab === 'personal'" class="tab-content">
        <div class="input-group">
          <label for="name">昵称</label>
          <input type="text" v-model="formData.name" placeholder="请输入昵称" class="unified-input">
        </div>

        <div class="input-group">
          <label for="avatar">头像</label>
          <div class="avatar-selector">
            <button 
              v-for="emoji in avatarOptions" 
              :key="emoji"
              :class="['avatar-option', { selected: formData.avatar === emoji }]"
              @click="formData.avatar = emoji"
            >
              {{ emoji }}
            </button>
          </div>
        </div>

        <div v-if="currentJobInfo" class="current-job-card">
          <div class="job-card-header">
            <span class="job-icon">💼</span>
            <span class="job-label">当前职业</span>
          </div>
          <div class="job-card-content">
            <div class="job-title">{{ currentJobInfo.title }}</div>
            <div class="job-salary">月薪：¥{{ formatNumber(currentJobInfo.salary) }}</div>
            <div v-if="currentJobInfo.startDate" class="job-date">
              入职时间：{{ currentJobInfo.startDate }}
            </div>
          </div>
        </div>

        <div class="input-group">
          <label for="email">邮箱（可选）</label>
          <input type="email" v-model="formData.email" placeholder="your@email.com" class="unified-input">
        </div>

        <div class="input-group">
          <label for="phone">手机号（可选）</label>
          <input type="tel" v-model="formData.phone" placeholder="请输入手机号" class="unified-input">
        </div>

        <div class="input-group">
          <label for="city">所在城市</label>
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

      <!-- 工作设置标签 -->
      <div v-show="activeTab === 'work'" class="tab-content">
        <div class="input-group">
          <label for="joinDate">入职日期</label>
          <input type="date" v-model="formData.joinDate" class="unified-input">
        </div>

        <div class="input-group">
          <label for="workStart">上班时间</label>
          <input type="time" v-model="formData.workStart" class="unified-input">
        </div>

        <div class="input-group">
          <label for="workEnd">下班时间</label>
          <input type="time" v-model="formData.workEnd" class="unified-input">
        </div>

        <div class="input-group">
          <label for="workSchedule">工作制度</label>
          <select v-model="formData.workSchedule" class="unified-input">
            <option value="double">双休（周六日休息）</option>
            <option value="alternate">大小休（隔周单休）</option>
            <option value="single">单休（仅周日休息）</option>
            <option value="full">全勤（无休息日）</option>
            <option value="custom">自定义工作天数</option>
          </select>
        </div>

        <div v-if="formData.workSchedule === 'custom'" class="input-group">
          <label for="workDays">每月工作天数</label>
          <input type="number" v-model.number="formData.workDays" placeholder="默认 22 天" min="1" max="31" class="unified-input">
        </div>

        <div class="work-hours-display">
          <div class="info-card">
            <span class="info-label">每日工作时长</span>
            <span class="info-value">{{ dailyWorkHours }} 小时</span>
          </div>
          <div class="info-card">
            <span class="info-label">每月工作天数</span>
            <span class="info-value">{{ monthlyWorkDays }} 天</span>
          </div>
        </div>
      </div>

      <!-- 生活设置标签 -->
      <div v-show="activeTab === 'life'" class="tab-content">
        <div class="input-group">
          <label for="salary">月薪（元）</label>
          <input type="number" v-model.number="formData.salary" placeholder="请输入你的月薪" class="unified-input">
        </div>

        <div class="input-group">
          <label for="peopleCount">几个人生活</label>
          <input type="number" v-model.number="formData.peopleCount" placeholder="默认 1 人" min="1" max="10" class="unified-input">
        </div>

        <div class="input-group">
          <label for="rent">每月房租（元）</label>
          <input type="number" v-model.number="formData.rent" placeholder="请输入每月房租" class="unified-input">
        </div>

        <div class="input-group">
          <label for="utilities">每月水电网费（元）</label>
          <input type="number" v-model.number="formData.utilities" placeholder="请输入每月水电网费" class="unified-input">
        </div>

        <div class="input-group">
          <label for="savingsRate">储蓄率（%）</label>
          <input type="number" v-model.number="formData.savingsRate" placeholder="建议20-40%" min="0" max="100" class="unified-input">
          <div v-if="savingsRateRecommendation" class="savings-recommendation">
            💡 基于您的段位，建议储蓄率 {{ savingsRateRecommendation.recommended }}%
          </div>
          <small class="input-hint">设置为0表示月光族，不储蓄</small>
        </div>

        <div class="expense-summary">
          <div class="summary-item">
            <span>固定支出</span>
            <span class="amount">¥{{ totalFixedExpense }}</span>
          </div>
          <div class="summary-item">
            <span>可支配收入</span>
            <span class="amount highlight">¥{{ disposableIncome }}</span>
          </div>
        </div>
      </div>

      <!-- 偏好设置标签 -->
      <div v-show="activeTab === 'preferences'" class="tab-content">
        <div class="input-group">
          <label for="theme">主题</label>
          <select v-model="formData.theme" class="unified-input">
            <option value="light">☀️ 浅色模式</option>
            <option value="dark">🌙 深色模式</option>
          </select>
        </div>

        <div class="input-group">
          <label for="weeklyGoal">每周学习目标（小时）</label>
          <input type="number" v-model.number="formData.weeklyGoal" placeholder="建议 10 小时" min="1" max="168" class="unified-input">
          <small class="input-hint">设定每周学习时长目标，帮助你保持学习节奏</small>
        </div>

        <div class="input-group">
          <label class="checkbox-label">
            <input type="checkbox" v-model="formData.notifications">
            <span>开启学习提醒通知</span>
          </label>
        </div>

        <div class="danger-zone">
          <h4>⚠️ 危险操作</h4>
          <button class="unified-btn danger-btn" @click="showResetConfirm = true">
            <span>清除所有数据</span>
          </button>
          <small class="input-hint">此操作将清空所有学习记录、任务进度和设置，无法恢复</small>
        </div>
      </div>

      <div class="unified-modal-footer">
        <button class="unified-btn cancel-btn" @click="close"><span>取消</span></button>
        <button class="unified-btn unified-btn-primary save-btn" @click="handleSave"><span>保存设置</span></button>
      </div>
    </div>

    <!-- 确认对话框 - 独立覆盖层 -->
    <div v-if="showResetConfirm" class="confirm-overlay" @click.self="showResetConfirm = false">
      <div class="confirm-dialog">
        <div class="confirm-icon">⚠️</div>
        <h3 class="confirm-title">确认清除所有数据？</h3>
        <p class="confirm-message">
          此操作将永久删除以下内容：
        </p>
        <ul class="confirm-list">
          <li>✗ 所有学习记录和任务进度</li>
          <li>✗ 个人信息和工作设置</li>
          <li>✗ 生活设置和偏好配置</li>
          <li>✗ 任务历史和成就记录</li>
        </ul>
        <p class="confirm-warning">
          <strong>此操作无法撤销！</strong>数据清除后将无法恢复。
        </p>
        <div class="confirm-actions">
          <button class="unified-btn" @click="showResetConfirm = false">
            <span>取消</span>
          </button>
          <button class="unified-btn danger-btn" @click="handleReset">
            <span>确认清除</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useUserStore } from '../stores/user'
import { useJobsStore } from '../stores/jobs'
import { useQuestStore } from '../stores/quest'
import { useLifestyle } from '../composables/useLifestyle'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'save'])

const userStore = useUserStore()
const jobsStore = useJobsStore()
const questStore = useQuestStore()
const { rankSystem } = useLifestyle()

const activeTab = ref('personal')
const showResetConfirm = ref(false)

const tabs = [
  { id: 'personal', label: '个人信息', icon: '👤' },
  { id: 'work', label: '工作设置', icon: '💼' },
  { id: 'life', label: '生活设置', icon: '🏠' },
  { id: 'preferences', label: '偏好设置', icon: '⚙️' }
]

const avatarOptions = ['🎮', '👨‍💻', '👩‍💻', '🧑‍💼', '👨‍🎓', '👩‍🎓', '🦸', '🦹', '🧙', '🧑‍🚀', '🤖', '👾']

const formData = ref({
  // 个人信息
  name: '职场冒险者',
  avatar: '🎮',
  email: '',
  phone: '',
  city: '杭州',
  
  // 工作设置
  joinDate: '',
  workStart: '09:00',
  workEnd: '18:00',
  workSchedule: 'double',
  workDays: 22,
  
  // 生活设置
  salary: 10000,
  peopleCount: 1,
  rent: 2000,
  utilities: 300,
  savingsRate: 30,
  
  // 偏好设置
  theme: 'light',
  notifications: true,
  weeklyGoal: 10
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
    full: 30,
    custom: formData.value.workDays
  }
  return scheduleMap[formData.value.workSchedule] || 22
})

// 储蓄率建议
const savingsRateRecommendation = computed(() => {
  if (formData.value.salary > 0) {
    return rankSystem.getSavingsRateRecommendation(formData.value.salary)
  }
  return null
})

// 固定支出
const totalFixedExpense = computed(() => {
  return formData.value.rent + formData.value.utilities
})

// 可支配收入
const disposableIncome = computed(() => {
  const afterTax = formData.value.salary * 0.85 // 简化税后计算
  const afterExpense = afterTax - totalFixedExpense.value
  const afterSavings = afterExpense * (1 - formData.value.savingsRate / 100)
  return Math.round(afterSavings)
})

// 当前职业信息
const currentJobInfo = computed(() => {
  return userStore.userInfo.currentJob
})

// 格式化数字
const formatNumber = (num) => {
  return num ? num.toLocaleString('zh-CN') : '0'
}

const loadData = () => {
  // 从 userStore 加载数据
  const user = userStore.userInfo
  formData.value = {
    name: user.name,
    avatar: user.avatar,
    email: user.email || '',
    phone: user.phone || '',
    city: user.city || '杭州',
    joinDate: user.joinDate || '',
    workStart: user.workStart || '09:00',
    workEnd: user.workEnd || '18:00',
    workSchedule: user.workSchedule || 'double',
    workDays: user.workDays || 22,
    salary: user.currentSalary || 10000,
    peopleCount: user.peopleCount || 1,
    rent: user.rent || 2000,
    utilities: user.utilities || 300,
    savingsRate: user.savingsRate || 30,
    theme: user.theme || 'light',
    notifications: user.notifications !== false,
    weeklyGoal: user.weeklyGoal || 10
  }
}

const handleSave = () => {
  // 更新 userStore
  userStore.updateUserInfo({
    name: formData.value.name,
    avatar: formData.value.avatar,
    email: formData.value.email,
    phone: formData.value.phone,
    city: formData.value.city,
    joinDate: formData.value.joinDate,
    workStart: formData.value.workStart,
    workEnd: formData.value.workEnd,
    workSchedule: formData.value.workSchedule,
    workDays: formData.value.workDays,
    currentSalary: formData.value.salary,
    peopleCount: formData.value.peopleCount,
    rent: formData.value.rent,
    utilities: formData.value.utilities,
    savingsRate: formData.value.savingsRate,
    theme: formData.value.theme,
    notifications: formData.value.notifications,
    weeklyGoal: formData.value.weeklyGoal
  })

  // 更新主题
  if (formData.value.theme !== userStore.userInfo.theme) {
    userStore.updateTheme(formData.value.theme)
  }

  // 兼容旧的 salaryData 存储
  localStorage.setItem('salaryData', JSON.stringify({
    salary: formData.value.salary,
    peopleCount: formData.value.peopleCount,
    rent: formData.value.rent,
    utilities: formData.value.utilities,
    savingsRate: formData.value.savingsRate,
    joinDate: formData.value.joinDate,
    workStart: formData.value.workStart,
    workEnd: formData.value.workEnd,
    workSchedule: formData.value.workSchedule,
    workDays: formData.value.workDays
  }))

  emit('save', formData.value)
  close()
}

const handleReset = () => {
  // 关闭确认对话框
  showResetConfirm.value = false
  
  // 重置所有 store
  userStore.resetUserData()
  jobsStore.learningPlans = []
  jobsStore.userProgress = {}
  jobsStore.saveToStorage()
  questStore.currentQuest = null
  questStore.questHistory = []
  questStore.saveToStorage()
  
  // 清除所有 localStorage 数据
  localStorage.removeItem('salaryData')
  localStorage.removeItem('userStore')
  localStorage.removeItem('jobsStore')
  localStorage.removeItem('questStore')
  
  // 清除所有以 job_ 开头的进度数据
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('job_')) {
      localStorage.removeItem(key)
    }
  })
  
  close()
  
  // 延迟刷新页面，让用户看到关闭动画
  setTimeout(() => {
    window.location.reload()
  }, 300)
}

const close = () => {
  emit('close')
}

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    loadData()
    activeTab.value = 'personal'
  }
})
</script>

<style scoped>
/* 使用统一设计系统的模态框样式 */

.close-btn {
  background: var(--immersive-bg-secondary);
  border: none;
  font-size: 1.5rem;
  color: var(--immersive-text-secondary);
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  border-radius: 50%;
}

.close-btn:hover {
  background: var(--rank-color, var(--neon-purple));
  color: white;
  transform: rotate(90deg);
}

/* 标签页 */
.tabs {
  display: flex;
  gap: var(--space-2);
  margin-bottom: var(--space-6);
  border-bottom: 2px solid var(--immersive-border);
  overflow-x: auto;
}

.tab {
  padding: var(--space-2) var(--space-4);
  background: none;
  border: none;
  color: var(--immersive-text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  white-space: nowrap;
}

.tab:hover {
  color: var(--rank-color, var(--neon-purple));
}

.tab.active {
  color: var(--rank-color, var(--neon-purple));
  border-bottom-color: var(--rank-color, var(--neon-purple));
}

.tab-content {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 表单 */
.input-group {
  margin-bottom: var(--space-5);
}

label {
  display: block;
  margin-bottom: var(--space-2);
  color: var(--immersive-text-primary);
  font-weight: 500;
  font-size: 0.875rem;
}

/* 头像选择器 */
.avatar-selector {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: var(--space-2);
}

.avatar-option {
  width: 100%;
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

.avatar-option:hover {
  border-color: var(--rank-color, var(--neon-purple));
  transform: scale(1.1);
}

.avatar-option.selected {
  border-color: var(--rank-color, var(--neon-purple));
  background: color-mix(in srgb, var(--rank-color, var(--neon-purple)) 10%, transparent);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--rank-color, var(--neon-purple)) 15%, transparent);
}

/* 当前职业卡片 */
.current-job-card {
  background: linear-gradient(135deg, 
    color-mix(in srgb, var(--rank-color, var(--neon-purple)) 10%, transparent),
    color-mix(in srgb, var(--rank-color, var(--neon-purple)) 5%, transparent));
  border: 2px solid color-mix(in srgb, var(--rank-color, var(--neon-purple)) 20%, transparent);
  border-radius: var(--radius-xl);
  padding: var(--space-4);
  margin-top: var(--space-4);
}

.job-card-header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-3);
}

.job-icon {
  font-size: 1.25rem;
}

.job-label {
  font-size: 0.75rem;
  color: var(--immersive-text-secondary);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.job-card-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.job-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--rank-color, var(--neon-purple));
}

.job-salary {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-success);
}

.job-date {
  font-size: 0.8125rem;
  color: var(--immersive-text-tertiary);
}

/* 工作时长显示 */
.work-hours-display {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
  margin-top: var(--space-4);
}

.info-card {
  background: var(--immersive-bg-secondary);
  padding: var(--space-3);
  border-radius: var(--radius-xl);
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

/* 支出汇总 */
.expense-summary {
  background: var(--immersive-bg-secondary);
  padding: var(--space-4);
  border-radius: var(--radius-xl);
  margin-top: var(--space-4);
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-2) 0;
  font-size: 0.875rem;
}

.summary-item:not(:last-child) {
  border-bottom: 1px solid var(--immersive-border);
}

.amount {
  font-weight: 700;
  color: var(--immersive-text-primary);
}

.amount.highlight {
  color: var(--rank-color, var(--neon-purple));
  font-size: 1.125rem;
}

/* 复选框 */
.checkbox-label {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  cursor: pointer;
  font-weight: 500;
}

.checkbox-label input[type="checkbox"] {
  width: auto;
  cursor: pointer;
}

/* 危险区域 */
.danger-zone {
  margin-top: var(--space-8);
  padding: var(--space-4);
  background: color-mix(in srgb, var(--color-error) 5%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-error) 20%, transparent);
  border-radius: var(--radius-xl);
}

.danger-zone h4 {
  margin: 0 0 var(--space-3) 0;
  color: var(--color-error);
  font-size: 0.875rem;
}

.danger-btn {
  width: 100%;
  background: var(--color-error) !important;
  margin-bottom: var(--space-2);
}

.danger-btn:hover {
  background: color-mix(in srgb, var(--color-error) 90%, black) !important;
}

.savings-recommendation {
  color: var(--rank-color, var(--neon-purple));
  font-size: 0.8125rem;
  margin-top: var(--space-1);
  font-weight: 500;
}

.input-hint {
  color: var(--immersive-text-tertiary);
  font-size: 0.75rem;
  margin-top: var(--space-1);
  display: block;
}

/* 确认对话框 */
.confirm-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: fadeIn 0.2s ease;
}

.confirm-dialog {
  background: var(--immersive-bg-primary);
  border-radius: var(--radius-2xl);
  padding: var(--space-8);
  max-width: 480px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  animation: slideUp 0.3s ease;
  border: 2px solid var(--color-error);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.confirm-icon {
  font-size: 4rem;
  text-align: center;
  margin-bottom: var(--space-4);
  animation: shake 0.5s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}

.confirm-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-error);
  text-align: center;
  margin-bottom: var(--space-4);
}

.confirm-message {
  font-size: 0.9375rem;
  color: var(--immersive-text-primary);
  text-align: center;
  margin-bottom: var(--space-4);
  line-height: 1.6;
}

.confirm-list {
  list-style: none;
  padding: 0;
  margin: 0 0 var(--space-4) 0;
  background: color-mix(in srgb, var(--color-error) 5%, transparent);
  border-radius: var(--radius-xl);
  padding: var(--space-4);
  border: 1px solid color-mix(in srgb, var(--color-error) 20%, transparent);
}

.confirm-list li {
  font-size: 0.875rem;
  color: var(--immersive-text-secondary);
  padding: var(--space-2) 0;
  line-height: 1.5;
}

.confirm-list li:not(:last-child) {
  border-bottom: 1px solid color-mix(in srgb, var(--color-error) 10%, transparent);
}

.confirm-warning {
  font-size: 0.875rem;
  color: var(--color-error);
  text-align: center;
  margin-bottom: var(--space-6);
  padding: var(--space-3);
  background: color-mix(in srgb, var(--color-error) 10%, transparent);
  border-radius: var(--radius-lg);
  line-height: 1.6;
}

.confirm-actions {
  display: flex;
  gap: var(--space-3);
}

.confirm-actions .unified-btn {
  flex: 1;
}
</style>
