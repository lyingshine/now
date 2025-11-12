/**
 * useQuest Composable
 * 封装任务相关的 UI 逻辑和状态管理
 */

import { ref, computed } from 'vue'
import { useQuestService } from '../services/questService'
import { checkAchievements } from '../utils/achievements'

export function useQuest() {
  const questService = useQuestService()
  
  // 状态
  const showCompletionModal = ref(false)
  const showAbandonModal = ref(false)
  const showLevelUpModal = ref(false)
  const levelUpData = ref({
    newLevel: 1,
    expGained: 0,
    milestone: null
  })

  // 计算属性
  const currentQuest = computed(() => questService.getCurrentQuest())
  const hasActiveQuest = computed(() => questService.hasActiveQuest())
  const canComplete = computed(() => {
    const result = questService.canCompleteQuest()
    return result.canComplete
  })
  const currentAchievements = computed(() => {
    if (!currentQuest.value) return []
    return checkAchievements(currentQuest.value, questService.getQuestHistory())
  })

  // 方法
  const acceptQuest = (jobId, customRewards = null) => {
    return questService.acceptQuest(jobId, customRewards)
  }

  const completeQuest = () => {
    const result = questService.completeQuest()
    return result
  }

  const abandonQuest = () => {
    return questService.abandonQuest()
  }

  const completeTask = (subQuestId, taskId) => {
    questService.completeSubTask(subQuestId, taskId)
  }

  const openCompletionModal = () => {
    showCompletionModal.value = true
  }

  const closeCompletionModal = () => {
    showCompletionModal.value = false
  }

  const openAbandonModal = () => {
    showAbandonModal.value = true
  }

  const closeAbandonModal = () => {
    showAbandonModal.value = false
  }

  const showLevelUp = (data) => {
    levelUpData.value = data
    showLevelUpModal.value = true
  }

  const closeLevelUp = () => {
    showLevelUpModal.value = false
  }

  return {
    // 状态
    currentQuest,
    hasActiveQuest,
    canComplete,
    currentAchievements,
    showCompletionModal,
    showAbandonModal,
    showLevelUpModal,
    levelUpData,
    
    // 方法
    acceptQuest,
    completeQuest,
    abandonQuest,
    completeTask,
    openCompletionModal,
    closeCompletionModal,
    openAbandonModal,
    closeAbandonModal,
    showLevelUp,
    closeLevelUp
  }
}
