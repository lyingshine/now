/**
 * 经验值计算工具
 * 用于职业任务系统的经验值分配和等级计算
 */

import { DIFFICULTY_WEIGHTS, LEVEL_SYSTEM } from '../types/quest.js'

/**
 * 根据难度分配经验值
 * @param {Array<{difficulty: string}>} subTasks - 子任务列表
 * @returns {Array<{difficulty: string, expReward: number}>} 带有经验值的子任务列表
 */
export function calculateExpDistribution(subTasks) {
  if (!subTasks || subTasks.length === 0) {
    return []
  }

  const { TOTAL_EXP } = LEVEL_SYSTEM

  // 计算总权重
  const totalWeight = subTasks.reduce((sum, task) => {
    const weight = DIFFICULTY_WEIGHTS[task.difficulty] || 1.0
    return sum + weight
  }, 0)

  // 分配经验值
  let distributedExp = 0
  const result = subTasks.map((task, index) => {
    const weight = DIFFICULTY_WEIGHTS[task.difficulty] || 1.0
    
    // 对于最后一个任务，使用剩余经验值以确保总和精确等于 TOTAL_EXP
    let expReward
    if (index === subTasks.length - 1) {
      expReward = TOTAL_EXP - distributedExp
    } else {
      expReward = Math.floor((weight / totalWeight) * TOTAL_EXP)
      distributedExp += expReward
    }

    return {
      ...task,
      expReward,
      weight
    }
  })

  return result
}

/**
 * 根据总经验值计算当前等级
 * @param {number} totalExp - 总经验值
 * @returns {number} 当前等级 (1-100)
 */
export function calculateLevel(totalExp) {
  const { EXP_PER_LEVEL, MAX_LEVEL, MIN_LEVEL } = LEVEL_SYSTEM
  
  if (totalExp <= 0) return MIN_LEVEL
  
  const level = Math.floor(totalExp / EXP_PER_LEVEL) + 1
  return Math.min(level, MAX_LEVEL)
}

/**
 * 计算当前等级的进度百分比
 * @param {number} totalExp - 总经验值
 * @returns {number} 进度百分比 (0-100)
 */
export function getLevelProgress(totalExp) {
  const { EXP_PER_LEVEL } = LEVEL_SYSTEM
  
  if (totalExp <= 0) return 0
  
  const currentLevelExp = totalExp % EXP_PER_LEVEL
  return Math.round((currentLevelExp / EXP_PER_LEVEL) * 100)
}

/**
 * 计算升到下一级所需的经验值
 * @param {number} totalExp - 总经验值
 * @returns {number} 所需经验值
 */
export function getExpForNextLevel(totalExp) {
  const { EXP_PER_LEVEL, TOTAL_EXP } = LEVEL_SYSTEM
  
  if (totalExp >= TOTAL_EXP) return 0
  
  const currentLevelExp = totalExp % EXP_PER_LEVEL
  return EXP_PER_LEVEL - currentLevelExp
}

/**
 * 计算当前等级在进度条中的经验值
 * @param {number} totalExp - 总经验值
 * @returns {number} 当前等级的经验值 (0-100)
 */
export function getCurrentLevelExp(totalExp) {
  const { EXP_PER_LEVEL } = LEVEL_SYSTEM
  return totalExp % EXP_PER_LEVEL
}

/**
 * 验证经验值分配是否正确
 * @param {Array<{expReward: number}>} subTasks - 子任务列表
 * @returns {{valid: boolean, total: number, expected: number}} 验证结果
 */
export function validateExpDistribution(subTasks) {
  const { TOTAL_EXP } = LEVEL_SYSTEM
  
  const total = subTasks.reduce((sum, task) => sum + (task.expReward || 0), 0)
  
  return {
    valid: total === TOTAL_EXP,
    total,
    expected: TOTAL_EXP,
    difference: total - TOTAL_EXP
  }
}

/**
 * 计算完成子任务后的新等级和经验值
 * @param {number} currentExp - 当前经验值
 * @param {number} expGain - 获得的经验值
 * @returns {{newExp: number, newLevel: number, leveledUp: boolean, levelsGained: number}} 计算结果
 */
export function calculateExpGain(currentExp, expGain) {
  const { TOTAL_EXP } = LEVEL_SYSTEM
  
  const oldLevel = calculateLevel(currentExp)
  const newExp = Math.min(currentExp + expGain, TOTAL_EXP)
  const newLevel = calculateLevel(newExp)
  
  return {
    newExp,
    newLevel,
    leveledUp: newLevel > oldLevel,
    levelsGained: newLevel - oldLevel
  }
}

/**
 * 获取等级里程碑信息
 * @param {number} level - 等级
 * @returns {{isMilestone: boolean, message: string|null}} 里程碑信息
 */
export function getLevelMilestone(level) {
  const milestones = {
    25: '🎉 恭喜达到25级！你已经掌握了基础技能！',
    50: '🌟 恭喜达到50级！你已经是中级专家了！',
    75: '🏆 恭喜达到75级！你已经接近大师水平！',
    100: '👑 恭喜满级！你已经完全胜任这个职位！'
  }
  
  return {
    isMilestone: level in milestones,
    message: milestones[level] || null
  }
}

/**
 * 计算预计完成时间
 * @param {number} remainingExp - 剩余经验值
 * @param {number} avgExpPerDay - 平均每天获得的经验值
 * @returns {number} 预计剩余天数
 */
export function estimateCompletionDays(remainingExp, avgExpPerDay) {
  if (avgExpPerDay <= 0) return Infinity
  return Math.ceil(remainingExp / avgExpPerDay)
}

/**
 * 计算平均每天经验值
 * @param {number} totalExp - 总经验值
 * @param {number} daysSpent - 已用天数
 * @returns {number} 平均每天经验值
 */
export function calculateAvgExpPerDay(totalExp, daysSpent) {
  if (daysSpent <= 0) return 0
  return Math.round(totalExp / daysSpent)
}

/**
 * 根据难度获取权重
 * @param {string} difficulty - 难度等级
 * @returns {number} 权重值
 */
export function getWeightByDifficulty(difficulty) {
  return DIFFICULTY_WEIGHTS[difficulty] || 1.0
}

/**
 * 计算整体进度百分比
 * @param {number} totalExp - 总经验值
 * @returns {number} 进度百分比 (0-100)
 */
export function calculateOverallProgress(totalExp) {
  const { TOTAL_EXP } = LEVEL_SYSTEM
  return Math.round((totalExp / TOTAL_EXP) * 100)
}
