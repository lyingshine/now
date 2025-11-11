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
              <div class="stat-value">¥{{ todayEarnings.toFixed(2) }}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">本月已赚</div>
              <div class="stat-value">¥{{ monthEarnings.toFixed(2) }}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">今年已赚</div>
              <div class="stat-value">¥{{ yearEarnings.toFixed(2) }}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">入职以来</div>
              <div class="stat-value">¥{{ totalEarnings.toFixed(2) }}</div>
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
    rank: { title: '💎 段位信息', items: [], class: 'rank' },
    income: { title: '💰 收入与储蓄', items: [], class: 'income' },
    basic: { title: '🏠 基础开销（必需）', items: [], class: 'basic' },
    food: { title: '🍚 日常饮食（必需）', items: [], class: 'food' },
    daily: { title: '👕 日常消费（半必需）', items: [], class: 'daily' },
    optional: { title: '📱 大件消费（可选）', items: [], class: 'optional' },
    summary: { title: '😊 整体评价', items: [], class: 'summary' }
  }

  lifestyleItems.value.forEach(item => {
    const category = categories[item.category]
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

const calculateEarnings = () => {
  perMinute.value = getPerMinuteRate()
  workMinutes.value = Math.floor(getTodayWorkMinutes())
  todayEarnings.value = perMinute.value * workMinutes.value
  
  // 简化的月度和年度计算
  const workDays = salaryData.value.workDays || 22
  const dailyEarnings = salaryData.value.salary / workDays
  
  const today = new Date()
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
  const yearStart = new Date(today.getFullYear(), 0, 1)
  
  const daysThisMonth = Math.floor((today - monthStart) / (1000 * 60 * 60 * 24)) + 1
  const daysThisYear = Math.floor((today - yearStart) / (1000 * 60 * 60 * 24)) + 1
  
  monthEarnings.value = dailyEarnings * Math.min(daysThisMonth, workDays)
  yearEarnings.value = (salaryData.value.salary * 12) * (daysThisYear / 365)
  
  // 入职以来
  if (salaryData.value.joinDate) {
    const joinDate = new Date(salaryData.value.joinDate)
    const daysSinceJoin = Math.floor((today - joinDate) / (1000 * 60 * 60 * 24))
    totalEarnings.value = dailyEarnings * Math.min(daysSinceJoin, daysSinceJoin * (workDays / 30))
  } else {
    totalEarnings.value = 0
  }
}

const goToJobs = () => {
  router.push('/jobs')
}

// 生命周期
onMounted(() => {
  loadData()
  calculateEarnings()
  timer = setInterval(calculateEarnings, 60000) // 每分钟更新一次
  
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
  background: var(--bg-primary);
}

.main-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  padding: 16px 24px;
}

.container {
  display: grid;
  grid-template-columns: 0.9fr 2fr 0.9fr;
  gap: 12px;
}

.left-panel, .middle-panel, .right-panel {
  background: white;
  backdrop-filter: blur(8px);
  border-radius: var(--radius-3xl);
  padding: var(--space-5);
  border: 1px solid var(--color-gray-200);
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-sm);
}

body.dark-mode .left-panel,
body.dark-mode .middle-panel,
body.dark-mode .right-panel {
  background: var(--color-gray-800);
  border: 1px solid var(--color-gray-700);
}

/* 段位显示 */
.rank-display {
  text-align: center;
  margin-bottom: var(--space-6);
  padding: var(--space-5) var(--space-4);
  background: white;
  border-radius: var(--radius-xl);
  border: 2px solid;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-sm);
}

.rank-display:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

body.dark-mode .rank-display {
  background: var(--color-gray-800);
}

.rank-icon {
  font-size: 40px;
  margin-bottom: 8px;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.rank-name {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: var(--space-2);
  letter-spacing: 0.05em;
}

.rank-desc {
  font-size: 0.9375rem;
  color: var(--color-gray-600);
  margin-bottom: var(--space-2);
}

.rank-percentage {
  font-size: 0.875rem;
  color: var(--color-gray-500);
  font-weight: 500;
}

.rank-lifestyle {
  font-size: 0.875rem;
  color: var(--color-gray-500);
  margin-top: 8px;
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
    linear-gradient(90deg, var(--color-accent), var(--color-primary));
  background-origin: border-box;
  background-clip: padding-box, border-box;
  padding: var(--space-6) var(--space-5);
  border-radius: var(--radius-xl);
  text-align: center;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-sm);
  margin-bottom: var(--space-4);
}

.earnings-display:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

body.dark-mode .earnings-display {
  background-image: 
    linear-gradient(var(--color-gray-800), var(--color-gray-800)),
    linear-gradient(90deg, var(--color-accent), var(--color-primary));
}

.earnings-label {
  font-size: 0.8125rem;
  color: var(--color-gray-600);
  margin-bottom: var(--space-3);
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.earnings-amount {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: var(--space-3);
  letter-spacing: -0.05em;
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-primary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.time-info {
  font-size: 0.9375rem;
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
  background: white;
  padding: var(--space-4) var(--space-3);
  border-radius: var(--radius-lg);
  text-align: center;
  transition: all var(--transition-fast);
  border: 2px solid var(--color-gray-200);
  box-shadow: var(--shadow-sm);
}

.stat-card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: var(--shadow-xl);
  border: 2px solid transparent;
  background-image: 
    linear-gradient(white, white),
    linear-gradient(90deg, var(--color-accent), var(--color-primary));
  background-origin: border-box;
  background-clip: padding-box, border-box;
}

body.dark-mode .stat-card {
  background: var(--color-gray-800);
  border: 2px solid var(--color-gray-700);
}

.stat-label {
  font-size: 0.75rem;
  color: var(--color-gray-600);
  margin-bottom: var(--space-2);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-primary);
  letter-spacing: -0.025em;
}

body.dark-mode .stat-value {
  color: var(--color-accent);
}

/* Section 标题 */
.section-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-gray-700);
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-3);
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
  gap: var(--space-3);
}

.lifestyle-category {
  background: white;
  border-radius: var(--radius-xl);
  padding: var(--space-3);
  border: 1px solid var(--color-gray-200);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-fast);
}

body.dark-mode .lifestyle-category {
  background: var(--color-gray-800);
  border-color: var(--color-gray-700);
}

.lifestyle-category-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-gray-900);
  margin-bottom: var(--space-2);
  padding-bottom: var(--space-2);
  padding-left: var(--space-2);
  border-bottom: 2px solid var(--color-gray-200);
  border-left: 3px solid var(--color-primary);
}

body.dark-mode .lifestyle-category-title {
  color: var(--color-gray-100);
  border-bottom-color: var(--color-gray-700);
}

.lifestyle-category-items {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-2);
}

.lifestyle-category.income .lifestyle-category-items,
.lifestyle-category.summary .lifestyle-category-items {
  grid-template-columns: 1fr;
}

.lifestyle-item {
  background: var(--color-gray-50);
  padding: var(--space-3);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-gray-200);
  transition: all var(--transition-fast);
  display: flex;
  gap: var(--space-2);
}

.lifestyle-item:hover {
  background: white;
  transform: translateX(4px);
  border-left-width: 4px;
  border-left-color: var(--color-accent);
  box-shadow: var(--shadow-md);
}

body.dark-mode .lifestyle-item {
  background: var(--color-gray-700);
  border-color: var(--color-gray-600);
}

.lifestyle-icon {
  font-size: 1.25rem;
}

.lifestyle-title {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-gray-900);
  margin-bottom: var(--space-1);
}

.lifestyle-desc {
  font-size: 0.75rem;
  color: var(--color-gray-600);
  line-height: 1.5;
}

body.dark-mode .lifestyle-title {
  color: var(--color-gray-100);
}

body.dark-mode .lifestyle-desc {
  color: var(--color-gray-400);
}

/* 岗位推荐 */
.job-recommend {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(37, 99, 235, 0.05) 100%);
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-3);
  cursor: pointer;
  transition: all var(--transition-fast);
  border: 1px solid var(--color-gray-200);
  box-shadow: var(--shadow-sm);
}

.job-recommend:hover {
  transform: translateY(-4px);
  border-color: var(--color-accent);
  box-shadow: var(--shadow-md);
}

body.dark-mode .job-recommend {
  background: var(--color-gray-800);
  border-color: var(--color-gray-700);
}

.job-recommend-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: var(--space-2);
}

.job-recommend-salary {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-accent);
  margin-bottom: var(--space-2);
  letter-spacing: -0.025em;
}

.job-recommend-reason {
  font-size: 0.875rem;
  color: var(--color-gray-600);
}

body.dark-mode .job-recommend-title {
  color: var(--color-accent);
}

/* 升级建议 */
.upgrade-tip {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(37, 99, 235, 0.05) 100%);
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-3);
  border: 1px solid var(--color-gray-200);
  border-left: 3px solid var(--color-primary);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-fast);
}

.upgrade-tip:hover {
  border-left-width: 4px;
  box-shadow: var(--shadow-md);
}

body.dark-mode .upgrade-tip {
  background: var(--color-gray-800);
  border-color: var(--color-gray-700);
}

.upgrade-tip-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: var(--space-2);
}

.upgrade-tip-content {
  font-size: 0.875rem;
  color: var(--color-gray-600);
  line-height: 1.7;
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
