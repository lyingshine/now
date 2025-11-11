<template>
  <div 
    class="skill-card"
    :class="{ 'skill-completed': skill.status === 'completed' }"
  >
    <div class="skill-header" @click="$emit('toggle')">
      <div class="skill-info">
        <div class="skill-status">
          <span v-if="skill.status === 'completed'" class="status-icon">✓</span>
          <span v-else-if="skill.status === 'in_progress'" class="status-icon">⏳</span>
          <span v-else class="status-icon">○</span>
        </div>
        <div>
          <h3 class="skill-name">{{ skill.skillName }}</h3>
          <div class="skill-reward">+{{ skill.reward }}元</div>
        </div>
      </div>
      <div class="skill-progress-info">
        <div class="progress-percent">{{ skill.progress }}%</div>
        <div class="expand-icon">{{ isExpanded ? '▼' : '▶' }}</div>
      </div>
    </div>

    <div class="skill-progress-bar">
      <div class="progress-fill" :style="{ width: skill.progress + '%' }"></div>
    </div>

    <div v-if="isExpanded" class="steps-list">
      <StepCard
        v-for="(step, stepIndex) in skill.steps"
        :key="stepIndex"
        :step="step"
        @toggle-task="(taskIndex) => $emit('toggle-task', stepIndex, taskIndex)"
      />
    </div>
  </div>
</template>

<script setup>
import StepCard from './StepCard.vue'

defineProps({
  skill: {
    type: Object,
    required: true
  },
  isExpanded: {
    type: Boolean,
    default: false
  }
})

defineEmits(['toggle', 'toggle-task'])
</script>

<style scoped>
.skill-card {
  background: var(--glass-bg);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  padding: 2rem;
  border-radius: var(--radius-2xl);
  border: 1px solid var(--glass-border);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: var(--shadow-md);
  position: relative;
  overflow: hidden;
}

.skill-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateX(2px);
}

body.dark-mode .skill-card {
  background: rgba(30, 41, 59, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.skill-completed {
  opacity: 0.7;
}

.skill-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  margin-bottom: 0.75rem;
}

.skill-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.skill-status {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--bg-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.skill-name {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.skill-reward {
  font-size: 0.875rem;
  color: var(--growth-primary);
  font-weight: 600;
}

.skill-progress-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.progress-percent {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--growth-primary);
}

.expand-icon {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.skill-progress-bar {
  height: 6px;
  background: var(--bg-primary);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--growth-primary), var(--growth-secondary));
  transition: width 0.3s ease;
}

.steps-list {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
</style>
