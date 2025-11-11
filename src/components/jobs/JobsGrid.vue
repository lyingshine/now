<template>
  <div class="jobs-grid" :class="{ 'disabled': disabled }">
    <JobCard
      v-for="job in jobs"
      :key="job.id"
      :job="job"
      :isAccepted="isJobAccepted(job.id)"
      :disabled="disabled"
      @click="!disabled && $emit('job-click', job)"
    />
  </div>
</template>

<script setup>
import JobCard from './JobCard.vue'

defineProps({
  jobs: {
    type: Array,
    required: true
  },
  isJobAccepted: {
    type: Function,
    required: true
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

defineEmits(['job-click'])
</script>

<style scoped>
.jobs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.jobs-grid.disabled {
  opacity: 0.5;
  pointer-events: none;
  filter: grayscale(0.5);
}
</style>
