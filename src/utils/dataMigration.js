/**
 * 数据迁移工具
 * 用于将旧的 jobsStore 数据迁移到新的 questStore
 */

import { QUEST_STATUS, SUBTASK_STATUS, DIFFICULTY_LEVEL } from '../types/quest.js'
import { calculateExpDistribution } from './expCalculator.js'

/**
 * 迁移旧的 learningPlans 数据到新的 Quest 格式
 * @param {Array} oldLearningPlans - 旧的学习计划数据
 * @param {Array} jobs - 职位数据
 * @returns {Object|null} 新的 Quest 对象
 */
export function migrateOldData(oldLearningPlans, jobs) {
  if (!oldLearningPlans || oldLearningPlans.length === 0) {
    return null
  }

  // 只迁移第一个进行中的任务
  const activePlan = oldLearningPlans.find(plan => plan.overallProgress < 100)
  if (!activePlan) {
    return null
  }

  // 查找对应的职位信息
  const job = jobs.find(j => j.id === activePlan.jobId)
  if (!job) {
    console.warn('找不到对应的职位信息:', activePlan.jobId)
    return null
  }

  // 生成子任务
  const subQuests = activePlan.skills.map((skill, index) => {
    // 根据顺序分配难度
    let difficulty
    const totalSkills = activePlan.skills.length
    if (index < totalSkills / 3) {
      difficulty = DIFFICULTY_LEVEL.BASIC
    } else if (index < (totalSkills * 2) / 3) {
      difficulty = DIFFICULTY_LEVEL.INTERMEDIATE
    } else {
      difficulty = DIFFICULTY_LEVEL.ADVANCED
    }

    // 确定状态
    let status
    if (skill.status === 'completed') {
      status = SUBTASK_STATUS.COMPLETED
    } else if (skill.status === 'in_progress') {
      status = SUBTASK_STATUS.ACTIVE
    } else {
      status = SUBTASK_STATUS.LOCKED
    }

    return {
      id: `${activePlan.jobId}-${index}`,
      title: skill.skillName,
      description: `掌握 ${skill.skillName} 技能`,
      difficulty,
      status,
      progress: skill.progress || 0,
      expReward: 0, // 将在下面计算
      order: index,
      weight: 0, // 将在下面计算
      tasks: [],
      completedDate: skill.status === 'completed' ? new Date().toISOString() : null
    }
  })

  // 分配经验值
  const subQuestsWithExp = calculateExpDistribution(subQuests)

  // 计算总经验值（基于已完成的子任务）
  let totalExp = 0
  subQuestsWithExp.forEach(sq => {
    if (sq.status === SUBTASK_STATUS.COMPLETED) {
      totalExp += sq.expReward
    }
  })

  // 创建新的 Quest 对象
  const quest = {
    id: Date.now(),
    jobId: activePlan.jobId,
    jobTitle: activePlan.jobTitle,
    salary: activePlan.salary,
    status: QUEST_STATUS.IN_PROGRESS,
    
    startDate: activePlan.startDate || new Date().toISOString(),
    completedDate: null,
    abandonedDate: null,
    estimatedDuration: activePlan.estimatedWeeks * 7,
    
    currentLevel: Math.floor(totalExp / 100) + 1,
    totalExp,
    maxExp: 10000,
    maxLevel: 100,
    expPerLevel: 100,
    
    overallProgress: activePlan.overallProgress || 0,
    subQuests: subQuestsWithExp,
    completedSubQuests: subQuestsWithExp.filter(sq => sq.status === SUBTASK_STATUS.COMPLETED).length,
    
    customRewards: {
      ultimateReward: `恭喜你胜任 ${activePlan.jobTitle} 职位！`,
      milestoneRewards: []
    },
    
    stats: {
      totalLearningHours: 0,
      daysSpent: 0,
      levelUps: 0,
      completedSubTasks: subQuestsWithExp.filter(sq => sq.status === SUBTASK_STATUS.COMPLETED).length,
      totalSubTasks: subQuestsWithExp.length
    }
  }

  return quest
}

/**
 * 验证 Quest 数据的完整性
 * @param {Object} quest - Quest 对象
 * @returns {{valid: boolean, errors: Array<string>}}
 */
export function validateQuestData(quest) {
  const errors = []

  if (!quest) {
    errors.push('Quest 对象为空')
    return { valid: false, errors }
  }

  // 验证必需字段
  const requiredFields = ['id', 'jobId', 'jobTitle', 'salary', 'status', 'subQuests']
  requiredFields.forEach(field => {
    if (!(field in quest)) {
      errors.push(`缺少必需字段: ${field}`)
    }
  })

  // 验证子任务
  if (quest.subQuests && Array.isArray(quest.subQuests)) {
    if (quest.subQuests.length === 0) {
      errors.push('子任务列表为空')
    }

    // 验证经验值总和
    const totalExp = quest.subQuests.reduce((sum, sq) => sum + (sq.expReward || 0), 0)
    if (totalExp !== 10000) {
      errors.push(`经验值总和不正确: ${totalExp} (应为 10000)`)
    }
  } else {
    errors.push('子任务列表无效')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * 修复损坏的 Quest 数据
 * @param {Object} quest - Quest 对象
 * @returns {Object} 修复后的 Quest 对象
 */
export function repairQuestData(quest) {
  if (!quest) return null

  // 确保所有必需字段存在
  const repairedQuest = {
    ...quest,
    id: quest.id || Date.now(),
    status: quest.status || QUEST_STATUS.IN_PROGRESS,
    totalExp: quest.totalExp || 0,
    maxExp: 10000,
    maxLevel: 100,
    expPerLevel: 100,
    currentLevel: quest.currentLevel || 1,
    overallProgress: quest.overallProgress || 0,
    completedSubQuests: quest.completedSubQuests || 0,
    subQuests: quest.subQuests || [],
    customRewards: quest.customRewards || {
      ultimateReward: `恭喜你胜任 ${quest.jobTitle} 职位！`,
      milestoneRewards: []
    },
    stats: quest.stats || {
      totalLearningHours: 0,
      daysSpent: 0,
      levelUps: 0,
      completedSubTasks: 0,
      totalSubTasks: quest.subQuests?.length || 0
    }
  }

  // 重新计算经验值分配（如果需要）
  if (repairedQuest.subQuests.length > 0) {
    const totalExpReward = repairedQuest.subQuests.reduce((sum, sq) => sum + (sq.expReward || 0), 0)
    if (totalExpReward !== 10000) {
      console.warn('重新分配经验值')
      repairedQuest.subQuests = calculateExpDistribution(repairedQuest.subQuests)
    }
  }

  return repairedQuest
}

/**
 * 清理旧数据
 * 在迁移完成后调用，清理 localStorage 中的旧数据
 */
export function cleanupOldData() {
  try {
    const stored = localStorage.getItem('jobsStore')
    if (stored) {
      const data = JSON.parse(stored)
      // 清空 learningPlans，但保留 userProgress
      data.learningPlans = []
      localStorage.setItem('jobsStore', JSON.stringify(data))
      console.log('已清理旧的 learningPlans 数据')
    }
  } catch (error) {
    console.error('清理旧数据失败:', error)
  }
}

/**
 * 检查是否需要迁移
 * @returns {boolean}
 */
export function needsMigration() {
  try {
    // 检查是否有旧数据
    const oldData = localStorage.getItem('jobsStore')
    if (!oldData) return false

    const parsed = JSON.parse(oldData)
    if (!parsed.learningPlans || parsed.learningPlans.length === 0) {
      return false
    }

    // 检查是否已有新数据
    const newData = localStorage.getItem('questStore')
    if (newData) {
      const parsedNew = JSON.parse(newData)
      if (parsedNew.currentQuest) {
        return false // 已经有新数据，不需要迁移
      }
    }

    return true
  } catch (error) {
    console.error('检查迁移状态失败:', error)
    return false
  }
}
