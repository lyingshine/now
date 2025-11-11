<template>
  <div class="earnings-display">
    <div class="earnings-label">每分钟收入</div>
    <div class="earnings-amount">¥{{ perMinute.toFixed(2) }}</div>
    <div class="time-info">今日已工作 {{ workMinutes }} 分钟</div>
  </div>
</template>

<script setup>
defineProps({
  perMinute: {
    type: Number,
    required: true
  },
  workMinutes: {
    type: Number,
    required: true
  }
})
</script>

<style scoped>
.earnings-display {
  background: white;
  border: 2px solid transparent;
  background-image: 
    linear-gradient(white, white),
    linear-gradient(135deg, var(--color-accent), var(--color-primary), var(--growth-primary));
  background-origin: border-box;
  background-clip: padding-box, border-box;
  padding: var(--space-6) var(--space-5);
  border-radius: var(--radius-2xl);
  text-align: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: var(--shadow-lg);
  margin-bottom: var(--space-4);
  position: relative;
  overflow: hidden;
}

.earnings-display:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

body.dark-mode .earnings-display {
  background-image: 
    linear-gradient(var(--color-gray-800), var(--color-gray-800)),
    linear-gradient(135deg, var(--color-accent), var(--color-primary), var(--growth-primary));
}

.earnings-label {
  font-size: 0.75rem;
  color: var(--color-gray-600);
  margin-bottom: var(--space-2);
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.earnings-amount {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: var(--space-2);
  letter-spacing: -0.05em;
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-primary) 50%, var(--growth-primary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.time-info {
  font-size: 0.875rem;
  color: var(--color-gray-600);
  font-weight: 500;
}
</style>
