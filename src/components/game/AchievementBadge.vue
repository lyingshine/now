<template>
  <div class="achievement-badge" :class="{ 'unlocked': unlocked }">
    <div class="badge-glow"></div>
    <div class="badge-icon">{{ icon }}</div>
    <div class="badge-info">
      <div class="badge-name">{{ name }}</div>
      <div class="badge-desc">{{ description }}</div>
      <div v-if="unlocked" class="badge-date">{{ unlockDate }}</div>
    </div>
    <div v-if="unlocked" class="unlock-check">✓</div>
    <div v-else class="lock-icon">🔒</div>
  </div>
</template>

<script setup>
defineProps({
  icon: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  unlocked: {
    type: Boolean,
    default: false
  },
  unlockDate: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.achievement-badge {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: var(--glass-bg);
  border-radius: var(--radius-xl);
  border: 2px solid var(--border-color);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.achievement-badge:not(.unlocked) {
  opacity: 0.5;
  filter: grayscale(1);
}

.achievement-badge.unlocked {
  border-color: #fbbf24;
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(245, 158, 11, 0.05));
  animation: achievementUnlock 0.6s ease;
}

@keyframes achievementUnlock {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.badge-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, rgba(251, 191, 36, 0.3), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.achievement-badge.unlocked:hover .badge-glow {
  opacity: 1;
}

.badge-icon {
  font-size: 2.5rem;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

.badge-info {
  flex: 1;
}

.badge-name {
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: 0.25rem;
  color: var(--text-primary);
}

.achievement-badge.unlocked .badge-name {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.badge-desc {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.badge-date {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
}

.unlock-check {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(251, 191, 36, 0.4);
}

.lock-icon {
  font-size: 1.5rem;
  opacity: 0.5;
}
</style>
