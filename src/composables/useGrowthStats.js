import { computed } from 'vue'

export function useGrowthStats(jobsStore) {
  const consecutiveDays = computed(() => {
    // 这里可以实现真实的连续学习天数计算
    return 0
  })

  const completedProjects = computed(() => {
    return jobsStore.learningPlans.reduce((total, plan) => {
      return total + plan.skills.filter(skill => skill.status === 'completed').length
    }, 0)
  })

  const achievements = computed(() => {
    // 这里可以实现真实的成就计算
    return 0
  })

  const stats = computed(() => [
    {
      icon: '⏱️',
      value: jobsStore.totalLearningHours,
      label: '学习时长（小时）'
    },
    {
      icon: '🔥',
      value: consecutiveDays.value,
      label: '连续学习（天）'
    },
    {
      icon: '💻',
      value: completedProjects.value,
      label: '完成项目（个）'
    },
    {
      icon: '🏆',
      value: achievements.value,
      label: '获得成就（个）'
    }
  ])

  return {
    stats,
    consecutiveDays,
    completedProjects,
    achievements
  }
}
