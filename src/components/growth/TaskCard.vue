<template>
  <div class="task-card">
    <div class="quest-badge-corner">⚔️</div>
    <div class="task-header">
      <h3 class="task-title">
        <span class="quest-icon">📜</span>
        {{ plan.jobTitle }}
      </h3>
      <GoldCoin :amount="plan.salary" />
    </div>
    
    <div class="task-progress">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: plan.overallProgress + '%' }"></div>
      </div>
      <div class="progress-text">{{ plan.overallProgress }}%</div>
    </div>
    
    <div class="task-info">
      <div class="info-item">
        <span class="info-label">开始日期：</span>
        <span class="info-value">{{ plan.startDate }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">预计完成：</span>
        <span class="info-value">{{ plan.estimatedEndDate }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">技能数量：</span>
        <span class="info-value">{{ plan.skills.length }} 项</span>
      </div>
    </div>
    
    <div class="task-actions">
      <button class="btn-primary" @click="$emit('continue', plan.jobId)">
        继续学习
      </button>
      <button class="btn-abandon" @click="$emit('abandon', plan.jobId)">
        放弃任务
      </button>
    </div>
  </div>
</template>

<script setup>
import GoldCoin from '../game/GoldCoin.vue'

defineProps({
  plan: {
    type: Object,
    required: true
  }
})

defineEmits(['continue', 'abandon'])
</script>

<style scoped>
.task-card {
  background: var(--glass-bg);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  padding: 2.5rem;
  border-radius: var(--radius-3xl);
  border: 2px solid var(--glass-border);
  transition: all 0.3s ease;
  box-shadow: var(--shadow-lg);
  position: relative;
  overflow: hidden;
}

.task-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.task-card:hover::before {
  opacity: 1;
}

.task-card:hover {
  transform: translateY(-6px) scale(1.01);
  box-shadow: var(--shadow-2xl), 0 0 30px rgba(16, 185, 129, 0.2);
  border-color: rgba(16, 185, 129, 0.5);
}

.quest-badge-corner {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.5rem;
  opacity: 0.6;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-10px) rotate(10deg);
  }
}

body.dark-mode .task-card {
  background: rgba(30, 41, 59, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.task-title {
  font-size: 1.25rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.quest-icon {
  font-size: 1.5rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.task-salary {
  font-size: 1.5rem;
  background: linear-gradient(135deg, var(--growth-primary) 0%, var(--color-accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
  letter-spacing: -0.025em;
}

.task-progress {
  margin-bottom: 1.5rem;
}

.progress-bar {
  height: 8px;
  background: var(--bg-primary);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--growth-primary), var(--growth-secondary), var(--color-accent));
  transition: width 0.3s ease;
  box-shadow: 0 0 10px rgba(16, 185, 129, 0.3);
}

.progress-text {
  text-align: right;
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 600;
}

.task-info {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.info-value {
  font-size: 0.875rem;
  font-weight: 600;
}

.task-actions {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
}

.btn-primary {
  padding: 1.25rem 2.5rem;
  background: linear-gradient(135deg, var(--growth-primary) 0%, var(--growth-secondary) 100%);
  color: white;
  border-radius: var(--radius-xl);
  font-weight: 700;
  font-size: 1.125rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: var(--shadow-lg);
  border: none;
  cursor: pointer;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-xl);
}

.btn-abandon {
  padding: 1.25rem 1.5rem;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: var(--radius-xl);
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s ease;
  cursor: pointer;
}

.btn-abandon:hover {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.2) 100%);
  border-color: rgba(239, 68, 68, 0.5);
  transform: translateY(-2px);
}

body.dark-mode .btn-abandon {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.15) 100%);
  color: #fca5a5;
  border-color: rgba(239, 68, 68, 0.4);
}

body.dark-mode .btn-abandon:hover {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.25) 0%, rgba(220, 38, 38, 0.25) 100%);
  border-color: rgba(239, 68, 68, 0.6);
}

@media (max-width: 768px) {
  .task-info {
    grid-template-columns: 1fr;
  }
}
</style>
