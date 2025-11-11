// 收入计算 Composable
import { ref, computed } from 'vue'
import { useWorkDays } from './useWorkDays'

export function useEarnings(salaryData) {
  const { getWorkDays, isTodayAfterJoinDate } = useWorkDays()
  
  const perMinute = ref(0)
  const workMinutes = ref(0)
  const todayEarnings = ref(0)
  const monthEarnings = ref(0)
  const yearEarnings = ref(0)
  const totalEarnings = ref(0)

  /**
   * 获取每分钟收入
   */
  const getPerMinuteRate = () => {
    const salary = salaryData.value.salary || 0
    const workDays = salaryData.value.workDays || 22
    const [startHour, startMin] = salaryData.value.workStart.split(':').map(Number)
    const [endHour, endMin] = salaryData.value.workEnd.split(':').map(Number)
    const workHours = (endHour * 60 + endMin - startHour * 60 - startMin) / 60

    const perDay = salary / workDays
    const perHour = perDay / workHours
    return perHour / 60
  }

  /**
   * 获取今日已工作分钟数
   */
  const getTodayWorkMinutes = () => {
    const now = new Date()
    const [startHour, startMin] = salaryData.value.workStart.split(':').map(Number)
    const [endHour, endMin] = salaryData.value.workEnd.split(':').map(Number)
    
    const startTime = new Date(now)
    startTime.setHours(startHour, startMin, 0, 0)
    
    const endTime = new Date(now)
    endTime.setHours(endHour, endMin, 0, 0)

    if (now < startTime) {
      return 0
    } else if (now > endTime) {
      return (endTime - startTime) / 60000
    } else {
      return (now - startTime) / 60000
    }
  }

  /**
   * 获取本月工作日天数
   */
  const getMonthWorkDays = () => {
    if (!salaryData.value.joinDate) return 0
    
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const joinDate = new Date(salaryData.value.joinDate)
    const joinDay = new Date(joinDate.getFullYear(), joinDate.getMonth(), joinDate.getDate())
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    
    if (joinDay > today) return 0
    
    const startDate = joinDay > monthStart ? joinDay : monthStart
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    if (startDate > yesterday) return 0
    
    return getWorkDays(startDate, yesterday, salaryData.value.workSchedule)
  }

  /**
   * 获取今年工作日天数
   */
  const getYearWorkDays = () => {
    if (!salaryData.value.joinDate) return 0
    
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const joinDate = new Date(salaryData.value.joinDate)
    const joinDay = new Date(joinDate.getFullYear(), joinDate.getMonth(), joinDate.getDate())
    const yearStart = new Date(now.getFullYear(), 0, 1)
    
    if (joinDay > today) return 0
    
    const startDate = joinDay > yearStart ? joinDay : yearStart
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    if (startDate > yesterday) return 0
    
    return getWorkDays(startDate, yesterday, salaryData.value.workSchedule)
  }

  /**
   * 获取总工作日天数
   */
  const getTotalWorkDays = () => {
    if (!salaryData.value.joinDate) return 0
    
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const joinDate = new Date(salaryData.value.joinDate)
    const joinDay = new Date(joinDate.getFullYear(), joinDate.getMonth(), joinDate.getDate())
    
    if (joinDay > today) return 0
    
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    if (joinDay > yesterday) return 0
    
    return getWorkDays(joinDay, yesterday, salaryData.value.workSchedule)
  }

  /**
   * 计算所有收入
   */
  const calculateEarnings = () => {
    perMinute.value = getPerMinuteRate()
    
    const workDays = salaryData.value.workDays || 22
    const perDay = salaryData.value.salary / workDays
    
    // 今日收入 - 只有入职后才计算
    let todayEarning = 0
    if (isTodayAfterJoinDate(salaryData.value.joinDate)) {
      const todayMinutes = getTodayWorkMinutes()
      workMinutes.value = Math.floor(todayMinutes)
      todayEarning = perMinute.value * todayMinutes
      todayEarnings.value = todayEarning
    } else {
      workMinutes.value = 0
      todayEarnings.value = 0
    }
    
    // 本月收入 = 昨天之前的完整天数 × 日薪 + 今天实时收入
    const monthDays = getMonthWorkDays()
    monthEarnings.value = perDay * monthDays + todayEarning
    
    // 今年收入 = 昨天之前的完整天数 × 日薪 + 今天实时收入
    const yearDays = getYearWorkDays()
    yearEarnings.value = perDay * yearDays + todayEarning
    
    // 入职以来收入 = 昨天之前的完整天数 × 日薪 + 今天实时收入
    const totalDays = getTotalWorkDays()
    totalEarnings.value = perDay * totalDays + todayEarning
  }

  return {
    perMinute,
    workMinutes,
    todayEarnings,
    monthEarnings,
    yearEarnings,
    totalEarnings,
    calculateEarnings
  }
}
