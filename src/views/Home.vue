<template>
  <div class="home">
    <div class="container">
      <h1 class="title">💰 NOW</h1>
      <p class="subtitle">实时收入计算器 & 职业成长平台</p>
      
      <div class="earnings-card">
        <div class="earnings-label">当前收入</div>
        <div class="earnings-amount">¥{{ currentEarnings.toLocaleString() }}</div>
        <div class="time-info">{{ timeInfo }}</div>
      </div>

      <div class="quick-actions">
        <router-link to="/jobs" class="action-btn primary">
          <span>💼</span>
          <span>浏览职位</span>
        </router-link>
        <router-link to="/growth" class="action-btn secondary">
          <span>🌱</span>
          <span>成长中心</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const currentEarnings = ref(0)
const timeInfo = ref('')

let timer = null

const calculateEarnings = () => {
  const salaryData = JSON.parse(localStorage.getItem('salaryData') || '{}')
  if (!salaryData.salary) {
    currentEarnings.value = 0
    timeInfo.value = '未设置薪资'
    return
  }

  const now = new Date()
  const workStart = new Date()
  const [startHour, startMin] = (salaryData.workStart || '09:00').split(':')
  workStart.setHours(parseInt(startHour), parseInt(startMin), 0)

  const workEnd = new Date()
  const [endHour, endMin] = (salaryData.workEnd || '18:00').split(':')
  workEnd.setHours(parseInt(endHour), parseInt(endMin), 0)

  if (now < workStart || now > workEnd) {
    currentEarnings.value = 0
    timeInfo.value = '非工作时间'
    return
  }

  const workedMs = now - workStart
  const totalWorkMs = workEnd - workStart
  const dailySalary = salaryData.salary / (salaryData.workDays || 22)
  const earnings = (workedMs / totalWorkMs) * dailySalary

  currentEarnings.value = Math.floor(earnings)
  timeInfo.value = `今日已工作 ${Math.floor(workedMs / 3600000)} 小时`
}

onMounted(() => {
  calculateEarnings()
  timer = setInterval(calculateEarnings, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.home {
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  max-width: 600px;
  padding: 2rem;
  text-align: center;
}

.title {
  font-size: 4rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-primary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  font-size: 1.25rem;
  color: var(--text-secondary);
  margin-bottom: 3rem;
}

.earnings-card {
  background: var(--bg-secondary);
  padding: 3rem 2rem;
  border-radius: 2rem;
  box-shadow: var(--shadow-lg);
  margin-bottom: 2rem;
  border: 2px solid var(--border-color);
}

.earnings-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.earnings-amount {
  font-size: 3rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-primary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
}

.time-info {
  font-size: 1rem;
  color: var(--text-secondary);
}

.quick-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.action-btn {
  padding: 1.5rem;
  border-radius: 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.action-btn.primary {
  background: var(--growth-primary);
  color: white;
}

.action-btn.secondary {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 2px solid var(--border-color);
}

.action-btn:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}
</style>
