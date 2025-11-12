<template>
  <div 
    class="skill-card"
    :class="{ 'skill-completed': skill.status === 'completed' }"
  >
    <div class="quest-badge-corner">
      <span v-if="skill.status === 'completed'">✅</span>
      <span v-else-if="skill.status === 'in_progress'">⚡</span>
      <span v-else>🎯</span>
    </div>
    
    <div class="skill-header" @click="$emit('toggle')">
      <div class="skill-info">
        <div class="skill-status" :class="`status-${skill.status}`">
          <span v-if="skill.status === 'completed'" class="status-icon">✓</span>
          <span v-else-if="skill.status === 'in_progress'" class="status-icon">⏳</span>
          <span v-else class="status-icon">🎯</span>
        </div>
        <div>
          <h3 class="skill-name">
            <span class="quest-icon">⚔️</span>
            {{ skill.skillName }}
          </h3>
          <div v-if="skill.expReward" class="skill-exp-reward">
            <span class="exp-icon">⚡</span>
            <span class="exp-text">完成后获得 {{ skill.expReward }} EXP</span>
          </div>
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
  border: 2px solid var(--glass-border);
  transition: all 0.3s ease;
  box-shadow: var(--shadow-md);
  position: relative;
  overflow: hidden;
}

.skill-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.2), transparent);
  transition: left 0.5s ease;
}

.skill-card:hover::before {
  left: 100%;
}

.skill-card:hover {
  box-shadow: var(--shadow-xl), 0 0 30px rgba(16, 185, 129, 0.2);
  transform: translateX(4px);
  border-color: rgba(16, 185, 129, 0.5);
}

.quest-badge-corner {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.5rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
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
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--bg-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  border: 2px solid var(--border-color);
  transition: all 0.3s ease;
}

.status-completed {
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  border-color: #10b981;
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.4);
}

.status-in_progress {
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
  border-color: #3b82f6;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
  }
}

.skill-name {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.quest-icon {
  font-size: 1.25rem;
}

.skill-exp-reward {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: var(--growth-primary);
  font-weight: 600;
}

.exp-icon {
  font-size: 1rem;
}

.exp-text {
  opacity: 0.9;
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
