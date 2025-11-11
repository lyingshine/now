<template>
  <div class="jobs-grid">
    <JobCard
      v-for="job in jobs"
      :key="job.id"
      :job="job"
      :isAccepted="isJobAccepted(job.id)"
      @click="$emit('job-click', job)"
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
</style>
