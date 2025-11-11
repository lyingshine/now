<template>
  <div class="job-recommendations">
    <div class="section-title">💼 岗位推荐</div>
    <div class="job-recommend-content">
      <div 
        v-for="job in jobs" 
        :key="job.id" 
        class="job-recommend"
        @click="$emit('jobClick')"
      >
        <div class="job-recommend-title">{{ job.title }}</div>
        <div class="job-recommend-salary">¥{{ job.salary.toLocaleString() }}/月</div>
        <div class="job-recommend-reason">{{ job.reason }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  jobs: {
    type: Array,
    required: true
  }
})

defineEmits(['jobClick'])
</script>

<style scoped>
.section-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-gray-700);
  margin-bottom: var(--space-3);
  padding-bottom: var(--space-2);
  border-bottom: 2px solid var(--color-gray-200);
  display: flex;
  align-items: center;
  gap: var(--space-2);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

body.dark-mode .section-title {
  color: var(--color-gray-300);
  border-bottom-color: var(--color-gray-700);
}

.job-recommend-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.job-recommend {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(245, 158, 11, 0.1) 100%);
  backdrop-filter: blur(10px);
  padding: var(--space-4);
  border-radius: var(--radius-xl);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-md);
  position: relative;
  overflow: hidden;
}

.job-recommend:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

body.dark-mode .job-recommend {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(245, 158, 11, 0.15) 100%);
  border-color: rgba(255, 255, 255, 0.1);
}

.job-recommend-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 6px;
}

.job-recommend-salary {
  font-size: 1.75rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-primary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 6px;
  letter-spacing: -0.025em;
}

.job-recommend-reason {
  font-size: 0.8125rem;
  color: var(--color-gray-600);
}

body.dark-mode .job-recommend-title {
  color: var(--color-accent);
}

body.dark-mode .job-recommend-reason {
  color: var(--color-gray-400);
}
</style>
