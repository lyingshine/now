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
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: var(--glass-bg);
  border-radius: var(--radius-2xl);
  border: 2px solid var(--glass-border);
  box-shadow: var(--shadow-lg);
}

.level-display.compact {
  padding: 0.75rem 1rem;
  gap: 0.75rem;
}

body.dark-mode .level-display {
  background: rgba(30, 41, 59, 0.7);
  border-color: rgba(255, 255, 255, 0.1);
}

.level-badge {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.25rem;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  border-radius: var(--radius-full);
  box-shadow: 0 4px 12px rgba(251, 191, 36, 0.3);
  flex-shrink: 0;
}

.level-display.compact .level-badge {
  padding: 0.5rem 1rem;
  gap: 0.5rem;
}

.level-icon {
  font-size: 1.5rem;
  animation: pulse 2s ease-in-out infinite;
}

.level-display.compact .level-icon {
  font-size: 1.25rem;
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
  gap: 0.25rem;
  color: #78350f;
  font-weight: 700;
}

.level-number {
  font-size: 1.5rem;
  line-height: 1;
}

.level-display.compact .level-number {
  font-size: 1.25rem;
}

.level-max {
  font-size: 0.875rem;
  opacity: 0.7;
}

.exp-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.exp-bar-container {
  height: 24px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: var(--radius-full);
  overflow: hidden;
  position: relative;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.level-display.compact .exp-bar-container {
  height: 20px;
}

body.dark-mode .exp-bar-container {
  background: rgba(0, 0, 0, 0.3);
}

.exp-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981 0%, #34d399 100%);
  border-radius: var(--radius-full);
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.exp-bar-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 100%
  );
  animation: shine 2s ease-in-out infinite;
}

@keyframes shine {
  0% {
    left: -100%;
  }
  50%, 100% {
    left: 200%;
  }
}

.exp-text {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 600;
  text-align: center;
}

.level-display.compact .exp-text {
  font-size: 0.75rem;
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
