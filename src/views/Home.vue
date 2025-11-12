<template>
  <div class="home fullpage-container" @wheel="handleWheel" :style="{ '--rank-color': rankInfo.current.color }">
    <!-- 导航指示器（合并箭头） -->
    <div class="page-indicator">
      <!-- 向上箭头 -->
      <button 
        v-if="currentPage > 0"
        class="indicator-arrow up"
        @click="scrollToPage(currentPage - 1)"
        aria-label="上一页"
      >
        <span>↑</span>
      </button>
      
      <!-- 页面指示点 -->
      <div 
        v-for="(page, index) in pages" 
        :key="index"
        :class="['indicator-dot', { active: currentPage === index }]"
        @click="scrollToPage(index)"
      >
        <span class="indicator-label">{{ page.label }}</span>
      </div>
      
      <!-- 向下箭头 -->
      <button 
        v-if="currentPage < pages.length - 1"
        class="indicator-arrow down"
        @click="scrollToPage(currentPage + 1)"
        aria-label="下一页"
      >
        <span>↓</span>
      </button>
    </div>

    <!-- 第一屏：段位排名 & 收入统计 -->
    <section class="fullpage-section" :class="{ active: currentPage === 0 }">
      <div class="section-content">
        <div class="section-header-text">
          <h1 class="section-title">职场段位</h1>
          <p class="section-subtitle">当前排名与收入概览</p>
        </div>

        <!-- 段位展示 - 居中大卡片 -->
        <div class="rank-display">
          <div class="rank-main-card">
            <div class="rank-icon" :style="{ color: rankInfo.current.color }">{{ rankInfo.current.icon }}</div>
            <div class="rank-name" :style="{ color: rankInfo.current.color }">{{ rankInfo.current.name }}</div>
            <div class="rank-level">{{ rankInfo.current.description }}</div>
            <div class="rank-percentile">超越 {{ rankInfo.current.percentage }} 的人</div>
            
            <!-- 关键数据 - 整合到段位卡片内 -->
            <div class="rank-metrics">
              <div class="rank-metric-item">
                <div class="rank-metric-label">月薪</div>
                <div class="rank-metric-value primary">¥{{ (salaryData.salary / 1000).toFixed(1) }}K</div>
              </div>
              <div class="rank-metric-divider"></div>
              <div class="rank-metric-item">
                <div class="rank-metric-label">年薪</div>
                <div class="rank-metric-value success">¥{{ (salaryData.salary * 12 / 10000).toFixed(1) }}W</div>
              </div>
              <div class="rank-metric-divider"></div>
              <div class="rank-metric-item">
                <div class="rank-metric-label">生活水平</div>
                <div class="rank-metric-value warning">{{ lifestyleLevel }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 收入统计 -->
        <div class="earnings-grid">
          <div class="earning-card">
            <div class="earning-icon">📅</div>
            <div class="earning-label">今日收入</div>
            <div class="earning-value">¥{{ todayEarnings.toFixed(2) }}</div>
            <div class="earning-progress">
              <div class="earning-bar" :style="{ width: (todayEarnings / (salaryData.salary / 22)) * 100 + '%' }"></div>
            </div>
          </div>
          
          <div class="earning-card">
            <div class="earning-icon">📊</div>
            <div class="earning-label">本月收入</div>
            <div class="earning-value">¥{{ monthEarnings.toFixed(0) }}</div>
            <div class="earning-progress">
              <div class="earning-bar" :style="{ width: (monthEarnings / salaryData.salary) * 100 + '%' }"></div>
            </div>
          </div>
          
          <div class="earning-card">
            <div class="earning-icon">📈</div>
            <div class="earning-label">年度收入</div>
            <div class="earning-value">¥{{ yearEarnings.toFixed(0) }}</div>
            <div class="earning-progress">
              <div class="earning-bar" :style="{ width: (yearEarnings / (salaryData.salary * 12)) * 100 + '%' }"></div>
            </div>
          </div>
          
          <div class="earning-card">
            <div class="earning-icon">💰</div>
            <div class="earning-label">入职以来</div>
            <div class="earning-value">¥{{ totalCareerEarnings.toFixed(0) }}</div>
            <div class="earning-meta">{{ workDuration }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 第二屏：生活水平 -->
    <section class="fullpage-section" :class="{ active: currentPage === 1 }">
      <div class="section-content">
        <div class="section-header-text">
          <h1 class="section-title">生活水平</h1>
          <p class="section-subtitle">基于月薪 ¥{{ (salaryData.salary / 1000).toFixed(1) }}K 的生活质量评估</p>
        </div>

        <!-- 总体评价 -->
        <div class="lifestyle-summary">
          <div class="summary-badge">
            <span class="summary-icon">{{ rankInfo.current.icon }}</span>
            <span class="summary-level">{{ lifestyleLevel }}</span>
          </div>
          <div class="summary-text">
            <p class="summary-description">{{ getLifestyleSummary() }}</p>
          </div>
        </div>

        <div class="lifestyle-showcase">
          <div v-for="(category, catIndex) in lifestyleCategories" :key="category.title" class="lifestyle-category">
            <div class="category-header">
              <h3 class="category-title">{{ category.title }}</h3>
              <div class="category-nav" v-if="category.items.length > 1">
                <button 
                  class="nav-dot"
                  v-for="(item, index) in category.items"
                  :key="index"
                  :class="{ active: currentLifestyleIndex[catIndex] === index }"
                  @click="setLifestyleIndex(catIndex, index)"
                ></button>
              </div>
            </div>
            
            <!-- 单项轮播显示 -->
            <div class="lifestyle-carousel">
              <transition name="slide-fade" mode="out-in">
                <div 
                  v-if="category.items.length > 0 && currentLifestyleIndex[catIndex] !== undefined"
                  :key="currentLifestyleIndex[catIndex]" 
                  class="lifestyle-item"
                >
                  <div class="item-main">
                    <div class="item-header">
                      <span class="item-icon">{{ category.items[currentLifestyleIndex[catIndex] || 0].icon }}</span>
                      <div class="item-info">
                        <span class="item-label">{{ category.items[currentLifestyleIndex[catIndex] || 0].label }}</span>
                        <span class="item-description">{{ category.items[currentLifestyleIndex[catIndex] || 0].description }}</span>
                      </div>
                    </div>
                    <div class="item-status-badge" :style="{ 
                      backgroundColor: getStatusBgColor(category.items[currentLifestyleIndex[catIndex] || 0].status),
                      color: getStatusColor(category.items[currentLifestyleIndex[catIndex] || 0].status)
                    }">
                      {{ category.items[currentLifestyleIndex[catIndex] || 0].status }}
                    </div>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 第三屏：职业推荐 & 建议 -->
    <section class="fullpage-section" :class="{ active: currentPage === 2 }">
      <div class="section-content">
        <div class="section-header-text">
          <h1 class="section-title">职业发展</h1>
          <p class="section-subtitle">为你推荐的成长路径与建议</p>
        </div>

        <div class="career-grid">
          <!-- 职业推荐 -->
          <div class="career-section">
            <h3 class="career-section-title">💼 推荐职位</h3>
            <div class="job-cards">
              <div v-for="job in recommendedJobs" :key="job.id" class="job-card" @click="goToJobs">
                <div class="job-header">
                  <span class="job-icon">{{ job.icon || '💼' }}</span>
                  <span class="job-title">{{ job.title }}</span>
                </div>
                <div class="job-salary">¥{{ (job.salary / 1000).toFixed(0) }}K/月</div>
                <div class="job-reason">{{ job.reason }}</div>
                <div class="job-tags">
                  <span v-for="tag in job.tags" :key="tag" class="job-tag">{{ tag }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 升级建议 -->
          <div class="career-section">
            <h3 class="career-section-title">💡 升级建议</h3>
            <div class="tips-list">
              <div v-for="(tip, index) in upgradeTips" :key="index" class="tip-card">
                <div class="tip-number">{{ index + 1 }}</div>
                <div class="tip-content">
                  <div class="tip-title">{{ tip.title }}</div>
                  <div class="tip-description">{{ tip.content }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 设置弹窗 -->
    <SettingsModal 
      :isOpen="isSettingsOpen"
      @close="isSettingsOpen = false"
      @save="handleSettingsSave"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLifestyle } from '../composables/useLifestyle'
import { useEarnings } from '../composables/useEarnings'
import { useQuestStore } from '../stores/quest'
import { useUserStore } from '../stores/user'
import { getCurrentLevelExp } from '../utils/expCalculator'
import RankCard from '../components/RankCard.vue'
import EarningsCard from '../components/EarningsCard.vue'
import StatsCards from '../components/StatsCards.vue'
import LifestyleSection from '../components/LifestyleSection.vue'
import JobRecommendations from '../components/JobRecommendations.vue'
import UpgradeTips from '../components/UpgradeTips.vue'
import SettingsModal from '../components/SettingsModal.vue'
import LevelDisplay from '../components/game/LevelDisplay.vue'
import jobsData from '../data/jobs-data.js'

const router = useRouter()
const questStore = useQuestStore()
const userStore = useUserStore()
const { calculateLifestyle, getRankInfo, getRank } = useLifestyle()

// 游戏化数据 - 优先显示当前任务的等级，否则显示用户全局等级
const playerLevel = computed(() => {
  if (questStore.hasActiveQuest && questStore.currentQuest) {
    return questStore.currentLevel
  }
  return userStore.userInfo.level || 1
})

// 显示总经验值，而不是当前等级的经验值
const currentExp = computed(() => {
  if (questStore.hasActiveQuest && questStore.currentQuest) {
    return questStore.currentQuest.totalExp
  }
  return userStore.userInfo.totalExp || 0
})

// 最大经验值是10000（满级100级）
const maxExp = computed(() => 10000)
const completedQuests = computed(() => {
  return questStore.questHistory.filter(h => h.completionType === 'completed').length
})
const achievements = computed(() => userStore.userInfo.achievements.length)
const streakDays = computed(() => userStore.userInfo.streakDays)

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

// 从 userStore 同步所有数据
const syncDataFromUser = () => {
  const user = userStore.userInfo
  
  salaryData.value.salary = user.currentSalary || 10000
  salaryData.value.joinDate = user.joinDate || ''
  salaryData.value.workStart = user.workStart || '09:00'
  salaryData.value.workEnd = user.workEnd || '18:00'
  salaryData.value.workSchedule = user.workSchedule || 'double'
  salaryData.value.workDays = user.workDays || 22
  salaryData.value.peopleCount = user.peopleCount || 1
  salaryData.value.rent = user.rent !== undefined ? user.rent : 2000
  salaryData.value.utilities = user.utilities !== undefined ? user.utilities : 300
  salaryData.value.savingsRate = user.savingsRate !== undefined ? user.savingsRate : 30
  
  // 同步后重新计算收入
  calculateEarnings()
}

// 使用收入计算 composable
const {
  perMinute,
  workMinutes,
  todayEarnings,
  monthEarnings,
  yearEarnings,
  totalEarnings,
  calculateEarnings
} = useEarnings(salaryData)

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

// 计算入职以来的收入
const totalCareerEarnings = computed(() => {
  if (!salaryData.value.joinDate) return 0
  
  const joinDate = new Date(salaryData.value.joinDate)
  const now = new Date()
  
  // 计算工作月数
  const months = (now.getFullYear() - joinDate.getFullYear()) * 12 + 
                 (now.getMonth() - joinDate.getMonth())
  
  // 简化计算：月薪 * 月数
  // 实际应该考虑薪资变化历史，这里先用当前薪资估算
  return salaryData.value.salary * Math.max(months, 0)
})

// 计算工作时长
const workDuration = computed(() => {
  if (!salaryData.value.joinDate) return '未设置入职日期'
  
  const joinDate = new Date(salaryData.value.joinDate)
  const now = new Date()
  
  const years = now.getFullYear() - joinDate.getFullYear()
  const months = now.getMonth() - joinDate.getMonth()
  const days = now.getDate() - joinDate.getDate()
  
  let totalMonths = years * 12 + months
  if (days < 0) totalMonths--
  
  if (totalMonths < 1) {
    const totalDays = Math.floor((now - joinDate) / (1000 * 60 * 60 * 24))
    return `${totalDays} 天`
  } else if (totalMonths < 12) {
    return `${totalMonths} 个月`
  } else {
    const y = Math.floor(totalMonths / 12)
    const m = totalMonths % 12
    return m > 0 ? `${y} 年 ${m} 个月` : `${y} 年`
  }
})

const savingsRecommendation = computed(() => {
  const { rankSystem } = useLifestyle()
  return rankSystem.getSavingsRateRecommendation(salaryData.value.salary)
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
      // 映射数据字段：title -> label, desc -> description
      category.items.push({
        ...item,
        label: item.title,
        description: item.desc,
        status: getItemStatus(item),
        value: getItemValue(item)
      })
    }
  })

  return Object.values(categories).filter(cat => cat.items.length > 0)
})

// 根据项目内容和用户段位判断状态
const getItemStatus = (item) => {
  // 如果是收入与储蓄类别，直接返回段位对应的生活水平
  if (item.category === 'income') {
    return lifestyleLevel.value
  }
  
  const desc = item.desc.toLowerCase()
  const salary = salaryData.value.salary
  
  // 根据薪资范围和描述关键词综合判断
  // 0-5000: 艰难
  if (salary <= 5000) {
    if (desc.includes('无法') || desc.includes('困难') || desc.includes('很少') || desc.includes('城中村') || desc.includes('远郊')) {
      return '艰难'
    }
    return '温饱'
  }
  // 5001-7000: 温饱
  else if (salary <= 7000) {
    if (desc.includes('偶尔') || desc.includes('快餐') || desc.includes('远郊')) {
      return '温饱'
    }
    return '小康'
  }
  // 7001-10000: 小康
  else if (salary <= 10000) {
    if (desc.includes('工作日') || desc.includes('普通') || desc.includes('20-30元')) {
      return '小康'
    }
    return '舒适'
  }
  // 10001-15000: 舒适
  else if (salary <= 15000) {
    if (desc.includes('正常') || desc.includes('品质') || desc.includes('30-40元')) {
      return '舒适'
    }
    return '富足'
  }
  // 15001-25000: 富足
  else if (salary <= 25000) {
    if (desc.includes('无忧') || desc.includes('40-60元') || desc.includes('中档')) {
      return '富足'
    }
    return '优越'
  }
  // 25001-35000: 优越
  else if (salary <= 35000) {
    if (desc.includes('品质好') || desc.includes('高档') || desc.includes('60-80元')) {
      return '优越'
    }
    return '优越'
  }
  // 35001-50000: 优越+
  else if (salary <= 50000) {
    if (desc.includes('高端') || desc.includes('奢华') || desc.includes('顶级')) {
      return '优越+'
    }
    return '优越'
  }
  // 50000+: 自由
  else {
    if (desc.includes('自由') || desc.includes('随心') || desc.includes('想买就买') || desc.includes('任何')) {
      return '自由'
    }
    return '优越+'
  }
}

// 提取数值信息
const getItemValue = (item) => {
  // 从描述中提取金额或百分比
  const match = item.desc.match(/(\d+(?:,\d+)?(?:\.\d+)?)[元%]/);
  return match ? match[0] : null
}

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
  // 保存到 userStore
  userStore.updateUserInfo(data)
  userStore.updateWorkSettings(data)
  userStore.updateLifeSettings(data)
  
  // 从 userStore 同步最新数据
  syncDataFromUser()
}

// 这些函数已移至 composables，不再需要

const goToJobs = () => {
  router.push('/jobs')
}

const getLifestyleProgress = (item) => {
  // 根据状态返回进度百分比
  const statusMap = {
    '艰难': 20,
    '温饱': 40,
    '小康': 60,
    '舒适': 75,
    '富足': 85,
    '优越': 92,
    '优越+': 97,
    '自由': 100
  }
  return statusMap[item.status] || 50
}

const getLifestyleColor = (item) => {
  // 根据状态返回渐变色
  const progress = getLifestyleProgress(item)
  if (progress >= 80) return 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
  if (progress >= 60) return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  if (progress >= 40) return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  return 'linear-gradient(135deg, #ffd89b 0%, #19547b 100%)'
}

const getStatusColor = (status) => {
  const colorMap = {
    '艰难': '#ef4444',
    '温饱': '#f59e0b',
    '小康': '#3b82f6',
    '舒适': '#8b5cf6',
    '富足': '#10b981',
    '优越': '#06b6d4',
    '优越+': '#0891b2',
    '自由': '#14b8a6'
  }
  return colorMap[status] || '#64748b'
}

const getStatusBgColor = (status) => {
  const colorMap = {
    '艰难': 'rgba(239, 68, 68, 0.15)',
    '温饱': 'rgba(245, 158, 11, 0.15)',
    '小康': 'rgba(59, 130, 246, 0.15)',
    '舒适': 'rgba(139, 92, 246, 0.15)',
    '富足': 'rgba(16, 185, 129, 0.15)',
    '优越': 'rgba(6, 182, 212, 0.15)',
    '优越+': 'rgba(8, 145, 178, 0.15)',
    '自由': 'rgba(20, 184, 166, 0.15)'
  }
  return colorMap[status] || 'rgba(100, 116, 139, 0.15)'
}

const getLifestyleSummary = () => {
  const salary = salaryData.value.salary
  const level = lifestyleLevel.value
  
  const summaries = {
    '艰难': `月薪 ¥${(salary / 1000).toFixed(1)}K，生活较为紧张。建议优先保障基本生活需求，控制非必要开支，努力提升收入。`,
    '温饱': `月薪 ¥${(salary / 1000).toFixed(1)}K，基本生活有保障。可以满足日常需求，但大额消费需要谨慎规划。`,
    '小康': `月薪 ¥${(salary / 1000).toFixed(1)}K，生活较为舒适。能够满足基本需求并有一定储蓄，偶尔可以享受生活。`,
    '舒适': `月薪 ¥${(salary / 1000).toFixed(1)}K，生活品质良好。可以较为自由地消费，有稳定的储蓄能力。`,
    '富足': `月薪 ¥${(salary / 1000).toFixed(1)}K，生活富足。能够享受高品质生活，有充足的储蓄和投资能力。`,
    '优越': `月薪 ¥${(salary / 1000).toFixed(1)}K，生活优越。可以自由选择生活方式，财务压力很小。`,
    '优越+': `月薪 ¥${(salary / 1000).toFixed(1)}K，生活非常优越。拥有极高的生活品质和财务自由度。`,
    '自由': `月薪 ¥${(salary / 1000).toFixed(1)}K，实现财务自由。可以完全按照自己的意愿生活，无需为金钱担忧。`
  }
  
  return summaries[level] || `月薪 ¥${(salary / 1000).toFixed(1)}K，生活水平：${level}`
}

// 全屏滚动相关
const currentPage = ref(0)
const pages = ref([
  { label: '段位排名' },
  { label: '生活水平' },
  { label: '职业发展' }
])
let isScrolling = false

// 生活水平轮播索引
const currentLifestyleIndex = ref({})
const isCarouselInitialized = ref(false)

// 初始化轮播索引
const initLifestyleCarousel = () => {
  if (isCarouselInitialized.value) return // 已经初始化过，不再重复初始化
  
  lifestyleCategories.value.forEach((category, index) => {
    if (currentLifestyleIndex.value[index] === undefined) {
      currentLifestyleIndex.value[index] = 0
    }
  })
  isCarouselInitialized.value = true
}

// 设置轮播索引
const setLifestyleIndex = (categoryIndex, itemIndex) => {
  currentLifestyleIndex.value[categoryIndex] = itemIndex
}

// 自动轮播
let carouselTimer = null
const startAutoCarousel = () => {
  carouselTimer = setInterval(() => {
    lifestyleCategories.value.forEach((category, catIndex) => {
      if (category.items.length > 1) {
        const currentIndex = currentLifestyleIndex.value[catIndex] || 0
        const nextIndex = (currentIndex + 1) % category.items.length
        currentLifestyleIndex.value[catIndex] = nextIndex
      }
    })
  }, 5000) // 每5秒切换
}

const stopAutoCarousel = () => {
  if (carouselTimer) {
    clearInterval(carouselTimer)
    carouselTimer = null
  }
}

// 监听 lifestyleCategories 变化，初始化轮播索引（仅首次）
watch(lifestyleCategories, (newCategories) => {
  if (newCategories && newCategories.length > 0 && !isCarouselInitialized.value) {
    initLifestyleCarousel()
  }
}, { immediate: true })

// 监听页面切换，控制轮播
watch(currentPage, (newPage) => {
  if (newPage === 1) {
    // 进入生活水平页面，启动轮播
    startAutoCarousel()
  } else {
    // 离开生活水平页面，停止轮播
    stopAutoCarousel()
  }
})

const handleWheel = (event) => {
  // 如果正在滚动中，忽略
  if (isScrolling) return
  
  // 检查事件目标，如果是轮播相关元素，不触发页面切换
  const target = event.target
  if (target.closest('.lifestyle-carousel') || 
      target.closest('.category-nav') || 
      target.closest('.nav-dot')) {
    return
  }
  
  isScrolling = true
  
  if (event.deltaY > 0) {
    // 向下滚动
    if (currentPage.value < pages.value.length - 1) {
      currentPage.value++
    }
  } else {
    // 向上滚动
    if (currentPage.value > 0) {
      currentPage.value--
    }
  }
  
  setTimeout(() => {
    isScrolling = false
  }, 800)
}

const scrollToPage = (index) => {
  if (index >= 0 && index < pages.value.length) {
    currentPage.value = index
  }
}

// 监听 userStore 的变化，实时更新数据
watch(
  () => userStore.userInfo,
  () => {
    syncDataFromUser()
  },
  { deep: true }
)

// 生命周期
onMounted(() => {
  // 先加载 stores
  questStore.loadFromStorage()
  userStore.loadFromStorage()
  
  // 从 userStore 同步所有数据（优先级高于 localStorage）
  syncDataFromUser()
  
  // 如果 userStore 没有数据，再从 localStorage 加载
  if (!userStore.userInfo.currentSalary) {
    loadData()
    syncDataFromUser()
  }
  
  // 每秒更新一次，实时显示收入
  timer = setInterval(() => {
    calculateEarnings()
  }, 1000)
  
  // 监听设置按钮点击（从 Navbar）
  window.addEventListener('openSettings', () => {
    isSettingsOpen.value = true
  })
  
  // 更新连续学习天数
  userStore.updateStreakDays()
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
  stopAutoCarousel()
  window.removeEventListener('openSettings', () => {})
})
</script>

<style scoped>
/* ===== 全屏容器 ===== */
.fullpage-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: var(--immersive-bg-primary);
  color: var(--immersive-text-primary);
  position: relative;
  padding-top: 0;
}

/* ===== 全屏区块 ===== */
.fullpage-section {
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: translateY(100vh);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
  padding-top: 80px;
}

.fullpage-section.active {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.fullpage-section:nth-child(2) {
  background: linear-gradient(135deg, 
    rgba(102, 126, 234, 0.03) 0%, 
    rgba(17, 153, 142, 0.03) 100%
  );
}

.fullpage-section:nth-child(3) {
  background: linear-gradient(135deg, 
    rgba(17, 153, 142, 0.03) 0%, 
    rgba(240, 147, 251, 0.03) 100%
  );
}

.fullpage-section:nth-child(4) {
  background: linear-gradient(135deg, 
    rgba(240, 147, 251, 0.03) 0%, 
    rgba(251, 191, 36, 0.03) 100%
  );
}

/* ===== 区块内容 ===== */
.section-content {
  max-width: 1400px;
  width: 100%;
  height: calc(100vh - 160px);
  padding: 0 var(--space-8);
  display: flex;
  flex-direction: column;
  animation: fadeInUp 0.8s ease-out 0.3s both;
  overflow: hidden;
  justify-content: center;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ===== 区块标题 ===== */
.section-header-text {
  text-align: center;
  margin-bottom: var(--space-4);
  flex-shrink: 0;
  min-height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.section-title {
  font-size: var(--text-3xl);
  font-weight: 900;
  background: linear-gradient(135deg, var(--rank-color, var(--neon-purple)) 0%, var(--neon-purple) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: var(--space-1);
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.section-subtitle {
  font-size: var(--text-sm);
  color: var(--immersive-text-secondary);
  font-weight: 400;
  line-height: 1.5;
}

/* ===== 第一屏：段位排名 ===== */
.rank-display {
  display: flex;
  justify-content: center;
  margin-bottom: var(--space-6);
  flex-shrink: 0;
  width: 100%;
}

.rank-main-card {
  text-align: center;
  padding: var(--space-10) var(--space-12);
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-4xl);
  border: 2px solid rgba(255, 255, 255, 0.15);
  position: relative;
  overflow: hidden;
  width: 100%;
  max-width: 1200px;
}

.rank-main-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--rank-color, var(--neon-purple));
}

.rank-icon {
  font-size: 6rem;
  margin-bottom: var(--space-4);
  filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.4));
  animation: float 3s ease-in-out infinite;
  line-height: 1;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.rank-name {
  font-size: var(--text-4xl);
  font-weight: 900;
  margin-bottom: var(--space-2);
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.rank-level {
  font-size: var(--text-lg);
  color: var(--immersive-text-secondary);
  font-weight: 600;
  margin-bottom: var(--space-3);
  line-height: 1.5;
}

.rank-percentile {
  font-size: var(--text-sm);
  color: var(--immersive-text-tertiary);
  font-weight: 700;
  margin-bottom: var(--space-6);
  padding: var(--space-2) var(--space-5);
  background: rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-full);
  display: inline-block;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

/* 段位卡片内的关键数据 */
.rank-metrics {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-8);
  margin-top: var(--space-6);
  padding-top: var(--space-6);
  border-top: 1px solid rgba(255, 255, 255, 0.15);
}

.rank-metric-item {
  text-align: center;
  padding: var(--space-3) var(--space-4);
  transition: all var(--duration-normal) var(--ease-smooth);
  border-radius: var(--radius-xl);
}

.rank-metric-item:hover {
  background: rgba(255, 255, 255, 0.05);
  transform: translateY(-2px);
}

.rank-metric-label {
  font-size: var(--text-sm);
  color: var(--immersive-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-bottom: var(--space-2);
  font-weight: 700;
}

.rank-metric-value {
  font-size: var(--text-3xl);
  font-weight: 900;
  font-variant-numeric: tabular-nums;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.rank-metric-divider {
  width: 1px;
  height: 60px;
  background: linear-gradient(to bottom, 
    transparent 0%, 
    rgba(255, 255, 255, 0.2) 50%, 
    transparent 100%
  );
}

.rank-progress-bar {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-bottom: var(--space-3);
}

.rank-progress-fill {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width 1s ease-out;
  position: relative;
}

.rank-progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(255, 255, 255, 0.4) 50%, 
    transparent 100%
  );
  animation: shimmer 2s infinite;
}

.rank-progress-info {
  margin-top: var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.progress-text {
  font-size: var(--text-sm);
  color: var(--immersive-text-tertiary);
  margin-bottom: var(--space-3);
  font-weight: 600;
  text-align: center;
}

.next-rank {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--immersive-text-secondary);
  line-height: 1.6;
}

.next-rank-icon {
  font-size: var(--text-xl);
}

.next-rank-need {
  color: var(--immersive-text-tertiary);
  font-weight: 600;
}

.max-rank {
  font-size: var(--text-base);
  color: #fbbf24;
  font-weight: 700;
  text-align: center;
}

.savings-recommendation {
  grid-column: 1 / -1;
  background: rgba(16, 185, 129, 0.1) !important;
  border: 1px solid rgba(16, 185, 129, 0.3) !important;
}

.stat-value.info {
  background: var(--neon-green);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.savings-range {
  font-size: var(--text-xs);
  color: var(--immersive-text-tertiary);
  margin-top: var(--space-1);
  font-weight: 600;
}

.savings-reason {
  font-size: var(--text-sm);
  color: var(--immersive-text-secondary);
  margin-top: var(--space-2);
  line-height: 1.5;
}

.rank-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-5);
  flex: 0 0 auto;
  width: 480px;
}

.rank-stat-item {
  text-align: center;
  padding: var(--space-4);
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-2xl);
  border: 1px solid rgba(255, 255, 255, 0.15);
  transition: all var(--duration-normal) var(--ease-smooth);
}

.rank-stat-item:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-4px);
  border-color: rgba(255, 255, 255, 0.25);
}

.stat-label {
  font-size: var(--text-xs);
  color: var(--immersive-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: var(--space-1);
  font-weight: 600;
}

.stat-value {
  font-size: var(--text-2xl);
  font-weight: 900;
  font-variant-numeric: tabular-nums;
  line-height: 1.2;
}

.stat-value.primary {
  background: var(--neon-purple);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-value.success {
  background: var(--neon-green);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-value.warning {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 收入网格 */
.earnings-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-4);
  flex-shrink: 0;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.earning-card {
  padding: var(--space-4);
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-2xl);
  border: 2px solid rgba(255, 255, 255, 0.15);
  transition: all var(--duration-normal) var(--ease-smooth);
  text-align: center;
  position: relative;
  overflow: hidden;
}

.earning-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--rank-color, var(--neon-green));
  opacity: 0;
  transition: opacity var(--duration-normal) var(--ease-smooth);
}

.earning-card:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-4px);
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.earning-card:hover::before {
  opacity: 1;
}

.earning-icon {
  font-size: var(--text-2xl);
  margin-bottom: var(--space-2);
  line-height: 1;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.earning-label {
  font-size: var(--text-xs);
  color: var(--immersive-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-bottom: var(--space-1);
  font-weight: 700;
}

.earning-value {
  font-size: var(--text-lg);
  font-weight: 900;
  background: var(--neon-green);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: var(--space-2);
  font-variant-numeric: tabular-nums;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.earning-meta {
  font-size: var(--text-xs);
  color: var(--immersive-text-secondary);
  font-weight: 600;
  margin-top: var(--space-1);
}

.earning-progress {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.earning-bar {
  height: 100%;
  background: var(--neon-green);
  border-radius: var(--radius-full);
  transition: width 1s ease-out;
  animation: progress-fill 1.5s ease-out;
  position: relative;
}

.earning-bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(255, 255, 255, 0.3) 50%, 
    transparent 100%
  );
  animation: shimmer 2s infinite;
}

@keyframes progress-fill {
  from { width: 0; }
}

/* ===== 第二屏：生活水平 ===== */
.lifestyle-summary {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-2xl);
  border: 2px solid rgba(255, 255, 255, 0.1);
  margin-bottom: var(--space-4);
  flex-shrink: 0;
  width: 100%;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.summary-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-4);
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-xl);
  min-width: 120px;
}

.summary-icon {
  font-size: 3rem;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

.summary-level {
  font-size: var(--text-xl);
  font-weight: 900;
  background: var(--neon-green);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.summary-text {
  flex: 1;
}

.summary-description {
  font-size: var(--text-sm);
  color: var(--immersive-text-secondary);
  line-height: 1.6;
  font-weight: 400;
}

.lifestyle-showcase {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-4);
  flex: 1;
  overflow: hidden;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.lifestyle-category {
  background: rgba(255, 255, 255, 0.03);
  border-radius: var(--radius-xl);
  padding: var(--space-4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: all var(--duration-normal) var(--ease-smooth);
}

.lifestyle-category:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.2);
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-3);
  padding-bottom: var(--space-2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
}

.category-title {
  font-size: var(--text-base);
  font-weight: 700;
  color: var(--immersive-text-primary);
  margin: 0;
}

.category-nav {
  display: flex;
  gap: var(--space-1);
}

.nav-dot {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.3);
  border: none;
  cursor: pointer;
  transition: all var(--duration-fast) ease;
  padding: 0;
}

.nav-dot:hover {
  background: rgba(255, 255, 255, 0.5);
  transform: scale(1.2);
}

.nav-dot.active {
  background: var(--rank-color, var(--neon-purple));
  transform: scale(1.3);
}

.lifestyle-carousel {
  flex: 1;
  display: flex;
  align-items: center;
  position: relative;
  min-height: 140px;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.lifestyle-items {
  display: grid;
  gap: var(--space-2);
}

.lifestyle-item {
  padding: var(--space-3);
  background: rgba(255, 255, 255, 0.02);
  border-radius: var(--radius-lg);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all var(--duration-normal) var(--ease-smooth);
  width: 100%;
}

.lifestyle-item:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.item-main {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-3);
}

.item-header {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
  flex: 1;
  min-width: 0;
}

.item-icon {
  font-size: var(--text-xl);
  flex-shrink: 0;
  line-height: 1;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
}

.item-label {
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--immersive-text-primary);
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-description {
  font-size: var(--text-xs);
  color: var(--immersive-text-tertiary);
  line-height: 1.6;
  word-break: break-word;
  white-space: normal;
}

.item-status-badge {
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 700;
  white-space: nowrap;
  flex-shrink: 0;
}

.item-progress {
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-full);
  overflow: hidden;
  display: none;
}

.item-bar {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width 1s ease-out;
  position: relative;
}

.item-bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(255, 255, 255, 0.3) 50%, 
    transparent 100%
  );
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.item-value {
  display: none;
}

/* ===== 第三屏：职业发展 ===== */
.career-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: var(--space-4);
  flex: 1;
  overflow: hidden;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.career-section {
  background: rgba(255, 255, 255, 0.03);
  border-radius: var(--radius-2xl);
  padding: var(--space-4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.career-section-title {
  font-size: var(--text-lg);
  font-weight: 700;
  margin-bottom: var(--space-3);
  color: var(--immersive-text-primary);
  flex-shrink: 0;
}

/* 职位卡片 */
.job-cards {
  display: grid;
  gap: var(--space-3);
  overflow: hidden;
}

.job-card {
  padding: var(--space-3);
  background: rgba(255, 255, 255, 0.02);
  border-radius: var(--radius-xl);
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-smooth);
}

.job-card:hover {
  background: rgba(255, 255, 255, 0.06);
  transform: translateY(-2px);
  border-color: var(--rank-color, rgba(102, 126, 234, 0.5));
  box-shadow: 0 4px 16px var(--rank-color, rgba(102, 126, 234, 0.2));
}

.job-header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-2);
}

.job-icon {
  font-size: var(--text-xl);
}

.job-title {
  font-size: var(--text-base);
  font-weight: 700;
  color: var(--immersive-text-primary);
}

.job-salary {
  font-size: var(--text-lg);
  font-weight: 900;
  background: var(--neon-green);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: var(--space-1);
}

.job-reason {
  font-size: var(--text-xs);
  color: var(--immersive-text-secondary);
  margin-bottom: var(--space-2);
  line-height: 1.4;
}

.job-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
}

.job-tag {
  padding: 2px var(--space-2);
  background: rgba(102, 126, 234, 0.2);
  color: #a5b4fc;
  border-radius: var(--radius-full);
  font-size: 10px;
  font-weight: 600;
}

/* 建议列表 */
.tips-list {
  display: grid;
  gap: var(--space-2);
  overflow: hidden;
}

.tip-card {
  display: flex;
  gap: var(--space-2);
  padding: var(--space-3);
  background: rgba(255, 255, 255, 0.02);
  border-radius: var(--radius-lg);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all var(--duration-normal) var(--ease-smooth);
}

.tip-card:hover {
  background: rgba(255, 255, 255, 0.05);
  transform: translateX(4px);
}

.tip-number {
  width: 28px;
  height: 28px;
  background: var(--rank-color, var(--neon-purple));
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-sm);
  font-weight: 900;
  color: white;
  flex-shrink: 0;
}

.tip-content {
  flex: 1;
  min-width: 0;
}

.tip-title {
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--immersive-text-primary);
  margin-bottom: var(--space-1);
}

.tip-description {
  font-size: var(--text-xs);
  color: var(--immersive-text-secondary);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ===== 导航指示器（合并箭头） ===== */
.page-indicator {
  position: fixed;
  right: var(--space-8);
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-radius: var(--radius-2xl);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* 箭头按钮 */
.indicator-arrow {
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  border-radius: var(--radius-lg);
  color: var(--immersive-text-secondary);
  font-size: var(--text-xl);
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-out-expo);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.indicator-arrow::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--rank-color, var(--color-primary));
  opacity: 0;
  transition: opacity var(--duration-fast) ease;
}

.indicator-arrow:hover {
  color: white;
  transform: scale(1.1);
}

.indicator-arrow:hover::before {
  opacity: 0.2;
}

.indicator-arrow:active {
  transform: scale(0.95);
}

.indicator-arrow.up {
  animation: bounce-up 2s ease-in-out infinite;
}

.indicator-arrow.down {
  animation: bounce-down 2s ease-in-out infinite;
}

@keyframes bounce-up {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

@keyframes bounce-down {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(4px); }
}

/* 指示点 */
.indicator-dot {
  width: 10px;
  height: 10px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-out-expo);
  position: relative;
}

.indicator-dot:hover {
  background: rgba(255, 255, 255, 0.5);
  transform: scale(1.4);
}

.indicator-dot.active {
  background: var(--rank-color, var(--color-primary));
  box-shadow: 0 0 12px var(--rank-color, var(--color-primary));
  transform: scale(1.6);
}

.indicator-label {
  position: absolute;
  right: 28px;
  top: 50%;
  transform: translateY(-50%);
  white-space: nowrap;
  font-size: var(--text-xs);
  color: var(--immersive-text-primary);
  opacity: 0;
  transition: all var(--duration-fast) var(--ease-out-expo);
  pointer-events: none;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-lg);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.indicator-dot:hover .indicator-label,
.indicator-dot.active .indicator-label {
  opacity: 1;
  transform: translateY(-50%) translateX(-8px);
}

/* 任务横幅 */
.quest-banner-immersive {
  background: var(--immersive-bg-secondary);
  border-top: 1px solid var(--divider-default);
  border-bottom: 1px solid var(--divider-default);
  padding: var(--space-6) 0;
}

.quest-progress-bar {
  height: 4px;
  background: var(--immersive-bg-tertiary);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-bottom: var(--space-4);
}

.quest-progress-fill {
  height: 100%;
  background: var(--neon-purple);
  border-radius: var(--radius-full);
  transition: width 1s ease-out;
}

.quest-info {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.quest-icon {
  font-size: var(--text-3xl);
}

.quest-title {
  flex: 1;
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--immersive-text-primary);
}

.quest-status {
  font-size: var(--text-base);
  color: var(--immersive-text-tertiary);
  font-weight: 600;
}

.quest-action {
  padding: var(--space-3) var(--space-6);
  background: var(--neon-purple);
  color: var(--immersive-text-primary);
  border: none;
  border-radius: var(--radius-xl);
  font-weight: 700;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-smooth);
}

.quest-action:hover {
  transform: translateX(4px);
  box-shadow: var(--glow-purple);
}

/* 数据百分比 */
.data-percentage {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--immersive-text-secondary);
  min-width: 80px;
  text-align: right;
}

/* 旧样式已移除，使用沉浸式主题 */

/* 旧横幅样式已移除 */

/* 旧面板样式已移除，使用沉浸式主题 */

/* 段位、收入、统计卡片样式已移至各自的组件中 */

/* 组件样式已移至各自的组件文件中 */

/* ===== 响应式 ===== */
@media (max-width: 768px) {
  .quick-stats {
    flex-direction: column;
    gap: var(--space-4);
  }
  
  .quick-stat {
    width: 100%;
  }
  
  .quest-info {
    flex-wrap: wrap;
  }
  
  .quest-action {
    width: 100%;
  }
  
  .data-item {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-3);
  }
  
  .data-progress {
    width: 100%;
  }
  
  .matrix-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .matrix-bar {
    width: 100%;
  }
}
</style>


/* ===== 响应式 ===== */
@media (max-width: 1024px) {
  .rank-main-card {
    min-width: 500px;
  }
  
  .rank-metrics {
    gap: var(--space-6);
  }
  
  .earnings-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-4);
  }
  
  .lifestyle-showcase {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .career-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .page-indicator {
    right: var(--space-4);
    padding: var(--space-2);
    gap: var(--space-2);
  }
  
  .indicator-arrow {
    width: 28px;
    height: 28px;
    font-size: var(--text-lg);
  }
  
  .indicator-dot {
    width: 8px;
    height: 8px;
  }
  
  .indicator-label {
    display: none;
  }
  
  .fullpage-section {
    padding-top: 70px;
  }
  
  .section-content {
    padding: 0 var(--space-4);
    height: calc(100vh - 140px);
  }
  
  .section-header-text {
    margin-bottom: var(--space-6);
  }
  
  .section-title {
    font-size: var(--text-3xl);
  }
  
  .section-subtitle {
    font-size: var(--text-base);
  }
  
  .rank-main-card {
    min-width: auto;
    width: 100%;
    padding: var(--space-6);
  }
  
  .rank-icon {
    font-size: 4rem;
  }
  
  .rank-name {
    font-size: var(--text-2xl);
  }
  
  .rank-metrics {
    flex-direction: column;
    gap: var(--space-4);
  }
  
  .earnings-grid {
    grid-template-columns: 1fr;
    gap: var(--space-3);
  }
  
  .rank-metric-divider {
    width: 80%;
    height: 1px;
    background: linear-gradient(to right, 
      transparent 0%, 
      rgba(255, 255, 255, 0.2) 50%, 
      transparent 100%
    );
  }
  
  .rank-metric-value {
    font-size: var(--text-2xl);
  }
  
  .rank-stat-item {
    min-width: auto;
  }
  
  .stat-value {
    font-size: var(--text-3xl);
  }
  
  .earning-value {
    font-size: var(--text-2xl);
  }
  
  .page-indicator {
    right: var(--space-4);
  }
  
  .indicator-label {
    display: none;
  }
  
  .lifestyle-showcase {
    grid-template-columns: 1fr;
    gap: var(--space-3);
  }
  
  .lifestyle-category {
    min-height: 150px;
  }
  
  .career-grid {
    grid-template-columns: 1fr;
  }
}
