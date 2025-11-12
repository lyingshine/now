<template>
  <div class="exp-bar">
    <div class="exp-label">
      <span class="level">⚡ Lv.{{ level }}</span>
      <span class="exp-text">{{ currentExp }} / {{ maxExp }} EXP</span>
    </div>
    <div class="exp-progress">
      <div class="exp-fill" :style="{ width: progress + '%' }">
        <div class="exp-shine"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  level: {
    type: Number,
    default: 1
  },
  currentExp: {
    type: Number,
    default: 0
  },
  maxExp: {
    type: Number,
    default: 1000
  }
})

const progress = computed(() => {
  return Math.min((props.currentExp / props.maxExp) * 100, 100)
})
</script>

<style scoped>
.exp-bar {
  width: 100%;
}

.exp-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-2);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
}

.level {
  color: var(--rank-color, var(--color-primary));
  font-size: var(--text-base);
  font-weight: var(--font-bold);
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.exp-text {
  color: var(--text-secondary);
  font-variant-numeric: tabular-nums;
}

.exp-progress {
  height: 12px;
  background: var(--bg-tertiary);
  border-radius: var(--radius-full);
  overflow: hidden;
  box-shadow: var(--shadow-inner);
  position: relative;
}

.exp-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--rank-color, var(--color-primary)) 0%, rgba(102, 126, 234, 0.8) 100%);
  border-radius: var(--radius-full);
  transition: width 0.6s var(--ease-out-expo);
  position: relative;
  box-shadow: 0 0 8px rgba(102, 126, 234, 0.4);
}

.exp-fill::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.3), transparent);
  border-radius: var(--radius-full) var(--radius-full) 0 0;
}

.exp-fill::after {
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

.dark .exp-progress,
body.dark-mode .exp-progress {
  background: rgba(30, 41, 59, 0.5);
}
</style>
