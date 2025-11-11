/**
 * 成就系统
 * 定义和管理用户成就
 */

export const ACHIEVEMENTS = {
  FIRST_QUEST: {
    id: 'first_quest',
    name: '初出茅庐',
    description: '完成第一个职业任务',
    icon: '🎯',
    rarity: 'common'
  },
  LEVEL_25: {
    id: 'level_25',
    name: '初级专家',
    description: '达到25级',
    icon: '⭐',
    rarity: 'common'
  },
  LEVEL_50: {
    id: 'level_50',
    name: '中级专家',
    description: '达到50级',
    icon: '🌟',
    rarity: 'rare'
  },
  LEVEL_75: {
    id: 'level_75',
    name: '高级专家',
    description: '达到75级',
    icon: '💫',
    rarity: 'epic'
  },
  LEVEL_100: {
    id: 'level_100',
    name: '大师级',
    description: '达到100级满级',
    icon: '👑',
    rarity: 'legendary'
  },
  HIGH_SALARY: {
    id: 'high_salary',
    name: '高薪职位',
    description: '完成月薪30000+的职位',
    icon: '💰',
    rarity: 'rare'
  },
  QUICK_COMPLETE: {
    id: 'quick_complete',
    name: '速战速决',
    description: '30天内完成一个任务',
    icon: '⚡',
    rarity: 'epic'
  },
  PERSISTENT: {
    id: 'persistent',
    name: '坚持不懈',
    description: '完成3个职业任务',
    icon: '🏆',
    rarity: 'epic'
  },
  CAREER_MASTER: {
    id: 'career_master',
    name: '职业大师',
    description: '完成5个职业任务',
    icon: '🎖️',
    rarity: 'legendary'
  }
}

/**
 * 检查并解锁成就
 * @param {Object} quest - 完成的任务
 * @param {Array} questHistory - 历史任务
 * @returns {Array} 新解锁的成就
 */
export function checkAchievements(quest, questHistory) {
  const newAchievements = []

  // 首次完成任务
  const completedQuests = questHistory.filter(h => h.completionType === 'completed')
  if (completedQuests.length === 1) {
    newAchievements.push(ACHIEVEMENTS.FIRST_QUEST)
  }

  // 等级成就
  if (quest.currentLevel >= 25 && quest.currentLevel < 50) {
    newAchievements.push(ACHIEVEMENTS.LEVEL_25)
  } else if (quest.currentLevel >= 50 && quest.currentLevel < 75) {
    newAchievements.push(ACHIEVEMENTS.LEVEL_25, ACHIEVEMENTS.LEVEL_50)
  } else if (quest.currentLevel >= 75 && quest.currentLevel < 100) {
    newAchievements.push(ACHIEVEMENTS.LEVEL_25, ACHIEVEMENTS.LEVEL_50, ACHIEVEMENTS.LEVEL_75)
  } else if (quest.currentLevel >= 100) {
    newAchievements.push(
      ACHIEVEMENTS.LEVEL_25,
      ACHIEVEMENTS.LEVEL_50,
      ACHIEVEMENTS.LEVEL_75,
      ACHIEVEMENTS.LEVEL_100
    )
  }

  // 高薪职位
  if (quest.salary >= 30000) {
    newAchievements.push(ACHIEVEMENTS.HIGH_SALARY)
  }

  // 速战速决
  if (quest.startDate && quest.completedDate) {
    const start = new Date(quest.startDate)
    const end = new Date(quest.completedDate)
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
    if (days <= 30) {
      newAchievements.push(ACHIEVEMENTS.QUICK_COMPLETE)
    }
  }

  // 坚持不懈
  if (completedQuests.length >= 3) {
    newAchievements.push(ACHIEVEMENTS.PERSISTENT)
  }

  // 职业大师
  if (completedQuests.length >= 5) {
    newAchievements.push(ACHIEVEMENTS.CAREER_MASTER)
  }

  return newAchievements
}

/**
 * 获取成就稀有度颜色
 * @param {string} rarity - 稀有度
 * @returns {string} 颜色
 */
export function getAchievementColor(rarity) {
  const colors = {
    common: '#10b981',
    rare: '#3b82f6',
    epic: '#a855f7',
    legendary: '#f59e0b'
  }
  return colors[rarity] || colors.common
}
