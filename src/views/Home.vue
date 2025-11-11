<template>
  <div class="home">
    <div class="main-wrapper">
      <div class="container">
        <!-- 左侧面板：段位和收入 -->
        <div class="left-panel">
          <div class="rank-display" :style="{ borderColor: rankInfo.current.color, color: rankInfo.current.color }">
            <div class="rank-icon">{{ rankInfo.current.icon }}</div>
            <div class="rank-name">{{ rankInfo.current.name }}</div>
            <div class="rank-desc">{{ rankInfo.current.description }}</div>
            <div class="rank-percentage">{{ rankInfo.current.percentage }}</div>
            <div class="rank-lifestyle">
              在杭州属于<span class="lifestyle-level">{{ lifestyleLevel }}</span>生活水平
            </div>
            <div v-if="rankInfo.next" class="rank-progress">
              <div class="rank-progress-label">
                <span>段位进度</span>
                <span>{{ rankInfo.progress }}%</span>
              </div>
              <div class="rank-progress-bar">
                <div class="rank-progress-fill" :style="{ width: rankInfo.progress + '%' }"></div>
              </div>
            </div>
          </div>

          <div class="earnings-display">
            <div class="earnings-label">每分钟收入</div>
            <div class="earnings-amount">¥{{ perMinute.toFixed(2) }}</div>
            <div class="time-info">今日已工作 {{ workMinutes }} 分钟</div>
          </div>

          <div class="stats">
            <div class="stat-card">
              <div class="stat-label">今日已赚</div>
              <div class="stat-value">¥{{ formatMoney(todayEarnings) }}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">本月已赚</div>
              <div class="stat-value">¥{{ formatMoney(monthEarnings) }}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">今年已赚</div>
              <div class="stat-value">¥{{ formatMoney(yearEarnings) }}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">入职以来</div>
              <div class="stat-value">¥{{ formatMoney(totalEarnings) }}</div>
            </div>
          </div>
        </div>

        <!-- 中间面板：生活水平 -->
        <div class="middle-panel">
          <div class="section-title">🏠 生活水平</div>
          <div class="lifestyle-content">
            <div v-for="category in lifestyleCategories" :key="category.name" :class="['lifestyle-category', category.class]">
              <div class="lifestyle-category-title">{{ category.title }}</div>
              <div class="lifestyle-category-items">
                <div v-for="item in category.items" :key="item.title" class="lifestyle-item">
                  <div class="lifestyle-icon">{{ item.icon }}</div>
                  <div>
                    <div class="lifestyle-title">{{ item.title }}</div>
                    <div class="lifestyle-desc">{{ item.desc }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧面板：岗位推荐和升级建议 -->
        <div class="right-panel">
          <div class="section-title">💼 岗位推荐</div>
          <div class="job-recommend-content">
            <div 
              v-for="job in recommendedJobs" 
              :key="job.id" 
              class="job-recommend"
              @click="goToJobs"
            >
              <div class="job-recommend-title">{{ job.title }}</div>
              <div class="job-recommend-salary">¥{{ job.salary.toLocaleString() }}/月</div>
              <div class="job-recommend-reason">{{ job.reason }}</div>
            </div>
          </div>

          <div class="section-title" style="margin-top: 20px;">🚀 升级建议</div>
          <div class="upgrade-tips-content">
            <div v-for="(tip, index) in upgradeTips" :key="index" class="upgrade-tip">
              <div class="upgrade-tip-title">{{ tip.title }}</div>
              <div class="upgrade-tip-content">{{ tip.content }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 设置弹窗 -->
    <SettingsModal 
      :isOpen="isSettingsOpen"
      @close="isSettingsOpen = false"
      @save="handleSettingsSave"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLifestyle } from '../composables/useLifestyle'
import SettingsModal from '../components/SettingsModal.vue'
import jobsData from '../data/jobs-data.js'

const router = useRouter()
const { calculateLifestyle, getRankInfo, getRank } = useLifestyle()

const isSettingsOpen = ref(false)
const salaryData = ref({
  salary: 10000,
  peopleCount: 1,
  rent: 2000,
  utilities: 300,
  savingsRate: 30,
  joinDate: '',
  workStart: '09:00',
  workEnd: '18:00',
  workSchedule: 'double',
  workDays: 22
})

const perMinute = ref(0)
const workMinutes = ref(0)
const todayEarnings = ref(0)
const monthEarnings = ref(0)
const yearEarnings = ref(0)
const totalEarnings = ref(0)

let timer = null

// 计算属性
const rankInfo = computed(() => {
  return getRankInfo(salaryData.value.salary)
})

const lifestyleLevel = computed(() => {
  const rank = getRank(salaryData.value.salary)
  const lifestyleMap = {
    'struggling': '艰难',
    'subsistence': '温饱',
    'basic': '小康',
    'comfortable': '舒适',
    'prosperous': '富足',
    'affluent': '优越',
    'wealthy': '优越+',
    'financial_freedom': '自由'
  }
  return lifestyleMap[rank.lifestyleLevel] || '一般'
})

const lifestyleItems = computed(() => {
  return calculateLifestyle(
    salaryData.value.salary,
    salaryData.value.peopleCount,
    salaryData.value.rent,
    salaryData.value.utilities,
    salaryData.value.savingsRate
  )
})

const lifestyleCategories = computed(() => {
  const categories = {
    income: { title: '💰 收入与储蓄', items: [], class: 'income' },
    basic: { title: '🏠 基础开销', items: [], class: 'basic' },
    daily: { title: '🍽️ 日常消费', items: [], class: 'daily' },
    optional: { title: '📱 大件消费', items: [], class: 'optional' },
    summary: { title: '😊 整体满意度', items: [], class: 'summary' }
  }

  lifestyleItems.value.forEach(item => {
    // 跳过段位信息类别
    if (item.category === 'rank') {
      return
    }
    // 将 food 类别合并到 daily 类别
    const categoryKey = item.category === 'food' ? 'daily' : item.category
    const category = categories[categoryKey]
    if (category) {
      category.items.push(item)
    }
  })

  return Object.values(categories).filter(cat => cat.items.length > 0)
})

const recommendedJobs = computed(() => {
  const currentSalary = salaryData.value.salary
  // 推荐比当前薪资高20%-50%的职位
  const targetMin = currentSalary * 1.2
  const targetMax = currentSalary * 1.5
  
  return jobsData
    .filter(job => job.salary >= targetMin && job.salary <= targetMax)
    .slice(0, 3)
    .map(job => ({
      ...job,
      reason: `比当前薪资高 ${((job.salary - currentSalary) / currentSalary * 100).toFixed(0)}%，适合进阶`
    }))
})

const upgradeTips = computed(() => {
  const salary = salaryData.value.salary
  const tips = []
  
  if (salary < 10000) {
    tips.push({
      title: '提升技能',
      content: '学习一门热门技术（前端/后端/数据分析），参加在线课程，获得认证证书。'
    })
    tips.push({
      title: '积累经验',
      content: '参与实际项目，建立个人作品集，在 GitHub 上展示你的代码。'
    })
  } else if (salary < 20000) {
    tips.push({
      title: '深度专精',
      content: '在当前领域深耕，成为某个细分方向的专家，提升不可替代性。'
    })
    tips.push({
      title: '拓展人脉',
      content: '参加行业活动，建立职业人脉，寻找更好的职业机会。'
    })
  } else if (salary < 35000) {
    tips.push({
      title: '管理能力',
      content: '培养团队管理能力，向技术管理或项目管理方向发展。'
    })
    tips.push({
      title: '行业影响力',
      content: '撰写技术博客，参与开源项目，在行业内建立个人品牌。'
    })
  } else {
    tips.push({
      title: '战略思维',
      content: '提升商业思维和战略眼光，考虑创业或成为合伙人。'
    })
    tips.push({
      title: '投资理财',
      content: '学习投资理财知识，实现财富增值，建立被动收入渠道。'
    })
  }
  
  tips.push({
    title: '持续学习',
    content: '保持学习热情，关注行业动态，每年设定新的学习目标。'
  })
  
  return tips
})

// 方法
const loadData = () => {
  const saved = localStorage.getItem('salaryData')
  if (saved) {
    salaryData.value = { ...salaryData.value, ...JSON.parse(saved) }
  }
}

const handleSettingsSave = (data) => {
  salaryData.value = { ...salaryData.value, ...data }
  calculateEarnings()
}

const formatMoney = (value) => {
  if (value >= 10000) {
    return (value / 10000).toFixed(2) + '万'
  }
  return value.toFixed(2)
}

const getPerMinuteRate = () => {
  const salary = salaryData.value.salary || 0
  const workDays = salaryData.value.workDays || 22
  const [startHour, startMin] = salaryData.value.workStart.split(':').map(Number)
  const [endHour, endMin] = salaryData.value.workEnd.split(':').map(Number)
  const workHours = (endHour * 60 + endMin - startHour * 60 - startMin) / 60

  const perDay = salary / workDays
  const perHour = perDay / workHours
  return perHour / 60
}

const getTodayWorkMinutes = () => {
  const now = new Date()
  const [startHour, startMin] = salaryData.value.workStart.split(':').map(Number)
  const [endHour, endMin] = salaryData.value.workEnd.split(':').map(Number)
  
  const startTime = new Date(now)
  startTime.setHours(startHour, startMin, 0, 0)
  
  const endTime = new Date(now)
  endTime.setHours(endHour, endMin, 0, 0)

  if (now < startTime) {
    return 0
  } else if (now > endTime) {
    return (endTime - startTime) / 60000
  } else {
    return (now - startTime) / 60000
  }
}

const isWorkDay = (date, weekNumber) => {
  const day = date.getDay() // 0=周日, 6=周六
  const schedule = salaryData.value.workSchedule
  
  switch(schedule) {
    case 'double': // 双休
      return day !== 0 && day !== 6
    case 'single': // 单休（周日休息）
      return day !== 0
    case 'alternate': // 大小休（隔周单休）
      if (weekNumber % 2 === 0) {
        return day !== 0 && day !== 6 // 双休
      } else {
        return day !== 0 // 单休
      }
    case 'full': // 全勤
      return true
    case 'custom': // 自定义
      return true
    default:
      return day !== 0 && day !== 6
  }
}

const getWeekNumber = (date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
}

const getWorkDays = (startDate, endDate) => {
  const schedule = salaryData.value.workSchedule
  
  // 如果是自定义模式，按日历天数计算
  if (schedule === 'custom') {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    return diffDays
  }
  
  // 否则根据工作制度计算实际工作日
  let count = 0
  const current = new Date(startDate)
  
  while (current <= endDate) {
    const weekNum = getWeekNumber(current)
    if (isWorkDay(current, weekNum)) {
      count++
    }
    current.setDate(current.getDate() + 1)
  }
  
  return count
}

const isTodayAfterJoinDate = () => {
  if (!salaryData.value.joinDate) return false
  
  const now = new Date()
  const joinDate = new Date(salaryData.value.joinDate)
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const joinDay = new Date(joinDate.getFullYear(), joinDate.getMonth(), joinDate.getDate())
  
  return today >= joinDay
}

const getMonthWorkDays = () => {
  if (!salaryData.value.joinDate) return 0
  
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const joinDate = new Date(salaryData.value.joinDate)
  const joinDay = new Date(joinDate.getFullYear(), joinDate.getMonth(), joinDate.getDate())
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  
  if (joinDay > today) return 0
  
  const startDate = joinDay > monthStart ? joinDay : monthStart
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  
  if (startDate > yesterday) return 0
  
  return getWorkDays(startDate, yesterday)
}

const getYearWorkDays = () => {
  if (!salaryData.value.joinDate) return 0
  
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const joinDate = new Date(salaryData.value.joinDate)
  const joinDay = new Date(joinDate.getFullYear(), joinDate.getMonth(), joinDate.getDate())
  const yearStart = new Date(now.getFullYear(), 0, 1)
  
  if (joinDay > today) return 0
  
  const startDate = joinDay > yearStart ? joinDay : yearStart
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  
  if (startDate > yesterday) return 0
  
  return getWorkDays(startDate, yesterday)
}

const getTotalWorkDays = () => {
  if (!salaryData.value.joinDate) return 0
  
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const joinDate = new Date(salaryData.value.joinDate)
  const joinDay = new Date(joinDate.getFullYear(), joinDate.getMonth(), joinDate.getDate())
  
  if (joinDay > today) return 0
  
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  
  if (joinDay > yesterday) return 0
  
  return getWorkDays(joinDay, yesterday)
}

const calculateEarnings = () => {
  perMinute.value = getPerMinuteRate()
  
  const workDays = salaryData.value.workDays || 22
  const perDay = salaryData.value.salary / workDays
  
  // 今日收入 - 只有入职后才计算
  let todayEarning = 0
  if (isTodayAfterJoinDate()) {
    const todayMinutes = getTodayWorkMinutes()
    workMinutes.value = Math.floor(todayMinutes)
    todayEarning = perMinute.value * todayMinutes
    todayEarnings.value = todayEarning
  } else {
    workMinutes.value = 0
    todayEarnings.value = 0
  }
  
  // 本月收入 = 昨天之前的完整天数 × 日薪 + 今天实时收入
  const monthDays = getMonthWorkDays()
  monthEarnings.value = perDay * monthDays + todayEarning
  
  // 今年收入 = 昨天之前的完整天数 × 日薪 + 今天实时收入
  const yearDays = getYearWorkDays()
  yearEarnings.value = perDay * yearDays + todayEarning
  
  // 入职以来收入 = 昨天之前的完整天数 × 日薪 + 今天实时收入
  const totalDays = getTotalWorkDays()
  totalEarnings.value = perDay * totalDays + todayEarning
}

const goToJobs = () => {
  router.push('/jobs')
}

// 生命周期
onMounted(() => {
  loadData()
  calculateEarnings()
  timer = setInterval(calculateEarnings, 1000) // 每秒更新一次，实时显示
  
  // 监听设置按钮点击（从 Navbar）
  window.addEventListener('openSettings', () => {
    isSettingsOpen.value = true
  })
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
  window.removeEventListener('openSettings', () => {})
})
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 50%, #fef3c7 100%);
  position: relative;
  overflow: hidden;
}

.home::before {
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

body.dark-mode .home {
  background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #1e293b 100%);
}

body.dark-mode .home::before {
  background: 
    radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.12) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(245, 158, 11, 0.12) 0%, transparent 50%);
}

.main-wrapper {
  max-width: 1600px;
  margin: 0 auto;
  padding: 12px 20px;
  position: relative;
  z-index: 1;
}

.container {
  display: grid;
  grid-template-columns: 0.75fr 2.5fr 0.75fr;
  gap: 16px;
}

.left-panel, .middle-panel, .right-panel {
  background: var(--glass-bg);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-radius: var(--radius-3xl);
  padding: var(--space-5);
  border: 1px solid var(--glass-border);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: var(--shadow-xl);
  position: relative;
  overflow: hidden;
}

.left-panel:hover, .middle-panel:hover, .right-panel:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-2xl);
}

body.dark-mode .left-panel,
body.dark-mode .middle-panel,
body.dark-mode .right-panel {
  background: rgba(30, 41, 59, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: var(--shadow-xl), 0 0 40px rgba(99, 102, 241, 0.1);
}

/* 段位显示 */
.rank-display {
  text-align: center;
  margin-bottom: var(--space-4);
  padding: var(--space-5) var(--space-4);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%);
  backdrop-filter: blur(10px);
  border-radius: var(--radius-2xl);
  border: 2px solid;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: var(--shadow-lg);
  position: relative;
  overflow: hidden;
}

.rank-display:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

body.dark-mode .rank-display {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(30, 41, 59, 0.7) 100%);
  box-shadow: var(--shadow-xl);
}

.rank-icon {
  font-size: 40px;
  margin-bottom: 8px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

.rank-name {
  font-size: 1.375rem;
  font-weight: 700;
  margin-bottom: 6px;
  letter-spacing: 0.05em;
}

.rank-desc {
  font-size: 0.875rem;
  color: var(--color-gray-600);
  margin-bottom: 6px;
}

.rank-percentage {
  font-size: 0.8125rem;
  color: var(--color-gray-500);
  font-weight: 500;
}

.rank-lifestyle {
  font-size: 0.8125rem;
  color: var(--color-gray-500);
  margin-top: 6px;
}

.lifestyle-level {
  font-weight: 600;
  color: var(--color-accent);
}

.rank-progress {
  margin-top: 15px;
}

.rank-progress-label {
  font-size: 12px;
  color: var(--color-gray-600);
  margin-bottom: 5px;
  display: flex;
  justify-content: space-between;
}

.rank-progress-bar {
  width: 100%;
  height: 10px;
  background: var(--color-gray-200);
  border-radius: 5px;
  overflow: hidden;
}

body.dark-mode .rank-progress-bar {
  background: var(--color-gray-700);
}

.rank-progress-fill {
  height: 100%;
  transition: width 0.3s;
  background: linear-gradient(90deg, var(--color-accent) 0%, var(--color-primary) 100%);
}

/* 收入展示 */
.earnings-display {
  background: white;
  border: 2px solid transparent;
  background-image: 
    linear-gradient(white, white),
    linear-gradient(135deg, var(--color-accent), var(--color-primary), var(--growth-primary));
  background-origin: border-box;
  background-clip: padding-box, border-box;
  padding: var(--space-6) var(--space-5);
  border-radius: var(--radius-2xl);
  text-align: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: var(--shadow-lg);
  margin-bottom: var(--space-4);
  position: relative;
  overflow: hidden;
}

.earnings-display:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

body.dark-mode .earnings-display {
  background-image: 
    linear-gradient(var(--color-gray-800), var(--color-gray-800)),
    linear-gradient(135deg, var(--color-accent), var(--color-primary), var(--growth-primary));
}

.earnings-label {
  font-size: 0.75rem;
  color: var(--color-gray-600);
  margin-bottom: var(--space-2);
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.earnings-amount {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: var(--space-2);
  letter-spacing: -0.05em;
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-primary) 50%, var(--growth-primary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.time-info {
  font-size: 0.875rem;
  color: var(--color-gray-600);
  font-weight: 500;
}

/* 统计卡片 */
.stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.stat-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%);
  backdrop-filter: blur(10px);
  padding: var(--space-4) var(--space-3);
  border-radius: var(--radius-xl);
  text-align: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-md);
  position: relative;
  overflow: visible;
  min-height: 90px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

body.dark-mode .stat-card {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(30, 41, 59, 0.7) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: var(--shadow-lg);
}

.stat-label {
  font-size: 0.6875rem;
  color: var(--color-gray-600);
  margin-bottom: var(--space-2);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.025em;
  word-break: break-all;
  line-height: 1.3;
}

body.dark-mode .stat-value {
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-primary-light) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Section 标题 */
.section-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-gray-700);
  margin-bottom: var(--space-3);
  padding-bottom: var(--space-2);
  border-bottom: 2px solid var(--color-gray-200);
  display: flex;
  align-items: center;
  gap: var(--space-2);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

body.dark-mode .section-title {
  color: var(--color-gray-300);
  border-bottom-color: var(--color-gray-700);
}

/* 生活水平 */
.lifestyle-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

/* 第1行：收入储蓄 */
.lifestyle-category.income {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(16, 185, 129, 0.05) 100%);
}

/* 第2行：基础开销 */
.lifestyle-category.basic {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(99, 102, 241, 0.05) 100%);
}

/* 第3行：日常消费（含饮食）和大件消费 */
.lifestyle-category.daily,
.lifestyle-category.optional {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(245, 158, 11, 0.05) 100%);
}

/* 第4行：整体满意度 */
.lifestyle-category.summary {
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.08) 0%, rgba(236, 72, 153, 0.05) 100%);
}

.lifestyle-category {
  backdrop-filter: blur(10px);
  border-radius: var(--radius-xl);
  padding: var(--space-5);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
  overflow: visible;
}

.lifestyle-category:hover {
  box-shadow: var(--shadow-md);
  transform: translateX(2px);
}

body.dark-mode .lifestyle-category {
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: var(--shadow-md);
}

body.dark-mode .lifestyle-category.income {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(16, 185, 129, 0.08) 100%);
}

body.dark-mode .lifestyle-category.basic {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(99, 102, 241, 0.08) 100%);
}

body.dark-mode .lifestyle-category.daily,
body.dark-mode .lifestyle-category.optional {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(245, 158, 11, 0.08) 100%);
}

body.dark-mode .lifestyle-category.summary {
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.12) 0%, rgba(236, 72, 153, 0.08) 100%);
}

.lifestyle-category-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-gray-900);
  margin-bottom: var(--space-3);
  padding-bottom: var(--space-2);
  padding-left: var(--space-2);
  border-bottom: 1px solid var(--color-gray-200);
  border-left: 3px solid;
}

.lifestyle-category.income .lifestyle-category-title {
  border-left-color: #10b981;
}

.lifestyle-category.basic .lifestyle-category-title {
  border-left-color: #6366f1;
}

.lifestyle-category.daily .lifestyle-category-title,
.lifestyle-category.optional .lifestyle-category-title {
  border-left-color: #f59e0b;
}

.lifestyle-category.summary .lifestyle-category-title {
  border-left-color: #ec4899;
}

body.dark-mode .lifestyle-category-title {
  color: var(--color-gray-100);
  border-bottom-color: var(--color-gray-700);
}

.lifestyle-category-items {
  display: grid;
  gap: var(--space-2);
}

/* 第1行：收入储蓄 - 1列 */
.lifestyle-category.income .lifestyle-category-items {
  grid-template-columns: 1fr;
}

/* 第2行：基础开销 - 4列 */
.lifestyle-category.basic .lifestyle-category-items {
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-3);
}

/* 第3行：日常消费（含饮食） + 大件消费 - 4列 */
.lifestyle-category.daily .lifestyle-category-items,
.lifestyle-category.optional .lifestyle-category-items {
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-3);
}

/* 第4行：整体评价 - 1列 */
.lifestyle-category.summary .lifestyle-category-items {
  grid-template-columns: 1fr;
}

.lifestyle-item {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(5px);
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: transform 0.15s ease, background 0.15s ease, box-shadow 0.15s ease;
  display: flex;
  gap: var(--space-3);
  position: relative;
  overflow: visible;
  min-height: 80px;
}

.lifestyle-item:hover {
  background: rgba(255, 255, 255, 0.9);
  transform: translateX(4px);
  box-shadow: var(--shadow-sm);
}

body.dark-mode .lifestyle-item {
  background: rgba(30, 41, 59, 0.6);
  border-color: rgba(255, 255, 255, 0.1);
}

body.dark-mode .lifestyle-item:hover {
  background: rgba(30, 41, 59, 0.9);
}

.lifestyle-icon {
  font-size: 1.5rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  flex-shrink: 0;
}

.lifestyle-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-gray-900);
  margin-bottom: 4px;
  line-height: 1.3;
  word-break: keep-all;
  white-space: nowrap;
}

.lifestyle-desc {
  font-size: 0.8125rem;
  color: var(--color-gray-600);
  line-height: 1.5;
  word-break: break-word;
}

body.dark-mode .lifestyle-title {
  color: var(--color-gray-100);
}

body.dark-mode .lifestyle-desc {
  color: var(--color-gray-400);
}

/* 岗位推荐 */
.job-recommend {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(245, 158, 11, 0.1) 100%);
  backdrop-filter: blur(10px);
  padding: var(--space-4);
  border-radius: var(--radius-xl);
  margin-bottom: var(--space-3);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-md);
  position: relative;
  overflow: hidden;
}



.job-recommend:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

body.dark-mode .job-recommend {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(245, 158, 11, 0.15) 100%);
  border-color: rgba(255, 255, 255, 0.1);
}

.job-recommend-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 6px;
}

.job-recommend-salary {
  font-size: 1.75rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-primary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 6px;
  letter-spacing: -0.025em;
}

.job-recommend-reason {
  font-size: 0.8125rem;
  color: var(--color-gray-600);
}

body.dark-mode .job-recommend-title {
  color: var(--color-accent);
}

/* 升级建议 */
.upgrade-tip {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%);
  backdrop-filter: blur(10px);
  padding: var(--space-4);
  border-radius: var(--radius-xl);
  margin-bottom: var(--space-3);
  border: 1px solid var(--glass-border);
  border-left: 4px solid var(--color-primary);
  box-shadow: var(--shadow-md);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
  overflow: hidden;
}

.upgrade-tip:hover {
  box-shadow: var(--shadow-lg);
  transform: translateX(4px);
}

body.dark-mode .upgrade-tip {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%);
  border-color: rgba(255, 255, 255, 0.1);
}

.upgrade-tip-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 6px;
}

.upgrade-tip-content {
  font-size: 0.8125rem;
  color: var(--color-gray-600);
  line-height: 1.6;
}

body.dark-mode .upgrade-tip-title {
  color: var(--color-accent);
}

body.dark-mode .upgrade-tip-content {
  color: var(--color-gray-400);
}

/* 响应式 */
@media (max-width: 1200px) {
  .container {
    grid-template-columns: 1fr 1fr;
  }
  
  .right-panel {
    grid-column: 1 / -1;
  }
}

@media (max-width: 768px) {
  .container {
    grid-template-columns: 1fr;
  }
  
  .lifestyle-category-items {
    grid-template-columns: 1fr;
  }
  
  .stats {
    gap: 8px;
  }
}
</style>
