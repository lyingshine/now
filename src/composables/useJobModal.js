import { ref } from 'vue'

export function useJobModal() {
  const selectedJob = ref(null)
  const isModalOpen = ref(false)

  const openJobModal = (job) => {
    selectedJob.value = job
    isModalOpen.value = true
  }

  const closeJobModal = () => {
    isModalOpen.value = false
    setTimeout(() => {
      selectedJob.value = null
    }, 300)
  }

  return {
    selectedJob,
    isModalOpen,
    openJobModal,
    closeJobModal
  }
}
