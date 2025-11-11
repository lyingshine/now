<template>
  <div class="step-card">
    <h4 class="step-title">{{ step.title }}</h4>
    <p class="step-description">{{ step.description }}</p>
    
    <div class="tasks-list">
      <TaskItem
        v-for="(task, taskIndex) in step.tasks"
        :key="task.id"
        :task="task"
        @toggle="$emit('toggle-task', taskIndex)"
      />
    </div>

    <ResourcesList :resources="step.resources" />
  </div>
</template>

<script setup>
import TaskItem from './TaskItem.vue'
import ResourcesList from './ResourcesList.vue'

defineProps({
  step: {
    type: Object,
    required: true
  }
})

defineEmits(['toggle-task'])
</script>

<style scoped>
.step-card {
  background: var(--bg-primary);
  padding: 1.5rem;
  border-radius: 0.75rem;
  transition: box-shadow 0.2s ease;
}

.step-card:hover {
  box-shadow: var(--shadow-sm);
}

.step-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.step-description {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}
</style>
