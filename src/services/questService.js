/**
 * Quest Service - 任务业务逻辑层
 * 封装任务相关的业务逻辑，减少组件对 store 的直接依赖
 */

import { useQuestStore } from '../stores/quest'
import { useUserStore } from '../stores/user'
import jobsData from '../data/jobs-data.js'

/**
 * 任务服务类
 */
export class QuestService {
  constructor() {
    this.questStore = useQuestStore()
    this.userStore = useUserStore()
  }

  /**
   * 获取所有可用任务
   */
  getAvailableJobs() {
    return this.questStore.availableJobs
  }

  /**
   * 检查任务是否已接取
   */
  isJobAccepted(jobId) {
    return this.questStore.isJobAccepted(jobId)
  }

  /**
   * 获取任务接取日期
   */
  getJobAcceptedDate(jobId) {
    return this.questStore.getJobAcceptedDate(jobId)
  }

  /**
   * 检查是否有活跃任务
   */
  hasActiveQuest() {
    return this.questStore.hasActiveQuest
  }

  /**
   * 获取当前任务
   */
  getCurrentQuest() {
    return this.questStore.currentQuest
  }

  /**
   * 接取任务
   */
  acceptQuest(jobId, customRewards = null) {
    const job = this.questStore.availableJobs.find(j => j.id === jobId)
    if (!job) {
      return { success: false, message: '任务不存在' }
    }

    const success = this.questStore.acceptQuest(jobId, job, customRewards)
    
    if (success) {
      return { success: true, message: '任务接取成功' }
    } else {
      return { success: false, message: '任务接取失败' }
    }
  }

  /**
   * 完成任务
   */
  completeQuest() {
    const result = this.questStore.confirmQuestCompletion()
    
    if (result.success) {
      // 获取岗位数据
      const jobData = jobsData.find(j => j.id === result.jobData.id)
      if (jobData) {
        // 更新用户职业信息
        const careerResult = this.userStore.updateCareer(jobData, new Date())
        
        // 增加经验值
        if (result.jobData.totalExp) {
          this.userStore.addExp(result.jobData.totalExp)
        }
        
        // 更新连续学习天数
        this.userStore.updateStreakDays()
        
        return {
          success: true,
          jobData,
          careerResult,
          message: '任务完成！'
        }
      }
    }
    
    return {
      success: false,
      message: result.message || '任务完成失败'
    }
  }

  /**
   * 放弃任务
   */
  abandonQuest() {
    return this.questStore.abandonQuest()
  }

  /**
   * 完成子任务
   */
  completeSubTask(subQuestId, taskId) {
    this.questStore.completeTask(subQuestId, taskId)
  }

  /**
   * 检查是否可以完成任务
   */
  canCompleteQuest() {
    return this.questStore.canCompleteQuest()
  }

  /**
   * 获取任务统计
   */
  getQuestStats() {
    return this.questStore.getQuestStats()
  }

  /**
   * 获取任务历史
   */
  getQuestHistory() {
    return this.questStore.getQuestHistory()
  }

  /**
   * 初始化（加载数据）
   */
  initialize() {
    this.questStore.loadFromStorage()
    this.questStore.loadJobs(jobsData)
  }
}

/**
 * 创建单例实例
 */
let questServiceInstance = null

export function useQuestService() {
  if (!questServiceInstance) {
    questServiceInstance = new QuestService()
  }
  return questServiceInstance
}

/**
 * 重置服务实例（用于测试）
 */
export function resetQuestService() {
  questServiceInstance = null
}
