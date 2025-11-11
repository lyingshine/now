<template>
  <div class="task-item" :class="{ 'task-completed': task.completed }">
    <div class="task-checkbox-wrapper">
      <input 
        type="checkbox" 
        :checked="task.completed"
        @change="handleToggle"
        class="task-checkbox"
        :id="`task-${task.id}`"
      />
      <label :for="`task-${task.id}`" class="checkbox-label">
        <span class="checkbox-icon">{{ task.completed ? '✓' : '' }}</span>
      </label>
    </div>
    <span class="task-text">{{ task.text }}</span>
    <div class="task-meta">
      <span class="task-hours">⏱️ {{ task.estimatedHours }}h</span>
      <span v-if="task.completed" class="task-reward">+{{ task.estimatedHours * 10 }} EXP</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['toggle'])

const handleToggle = () => {
  emit('toggle')
}
</script>

<style scoped>
.task-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  border: 2px solid transparent;
  transition: all 0.3s ease;
  position: relative;
}

.task-item:hover {
  background: var(--border-color);
  border-color: var(--growth-primary);
  transform: translateX(4px);
}

.task-completed {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(52, 211, 153, 0.05));
  border-color: rgba(16, 185, 129, 0.3);
}

.task-completed .task-text {
  text-decoration: line-through;
  opacity: 0.7;
}

.task-checkbox-wrapper {
  position: relative;
}

.task-checkbox {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkbox-label {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: 2px solid var(--border-color);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: var(--bg-primary);
}

.task-checkbox:checked + .checkbox-label {
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  border-color: #10b981;
  animation: checkBounce 0.4s ease;
}

@keyframes checkBounce {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

.checkbox-icon {
  color: white;
  font-weight: 700;
  font-size: 0.875rem;
}

.task-text {
  flex: 1;
  font-size: 0.875rem;
  font-weight: 500;
}

.task-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.task-hours {
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  background: var(--bg-primary);
  border-radius: var(--radius-full);
}

.task-reward {
  font-size: 0.75rem;
  color: var(--growth-primary);
  font-weight: 700;
  padding: 0.25rem 0.75rem;
  background: rgba(16, 185, 129, 0.1);
  border-radius: var(--radius-full);
  animation: rewardPop 0.5s ease;
}

@keyframes rewardPop {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
