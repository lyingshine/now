// 工作日计算 Composable
export function useWorkDays() {
  /**
   * 判断是否为工作日
   * @param {Date} date - 日期
   * @param {number} weekNumber - 周数
   * @param {string} schedule - 工作制度
   * @returns {boolean}
   */
  const isWorkDay = (date, weekNumber, schedule) => {
    const day = date.getDay() // 0=周日, 6=周六
    
    switch(schedule) {
      case 'double': // 双休
        return day !== 0 && day !== 6
      case 'single': // 单休（周日休息）
        return day !== 0
      case 'alternate': // 大小休（隔周单休）
        if (weekNumber % 2 === 0) {
          return day !== 0 && day !== 6 // 双休
        } else {
          return day !== 0 // 单休
        }
      case 'full': // 全勤
        return true
      case 'custom': // 自定义
        return true
      default:
        return day !== 0 && day !== 6
    }
  }

  /**
   * 获取周数
   * @param {Date} date - 日期
   * @returns {number}
   */
  const getWeekNumber = (date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    const dayNum = d.getUTCDay() || 7
    d.setUTCDate(d.getUTCDate() + 4 - dayNum)
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
  }

  /**
   * 计算工作日天数
   * @param {Date} startDate - 开始日期
   * @param {Date} endDate - 结束日期
   * @param {string} schedule - 工作制度
   * @returns {number}
   */
  const getWorkDays = (startDate, endDate, schedule) => {
    // 如果是自定义模式，按日历天数计算
    if (schedule === 'custom') {
      const start = new Date(startDate)
      const end = new Date(endDate)
      const diffTime = Math.abs(end - start)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
      return diffDays
    }
    
    // 否则根据工作制度计算实际工作日
    let count = 0
    const current = new Date(startDate)
    
    while (current <= endDate) {
      const weekNum = getWeekNumber(current)
      if (isWorkDay(current, weekNum, schedule)) {
        count++
      }
      current.setDate(current.getDate() + 1)
    }
    
    return count
  }

  /**
   * 判断今天是否在入职日期之后
   * @param {string} joinDate - 入职日期
   * @returns {boolean}
   */
  const isTodayAfterJoinDate = (joinDate) => {
    if (!joinDate) return false
    
    const now = new Date()
    const join = new Date(joinDate)
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const joinDay = new Date(join.getFullYear(), join.getMonth(), join.getDate())
    
    return today >= joinDay
  }

  return {
    isWorkDay,
    getWeekNumber,
    getWorkDays,
    isTodayAfterJoinDate
  }
}
