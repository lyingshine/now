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
  background: var(--bg-primary);
  border: 2px solid transparent;
  background-image: 
    linear-gradient(var(--bg-primary), var(--bg-primary)),
    linear-gradient(135deg, var(--color-accent), var(--color-primary), var(--color-success));
  background-origin: border-box;
  background-clip: padding-box, border-box;
  padding: var(--space-6) var(--space-5);
  border-radius: var(--radius-2xl);
  text-align: center;
  transition: all var(--duration-normal) var(--ease-smooth);
  box-shadow: var(--shadow-lg);
  margin-bottom: var(--space-4);
  position: relative;
  overflow: hidden;
}

.earnings-display::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.5) 50%, transparent 100%);
  opacity: 0.5;
}

.earnings-display:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-2xl);
}

.dark .earnings-display,
body.dark-mode .earnings-display {
  background-image: 
    linear-gradient(var(--bg-secondary), var(--bg-secondary)),
    linear-gradient(135deg, var(--color-accent), var(--color-primary), var(--color-success));
}

.earnings-label {
  font-size: var(--text-xs);
  color: var(--text-secondary);
  margin-bottom: var(--space-2);
  font-weight: var(--font-medium);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.earnings-amount {
  font-size: var(--text-5xl);
  font-weight: var(--font-extrabold);
  margin-bottom: var(--space-2);
  letter-spacing: -0.03em;
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-primary) 50%, var(--color-success) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  font-variant-numeric: tabular-nums;
}

.time-info {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  font-weight: var(--font-medium);
}
</style>
