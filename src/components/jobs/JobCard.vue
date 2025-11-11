<template>
  <div 
    class="job-card"
    :class="{ 'disabled': disabled }"
    @click="!disabled && $emit('click', job)"
  >
    <div class="quest-badge-corner">🎯</div>
    
    <div class="job-header">
      <div class="job-title">
        <span class="quest-icon">⚔️</span>
        {{ job.title }}
      </div>
      <GoldCoin :amount="job.salary" />
    </div>
    
    <div class="job-rank" :style="{ borderColor: rank.color, color: rank.color }">
      {{ rank.icon }} {{ rank.name }}段位
    </div>
    
    <div class="quest-rewards">
      <div class="reward-item">
        <span class="reward-icon">💰</span>
        <span>{{ job.salary.toLocaleString() }} 金币/月</span>
      </div>
      <div class="reward-item">
        <span class="reward-icon">⚡</span>
        <span>{{ job.salary * 0.2 }} 经验值</span>
      </div>
    </div>
    
    <div class="job-info">
      <span class="info-item">📚 {{ job.education }}</span>
      <span class="info-item">💼 {{ job.experience }}</span>
    </div>
    
    <div class="job-tags">
      <span v-for="tag in job.tags" :key="tag" class="tag">{{ tag }}</span>
    </div>
    
    <div class="job-requirements">
      <div class="req-count">{{ job.requirements.length }} 项技能要求</div>
    </div>
    
    <div class="job-status" v-if="isAccepted">
      <span class="status-badge">✓ 已接取</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useLifestyle } from '../../composables/useLifestyle'
import GoldCoin from '../game/GoldCoin.vue'

const props = defineProps({
  job: {
    type: Object,
    required: true
  },
  isAccepted: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])

const { getRank } = useLifestyle()
const rank = computed(() => getRank(props.job.salary))
</script>

<style scoped>
.job-card {
  background: var(--glass-bg);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  padding: 2rem;
  border-radius: var(--radius-3xl);
  border: 2px solid var(--glass-border);
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: var(--shadow-lg);
  position: relative;
  overflow: hidden;
}

.job-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.job-card:hover::before {
  opacity: 1;
}

.job-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: var(--shadow-2xl), 0 0 30px rgba(251, 191, 36, 0.2);
  border-color: rgba(251, 191, 36, 0.5);
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
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

body.dark-mode .job-card {
  background: rgba(30, 41, 59, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: var(--shadow-xl);
}

body.dark-mode .job-card:hover {
  box-shadow: var(--shadow-2xl), var(--shadow-glow);
}

.job-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.job-rank {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: var(--radius-full);
  font-size: 0.875rem;
  font-weight: 700;
  margin-bottom: 1rem;
  border: 2px solid;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  box-shadow: var(--shadow-sm);
}

body.dark-mode .job-rank {
  background: rgba(30, 41, 59, 0.5);
}

.job-title {
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

.quest-rewards {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px dashed var(--border-color);
}

.reward-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 600;
}

.reward-icon {
  font-size: 1.125rem;
}

.job-info {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.info-item {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.job-tags {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.tag {
  padding: 0.25rem 0.75rem;
  background: var(--bg-primary);
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.job-requirements {
  margin-bottom: 1.5rem;
  padding: 0.75rem;
  background: var(--bg-primary);
  border-radius: 0.75rem;
}

.req-count {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.job-status {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-gray-200);
}

body.dark-mode .job-status {
  border-top-color: var(--color-gray-700);
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: #e8f5e9;
  color: #2e7d32;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
}

body.dark-mode .status-badge {
  background: rgba(76, 175, 80, 0.2);
  color: var(--growth-primary);
}

.job-card.disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.job-card.disabled:hover {
  transform: none;
  box-shadow: var(--shadow-lg);
  border-color: var(--glass-border);
}

.job-card.disabled::before {
  display: none;
}
</style>
