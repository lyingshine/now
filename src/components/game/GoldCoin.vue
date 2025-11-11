<template>
  <span class="gold-coin" :class="{ 'animate': animate }">
    <span class="coin-icon">💰</span>
    <span class="coin-amount">{{ formatAmount(amount) }}</span>
  </span>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  amount: {
    type: Number,
    required: true
  }
})

const animate = ref(false)

const formatAmount = (num) => {
  return num.toLocaleString()
}

watch(() => props.amount, () => {
  animate.value = true
  setTimeout(() => {
    animate.value = false
  }, 600)
})
</script>

<style scoped>
.gold-coin {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  border-radius: var(--radius-full);
  font-weight: 700;
  color: #78350f;
  box-shadow: 0 4px 12px rgba(251, 191, 36, 0.4);
  transition: all 0.3s ease;
}

.gold-coin.animate {
  animation: coinBounce 0.6s ease;
}

@keyframes coinBounce {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2) rotate(10deg);
  }
}

.coin-icon {
  font-size: 1.25rem;
  animation: coinSpin 2s linear infinite;
}

@keyframes coinSpin {
  0%, 100% {
    transform: rotateY(0deg);
  }
  50% {
    transform: rotateY(180deg);
  }
}

.coin-amount {
  font-size: 1.125rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

body.dark-mode .gold-coin {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  box-shadow: 0 4px 12px rgba(251, 191, 36, 0.3);
}
</style>
