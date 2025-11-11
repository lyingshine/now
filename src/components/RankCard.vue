<template>
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
</template>

<script setup>
defineProps({
  rankInfo: {
    type: Object,
    required: true
  },
  lifestyleLevel: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.rank-display {
  text-align: center;
  margin-bottom: var(--space-4);
  padding: var(--space-5) var(--space-4);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%);
  backdrop-filter: blur(10px);
  border-radius: var(--radius-2xl);
  border: 2px solid;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: var(--shadow-lg);
  position: relative;
  overflow: hidden;
}

.rank-display:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

body.dark-mode .rank-display {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(30, 41, 59, 0.7) 100%);
  box-shadow: var(--shadow-xl);
}

.rank-icon {
  font-size: 40px;
  margin-bottom: 8px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

.rank-name {
  font-size: 1.375rem;
  font-weight: 700;
  margin-bottom: 6px;
  letter-spacing: 0.05em;
}

.rank-desc {
  font-size: 0.875rem;
  color: var(--color-gray-600);
  margin-bottom: 6px;
}

.rank-percentage {
  font-size: 0.8125rem;
  color: var(--color-gray-500);
  font-weight: 500;
}

.rank-lifestyle {
  font-size: 0.8125rem;
  color: var(--color-gray-500);
  margin-top: 6px;
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
</style>
