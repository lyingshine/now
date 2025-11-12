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

onMounted(() => {
  userStore.loadFromStorage()
  loadUserData()
})
</script>

<style scoped>
.settings {
  height: 100vh;
  background: var(--immersive-bg-primary);
  padding: 80px var(--space-6) var(--space-6);
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
  margin-bottom: var(--space-6);
  flex-shrink: 0;
}

.settings-content {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  padding-right: var(--space-2);
}

.unified-card {
  margin-bottom: var(--space-4);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-4);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.form-label {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--immersive-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.actions {
  display: flex;
  gap: var(--space-4);
  justify-content: center;
  margin-top: var(--space-6);
  padding-top: var(--space-4);
  flex-shrink: 0;
}

/* 响应式 */
@media (max-width: 768px) {
  .settings {
    padding: 70px var(--space-4) var(--space-4);
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
}

@media (max-height: 800px) {
  .settings {
    padding-top: 70px;
    padding-bottom: var(--space-4);
  }
  
  .section-header-text .unified-title {
    font-size: 2rem;
  }
  
  .unified-card {
    margin-bottom: var(--space-3);
  }
  
  .form-grid {
    gap: var(--space-3);
  }
}
</style>
