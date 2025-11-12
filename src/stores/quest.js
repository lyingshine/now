/**
 * 职业任务系统 Store
 * 管理用户的职业任务、等级系统和进度
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  calculateExpDistribution,
  calculateLevel,
  getLevelProgress,
  getExpForNextLevel,
  calculateExpGain,
  getLevelMilestone,
  calculateOverallProgress,
  validateExpDistribution
} from '../utils/expCalculator.js'
import {
  QUEST_STATUS,
  SUBTASK_STATUS,
  DIFFICULTY_LEVEL,
  LEARNING_STEP_TYPE,
  LEVEL_SYSTEM
} from '../types/quest.js'

export const useQuestStore = defineStore('quest', () => {
  // ==================== 状态 ====================
  
  /** @type {import('vue').Ref<import('../types/quest.js').Quest|null>} */
  const currentQuest = ref(null)
  
  /** @type {import('vue').Ref<import('../types/quest.js').QuestHistory[]>} */
  const questHistory = ref([])
  
  /** @type {import('vue').Ref<Array>} */
  const availableJobs = ref([])
  
  /** @type {import('vue').Ref<{expGained: number, levelsGained: number}>} */
  const lastExpGain = ref({ expGained: 0, levelsGained: 0 })

  // ==================== 计算属性 ====================
  
  /**
   * 是否有活跃的任务
   */
  const hasActiveQuest = computed(() => {
    return currentQuest.value !== null && 
           currentQuest.value !== undefined &&
           currentQuest.value.status === QUEST_STATUS.IN_PROGRESS
  })

  /**
   * 当前等级
   */
  const currentLevel = computed(() => {
    if (!currentQuest.value) return LEVEL_SYSTEM.MIN_LEVEL
    return calculateLevel(currentQuest.value.totalExp)
  })

  /**
   * 当前等级进度百分比
   */
  const currentLevelProgress = computed(() => {
    if (!currentQuest.value) return 0
    return getLevelProgress(currentQuest.value.totalExp)
  })

  /**
   * 升到下一级所需经验
   */
  const expToNextLevel = computed(() => {
    if (!currentQuest.value) return LEVEL_SYSTEM.EXP_PER_LEVEL
    return getExpForNextLevel(currentQuest.value.totalExp)
  })

  /**
   * 整体完成进度
   */
  const overallProgress = computed(() => {
    if (!currentQuest.value) return 0
    return calculateOverallProgress(currentQuest.value.totalExp)
  })

  /**
   * 已完成的子任务数量
   */
  const completedSubQuestsCount = computed(() => {
    if (!currentQuest.value) return 0
    return currentQuest.value.subQuests.filter(
      sq => sq.status === SUBTASK_STATUS.COMPLETED
    ).length
  })

  /**
   * 活跃的子任务
   */
  const activeSubQuests = computed(() => {
    if (!currentQuest.value) return []
    return currentQuest.value.subQuests.filter(
      sq => sq.status === SUBTASK_STATUS.ACTIVE
    )
  })

  // ==================== 方法 ====================

  /**
   * 加载职位数据
   * @param {Array} jobs - 职位列表
   */
  function loadJobs(jobs) {
    availableJobs.value = jobs
  }

  /**
   * 检查是否可以接取新任务
   * @returns {{canAccept: boolean, message: string}}
   */
  function canAcceptNewQuest() {
    if (hasActiveQuest.value) {
      return {
        canAccept: false,
        message: '你已经有一个进行中的职业任务！请先完成或放弃当前任务。'
      }
    }
    return {
      canAccept: true,
      message: ''
    }
  }

  /**
   * 接取新任务
   * @param {number} jobId - 职位ID
   * @param {Object} job - 职位信息
   * @param {Object} customRewards - 自定义奖励设置
   * @returns {boolean} 是否成功接取
   */
  function acceptQuest(jobId, job, customRewards = null) {
    // 检查是否可以接取
    const { canAccept, message } = canAcceptNewQuest()
    if (!canAccept) {
      console.error(message)
      return false
    }

    // 生成子任务
    const subQuests = generateSubQuests(job)

    // 创建新任务
    const quest = {
      id: Date.now(),
      jobId,
      jobTitle: job.title,
      salary: job.salary,
      status: QUEST_STATUS.IN_PROGRESS,
      
      startDate: new Date().toISOString(),
      completedDate: null,
      abandonedDate: null,
      estimatedDuration: subQuests.length * 30, // 每个子任务预计30天
      
      currentLevel: LEVEL_SYSTEM.MIN_LEVEL,
      totalExp: 0,
      maxExp: LEVEL_SYSTEM.TOTAL_EXP,
      maxLevel: LEVEL_SYSTEM.MAX_LEVEL,
      expPerLevel: LEVEL_SYSTEM.EXP_PER_LEVEL,
      
      overallProgress: 0,
      subQuests,
      completedSubQuests: 0,
      
      customRewards: customRewards || {
        ultimateReward: `恭喜你胜任 ${job.title} 职位！`,
        milestoneRewards: []
      },
      
      stats: {
        totalLearningHours: 0,
        daysSpent: 0,
        levelUps: 0,
        completedSubTasks: 0,
        totalSubTasks: subQuests.length
      }
    }

    currentQuest.value = quest
    saveToStorage()
    return true
  }

  /**
   * 生成子任务列表
   * @param {Object} job - 职位信息
   * @returns {Array} 子任务列表
   */
  function generateSubQuests(job) {
    if (!job.requirements || job.requirements.length === 0) {
      return []
    }

    // 为每个要求分配难度等级
    const totalReqs = job.requirements.length
    const subTasks = job.requirements.map((req, index) => {
      // 根据顺序分配难度：前1/3基础，中1/3进阶，后1/3高级
      let difficulty
      if (index < totalReqs / 3) {
        difficulty = DIFFICULTY_LEVEL.BASIC
      } else if (index < (totalReqs * 2) / 3) {
        difficulty = DIFFICULTY_LEVEL.INTERMEDIATE
      } else {
        difficulty = DIFFICULTY_LEVEL.ADVANCED
      }

      return {
        id: `${job.id}-${index}`,
        title: req.skill || req.text,
        description: `掌握 ${req.skill || req.text} 技能`,
        difficulty,
        status: index === 0 ? SUBTASK_STATUS.ACTIVE : SUBTASK_STATUS.LOCKED,
        progress: 0,
        expReward: 0, // 将在下面计算
        order: index,
        weight: 0, // 将在下面计算
        tasks: generateLearningTasks(req, index, totalReqs),
        completedDate: null
      }
    })

    // 分配经验值
    const subTasksWithExp = calculateExpDistribution(subTasks)
    
    // 验证经验值分配
    const validation = validateExpDistribution(subTasksWithExp)
    if (!validation.valid) {
      console.warn('经验值分配不精确:', validation)
    }

    return subTasksWithExp
  }

  /**
   * 生成学习任务
   * @param {Object} requirement - 技能要求
   * @param {number} index - 索引
   * @param {number} total - 总数
   * @returns {Array} 学习任务列表
   */
  function generateLearningTasks(requirement, index, total) {
    const skillName = requirement.skill || requirement.text
    const difficulty = index < total / 3 ? 0 : index < (total * 2) / 3 ? 1 : 2

    return [
      {
        id: `${skillName}-theory`,
        title: `理论学习：${skillName}`,
        description: `深入理解 ${skillName} 的核心概念和原理`,
        type: LEARNING_STEP_TYPE.THEORY,
        estimatedHours: 8 + difficulty * 4,
        expReward: 50 + difficulty * 25,
        completed: false,
        subtasks: [
          '阅读官方文档和教程',
          '学习最佳实践和设计模式',
          '理解核心原理和底层机制'
        ],
        completedDate: null
      },
      {
        id: `${skillName}-practice`,
        title: `实践练习：${skillName}`,
        description: `通过实际项目掌握 ${skillName}`,
        type: LEARNING_STEP_TYPE.PRACTICE,
        estimatedHours: 12 + difficulty * 6,
        expReward: 75 + difficulty * 35,
        completed: false,
        subtasks: [
          '完成基础练习和小项目',
          '实现中型实战项目',
          '解决实际开发问题'
        ],
        completedDate: null
      },
      {
        id: `${skillName}-mastery`,
        title: `精通掌握：${skillName}`,
        description: `达到 ${skillName} 的专业水平`,
        type: LEARNING_STEP_TYPE.MASTERY,
        estimatedHours: 16 + difficulty * 8,
        expReward: 100 + difficulty * 50,
        completed: false,
        subtasks: [
          '优化性能和代码质量',
          '处理复杂场景和边界情况',
          '能够指导他人学习'
        ],
        completedDate: null
      }
    ]
  }

  /**
   * 完成学习任务
   * @param {string} subQuestId - 子任务ID
   * @param {string} taskId - 学习任务ID
   */
  function completeTask(subQuestId, taskId) {
    if (!currentQuest.value) return

    const subQuest = currentQuest.value.subQuests.find(sq => sq.id === subQuestId)
    if (!subQuest || subQuest.status !== SUBTASK_STATUS.ACTIVE) return

    const task = subQuest.tasks.find(t => t.id === taskId)
    if (!task || task.completed) return

    // 标记任务完成
    task.completed = true
    task.completedDate = new Date().toISOString()

    // 更新子任务进度
    updateSubQuestProgress(subQuest)

    // 检查子任务是否完成
    if (subQuest.progress === 100) {
      completeSubQuest(subQuest)
    }

    saveToStorage()
  }

  /**
   * 更新子任务进度
   * @param {Object} subQuest - 子任务
   */
  function updateSubQuestProgress(subQuest) {
    const completedTasks = subQuest.tasks.filter(t => t.completed).length
    const totalTasks = subQuest.tasks.length
    subQuest.progress = Math.round((completedTasks / totalTasks) * 100)
  }

  /**
   * 完成子任务
   * @param {Object} subQuest - 子任务
   */
  function completeSubQuest(subQuest) {
    if (!currentQuest.value) return

    // 标记子任务完成
    subQuest.status = SUBTASK_STATUS.COMPLETED
    subQuest.completedDate = new Date().toISOString()

    // 增加经验值
    const expGainResult = calculateExpGain(
      currentQuest.value.totalExp,
      subQuest.expReward
    )

    currentQuest.value.totalExp = expGainResult.newExp
    currentQuest.value.currentLevel = expGainResult.newLevel

    // 记录本次获得的经验值（用于升级弹窗显示）
    lastExpGain.value = {
      expGained: subQuest.expReward,
      levelsGained: expGainResult.levelsGained
    }

    // 更新统计
    currentQuest.value.completedSubQuests += 1
    currentQuest.value.stats.completedSubTasks += 1
    if (expGainResult.leveledUp) {
      currentQuest.value.stats.levelUps += expGainResult.levelsGained
    }

    // 更新整体进度
    currentQuest.value.overallProgress = calculateOverallProgress(
      currentQuest.value.totalExp
    )

    // 解锁下一个子任务
    const nextSubQuest = currentQuest.value.subQuests.find(
      sq => sq.order === subQuest.order + 1 && sq.status === SUBTASK_STATUS.LOCKED
    )
    if (nextSubQuest) {
      nextSubQuest.status = SUBTASK_STATUS.ACTIVE
    }

    // 检查里程碑
    const milestone = getLevelMilestone(expGainResult.newLevel)
    if (milestone.isMilestone) {
      console.log(milestone.message)
      // 这里可以触发里程碑动画
    }

    saveToStorage()
  }

  /**
   * 检查是否可以完成任务
   * @returns {{canComplete: boolean, message: string}}
   */
  function canCompleteQuest() {
    if (!currentQuest.value) {
      return { canComplete: false, message: '没有进行中的任务' }
    }

    const allSubQuestsCompleted = currentQuest.value.subQuests.every(
      sq => sq.status === SUBTASK_STATUS.COMPLETED
    )

    if (!allSubQuestsCompleted) {
      return {
        canComplete: false,
        message: '还有子任务未完成'
      }
    }

    const reachedMaxLevel = currentQuest.value.currentLevel >= LEVEL_SYSTEM.MAX_LEVEL

    if (!reachedMaxLevel) {
      return {
        canComplete: false,
        message: '还未达到满级'
      }
    }

    return { canComplete: true, message: '' }
  }

  /**
   * 确认完成任务
   * @returns {{success: boolean, jobData: Object|null, message: string}} 完成结果
   */
  function confirmQuestCompletion() {
    console.log('🔍 检查是否可以完成任务...')
    const { canComplete, message } = canCompleteQuest()
    console.log('📊 检查结果:', { canComplete, message })
    
    if (!canComplete) {
      console.error('❌ 无法完成任务:', message)
      return { success: false, jobData: null, message }
    }
    
    console.log('✅ 可以完成任务，开始处理...')

    // 保存任务数据用于返回
    const completedQuest = { ...currentQuest.value }
    const jobData = {
      id: completedQuest.jobId,
      title: completedQuest.jobTitle,
      salary: completedQuest.salary,
      completedDate: new Date().toISOString(),
      totalExp: completedQuest.totalExp,
      level: completedQuest.currentLevel,
      stats: { ...completedQuest.stats }
    }

    // 标记任务完成
    currentQuest.value.status = QUEST_STATUS.COMPLETED
    currentQuest.value.completedDate = jobData.completedDate

    // 添加到历史记录
    addToHistory(currentQuest.value, 'completed')

    // 清空当前任务
    currentQuest.value = null

    saveToStorage()
    
    return { 
      success: true, 
      jobData,
      message: '恭喜完成任务！'
    }
  }

  /**
   * 放弃任务
   * @returns {boolean} 是否成功放弃
   */
  function abandonQuest() {
    if (!currentQuest.value) return false

    // 标记任务放弃
    currentQuest.value.status = QUEST_STATUS.ABANDONED
    currentQuest.value.abandonedDate = new Date().toISOString()

    // 添加到历史记录
    addToHistory(currentQuest.value, 'abandoned')

    // 清空当前任务
    currentQuest.value = null

    saveToStorage()
    return true
  }

  /**
   * 添加到历史记录
   * @param {Object} quest - 任务
   * @param {string} completionType - 完成类型
   */
  function addToHistory(quest, completionType) {
    questHistory.value.push({
      quest: { ...quest },
      completionType,
      endDate: new Date().toISOString(),
      achievements: [] // 可以在这里添加成就逻辑
    })
  }

  /**
   * 获取历史记录
   * @returns {Array} 历史记录列表
   */
  function getQuestHistory() {
    return questHistory.value
  }

  /**
   * 获取统计数据
   * @returns {Object} 统计数据
   */
  function getQuestStats() {
    const totalQuests = questHistory.value.length
    const completedQuests = questHistory.value.filter(
      h => h.completionType === 'completed'
    ).length
    const abandonedQuests = questHistory.value.filter(
      h => h.completionType === 'abandoned'
    ).length

    return {
      totalQuests,
      completedQuests,
      abandonedQuests,
      completionRate: totalQuests > 0 ? (completedQuests / totalQuests) * 100 : 0
    }
  }

  /**
   * 保存到 localStorage
   */
  function saveToStorage() {
    try {
      localStorage.setItem('questStore', JSON.stringify({
        currentQuest: currentQuest.value,
        questHistory: questHistory.value
      }))
    } catch (error) {
      console.error('保存数据失败:', error)
    }
  }

  /**
   * 从 localStorage 加载
   */
  function loadFromStorage() {
    try {
      const stored = localStorage.getItem('questStore')
      if (stored) {
        const data = JSON.parse(stored)
        currentQuest.value = data.currentQuest || null
        questHistory.value = data.questHistory || []
      }
    } catch (error) {
      console.error('加载数据失败:', error)
    }
  }

  // ==================== 返回 ====================
  
  return {
    // 状态
    currentQuest,
    questHistory,
    availableJobs,
    lastExpGain,
    
    // 计算属性
    hasActiveQuest,
    currentLevel,
    currentLevelProgress,
    expToNextLevel,
    overallProgress,
    completedSubQuestsCount,
    activeSubQuests,
    
    // 方法
    loadJobs,
    canAcceptNewQuest,
    acceptQuest,
    completeTask,
    canCompleteQuest,
    confirmQuestCompletion,
    abandonQuest,
    getQuestHistory,
    getQuestStats,
    saveToStorage,
    loadFromStorage
  }
})
