<template>
  <div class="task-item" :class="{ 'task-completed': task.completed }">
    <input 
      type="checkbox" 
      :checked="task.completed"
      @change="$emit('toggle')"
      class="task-checkbox"
    />
    <span class="task-text">{{ task.text }}</span>
    <span class="task-hours">{{ task.estimatedHours }}h</span>
  </div>
</template>

<script setup>
defineProps({
  task: {
    type: Object,
    required: true
  }
})

defineEmits(['toggle'])
</script>

<style scoped>
.task-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: var(--bg-secondary);
  border-radius: 0.5rem;
  transition: background 0.15s ease;
}

.task-item:hover {
  background: var(--border-color);
}

.task-completed {
  opacity: 0.6;
}

.task-completed .task-text {
  text-decoration: line-through;
}

.task-checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.task-text {
  flex: 1;
  font-size: 0.875rem;
}

.task-hours {
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-weight: 600;
}
</style>
