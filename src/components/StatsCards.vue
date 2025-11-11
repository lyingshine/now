<template>
  <div class="stats">
    <div class="stat-card">
      <div class="stat-label">今日已赚</div>
      <div class="stat-value">¥{{ formatMoney(todayEarnings) }}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">本月已赚</div>
      <div class="stat-value">¥{{ formatMoney(monthEarnings) }}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">今年已赚</div>
      <div class="stat-value">¥{{ formatMoney(yearEarnings) }}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">入职以来</div>
      <div class="stat-value">¥{{ formatMoney(totalEarnings) }}</div>
    </div>
  </div>
</template>

<script setup>
import { useFormatters } from '../composables/useFormatters'

const { formatMoney } = useFormatters()

defineProps({
  todayEarnings: {
    type: Number,
    required: true
  },
  monthEarnings: {
    type: Number,
    required: true
  },
  yearEarnings: {
    type: Number,
    required: true
  },
  totalEarnings: {
    type: Number,
    required: true
  }
})
</script>

<style scoped>
.stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.stat-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%);
  backdrop-filter: blur(10px);
  padding: var(--space-4) var(--space-3);
  border-radius: var(--radius-xl);
  text-align: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-md);
  position: relative;
  overflow: visible;
  min-height: 90px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

body.dark-mode .stat-card {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(30, 41, 59, 0.7) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: var(--shadow-lg);
}

.stat-label {
  font-size: 0.6875rem;
  color: var(--color-gray-600);
  margin-bottom: var(--space-2);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.025em;
  word-break: break-all;
  line-height: 1.3;
}

body.dark-mode .stat-value {
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-primary-light) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
