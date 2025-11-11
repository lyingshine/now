<template>
  <div class="quest-reward">
    <div class="reward-header">
      <span class="reward-icon">🎁</span>
      <span class="reward-title">任务奖励</span>
    </div>
    <div class="reward-list">
      <div class="reward-item">
        <span class="item-icon">💰</span>
        <span class="item-label">金币</span>
        <span class="item-value">+{{ gold }}</span>
      </div>
      <div class="reward-item">
        <span class="item-icon">⚡</span>
        <span class="item-label">经验值</span>
        <span class="item-value">+{{ exp }}</span>
      </div>
      <div v-if="items.length > 0" class="reward-item">
        <span class="item-icon">🎯</span>
        <span class="item-label">道具</span>
        <span class="item-value">{{ items.join(', ') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  gold: {
    type: Number,
    required: true
  },
  exp: {
    type: Number,
    required: true
  },
  items: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
.quest-reward {
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(245, 158, 11, 0.05));
  border: 2px solid rgba(251, 191, 36, 0.3);
  border-radius: var(--radius-xl);
  padding: 1.5rem;
  margin-top: 1rem;
}

.reward-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
  font-size: 1.125rem;
  color: #fbbf24;
}

.reward-icon {
  font-size: 1.5rem;
  animation: rewardPulse 2s ease-in-out infinite;
}

@keyframes rewardPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

.reward-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.reward-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  transition: all 0.2s ease;
}

.reward-item:hover {
  transform: translateX(4px);
  background: var(--bg-secondary);
}

.item-icon {
  font-size: 1.25rem;
}

.item-label {
  flex: 1;
  font-weight: 600;
  color: var(--text-secondary);
}

.item-value {
  font-weight: 700;
  color: var(--growth-primary);
  font-size: 1.125rem;
}
</style>
