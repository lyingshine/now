<template>
  <div 
    class="job-card"
    @click="$emit('click', job)"
  >
    <div class="job-header">
      <div class="job-title">{{ job.title }}</div>
      <div class="job-salary">¥{{ job.salary.toLocaleString() }}/月</div>
    </div>
    
    <div class="job-rank" :style="{ borderColor: rank.color, color: rank.color }">
      {{ rank.icon }} {{ rank.name }}段位
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

const props = defineProps({
  job: {
    type: Object,
    required: true
  },
  isAccepted: {
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
  border: 1px solid var(--glass-border);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  box-shadow: var(--shadow-lg);
  position: relative;
  overflow: hidden;
}

.job-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-xl);
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
}

.job-salary {
  font-size: 1.5rem;
  background: linear-gradient(135deg, var(--growth-primary) 0%, var(--color-accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
  letter-spacing: -0.025em;
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
</style>
