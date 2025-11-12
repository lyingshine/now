<template>
  <div class="career" :style="{ '--rank-color': rankColor }">
    <div class="unified-container">
      <div class="section-header-text">
        <h1 class="unified-title">🗺️ 冒险生涯</h1>
        <p class="unified-subtitle">记录你的职业冒险历程</p>
      </div>

      <!-- 时间线容器 -->
      <div class="timeline-wrapper">
        <!-- 左侧滚动按钮 -->
        <button 
          v-if="canScrollLeft" 
          class="scroll-button left"
          @click="scrollLeft"
          aria-label="向左滚动"
        >
          <span class="arrow">←</span>
        </button>

        <!-- 时间线 -->
        <div class="timeline" ref="timelineRef" @scroll="updateScrollButtons">
        <!-- 初始职业 -->
        <div class="timeline-item initial">
          <div class="timeline-dot">🎯</div>
          <div class="timeline-content">
            <div class="timeline-card">
              <div class="card-header">
                <h3>起点：初始职业</h3>
                <span class="date">{{ formatDate(userStore.userInfo.createdAt) }}</span>
              </div>
              <div class="card-body">
                <div class="job-info">
                  <div class="job-title">{{ initialJob }}</div>
                  <div class="job-salary">月薪：¥{{ formatNumber(initialSalary) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 当前冒险（如果有活跃任务） -->
        <div v-if="questStore.hasActiveQuest" class="timeline-item active">
          <div class="timeline-dot pulsing">⚡</div>
          <div class="timeline-content">
            <div class="timeline-card active-card">
              <div class="card-header">
                <h3>🎮 当前冒险</h3>
                <span class="status-badge active">进行中</span>
              </div>
              <div class="card-body">
                <!-- 冒险准备期 -->
                <div class="adventure-phase">
                  <div class="phase-header">
                    <span class="phase-icon">📋</span>
                    <span class="phase-title">冒险准备期</span>
                  </div>
                  <div class="phase-content">
                    <div class="phase-info">
                      <span class="info-label">接取任务</span>
                      <span class="info-value">{{ formatDate(questStore.currentQuest.startDate) }}</span>
                    </div>
                    <div class="phase-info">
                      <span class="info-label">目标职位</span>
                      <span class="info-value">{{ questStore.currentQuest.jobTitle }}</span>
                    </div>
                    <div class="phase-info">
                      <span class="info-label">目标薪资</span>
                      <span class="info-value">¥{{ formatNumber(questStore.currentQuest.salary) }}</span>
                    </div>
                  </div>
                </div>

                <!-- 冒险期 -->
                <div class="adventure-phase">
                  <div class="phase-header">
                    <span class="phase-icon">⚔️</span>
                    <span class="phase-title">冒险期（学习中）</span>
                  </div>
                  <div class="phase-content">
                    <div class="progress-info">
                      <div class="progress-label">
                        <span>学习进度</span>
                        <span class="progress-value">{{ questStore.overallProgress }}%</span>
                      </div>
                      <div class="progress-bar">
                        <div class="progress-fill" :style="{ width: questStore.overallProgress + '%' }"></div>
                      </div>
                    </div>
                    <div class="phase-info">
                      <span class="info-label">当前等级</span>
                      <span class="info-value">Lv.{{ questStore.currentLevel }} / 100</span>
                    </div>
                    <div class="phase-info">
                      <span class="info-label">已完成</span>
                      <span class="info-value">{{ questStore.completedSubQuestsCount }} / {{ questStore.currentQuest.subQuests.length }} 个技能</span>
                    </div>
                    <div class="phase-info">
                      <span class="info-label">已学习</span>
                      <span class="info-value">{{ daysSpent }} 天</span>
                    </div>
                  </div>
                </div>

                <!-- 试用期（预计） -->
                <div class="adventure-phase future">
                  <div class="phase-header">
                    <span class="phase-icon">🎯</span>
                    <span class="phase-title">试用期（预计）</span>
                  </div>
                  <div class="phase-content">
                    <div class="phase-info">
                      <span class="info-label">入职时间</span>
                      <span class="info-value">完成学习后</span>
                    </div>
                    <div class="phase-info">
                      <span class="info-label">试用期长</span>
                      <span class="info-value">3-6 个月</span>
                    </div>
                    <div class="phase-info">
                      <span class="info-label">转正后</span>
                      <span class="info-value">冒险结束</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 历史冒险 -->
        <div 
          v-for="(history, index) in questHistory" 
          :key="index"
          class="timeline-item completed"
        >
          <div class="timeline-dot">✅</div>
          <div class="timeline-content">
            <div class="timeline-card">
              <div class="card-header">
                <h3>🏆 冒险 #{{ questHistory.length - index }}</h3>
                <span class="status-badge completed">已完成</span>
              </div>
              <div class="card-body">
                <!-- 冒险准备期 -->
                <div class="adventure-phase completed">
                  <div class="phase-header">
                    <span class="phase-icon">📋</span>
                    <span class="phase-title">冒险准备期</span>
                  </div>
                  <div class="phase-content">
                    <div class="phase-info">
                      <span class="info-label">接取任务</span>
                      <span class="info-value">{{ formatDate(history.quest.startDate) }}</span>
                    </div>
                    <div class="phase-info">
                      <span class="info-label">目标职位</span>
                      <span class="info-value">{{ history.quest.jobTitle }}</span>
                    </div>
                  </div>
                </div>

                <!-- 冒险期 -->
                <div class="adventure-phase completed">
                  <div class="phase-header">
                    <span class="phase-icon">⚔️</span>
                    <span class="phase-title">冒险期（已完成）</span>
                  </div>
                  <div class="phase-content">
                    <div class="phase-info">
                      <span class="info-label">学习时长</span>
                      <span class="info-value">{{ calculateDuration(history.quest.startDate, history.quest.completedDate) }}</span>
                    </div>
                    <div class="phase-info">
                      <span class="info-label">最终等级</span>
                      <span class="info-value">Lv.{{ history.quest.currentLevel }}</span>
                    </div>
                    <div class="phase-info">
                      <span class="info-label">完成技能</span>
                      <span class="info-value">{{ history.quest.completedSubQuests }} 个</span>
                    </div>
                  </div>
                </div>

                <!-- 试用期 -->
                <div class="adventure-phase completed">
                  <div class="phase-header">
                    <span class="phase-icon">🎯</span>
                    <span class="phase-title">试用期</span>
                  </div>
                  <div class="phase-content">
                    <div class="phase-info">
                      <span class="info-label">入职时间</span>
                      <span class="info-value">{{ formatDate(history.quest.completedDate) }}</span>
                    </div>
                    <div class="phase-info">
                      <span class="info-label">转正薪资</span>
                      <span class="info-value">¥{{ formatNumber(history.quest.salary) }}</span>
                    </div>
                    <div class="phase-info">
                      <span class="info-label">状态</span>
                      <span class="info-value success">✓ 已转正</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="!questStore.hasActiveQuest && questHistory.length === 0" class="timeline-item empty">
          <div class="timeline-dot">📋</div>
          <div class="timeline-content">
            <div class="empty-state">
              <div class="empty-icon">🗺️</div>
              <h3>开始你的冒险</h3>
              <p>前往任务大厅接取第一个职业任务，开启你的冒险生涯！</p>
              <button @click="goToJobs" class="btn-start">
                前往任务大厅 →
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧滚动按钮 -->
      <button 
        v-if="canScrollRight" 
        class="scroll-button right"
        @click="scrollRight"
        aria-label="向右滚动"
      >
        <span class="arrow">→</span>
      </button>
      </div>

      <!-- 统计卡片 -->
      <div class="stats-section">
        <h2 class="section-title">📊 冒险统计</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">🎯</div>
            <div class="stat-content">
              <div class="stat-label">总冒险次数</div>
              <div class="stat-value">{{ totalAdventures }}</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">✅</div>
            <div class="stat-content">
              <div class="stat-label">完成冒险</div>
              <div class="stat-value">{{ completedAdventures }}</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">💰</div>
            <div class="stat-content">
              <div class="stat-label">当前薪资</div>
              <div class="stat-value">¥{{ formatNumber(userStore.userInfo.currentSalary) }}</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📈</div>
            <div class="stat-content">
              <div class="stat-label">薪资增长</div>
              <div class="stat-value">{{ salaryGrowth }}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuestStore } from '../stores/quest'
import { useUserStore } from '../stores/user'
import { useLifestyle } from '../composables/useLifestyle'

const router = useRouter()
const questStore = useQuestStore()
const userStore = useUserStore()
const { getRankInfo } = useLifestyle()

// 计算段位颜色
const rankColor = computed(() => {
  const salary = userStore.userInfo.currentSalary || 10000
  const rankInfo = getRankInfo(salary)
  return rankInfo.current.color
})

// 初始职业
const initialJob = computed(() => {
  if (userStore.careerHistory.length > 0) {
    return userStore.careerHistory[0].title
  }
  return userStore.userInfo.currentJob?.title || '待业中'
})

const initialSalary = computed(() => {
  if (userStore.careerHistory.length > 0) {
    return userStore.careerHistory[0].salary
  }
  return 10000
})

// 任务历史（只显示已完成的）
const questHistory = computed(() => {
  return questStore.questHistory.filter(h => h.completionType === 'completed').reverse()
})

// 当前冒险已用天数
const daysSpent = computed(() => {
  if (!questStore.currentQuest) return 0
  const start = new Date(questStore.currentQuest.startDate)
  const now = new Date()
  return Math.ceil((now - start) / (1000 * 60 * 60 * 24))
})

// 统计数据
const totalAdventures = computed(() => {
  return questHistory.value.length + (questStore.hasActiveQuest ? 1 : 0)
})

const completedAdventures = computed(() => {
  return questHistory.value.length
})

const salaryGrowth = computed(() => {
  if (initialSalary.value === 0) return 0
  const current = userStore.userInfo.currentSalary
  return Math.round(((current - initialSalary.value) / initialSalary.value) * 100)
})

// 方法
const formatDate = (dateString) => {
  if (!dateString) return '未知'
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

const formatNumber = (num) => {
  return num ? num.toLocaleString('zh-CN') : '0'
}

const calculateDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return '未知'
  const start = new Date(startDate)
  const end = new Date(endDate)
  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
  if (days < 30) return `${days} 天`
  const months = Math.floor(days / 30)
  const remainingDays = days % 30
  return remainingDays > 0 ? `${months} 个月 ${remainingDays} 天` : `${months} 个月`
}

const goToJobs = () => {
  router.push('/jobs')
}

// 滚动控制
import { ref as vueRef, onMounted, onUnmounted } from 'vue'

const timelineRef = vueRef(null)
const canScrollLeft = vueRef(false)
const canScrollRight = vueRef(false)

const updateScrollButtons = () => {
  if (!timelineRef.value) return
  
  const element = timelineRef.value
  canScrollLeft.value = element.scrollLeft > 0
  canScrollRight.value = element.scrollLeft < (element.scrollWidth - element.clientWidth - 10)
}

const scrollLeft = () => {
  if (!timelineRef.value) return
  timelineRef.value.scrollBy({
    left: -400,
    behavior: 'smooth'
  })
}

const scrollRight = () => {
  if (!timelineRef.value) return
  timelineRef.value.scrollBy({
    left: 400,
    behavior: 'smooth'
  })
}

onMounted(() => {
  // 初始化滚动按钮状态
  setTimeout(() => {
    updateScrollButtons()
  }, 100)
  
  // 监听窗口大小变化
  window.addEventListener('resize', updateScrollButtons)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateScrollButtons)
})
</script>

<style scoped>
.career {
  min-height: 100vh;
  background: var(--immersive-bg-primary);
  padding: 100px var(--space-8) var(--space-8);
  position: relative;
}

.career::before {
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
}

.section-header-text {
  margin-bottom: var(--space-12);
}

/* 时间线容器 */
.timeline-wrapper {
  position: relative;
  margin-bottom: 3rem;
}

/* 滚动按钮 */
.scroll-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 60px;
  height: 60px;
  background: var(--rank-color, var(--neon-purple));
  border: none;
  border-radius: var(--radius-full);
  color: white;
  font-size: 2rem;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 4px 12px color-mix(in srgb, var(--rank-color, #667eea) 40%, transparent);
  transition: all var(--duration-normal) var(--ease-smooth);
  display: flex;
  align-items: center;
  justify-content: center;
}

.scroll-button:hover {
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 6px 16px color-mix(in srgb, var(--rank-color, #667eea) 60%, transparent);
}

.scroll-button:active {
  transform: translateY(-50%) scale(0.95);
}

.scroll-button.left {
  left: -30px;
}

.scroll-button.right {
  right: -30px;
}

.scroll-button .arrow {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1;
}

/* 时间线 - 横版 */
.timeline {
  position: relative;
  padding: 4rem 2rem;
  overflow-x: auto;
  overflow-y: visible;
  display: flex;
  gap: 3rem;
  padding-bottom: 2rem;
}

/* 隐藏滚动条 */
.timeline::-webkit-scrollbar {
  display: none;
}

.timeline {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 90px;
  height: 4px;
  background: var(--rank-color, var(--neon-purple));
  border-radius: 2px;
  box-shadow: 0 2px 8px color-mix(in srgb, var(--rank-color, #667eea) 30%, transparent);
}

.timeline-item {
  position: relative;
  flex-shrink: 0;
  width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.timeline-dot {
  position: relative;
  width: 60px;
  height: 60px;
  background: var(--immersive-bg-secondary);
  border: 4px solid var(--rank-color, var(--neon-purple));
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  z-index: 2;
  box-shadow: 0 4px 12px color-mix(in srgb, var(--rank-color, #667eea) 30%, transparent);
  margin-bottom: 2rem;
}

.timeline-dot.pulsing {
  animation: pulse 2s ease-in-out infinite;
  border-color: #f59e0b;
  box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7);
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7);
  }
  50% {
    box-shadow: 0 0 0 20px rgba(245, 158, 11, 0);
  }
}

.timeline-content {
  width: 100%;
}

.timeline-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: var(--radius-2xl);
  padding: var(--space-8);
  border: 2px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  transition: all var(--duration-normal) var(--ease-smooth);
  min-height: 500px;
  display: flex;
  flex-direction: column;
}

.timeline-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.25);
}

.active-card {
  border-color: var(--rank-color, #f59e0b);
  box-shadow: 0 0 30px color-mix(in srgb, var(--rank-color, #f59e0b) 30%, transparent);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-6);
  padding-bottom: var(--space-4);
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
}

.card-header h3 {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--immersive-text-primary);
}

.card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.status-badge {
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: 700;
}

.status-badge.active {
  background: var(--rank-color, linear-gradient(135deg, #f59e0b, #fbbf24));
  color: white;
  animation: badgePulse 2s ease-in-out infinite;
}

@keyframes badgePulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.status-badge.completed {
  background: var(--color-success);
  color: white;
}

/* 冒险阶段 */
.adventure-phase {
  margin-bottom: var(--space-6);
  padding: var(--space-6);
  background: rgba(255, 255, 255, 0.03);
  border-radius: var(--radius-xl);
  border-left: 4px solid var(--rank-color, #6366f1);
}

.adventure-phase.completed {
  border-left-color: var(--color-success);
  opacity: 0.9;
}

.adventure-phase.future {
  border-left-color: var(--immersive-text-tertiary);
  opacity: 0.7;
}

.phase-header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}

.phase-icon {
  font-size: var(--text-2xl);
}

.phase-title {
  font-size: var(--text-base);
  font-weight: 700;
  color: var(--immersive-text-primary);
}

.phase-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.phase-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-2) 0;
}

.info-label {
  font-size: var(--text-sm);
  color: var(--immersive-text-secondary);
}

.info-value {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--immersive-text-primary);
}

.info-value.success {
  color: var(--color-success);
}

.progress-info {
  margin-bottom: 0.5rem;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.progress-value {
  font-weight: 700;
  color: var(--growth-primary);
}

.progress-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--rank-color, var(--color-success));
  border-radius: var(--radius-full);
  transition: width 1s ease-out;
}

.job-info {
  padding: var(--space-4);
  background: rgba(255, 255, 255, 0.03);
  border-radius: var(--radius-lg);
}

.job-title {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--rank-color, var(--neon-purple));
  margin-bottom: var(--space-2);
}

.job-salary {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--color-success);
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 3rem 2rem;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

.btn-start {
  padding: var(--space-4) var(--space-8);
  background: var(--rank-color, var(--neon-purple));
  color: white;
  border: none;
  border-radius: var(--radius-xl);
  font-size: var(--text-base);
  font-weight: 700;
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-smooth);
  box-shadow: 0 4px 12px color-mix(in srgb, var(--rank-color, #667eea) 40%, transparent);
}

.btn-start:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px color-mix(in srgb, var(--rank-color, #667eea) 50%, transparent);
}

/* 统计区域 */
.stats-section {
  margin-top: 4rem;
}

.section-title {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--immersive-text-primary);
  margin-bottom: var(--space-8);
  text-align: center;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-6);
}

.stat-card {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-6);
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: var(--radius-xl);
  border: 2px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all var(--duration-normal) var(--ease-smooth);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 255, 255, 0.25);
}

.stat-icon {
  font-size: var(--text-4xl);
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: var(--text-sm);
  color: var(--immersive-text-secondary);
  margin-bottom: var(--space-1);
}

.stat-value {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--immersive-text-primary);
}

/* 响应式 */
@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .timeline-item {
    width: 350px;
  }
  
  .scroll-button {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
  }
  
  .scroll-button.left {
    left: -25px;
  }
  
  .scroll-button.right {
    right: -25px;
  }
}

@media (max-width: 768px) {
  .career {
    padding: 80px var(--space-4) var(--space-4);
  }
  
  .timeline-item {
    width: 300px;
  }

  .timeline-dot {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .timeline {
    padding: 2rem 1rem;
  }
  
  .scroll-button {
    width: 44px;
    height: 44px;
    font-size: 1.25rem;
  }
  
  .scroll-button.left {
    left: 10px;
  }
  
  .scroll-button.right {
    right: 10px;
  }
}
</style>
