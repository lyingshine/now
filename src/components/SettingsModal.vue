<template>
  <div v-if="isOpen" class="modal" @click.self="close">
    <div class="modal-content">
      <div class="modal-header">
        <div class="modal-title">⚙️ 设置</div>
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
          <input type="text" v-model="formData.name" placeholder="请输入昵称">
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
          <input type="email" v-model="formData.email" placeholder="your@email.com">
        </div>

        <div class="input-group">
          <label for="phone">手机号（可选）</label>
          <input type="tel" v-model="formData.phone" placeholder="请输入手机号">
        </div>

        <div class="input-group">
          <label for="city">所在城市</label>
          <select v-model="formData.city">
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
          <input type="date" v-model="formData.joinDate">
        </div>

        <div class="input-group">
          <label for="workStart">上班时间</label>
          <input type="time" v-model="formData.workStart">
        </div>

        <div class="input-group">
          <label for="workEnd">下班时间</label>
          <input type="time" v-model="formData.workEnd">
        </div>

        <div class="input-group">
          <label for="workSchedule">工作制度</label>
          <select v-model="formData.workSchedule">
            <option value="double">双休（周六日休息）</option>
            <option value="alternate">大小休（隔周单休）</option>
            <option value="single">单休（仅周日休息）</option>
            <option value="full">全勤（无休息日）</option>
            <option value="custom">自定义工作天数</option>
          </select>
        </div>

        <div v-if="formData.workSchedule === 'custom'" class="input-group">
          <label for="workDays">每月工作天数</label>
          <input type="number" v-model.number="formData.workDays" placeholder="默认 22 天" min="1" max="31">
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
          <input type="number" v-model.number="formData.salary" placeholder="请输入你的月薪">
        </div>

        <div class="input-group">
          <label for="peopleCount">几个人生活</label>
          <input type="number" v-model.number="formData.peopleCount" placeholder="默认 1 人" min="1" max="10">
        </div>

        <div class="input-group">
          <label for="rent">每月房租（元）</label>
          <input type="number" v-model.number="formData.rent" placeholder="请输入每月房租">
        </div>

        <div class="input-group">
          <label for="utilities">每月水电网费（元）</label>
          <input type="number" v-model.number="formData.utilities" placeholder="请输入每月水电网费">
        </div>

        <div class="input-group">
          <label for="savingsRate">储蓄率（%）</label>
          <input type="number" v-model.number="formData.savingsRate" placeholder="建议20-40%" min="0" max="100">
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
          <select v-model="formData.theme">
            <option value="light">☀️ 浅色模式</option>
            <option value="dark">🌙 深色模式</option>
          </select>
        </div>

        <div class="input-group">
          <label for="weeklyGoal">每周学习目标（小时）</label>
          <input type="number" v-model.number="formData.weeklyGoal" placeholder="建议 10 小时" min="1" max="168">
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
          <button class="danger-btn" @click="handleReset">
            重置所有数据
          </button>
          <small class="input-hint">此操作将清空所有学习记录和设置，无法恢复</small>
        </div>
      </div>

      <div class="modal-footer">
        <button class="cancel-btn" @click="close">取消</button>
        <button class="save-btn" @click="handleSave">保存设置</button>
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
  if (confirm('确定要重置所有数据吗？此操作无法恢复！')) {
    // 重置所有 store
    userStore.resetUserData()
    jobsStore.learningPlans = []
    jobsStore.userProgress = {}
    jobsStore.saveToStorage()
    questStore.currentQuest = null
    questStore.questHistory = []
    questStore.saveToStorage()
    
    // 清除旧数据
    localStorage.removeItem('salaryData')
    
    alert('数据已重置！')
    close()
    
    // 刷新页面
    window.location.reload()
  }
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
.modal {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: white;
  border-radius: var(--radius-3xl);
  padding: var(--space-8);
  max-width: 600px;
  width: 90%;
  max-height: 85vh;
  overflow-y: auto;
  position: relative;
  animation: slideUp 0.3s ease;
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--color-gray-200);
}

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
  border-color: var(--color-gray-700);
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
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.modal-title {
  font-size: 1.5rem;
  color: var(--color-gray-900);
  font-weight: 700;
}

body.dark-mode .modal-title {
  color: var(--color-gray-100);
}

.close-btn {
  background: var(--color-gray-100);
  border: none;
  font-size: 1.5rem;
  color: var(--color-gray-600);
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
  background: var(--color-accent);
  color: white;
  transform: rotate(90deg);
}

body.dark-mode .close-btn {
  background: var(--color-gray-700);
  color: var(--color-gray-400);
}

/* 标签页 */
.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 2px solid var(--color-gray-200);
  overflow-x: auto;
}

body.dark-mode .tabs {
  border-bottom-color: var(--color-gray-700);
}

.tab {
  padding: 10px 16px;
  background: none;
  border: none;
  color: var(--color-gray-600);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  white-space: nowrap;
}

.tab:hover {
  color: var(--color-accent);
}

.tab.active {
  color: var(--color-accent);
  border-bottom-color: var(--color-accent);
}

body.dark-mode .tab {
  color: var(--color-gray-400);
}

body.dark-mode .tab.active {
  color: var(--color-accent);
}

.tab-content {
  animation: fadeIn 0.3s ease;
}

/* 表单 */
.input-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: var(--space-2);
  color: var(--color-gray-700);
  font-weight: 500;
  font-size: 0.875rem;
}

body.dark-mode label {
  color: var(--color-gray-300);
}

input, select {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-xl);
  font-size: 0.875rem;
  font-weight: 500;
  background: var(--color-gray-50);
  color: var(--color-gray-900);
  transition: all var(--transition-fast);
}

input:focus, select:focus {
  outline: none;
  border-color: var(--color-accent);
  background: white;
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.15);
}

body.dark-mode input,
body.dark-mode select {
  background: var(--color-gray-700);
  border-color: var(--color-gray-600);
  color: var(--color-gray-100);
}

body.dark-mode input:focus,
body.dark-mode select:focus {
  background: var(--color-gray-600);
}

/* 头像选择器 */
.avatar-selector {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
}

.avatar-option {
  width: 100%;
  aspect-ratio: 1;
  font-size: 1.5rem;
  border: 2px solid var(--color-gray-200);
  border-radius: var(--radius-xl);
  background: var(--color-gray-50);
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-option:hover {
  border-color: var(--color-accent);
  transform: scale(1.1);
}

.avatar-option.selected {
  border-color: var(--color-accent);
  background: rgba(245, 158, 11, 0.1);
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.15);
}

body.dark-mode .avatar-option {
  background: var(--color-gray-700);
  border-color: var(--color-gray-600);
}

/* 当前职业卡片 */
.current-job-card {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
  border: 2px solid rgba(99, 102, 241, 0.2);
  border-radius: var(--radius-xl);
  padding: 16px;
  margin-top: 16px;
}

.job-card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.job-icon {
  font-size: 1.25rem;
}

.job-label {
  font-size: 0.75rem;
  color: var(--color-gray-600);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

body.dark-mode .job-label {
  color: var(--color-gray-400);
}

.job-card-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.job-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-primary);
}

.job-salary {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--growth-primary);
}

.job-date {
  font-size: 0.8125rem;
  color: var(--color-gray-600);
}

body.dark-mode .job-date {
  color: var(--color-gray-400);
}

body.dark-mode .current-job-card {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.15));
  border-color: rgba(99, 102, 241, 0.3);
}

/* 工作时长显示 */
.work-hours-display {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 16px;
}

.info-card {
  background: var(--color-gray-50);
  padding: 12px;
  border-radius: var(--radius-xl);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 0.75rem;
  color: var(--color-gray-600);
}

.info-value {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-accent);
}

body.dark-mode .info-card {
  background: var(--color-gray-700);
}

body.dark-mode .info-label {
  color: var(--color-gray-400);
}

/* 支出汇总 */
.expense-summary {
  background: var(--color-gray-50);
  padding: 16px;
  border-radius: var(--radius-xl);
  margin-top: 16px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  font-size: 0.875rem;
}

.summary-item:not(:last-child) {
  border-bottom: 1px solid var(--color-gray-200);
}

.amount {
  font-weight: 700;
  color: var(--color-gray-700);
}

.amount.highlight {
  color: var(--color-accent);
  font-size: 1.125rem;
}

body.dark-mode .expense-summary {
  background: var(--color-gray-700);
}

body.dark-mode .summary-item {
  border-bottom-color: var(--color-gray-600);
}

body.dark-mode .amount {
  color: var(--color-gray-300);
}

/* 复选框 */
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 500;
}

.checkbox-label input[type="checkbox"] {
  width: auto;
  cursor: pointer;
}

/* 危险区域 */
.danger-zone {
  margin-top: 32px;
  padding: 16px;
  background: rgba(239, 68, 68, 0.05);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: var(--radius-xl);
}

.danger-zone h4 {
  margin: 0 0 12px 0;
  color: #dc2626;
  font-size: 0.875rem;
}

.danger-btn {
  width: 100%;
  padding: 10px;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 8px;
}

.danger-btn:hover {
  background: #b91c1c;
}

.savings-recommendation {
  color: var(--color-accent);
  font-size: 0.8125rem;
  margin-top: 6px;
  font-weight: 500;
}

.input-hint {
  color: var(--color-gray-500);
  font-size: 0.75rem;
  margin-top: 4px;
  display: block;
}

/* 底部按钮 */
.modal-footer {
  display: flex;
  gap: 12px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid var(--color-gray-200);
}

body.dark-mode .modal-footer {
  border-top-color: var(--color-gray-700);
}

.cancel-btn {
  flex: 1;
  padding: 12px;
  background: var(--color-gray-100);
  color: var(--color-gray-700);
  border: none;
  border-radius: var(--radius-xl);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.cancel-btn:hover {
  background: var(--color-gray-200);
}

body.dark-mode .cancel-btn {
  background: var(--color-gray-700);
  color: var(--color-gray-300);
}

body.dark-mode .cancel-btn:hover {
  background: var(--color-gray-600);
}

.save-btn {
  flex: 1;
  padding: 12px;
  background: var(--color-accent);
  color: white;
  border: none;
  border-radius: var(--radius-xl);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-sm);
}

.save-btn:hover {
  background: var(--color-accent-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}
</style>
