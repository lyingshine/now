<template>
  <div class="quest-badge" :class="[`difficulty-${difficulty}`, { 'completed': completed }]">
    <div class="badge-icon">{{ icon }}</div>
    <div class="badge-content">
      <div class="badge-title">{{ title }}</div>
      <div class="badge-reward">
        <span class="reward-item">💰 {{ reward }}</span>
        <span class="reward-item">⚡ {{ exp }} EXP</span>
      </div>
    </div>
    <div v-if="completed" class="badge-check">✓</div>
  </div>
</template>

<script setup>
defineProps({
  icon: {
    type: String,
    default: '📋'
  },
  title: {
    type: String,
    required: true
  },
  reward: {
    type: [String, Number],
    required: true
  },
  exp: {
    type: Number,
    default: 100
  },
  difficulty: {
    type: String,
    default: 'normal', // easy, normal, hard, epic, legendary
    validator: (value) => ['easy', 'normal', 'hard', 'epic', 'legendary'].includes(value)
  },
  completed: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.quest-badge {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: var(--glass-bg);
  border-radius: var(--radius-xl);
  border: 2px solid;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.quest-badge::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.quest-badge:hover::before {
  left: 100%;
}

.difficulty-easy {
  border-color: #10b981;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(52, 211, 153, 0.05));
}

.difficulty-normal {
  border-color: #3b82f6;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(96, 165, 250, 0.05));
}

.difficulty-hard {
  border-color: #a855f7;
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(192, 132, 252, 0.05));
}

.difficulty-epic {
  border-color: #f59e0b;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(251, 191, 36, 0.05));
}

.difficulty-legendary {
  border-color: #ef4444;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(248, 113, 113, 0.05));
  animation: legendaryGlow 2s ease-in-out infinite;
}

@keyframes legendaryGlow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(239, 68, 68, 0.3);
  }
  50% {
    box-shadow: 0 0 30px rgba(239, 68, 68, 0.6);
  }
}

.quest-badge.completed {
  opacity: 0.7;
  filter: grayscale(0.3);
}

.badge-icon {
  font-size: 2rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.badge-content {
  flex: 1;
}

.badge-title {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.badge-reward {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.reward-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.badge-check {
  width: 32px;
  height: 32px;
  background: #10b981;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 700;
}
</style>
