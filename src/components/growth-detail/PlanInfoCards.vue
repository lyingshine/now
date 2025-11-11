<template>
  <div class="plan-info">
    <div class="info-card">
      <div class="info-label">开始日期</div>
      <div class="info-value">{{ plan.startDate }}</div>
    </div>
    <div class="info-card">
      <div class="info-label">预计完成</div>
      <div class="info-value">{{ plan.estimatedEndDate }}</div>
    </div>
    <div class="info-card">
      <div class="info-label">预计周数</div>
      <div class="info-value">{{ plan.estimatedWeeks }} 周</div>
    </div>
    <div class="info-card">
      <div class="info-label">每周学习</div>
      <div class="info-value">{{ plan.weeklyHours }} 小时</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  plan: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.plan-info {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.info-card {
  background: var(--glass-bg);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  padding: 1.75rem;
  border-radius: var(--radius-2xl);
  border: 1px solid var(--glass-border);
  text-align: center;
  box-shadow: var(--shadow-md);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.info-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

body.dark-mode .info-card {
  background: rgba(30, 41, 59, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.info-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.info-value {
  font-size: 1.125rem;
  font-weight: 700;
}

@media (max-width: 768px) {
  .plan-info {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
