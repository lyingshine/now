<template>
  <div class="tasks-section">
    <h2 class="section-title">📋 我的任务 ({{ plans.length }})</h2>
    <div class="tasks-grid">
      <TaskCard
        v-for="plan in plans"
        :key="plan.jobId"
        :plan="plan"
        @continue="$emit('continue', $event)"
        @abandon="$emit('abandon', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import TaskCard from './TaskCard.vue'

defineProps({
  plans: {
    type: Array,
    required: true
  }
})

defineEmits(['continue', 'abandon'])
</script>

<style scoped>
.tasks-section {
  margin-top: 3rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.tasks-grid {
  display: grid;
  gap: 1.5rem;
}
</style>
