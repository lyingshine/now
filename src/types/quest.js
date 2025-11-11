/**
 * 职业任务系统类型定义
 * 使用 JSDoc 提供类型提示和文档
 */

/**
 * 任务状态枚举
 * @typedef {'not_started' | 'in_progress' | 'completed' | 'abandoned'} QuestStatus
 */

/**
 * 子任务状态枚举
 * @typedef {'locked' | 'active' | 'completed'} SubTaskStatus
 */

/**
 * 难度等级枚举
 * @typedef {'basic' | 'intermediate' | 'advanced' | 'expert'} DifficultyLevel
 */

/**
 * 学习步骤类型枚举
 * @typedef {'theory' | 'practice' | 'mastery'} LearningStepType
 */

/**
 * 资源类型
 * @typedef {Object} Resource
 * @property {string} type - 资源类型 (doc, video, article, etc.)
 * @property {string} name - 资源名称
 * @property {string} url - 资源链接
 * @property {number} rating - 评分 (0-5)
 * @property {string} reason - 推荐理由
 */

/**
 * 学习任务
 * @typedef {Object} LearningTask
 * @property {string} id - 任务唯一标识
 * @property {string} title - 任务标题
 * @property {string} description - 任务描述
 * @property {LearningStepType} type - 任务类型
 * @property {number} estimatedHours - 预计学习时长（小时）
 * @property {number} expReward - 经验值奖励
 * @property {boolean} completed - 是否完成
 * @property {string[]} subtasks - 子任务列表
 * @property {string|null} completedDate - 完成日期
 */

/**
 * 子任务（Sub Quest）
 * @typedef {Object} SubTask
 * @property {string} id - 子任务唯一标识
 * @property {string} title - 子任务标题
 * @property {string} description - 子任务描述
 * @property {DifficultyLevel} difficulty - 难度等级
 * @property {SubTaskStatus} status - 子任务状态
 * @property {number} progress - 完成进度 (0-100)
 * @property {number} expReward - 经验值奖励
 * @property {number} goldReward - 金币奖励（默认）
 * @property {number|null} customGoldReward - 用户自定义金币奖励
 * @property {string|null} customReward - 用户自定义奖励描述
 * @property {number} order - 子任务顺序
 * @property {number} weight - 难度权重 (1.0, 1.5, 2.0, 2.5)
 * @property {LearningTask[]} tasks - 学习任务列表
 * @property {string|null} completedDate - 完成日期
 */

/**
 * 自定义奖励设置
 * @typedef {Object} CustomRewards
 * @property {number} levelUpGold - 升级奖励金币
 * @property {number} completionGold - 完成任务终极奖励金币
 * @property {string} ultimateReward - 终极奖励描述
 * @property {Array<{level: number, reward: string}>} milestoneRewards - 里程碑奖励
 */

/**
 * 任务统计数据
 * @typedef {Object} QuestStats
 * @property {number} totalLearningHours - 总学习时长
 * @property {number} daysSpent - 已用天数
 * @property {number} levelUps - 升级次数
 * @property {number} completedSubTasks - 完成的子任务数
 * @property {number} totalSubTasks - 总子任务数
 */

/**
 * 主任务（Quest）
 * @typedef {Object} Quest
 * @property {number} id - 任务唯一标识
 * @property {number} jobId - 关联的职位ID
 * @property {string} jobTitle - 职位名称
 * @property {number} salary - 目标薪资
 * @property {QuestStatus} status - 任务状态
 * 
 * @property {string} startDate - 开始日期 (ISO 8601)
 * @property {string|null} completedDate - 完成日期 (ISO 8601)
 * @property {string|null} abandonedDate - 放弃日期 (ISO 8601)
 * @property {number} estimatedDuration - 预计完成天数
 * 
 * @property {number} currentLevel - 当前等级 (1-100)
 * @property {number} totalExp - 总经验值 (0-10000)
 * @property {number} maxExp - 最大经验值 (固定10000)
 * @property {number} maxLevel - 最大等级 (固定100)
 * @property {number} expPerLevel - 每级所需经验 (固定100)
 * 
 * @property {number} overallProgress - 整体进度 (0-100)
 * @property {SubTask[]} subQuests - 子任务列表
 * @property {number} completedSubQuests - 已完成子任务数
 * 
 * @property {CustomRewards} customRewards - 自定义奖励设置
 * @property {QuestStats} stats - 统计数据
 */

/**
 * 任务历史记录
 * @typedef {Object} QuestHistory
 * @property {Quest} quest - 任务数据
 * @property {string} completionType - 完成类型 ('completed' | 'abandoned')
 * @property {string} endDate - 结束日期
 * @property {string[]} achievements - 获得的成就
 */

/**
 * 成就
 * @typedef {Object} Achievement
 * @property {string} id - 成就ID
 * @property {string} name - 成就名称
 * @property {string} description - 成就描述
 * @property {string} icon - 成就图标
 * @property {string} rarity - 稀有度 ('common' | 'rare' | 'epic' | 'legendary')
 * @property {boolean} unlocked - 是否解锁
 * @property {string|null} unlockedDate - 解锁日期
 */

// 导出类型常量
export const QUEST_STATUS = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  ABANDONED: 'abandoned'
}

export const SUBTASK_STATUS = {
  LOCKED: 'locked',
  ACTIVE: 'active',
  COMPLETED: 'completed'
}

export const DIFFICULTY_LEVEL = {
  BASIC: 'basic',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
  EXPERT: 'expert'
}

export const LEARNING_STEP_TYPE = {
  THEORY: 'theory',
  PRACTICE: 'practice',
  MASTERY: 'mastery'
}

// 导出难度权重映射
export const DIFFICULTY_WEIGHTS = {
  [DIFFICULTY_LEVEL.BASIC]: 1.0,
  [DIFFICULTY_LEVEL.INTERMEDIATE]: 1.5,
  [DIFFICULTY_LEVEL.ADVANCED]: 2.0,
  [DIFFICULTY_LEVEL.EXPERT]: 2.5
}

// 导出等级系统常量
export const LEVEL_SYSTEM = {
  MAX_LEVEL: 100,
  MIN_LEVEL: 1,
  TOTAL_EXP: 10000,
  EXP_PER_LEVEL: 100
}
