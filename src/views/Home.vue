<template>
  <div class="home">
    <div class="main-wrapper">
      <!-- 游戏化顶部栏 -->
      <div class="game-header">
        <div class="player-info">
          <div class="player-avatar">🎮</div>
          <div class="player-details">
            <div class="player-name">职场冒险者</div>
            <LevelDisplay 
              :level="playerLevel" 
              :currentExp="currentExp" 
              :maxLevel="100"
              :expPerLevel="maxExp"
              compact
            />
          </div>
        </div>
        <div class="player-stats">
          <div class="stat-item">
            <span class="stat-icon">⚔️</span>
            <span class="stat-label">已完成任务</span>
            <span class="stat-value">{{ completedQuests }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-icon">🏆</span>
            <span class="stat-label">成就</span>
            <span class="stat-value">{{ achievements }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-icon">🔥</span>
            <span class="stat-label">连续天数</span>
            <span class="stat-value">{{ streakDays }}</span>
          </div>
        </div>
      </div>
      
      <!-- 当前任务快捷入口 -->
      <div v-if="questStore.hasActiveQuest" class="current-quest-banner">
        <div class="quest-banner-content">
          <div class="quest-banner-icon">🎯</div>
          <div class="quest-banner-info">
            <div class="quest-banner-title">当前任务：{{ questStore.currentQuest.jobTitle }}</div>
            <div class="quest-banner-progress">
              进度：{{ questStore.overallProgress }}% | 
              已完成 {{ questStore.completedSubQuestsCount }}/{{ questStore.currentQuest.subQuests.length }} 个子任务
            </div>
          </div>
          <button @click="router.push('/growth')" class="btn-continue-quest">
            继续任务 →
          </button>
        </div>
      </div>
      
      <div v-else class="no-quest-banner">
        <div class="no-quest-content">
          <div class="no-quest-icon">📋</div>
          <div class="no-quest-text">
            <div class="no-quest-title">还没有进行中的任务</div>
            <div class="no-quest-subtitle">开始你的职业冒险，接取第一个任务吧！</div>
          </div>
          <button @click="router.push('/jobs')" class="btn-start-quest">
            前往任务大厅 →
          </button>
        </div>
      </div>
      
      <div class="container">
        <!-- 左侧面板：段位和收入 -->
        <div class="left-panel">
          <RankCard :rankInfo="rankInfo" :lifestyleLevel="lifestyleLevel" />
          <EarningsCard :perMinute="perMinute" :workMinutes="workMinutes" />
          <StatsCards 
            :todayEarnings="todayEarnings"
            :monthEarnings="monthEarnings"
            :yearEarnings="yearEarnings"
            :totalEarnings="totalEarnings"
          />
        </div>

        <!-- 中间面板：生活水平 -->
        <div class="middle-panel">
          <div class="section-title">🏠 生活水平</div>
          <LifestyleSection :categories="lifestyleCategories" />
        </div>

        <!-- 右侧面板：岗位推荐和升级建议 -->
        <div class="right-panel">
          <JobRecommendations :jobs="recommendedJobs" @jobClick="goToJobs" />
          <UpgradeTips :tips="upgradeTips" />
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
import { useEarnings } from '../composables/useEarnings'
import { useQuestStore } from '../stores/quest'
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
const { calculateLifestyle, getRankInfo, getRank } = useLifestyle()

// 游戏化数据 - 从 questStore 获取
const playerLevel = computed(() => {
  const level = questStore.currentLevel || 1
  console.log('当前等级:', level)
  return level
})

const currentExp = computed(() => {
  if (!questStore.currentQuest) {
    console.log('没有活跃任务，经验值为 0')
    return 0
  }
  const exp = getCurrentLevelExp(questStore.currentQuest.totalExp)
  console.log('当前等级经验值:', exp, '总经验值:', questStore.currentQuest.totalExp)
  return exp
})

const maxExp = computed(() => 100)
const completedQuests = computed(() => {
  return questStore.questHistory.filter(h => h.completionType === 'completed').length
})
const achievements = ref(0)
const streakDays = ref(0)

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

// 这些函数已移至 composables，不再需要

const goToJobs = () => {
  router.push('/jobs')
}

// 生命周期
onMounted(() => {
  loadData()
  calculateEarnings()
  questStore.loadFromStorage()
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

.game-header {
  background: var(--glass-bg);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-radius: var(--radius-3xl);
  padding: 1.5rem 2rem;
  margin-bottom: 16px;
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-xl);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

body.dark-mode .game-header {
  background: rgba(30, 41, 59, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.player-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  max-width: 500px;
}

.player-avatar {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
  animation: avatarPulse 2s ease-in-out infinite;
}

@keyframes avatarPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.player-details {
  flex: 1;
}

.player-name {
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.player-stats {
  display: flex;
  gap: 2rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.stat-icon {
  font-size: 1.5rem;
}

.stat-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--growth-primary);
}

/* 当前任务横幅 */
.current-quest-banner {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(52, 211, 153, 0.1));
  border: 2px solid rgba(16, 185, 129, 0.3);
  border-radius: var(--radius-2xl);
  padding: 1.5rem 2rem;
  margin-bottom: 16px;
  animation: slideDown 0.3s ease-out;
}

body.dark-mode .current-quest-banner {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(52, 211, 153, 0.15));
  border-color: rgba(16, 185, 129, 0.4);
}

.quest-banner-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.quest-banner-icon {
  font-size: 2.5rem;
  flex-shrink: 0;
}

.quest-banner-info {
  flex: 1;
}

.quest-banner-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.quest-banner-progress {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.btn-continue-quest {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  color: white;
  border: none;
  border-radius: var(--radius-xl);
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
  white-space: nowrap;
}

.btn-continue-quest:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

/* 无任务横幅 */
.no-quest-banner {
  background: var(--glass-bg);
  border: 2px dashed var(--border-color);
  border-radius: var(--radius-2xl);
  padding: 1.5rem 2rem;
  margin-bottom: 16px;
}

body.dark-mode .no-quest-banner {
  background: rgba(30, 41, 59, 0.5);
  border-color: rgba(255, 255, 255, 0.2);
}

.no-quest-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.no-quest-icon {
  font-size: 2.5rem;
  opacity: 0.6;
  flex-shrink: 0;
}

.no-quest-text {
  flex: 1;
}

.no-quest-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.no-quest-subtitle {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.btn-start-quest {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border: none;
  border-radius: var(--radius-xl);
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
  white-space: nowrap;
}

.btn-start-quest:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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

/* 段位、收入、统计卡片样式已移至各自的组件中 */

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

/* 生活水平样式已移至 LifestyleSection.vue 组件中 */

/* 岗位推荐和升级建议样式已移至各自的组件中 */

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
