<template>
  <div class="quest-progress-card">
    <div class="card-header">
      <div class="quest-icon">🎯</div>
      <div class="quest-info">
        <h3 class="quest-title">{{ quest.jobTitle }}</h3>
        <div class="quest-salary">
          <span class="salary-icon">💰</span>
          <span class="salary-amount">¥{{ quest.salary.toLocaleString() }}</span>
          <span class="salary-label">/月</span>
        </div>
      </div>
    </div>

    <div class="progress-section">
      <LevelDisplay 
        :level="currentLevel" 
        :currentExp="currentLevelExp" 
        :maxLevel="quest.maxLevel"
        :expPerLevel="quest.maxExp"
      />
    </div>

    <div class="stats-grid">
      <div class="stat-item">
        <div class="stat-label">子任务进度</div>
        <div class="stat-value">
          {{ quest.completedSubQuests }}/{{ quest.subQuests.length }}
        </div>
        <div class="stat-bar">
          <div 
            class="stat-bar-fill" 
            :style="{ width: `${subQuestProgress}%` }"
          ></div>
        </div>
      </div>

      <div class="stat-item">
        <div class="stat-label">整体进度</div>
        <div class="stat-value">{{ quest.overallProgress }}%</div>
        <div class="stat-bar">
          <div 
            class="stat-bar-fill" 
            :style="{ width: `${quest.overallProgress}%` }"
          ></div>
        </div>
      </div>
    </div>

    <div class="time-info">
      <div class="time-item">
        <span class="time-icon">📅</span>
        <span class="time-text">开始于 {{ formatDate(quest.startDate) }}</span>
      </div>
      <div class="time-item">
        <span class="time-icon">⏱️</span>
        <span class="time-text">已用 {{ daysSpent }} 天</span>
      </div>
    </div>

    <button @click="$emit('continue')" class="continue-button">
      继续任务 →
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { calculateLevel, getCurrentLevelExp } from '../../utils/expCalculator'
import LevelDisplay from '../game/LevelDisplay.vue'

const props = defineProps({
  quest: {
    type: Object,
    required: true
  }
})

defineEmits(['continue'])

const currentLevel = computed(() => {
  return calculateLevel(props.quest.totalExp)
})

// 显示总经验值，而不是当前等级的经验值
const currentLevelExp = computed(() => {
  return props.quest.totalExp
})

const subQuestProgress = computed(() => {
  if (props.quest.subQuests.length === 0) return 0
  return Math.round((props.quest.completedSubQuests / props.quest.subQuests.length) * 100)
})

const daysSpent = computed(() => {
  if (!props.quest.startDate) return 0
  const start = new Date(props.quest.startDate)
  const now = new Date()
  const diff = now - start
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}
</script>

<style scoped>
.quest-progress-card {
  background: var(--glass-bg);
  border-radius: var(--radius-2xl);
  padding: 2rem;
  border: 2px solid var(--glass-border);
  box-shadow: var(--shadow-xl);
}

body.dark-mode .quest-progress-card {
  background: rgba(30, 41, 59, 0.7);
  border-color: rgba(255, 255, 255, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid var(--border-color);
}

.quest-icon {
  font-size: 3rem;
  flex-shrink: 0;
}

.quest-info {
  flex: 1;
}

.quest-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.quest-salary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
}

.salary-icon {
  font-size: 1.25rem;
}

.salary-amount {
  font-size: 1.25rem;
  color: var(--rank-color, var(--color-primary));
}

.salary-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.progress-section {
  margin-bottom: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-item {
  padding: 1rem;
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--rank-color, var(--color-primary));
  margin-bottom: 0.75rem;
}

.stat-bar {
  height: 8px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: var(--radius-full);
  overflow: hidden;
}

body.dark-mode .stat-bar {
  background: rgba(0, 0, 0, 0.3);
}

.stat-bar-fill {
  height: 100%;
  background: var(--rank-color, var(--color-primary));
  border-radius: var(--radius-full);
  transition: width 0.3s ease;
  position: relative;
}

.stat-bar-fill::after {
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

.time-info {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  margin-bottom: 1.5rem;
}

.time-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.time-icon {
  font-size: 1.125rem;
}

.continue-button {
  width: 100%;
  padding: 1rem 2rem;
  background: var(--rank-color, var(--color-primary));
  color: white;
  border: none;
  border-radius: var(--radius-xl);
  font-size: 1.125rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px color-mix(in srgb, var(--rank-color, var(--color-primary)) 30%, transparent);
}

.continue-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px color-mix(in srgb, var(--rank-color, var(--color-primary)) 40%, transparent);
  filter: brightness(1.1);
}

@media (max-width: 600px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .time-info {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
