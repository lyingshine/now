// 生活水平计算 Composable
import hangzhouDataConfig from '../data/hangzhou-data-config.js'
import rankSystemModule from '../data/rank-system.js'
import lifestyleModule from '../data/lifestyle-data.js'

// 将 hangzhouDataConfig 设置为全局变量，供其他模块使用
if (typeof window !== 'undefined') {
  window.hangzhouDataConfig = hangzhouDataConfig
}

const rankSystem = rankSystemModule.rankSystem
const lifestyleData = lifestyleModule.lifestyleData

export function useLifestyle() {
  const calculateLifestyle = (salary, peopleCount = 1, rent = null, utilities = null, savingsRate = null) => {
    return lifestyleData.calculate(salary, peopleCount, rent, utilities, savingsRate)
  }

  const getRank = (salary) => {
    return rankSystem.getRank(salary)
  }

  const getProgress = (salary) => {
    return rankSystem.getProgress(salary)
  }

  const getRankInfo = (salary) => {
    return rankSystem.getRankInfo(salary)
  }

  return {
    calculateLifestyle,
    getRank,
    getProgress,
    getRankInfo,
    hangzhouDataConfig,
    rankSystem
  }
}
