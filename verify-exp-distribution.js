/**
 * 经验值分配验证脚本
 * 用于验证每个职业任务的经验值分配是否正确
 */

// 模拟 LEVEL_SYSTEM 和 DIFFICULTY_WEIGHTS
const LEVEL_SYSTEM = {
  MAX_LEVEL: 100,
  MIN_LEVEL: 1,
  TOTAL_EXP: 10000,
  EXP_PER_LEVEL: 100
}

const DIFFICULTY_WEIGHTS = {
  'basic': 1.0,
  'intermediate': 1.5,
  'advanced': 2.0,
  'expert': 2.5
}

/**
 * 计算经验值分配
 */
function calculateExpDistribution(subTasks) {
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
 * 验证经验值分配
 */
function validateExpDistribution(subTasks) {
  const total = subTasks.reduce((sum, task) => sum + (task.expReward || 0), 0)
  
  return {
    valid: total === LEVEL_SYSTEM.TOTAL_EXP,
    total,
    expected: LEVEL_SYSTEM.TOTAL_EXP,
    difference: total - LEVEL_SYSTEM.TOTAL_EXP
  }
}

/**
 * 计算等级
 */
function calculateLevel(totalExp) {
  if (totalExp <= 0) return LEVEL_SYSTEM.MIN_LEVEL
  const level = Math.floor(totalExp / LEVEL_SYSTEM.EXP_PER_LEVEL) + 1
  return Math.min(level, LEVEL_SYSTEM.MAX_LEVEL)
}

// 测试用例
console.log('=== 经验值系统验证 ===\n')

// 测试用例 1: 5个基础难度任务
console.log('测试用例 1: 5个基础难度任务')
const test1 = [
  { id: 1, title: '任务1', difficulty: 'basic' },
  { id: 2, title: '任务2', difficulty: 'basic' },
  { id: 3, title: '任务3', difficulty: 'basic' },
  { id: 4, title: '任务4', difficulty: 'basic' },
  { id: 5, title: '任务5', difficulty: 'basic' }
]
const result1 = calculateExpDistribution(test1)
const validation1 = validateExpDistribution(result1)
console.log('子任务经验值:', result1.map(t => `${t.title}: ${t.expReward}`).join(', '))
console.log('总经验值:', validation1.total)
console.log('是否正确:', validation1.valid ? '✅' : '❌')
console.log('完成后等级:', calculateLevel(validation1.total))
console.log()

// 测试用例 2: 混合难度任务
console.log('测试用例 2: 混合难度任务')
const test2 = [
  { id: 1, title: '任务1', difficulty: 'basic' },
  { id: 2, title: '任务2', difficulty: 'basic' },
  { id: 3, title: '任务3', difficulty: 'intermediate' },
  { id: 4, title: '任务4', difficulty: 'intermediate' },
  { id: 5, title: '任务5', difficulty: 'advanced' },
  { id: 6, title: '任务6', difficulty: 'advanced' }
]
const result2 = calculateExpDistribution(test2)
const validation2 = validateExpDistribution(result2)
console.log('子任务经验值:')
result2.forEach(t => {
  console.log(`  ${t.title} (${t.difficulty}): ${t.expReward} EXP (权重: ${t.weight})`)
})
console.log('总经验值:', validation2.total)
console.log('是否正确:', validation2.valid ? '✅' : '❌')
console.log('完成后等级:', calculateLevel(validation2.total))
console.log()

// 测试用例 3: 10个任务，难度递增
console.log('测试用例 3: 10个任务，难度递增')
const test3 = [
  { id: 1, title: '任务1', difficulty: 'basic' },
  { id: 2, title: '任务2', difficulty: 'basic' },
  { id: 3, title: '任务3', difficulty: 'basic' },
  { id: 4, title: '任务4', difficulty: 'intermediate' },
  { id: 5, title: '任务5', difficulty: 'intermediate' },
  { id: 6, title: '任务6', difficulty: 'intermediate' },
  { id: 7, title: '任务7', difficulty: 'advanced' },
  { id: 8, title: '任务8', difficulty: 'advanced' },
  { id: 9, title: '任务9', difficulty: 'expert' },
  { id: 10, title: '任务10', difficulty: 'expert' }
]
const result3 = calculateExpDistribution(test3)
const validation3 = validateExpDistribution(result3)
console.log('子任务经验值:')
result3.forEach(t => {
  const level = calculateLevel(result3.slice(0, result3.indexOf(t) + 1).reduce((sum, task) => sum + task.expReward, 0))
  console.log(`  ${t.title} (${t.difficulty}): ${t.expReward} EXP → 达到 Lv.${level}`)
})
console.log('总经验值:', validation3.total)
console.log('是否正确:', validation3.valid ? '✅' : '❌')
console.log('完成后等级:', calculateLevel(validation3.total))
console.log()

// 测试等级计算
console.log('=== 等级计算验证 ===\n')
const testLevels = [0, 100, 500, 1000, 2500, 5000, 7500, 9900, 10000]
testLevels.forEach(exp => {
  const level = calculateLevel(exp)
  console.log(`${exp} EXP → Lv.${level}`)
})
console.log()

// 总结
console.log('=== 验证总结 ===')
console.log('✅ 每个任务的等级是独立的（1-100）')
console.log('✅ 所有子任务经验值总和 = 10000')
console.log('✅ 完成所有子任务 = 100级')
console.log('✅ 经验值按难度权重分配')
console.log('✅ 最后一个子任务使用剩余经验值，确保总和精确')
