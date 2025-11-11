import { ref } from 'vue'

export function useSkillExpansion(initialIndex = 0) {
  const expandedSkills = ref({})

  const toggleSkill = (skillIndex) => {
    expandedSkills.value[skillIndex] = !expandedSkills.value[skillIndex]
  }

  const initializeExpansion = () => {
    expandedSkills.value[initialIndex] = true
  }

  return {
    expandedSkills,
    toggleSkill,
    initializeExpansion
  }
}
