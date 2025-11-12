<template>
  <div class="settings" :style="{ '--rank-color': rankColor }">
    <div class="unified-container">
      <div class="section-header-text">
        <h1 class="unified-title">⚙️ 设置</h1>
        <p class="unified-subtitle">配置你的职场信息和偏好设置</p>
      </div>

      <div class="settings-content">
        <!-- 基本信息 -->
        <div class="unified-card">
          <h2 class="unified-section-title">👤 基本信息</h2>
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">姓名</label>
              <input 
                v-model="formData.name" 
                type="text" 
                class="unified-input"
                placeholder="请输入姓名"
              />
            </div>
            <div class="form-group">
              <label class="form-label">入职日期</label>
              <input 
                v-model="formData.joinDate" 
                type="date" 
                class="unified-input"
              />
            </div>
          </div>
        </div>

        <!-- 工作信息 -->
        <div class="unified-card">
          <h2 class="unified-section-title">💼 工作信息</h2>
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">当前月薪（元）</label>
              <input 
                v-model.number="formData.currentSalary" 
                type="number" 
                class="unified-input"
                placeholder="10000"
                min="0"
              />
            </div>
            <div class="form-group">
              <label class="form-label">工作制度</label>
              <select v-model="formData.workSchedule" class="unified-input">
                <option value="single">单休</option>
                <option value="double">双休</option>
                <option value="big-small">大小周</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">上班时间</label>
              <input 
                v-model="formData.workStart" 
                type="time" 
                class="unified-input"
              />
            </div>
            <div class="form-group">
              <label class="form-label">下班时间</label>
              <input 
                v-model="formData.workEnd" 
                type="time" 
                class="unified-input"
              />
            </div>
            <div class="form-group">
              <label class="form-label">每月工作天数</label>
              <input 
                v-model.number="formData.workDays" 
                type="number" 
                class="unified-input"
                placeholder="22"
                min="1"
                max="31"
              />
            </div>
          </div>
        </div>

        <!-- 生活信息 -->
        <div class="unified-card">
          <h2 class="unified-section-title">🏠 生活信息</h2>
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">家庭人数</label>
              <input 
                v-model.number="formData.peopleCount" 
                type="number" 
                class="unified-input"
                placeholder="1"
                min="1"
              />
            </div>
            <div class="form-group">
              <label class="form-label">月租金（元）</label>
              <input 
                v-model.number="formData.rent" 
                type="number" 
                class="unified-input"
                placeholder="2000"
                min="0"
              />
            </div>
            <div class="form-group">
              <label class="form-label">月水电费（元）</label>
              <input 
                v-model.number="formData.utilities" 
                type="number" 
                class="unified-input"
                placeholder="300"
                min="0"
              />
            </div>
            <div class="form-group">
              <label class="form-label">储蓄率（%）</label>
              <input 
                v-model.number="formData.savingsRate" 
                type="number" 
                class="unified-input"
                placeholder="30"
                min="0"
                max="100"
              />
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="actions">
          <button @click="handleCancel" class="unified-btn unified-btn-large">
            取消
          </button>
          <button @click="handleSave" class="unified-btn unified-btn-primary unified-btn-large">
            保存设置
          </button>
        </div>

        <!-- 危险操作区域 -->
        <div class="danger-zone">
          <button @click="handleClearData" class="unified-btn unified-btn-large danger-btn">
            🗑️ 清除所有数据
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useLifestyle } from '../composables/useLifestyle'

const router = useRouter()
const userStore = useUserStore()
const { getRankInfo } = useLifestyle()

// 计算段位颜色
const rankColor = computed(() => {
  const salary = userStore.userInfo.currentSalary || 10000
  const rankInfo = getRankInfo(salary)
  return rankInfo.current.color
})

// 表单数据
const formData = ref({
  name: '',
  joinDate: '',
  currentSalary: 10000,
  workSchedule: 'double',
  workStart: '09:00',
  workEnd: '18:00',
  workDays: 22,
  peopleCount: 1,
  rent: 2000,
  utilities: 300,
  savingsRate: 30
})

// 加载用户数据
const loadUserData = () => {
  const user = userStore.userInfo
  formData.value = {
    name: user.name || '',
    joinDate: user.joinDate || '',
    currentSalary: user.currentSalary || 10000,
    workSchedule: user.workSchedule || 'double',
    workStart: user.workStart || '09:00',
    workEnd: user.workEnd || '18:00',
    workDays: user.workDays || 22,
    peopleCount: user.peopleCount || 1,
    rent: user.rent !== undefined ? user.rent : 2000,
    utilities: user.utilities !== undefined ? user.utilities : 300,
    savingsRate: user.savingsRate !== undefined ? user.savingsRate : 30
  }
}

// 保存设置
const handleSave = () => {
  // 更新用户信息
  userStore.updateUserInfo(formData.value)
  userStore.updateWorkSettings(formData.value)
  userStore.updateLifeSettings(formData.value)
  
  // 显示成功提示
  alert('设置已保存！')
  
  // 返回首页
  router.push('/')
}

// 取消
const handleCancel = () => {
  router.back()
}

// 清除所有数据
const handleClearData = () => {
  const confirmed = confirm(
    '⚠️ 警告：此操作将清除所有数据，包括：\n\n' +
    '• 个人信息和设置\n' +
    '• 所有任务进度\n' +
    '• 职业历史记录\n' +
    '• 成就和经验值\n\n' +
    '此操作不可恢复！确定要继续吗？'
  )
  
  if (!confirmed) return
  
  // 二次确认
  const doubleConfirm = confirm(
    '🚨 最后确认：\n\n' +
    '你真的要删除所有数据吗？\n' +
    '这将无法撤销！'
  )
  
  if (!doubleConfirm) return
  
  try {
    // 清除所有 localStorage 数据
    localStorage.clear()
    
    // 显示成功提示
    alert('✅ 所有数据已清除！页面即将刷新...')
    
    // 刷新页面，重新初始化
    setTimeout(() => {
      window.location.href = '/'
    }, 500)
  } catch (error) {
    console.error('清除数据失败:', error)
    alert('❌ 清除数据失败，请重试')
  }
}

onMounted(() => {
  userStore.loadFromStorage()
  loadUserData()
})
</script>

<style scoped>
.settings {
  height: 100vh;
  background: var(--immersive-bg-primary);
  padding: 100px var(--space-6) var(--space-6);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.settings::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 30%, color-mix(in srgb, var(--rank-color, #667eea) 8%, transparent) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, color-mix(in srgb, var(--rank-color, #667eea) 8%, transparent) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

.unified-container {
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
}

.section-header-text {
  margin-bottom: var(--space-4);
  flex-shrink: 0;
  text-align: center;
}

.section-header-text .unified-title {
  font-size: var(--text-2xl);
  margin-bottom: var(--space-1);
}

.section-header-text .unified-subtitle {
  font-size: var(--text-xs);
}

.settings-content {
  flex: 1;
  overflow: visible;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.settings-content::-webkit-scrollbar {
  display: none;
}

.unified-card {
  padding: var(--space-4);
  transition: all var(--duration-normal) var(--ease-hover);
  will-change: transform;
  flex-shrink: 0;
}

.unified-card .unified-section-title {
  font-size: var(--text-base);
  margin-bottom: var(--space-3);
}

.unified-card:hover {
  transform: translateY(-1px);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.form-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--immersive-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  display: flex;
  align-items: center;
  gap: var(--space-1);
  transition: color var(--duration-fast) var(--ease-default);
}

.form-group:focus-within .form-label {
  color: var(--rank-color, var(--color-primary));
}

.unified-input {
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-sm);
}

.actions {
  display: flex;
  gap: var(--space-3);
  justify-content: center;
  margin-top: auto;
  padding-top: var(--space-3);
  flex-shrink: 0;
}

/* 危险操作区域 */
.danger-zone {
  display: flex;
  justify-content: center;
  padding-top: var(--space-3);
  margin-top: var(--space-2);
  border-top: 1px solid rgba(239, 68, 68, 0.2);
  flex-shrink: 0;
}

.danger-btn {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
  transition: all var(--duration-normal) var(--ease-hover);
  position: relative;
  overflow: hidden;
}

.danger-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.2);
  transform: translate(-50%, -50%);
  transition: width 0.6s var(--ease-out-circ), height 0.6s var(--ease-out-circ);
  z-index: -1;
}

.danger-btn:hover {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.3);
}

.danger-btn:hover::before {
  width: 100%;
  height: 100%;
  border-radius: var(--radius-xl);
}

.danger-btn:active {
  transform: translateY(0);
}

/* 响应式 */
@media (max-width: 768px) {
  .settings {
    padding: 90px var(--space-4) var(--space-4);
  }
  
  .section-header-text {
    margin-bottom: var(--space-4);
  }
  
  .unified-card {
    margin-bottom: var(--space-3);
  }
  
  .form-grid {
    grid-template-columns: 1fr;
    gap: var(--space-3);
  }
  
  .actions {
    flex-direction: column;
    margin-top: var(--space-4);
  }
  
  .actions button {
    width: 100%;
  }
  
  .danger-zone {
    padding-top: var(--space-2);
    margin-top: var(--space-2);
  }
  
  .danger-btn {
    width: 100%;
  }
}

@media (max-height: 900px) {
  .settings {
    padding-top: 90px;
    padding-bottom: var(--space-3);
  }
  
  .section-header-text {
    margin-bottom: var(--space-3);
  }
  
  .section-header-text .unified-title {
    font-size: var(--text-xl);
  }
  
  .unified-card {
    padding: var(--space-3);
  }
  
  .unified-card .unified-section-title {
    font-size: var(--text-sm);
    margin-bottom: var(--space-2);
  }
  
  .form-grid {
    gap: var(--space-2);
  }
  
  .form-group {
    gap: 4px;
  }
  
  .unified-input {
    padding: 6px var(--space-2);
    font-size: 13px;
  }
  
  .actions {
    padding-top: var(--space-2);
    gap: var(--space-2);
  }
  
  .danger-zone {
    padding-top: var(--space-2);
    margin-top: var(--space-1);
  }
}

@media (max-height: 800px) {
  .settings-content {
    gap: var(--space-2);
  }
  
  .form-label {
    font-size: 10px;
  }
}
</style>
