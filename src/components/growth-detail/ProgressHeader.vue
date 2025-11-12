<template>
  <div class="detail-header">
    <div class="header-left">
      <button class="btn-back" @click="$emit('back')">← 返回</button>
      <button class="btn-abandon" @click="$emit('abandon')">放弃任务</button>
    </div>
    <div class="header-content">
      <h1 class="job-title">{{ plan.jobTitle }}</h1>
      <div class="job-salary">目标薪资：¥{{ plan.salary.toLocaleString() }}/月</div>
    </div>
    <div class="header-progress">
      <div class="progress-circle">
        <svg width="120" height="120">
          <circle cx="60" cy="60" r="54" fill="none" stroke="#e5e7eb" stroke-width="8"/>
          <circle 
            cx="60" cy="60" r="54" fill="none" 
            stroke="url(#gradient)" 
            stroke-width="8"
            stroke-linecap="round"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="circumference - (circumference * plan.overallProgress) / 100"
            transform="rotate(-90 60 60)"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#4caf50;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#2196f3;stop-opacity:1" />
            </linearGradient>
          </defs>
        </svg>
        <div class="progress-text">{{ plan.overallProgress }}%</div>
      </div>
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

defineEmits(['back', 'abandon'])

const circumference = 2 * Math.PI * 54
</script>

<style scoped>
.detail-header {
  background: var(--immersive-bg-secondary);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  padding: var(--space-8);
  border-radius: var(--radius-2xl);
  margin-bottom: var(--space-6);
  border: 2px solid color-mix(in srgb, var(--rank-color, var(--neon-purple)) 30%, transparent);
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: var(--space-6);
  align-items: center;
  box-shadow: 0 4px 12px color-mix(in srgb, var(--rank-color, var(--neon-purple)) 10%, transparent);
  position: relative;
  overflow: hidden;
}

.detail-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--rank-color, var(--neon-purple));
}

.btn-back {
  padding: var(--space-3) var(--space-5);
  background: var(--immersive-bg-tertiary);
  border: 1px solid var(--immersive-border);
  border-radius: var(--radius-xl);
  cursor: pointer;
  font-weight: 600;
  transition: all var(--transition-fast);
  color: var(--immersive-text-primary);
  font-size: 0.9375rem;
}

.btn-back:hover {
  background: color-mix(in srgb, var(--rank-color, var(--neon-purple)) 10%, var(--immersive-bg-tertiary));
  border-color: var(--rank-color, var(--neon-purple));
  transform: translateX(-2px);
}

body.dark-mode .btn-back {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(30, 41, 59, 0.7) 100%);
  color: var(--text-primary);
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.btn-abandon {
  padding: var(--space-2) var(--space-4);
  background: color-mix(in srgb, var(--color-error) 10%, transparent);
  color: var(--color-error);
  border: 1px solid color-mix(in srgb, var(--color-error) 30%, transparent);
  border-radius: var(--radius-xl);
  font-weight: 600;
  font-size: 0.875rem;
  transition: all var(--transition-fast);
  cursor: pointer;
}

.btn-abandon:hover {
  background: color-mix(in srgb, var(--color-error) 20%, transparent);
  border-color: var(--color-error);
  transform: translateX(-2px);
}

.header-content {
  flex: 1;
}

.job-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: var(--space-2);
  color: var(--immersive-text-primary);
}

.job-salary {
  font-size: 1.25rem;
  color: var(--rank-color, var(--neon-purple));
  font-weight: 800;
}

.progress-circle {
  position: relative;
  width: 120px;
  height: 120px;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.5rem;
  font-weight: 900;
  color: var(--rank-color, var(--neon-purple));
}

@media (max-width: 768px) {
  .detail-header {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .progress-circle {
    margin: 0 auto;
  }
}
</style>
