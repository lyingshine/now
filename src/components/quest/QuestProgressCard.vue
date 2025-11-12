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
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  border-radius: var(--radius-3xl);
  padding: var(--space-8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 
    0 16px 48px rgba(0, 0, 0, 0.2),
    0 0 0 1px rgba(255, 255, 255, 0.05) inset;
  position: relative;
  overflow: hidden;
  transition: all var(--duration-normal) var(--ease-hover);
  will-change: transform;
}

.quest-progress-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg,
    transparent 0%,
    var(--rank-color, var(--color-primary)) 50%,
    transparent 100%
  );
  box-shadow: 0 0 20px var(--rank-color, var(--color-primary));
}

.quest-progress-card:hover {
  transform: translateY(-3px);
  box-shadow: 
    0 24px 64px rgba(0, 0, 0, 0.3),
    0 0 40px color-mix(in srgb, var(--rank-color, var(--color-primary)) 20%, transparent),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset;
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
  padding: var(--space-4);
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border-radius: var(--radius-xl);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all var(--duration-normal) var(--ease-default);
}

.stat-item:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
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
  padding: var(--space-4) var(--space-8);
  background: linear-gradient(135deg,
    var(--rank-color, var(--color-primary)) 0%,
    color-mix(in srgb, var(--rank-color, var(--color-primary)) 80%, black) 100%
  );
  color: white;
  border: none;
  border-radius: var(--radius-xl);
  font-size: var(--text-lg);
  font-weight: 700;
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-hover);
  box-shadow: 
    0 8px 24px color-mix(in srgb, var(--rank-color, var(--color-primary)) 40%, transparent),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  position: relative;
  overflow: hidden;
}

.continue-button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s ease, height 0.6s ease;
}

.continue-button:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 12px 32px color-mix(in srgb, var(--rank-color, var(--color-primary)) 50%, transparent),
    0 0 30px color-mix(in srgb, var(--rank-color, var(--color-primary)) 30%, transparent),
    0 0 0 1px rgba(255, 255, 255, 0.2) inset;
  background: linear-gradient(135deg,
    color-mix(in srgb, var(--rank-color, var(--color-primary)) 110%, white) 0%,
    var(--rank-color, var(--color-primary)) 100%
  );
}

.continue-button:hover::before {
  width: 300px;
  height: 300px;
}

.continue-button:active {
  transform: translateY(-1px) scale(1.01);
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
