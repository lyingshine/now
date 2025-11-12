<template>
  <div class="level-display" :class="{ 'compact': compact }">
    <div class="level-badge">
      <div class="level-icon">⭐</div>
      <div class="level-info">
        <div class="level-number">Lv.{{ level }}</div>
        <div class="level-max">/ {{ maxLevel }}</div>
      </div>
    </div>
    
    <div class="exp-section">
      <div class="exp-bar-container">
        <div 
          class="exp-bar-fill" 
          :style="{ width: `${expProgress}%` }"
        >
          <div class="exp-bar-shine"></div>
        </div>
      </div>
      <div class="exp-text">
        {{ currentExp }} / {{ expPerLevel }} EXP
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  level: {
    type: Number,
    required: true,
    default: 1
  },
  currentExp: {
    type: Number,
    required: true,
    default: 0
  },
  maxLevel: {
    type: Number,
    default: 100
  },
  expPerLevel: {
    type: Number,
    default: 100
  },
  compact: {
    type: Boolean,
    default: false
  }
})

const expProgress = computed(() => {
  // 如果当前经验值大于等于最大经验值，显示100%
  if (props.currentExp >= props.expPerLevel) return 100
  // 否则按比例计算进度
  return Math.round((props.currentExp / props.expPerLevel) * 100)
})
</script>

<style scoped>
.level-display {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4) var(--space-6);
  background: var(--glass-bg-strong);
  backdrop-filter: blur(var(--blur-lg));
  border-radius: var(--radius-2xl);
  border: 2px solid var(--glass-border);
  box-shadow: var(--shadow-lg);
  transition: all var(--duration-normal) var(--ease-smooth);
}

.level-display:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-xl);
}

.level-display.compact {
  padding: var(--space-3) var(--space-4);
  gap: var(--space-3);
}

.dark .level-display,
body.dark-mode .level-display {
  background: rgba(30, 41, 59, 0.8);
  border-color: rgba(255, 255, 255, 0.15);
}

.level-badge {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-5);
  background: linear-gradient(135deg, var(--color-warning) 0%, #d97706 100%);
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-warning);
  flex-shrink: 0;
  transition: all var(--duration-fast) var(--ease-smooth);
}

.level-badge:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(251, 191, 36, 0.4);
}

.level-display.compact .level-badge {
  padding: var(--space-2) var(--space-4);
  gap: var(--space-2);
}

.level-icon {
  font-size: var(--text-2xl);
  line-height: 1;
  animation: pulse 2s ease-in-out infinite;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.level-display.compact .level-icon {
  font-size: var(--text-xl);
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.level-info {
  display: flex;
  align-items: baseline;
  gap: var(--space-1);
  color: #78350f;
  font-weight: var(--font-bold);
}

.level-number {
  font-size: var(--text-2xl);
  line-height: var(--leading-none);
  letter-spacing: -0.02em;
}

.level-display.compact .level-number {
  font-size: var(--text-xl);
}

.level-max {
  font-size: var(--text-sm);
  opacity: 0.7;
  font-weight: var(--font-semibold);
}

.exp-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  min-width: 0;
}

.exp-bar-container {
  height: 24px;
  background: var(--bg-tertiary);
  border-radius: var(--radius-full);
  overflow: hidden;
  position: relative;
  box-shadow: var(--shadow-inner);
}

.level-display.compact .exp-bar-container {
  height: 20px;
}

.dark .exp-bar-container,
body.dark-mode .exp-bar-container {
  background: rgba(0, 0, 0, 0.3);
}

.exp-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--rank-color, var(--color-primary)) 0%, rgba(102, 126, 234, 0.8) 100%);
  border-radius: var(--radius-full);
  transition: width 0.8s var(--ease-out-quint);
  position: relative;
  box-shadow: 0 0 8px rgba(102, 126, 234, 0.4);
}

.exp-bar-fill::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.3), transparent);
  border-radius: var(--radius-full) var(--radius-full) 0 0;
}

.exp-bar-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.exp-text {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  font-weight: var(--font-semibold);
  text-align: center;
  font-variant-numeric: tabular-nums;
}

.level-display.compact .exp-text {
  font-size: var(--text-xs);
}

/* 满级特效 */
.level-display:has(.level-number:contains("100")) .level-badge {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #dc2626 100%);
  animation: rainbow 3s ease-in-out infinite;
}

@keyframes rainbow {
  0%, 100% {
    filter: hue-rotate(0deg);
  }
  50% {
    filter: hue-rotate(30deg);
  }
}
</style>
