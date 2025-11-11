// 生活水平计算 Composable
import hangzhouDataConfig from '../data/hangzhou-data-config.js'
import rankSystemData from '../data/rank-system.js'
import lifestyleDataModule from '../data/lifestyle-data.js'

export function useLifestyle() {
  const calculateLifestyle = (salary, peopleCount = 1, rent = null, utilities = null, savingsRate = null) => {
    return lifestyleDataModule.lifestyleData.calculate(salary, peopleCount, rent, utilities, savingsRate)
  }

  const getRank = (salary) => {
    return rankSystemData.rankSystem.getRank(salary)
  }

  const getProgress = (salary) => {
    return rankSystemData.rankSystem.getProgress(salary)
  }

  const getRankInfo = (salary) => {
    return rankSystemData.rankSystem.getRankInfo(salary)
  }

  return {
    calculateLifestyle,
    getRank,
    getProgress,
    getRankInfo,
    hangzhouDataConfig,
    rankSystem: rankSystemData.rankSystem
  }
}
