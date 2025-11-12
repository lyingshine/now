<template>
  <div 
    class="job-card"
    :class="{ 'disabled': disabled }"
    :style="{ '--rank-color': rank.color }"
    @click="!disabled && $emit('click', job)"
  >
    <div class="job-header">
      <div class="job-title">
        {{ job.title }}
      </div>
      <div class="job-salary">
        💰 ¥{{ formatSalary(job.salary) }}<span class="salary-unit">/月</span>
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
      <div class="req-count">📋 {{ job.requirements.length }} 项技能要求</div>
    </div>
    
    <div class="job-status" v-if="isAccepted">
      <span class="status-badge">✓ 已接取</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useLifestyle } from '../../composables/useLifestyle'

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

// 格式化薪资显示
const formatSalary = (salary) => {
  if (salary >= 10000) {
    return (salary / 1000).toFixed(1) + 'K'
  }
  return salary.toLocaleString('zh-CN')
}
</script>

<style scoped>
.job-card {
  background: linear-gradient(135deg, 
    color-mix(in srgb, var(--rank-color, var(--color-primary)) 5%, var(--bg-secondary)) 0%,
    var(--bg-secondary) 100%
  );
  backdrop-filter: blur(var(--blur-lg)) saturate(180%);
  -webkit-backdrop-filter: blur(var(--blur-lg)) saturate(180%);
  padding: var(--space-4);
  border-radius: var(--radius-2xl);
  border: 2px solid rgba(255, 255, 255, 0.1);
  transition: all var(--duration-fast) var(--ease-smooth);
  cursor: pointer;
  box-shadow: var(--shadow-lg);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  height: 100%;
}

.job-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--rank-color, var(--neon-purple));
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.job-card:hover::before {
  opacity: 1;
}

.job-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-2xl);
  border-color: rgba(255, 255, 255, 0.3);
}

.job-header {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  padding-bottom: var(--space-2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.job-title {
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  line-height: var(--leading-tight);
}

.job-salary {
  font-size: var(--text-2xl);
  font-weight: var(--font-black);
  color: var(--rank-color, var(--color-primary));
  letter-spacing: -0.02em;
  display: flex;
  align-items: baseline;
  gap: var(--space-1);
}

.salary-unit {
  font-size: 0.875rem;
  font-weight: 600;
  opacity: 0.7;
}

.job-info {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.info-item {
  font-size: var(--text-xs);
  color: var(--text-secondary);
  line-height: var(--leading-normal);
  font-weight: var(--font-medium);
}

.job-tags {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.tag {
  padding: var(--space-1) var(--space-2);
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  line-height: var(--leading-tight);
  font-weight: var(--font-semibold);
  color: var(--color-primary);
}

.job-requirements {
  padding: var(--space-2);
  background: color-mix(in srgb, var(--rank-color, var(--neon-purple)) 5%, transparent);
  border-radius: var(--radius-lg);
  border: 1px solid color-mix(in srgb, var(--rank-color, var(--neon-purple)) 15%, transparent);
}

.req-count {
  font-size: 0.8125rem;
  color: var(--immersive-text-primary);
  font-weight: 600;
  line-height: 1.5;
}

.job-status {
  padding-top: var(--space-2);
  border-top: 1px solid color-mix(in srgb, var(--rank-color, var(--neon-purple)) 15%, transparent);
  margin-top: auto;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-2) var(--space-3);
  background: color-mix(in srgb, var(--color-success) 15%, transparent);
  color: var(--color-success);
  border-radius: var(--radius-full);
  font-size: 0.8125rem;
  font-weight: 700;
  line-height: 1.3;
  border: 1px solid color-mix(in srgb, var(--color-success) 30%, transparent);
}

.job-card.disabled {
  cursor: not-allowed;
  opacity: 0.5;
  filter: grayscale(0.3);
}

.job-card.disabled:hover {
  transform: none;
  box-shadow: 0 4px 12px color-mix(in srgb, var(--rank-color, var(--neon-purple)) 10%, transparent);
  border-color: color-mix(in srgb, var(--rank-color, var(--neon-purple)) 30%, transparent);
}

.job-card.disabled::before {
  display: none;
}
</style>
