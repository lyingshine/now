<template>
  <div class="upgrade-tips">
    <div class="section-title">🚀 升级建议</div>
    <div class="upgrade-tips-content">
      <div v-for="(tip, index) in tips" :key="index" class="upgrade-tip">
        <div class="upgrade-tip-title">{{ tip.title }}</div>
        <div class="upgrade-tip-content">{{ tip.content }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  tips: {
    type: Array,
    required: true
  }
})
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
  margin-top: 20px;
}

body.dark-mode .section-title {
  color: var(--color-gray-300);
  border-bottom-color: var(--color-gray-700);
}

.upgrade-tips-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.upgrade-tip {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%);
  backdrop-filter: blur(10px);
  padding: var(--space-4);
  border-radius: var(--radius-xl);
  border: 1px solid var(--glass-border);
  border-left: 4px solid var(--color-primary);
  box-shadow: var(--shadow-md);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
  overflow: hidden;
}

.upgrade-tip:hover {
  box-shadow: var(--shadow-lg);
  transform: translateX(4px);
}

body.dark-mode .upgrade-tip {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%);
  border-color: rgba(255, 255, 255, 0.1);
}

.upgrade-tip-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 6px;
}

.upgrade-tip-content {
  font-size: 0.8125rem;
  color: var(--color-gray-600);
  line-height: 1.6;
}

body.dark-mode .upgrade-tip-title {
  color: var(--color-accent);
}

body.dark-mode .upgrade-tip-content {
  color: var(--color-gray-400);
}
</style>
