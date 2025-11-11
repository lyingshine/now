<template>
  <div class="detail-header">
    <button class="btn-back" @click="$emit('back')">← 返回</button>
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

defineEmits(['back'])

const circumference = 2 * Math.PI * 54
</script>

<style scoped>
.detail-header {
  background: var(--glass-bg);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  padding: 2.5rem;
  border-radius: var(--radius-3xl);
  margin-bottom: 2rem;
  border: 1px solid var(--glass-border);
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 2rem;
  align-items: center;
  box-shadow: var(--shadow-xl);
  position: relative;
  overflow: hidden;
}

.detail-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--growth-primary), var(--growth-secondary), var(--color-accent));
}

body.dark-mode .detail-header {
  background: rgba(30, 41, 59, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-back {
  padding: 1rem 1.75rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%);
  backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-xl);
  cursor: pointer;
  font-weight: 700;
  transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
  box-shadow: var(--shadow-md);
  color: var(--text-primary);
}

.btn-back:hover {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
  color: white;
  transform: translateX(-2px);
  box-shadow: var(--shadow-lg);
}

body.dark-mode .btn-back {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(30, 41, 59, 0.7) 100%);
  color: var(--text-primary);
}

.header-content {
  flex: 1;
}

.job-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.job-salary {
  font-size: 1.5rem;
  background: linear-gradient(135deg, var(--growth-primary) 0%, var(--color-accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
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
  font-weight: 700;
  color: var(--growth-primary);
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
