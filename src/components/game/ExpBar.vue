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
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.level {
  color: var(--rank-color, var(--color-primary));
  font-size: 1rem;
  font-weight: 700;
}

.exp-text {
  color: var(--text-secondary);
}

.exp-progress {
  height: 12px;
  background: var(--bg-primary);
  border-radius: var(--radius-full);
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
}

.exp-fill {
  height: 100%;
  background: var(--rank-color, var(--color-primary));
  border-radius: var(--radius-full);
  transition: width 0.5s ease;
  position: relative;
}

.exp-fill::after {
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
  position: relative;
  overflow: hidden;
}

.exp-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  animation: shine 2s infinite;
}

@keyframes shine {
  0% {
    left: -100%;
  }
  100% {
    left: 200%;
  }
}

body.dark-mode .exp-progress {
  background: rgba(30, 41, 59, 0.5);
}
</style>
