import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // 用户基本信息
  const userInfo = ref({
    // 个人信息
    name: '职场冒险者',
    avatar: '🎮',
    email: '',
    phone: '',
    city: '杭州',
    
    // 职业信息
    currentJob: null, // 当前职位信息
    currentSalary: 10000, // 当前薪资
    joinDate: '', // 入职日期
    
    // 工作设置
    workStart: '09:00',
    workEnd: '18:00',
    workSchedule: 'double', // double/alternate/single/full/custom
    workDays: 22, // 每月工作天数（自定义时使用）
    
    // 生活设置
    peopleCount: 1, // 几个人生活
    rent: 2000, // 每月房租
    utilities: 300, // 每月水电网费
    savingsRate: 30, // 储蓄率
    
    // 游戏数据
    level: 1, // 用户等级
    totalExp: 0, // 总经验值
    achievements: [], // 成就列表
    streakDays: 0, // 连续学习天数
    lastActiveDate: null, // 最后活跃日期
    
    // 偏好设置
    theme: 'light', // light/dark
    notifications: true, // 是否开启通知
    weeklyGoal: 10, // 每周学习目标（小时）
    
    // 系统标记
    isInitialized: false, // 是否已完成初始化
    createdAt: new Date().toISOString()
  })

  // 职业历史记录
  const careerHistory = ref([])

  // 计算属性
  const hasCurrentJob = computed(() => !!userInfo.value.currentJob)

  const currentJobTitle = computed(() => {
    return userInfo.value.currentJob?.title || '待业中'
  })

  const salaryGrowth = computed(() => {
    if (careerHistory.value.length < 2) return 0
    const firstJob = careerHistory.value[0]
    const currentSalary = userInfo.value.currentSalary
    return ((currentSalary - firstJob.salary) / firstJob.salary * 100).toFixed(1)
  })

  // 方法

  /**
   * 更新用户职业信息（完成岗位学习后调用）
   * @param {Object} jobData - 岗位数据
   * @param {Date} completionDate - 完成日期
   */
  const updateCareer = (jobData, completionDate = new Date()) => {
    // 保存旧职位到历史记录
    if (userInfo.value.currentJob) {
      careerHistory.value.push({
        ...userInfo.value.currentJob,
        startDate: userInfo.value.joinDate,
        endDate: completionDate.toISOString().split('T')[0],
        duration: calculateDuration(userInfo.value.joinDate, completionDate)
      })
    }

    // 更新当前职位
    userInfo.value.currentJob = {
      id: jobData.id,
      title: jobData.title,
      salary: jobData.monthlyGold || jobData.salary,
      experience: jobData.experience,
      education: jobData.education,
      tags: jobData.tags,
      completedDate: completionDate.toISOString().split('T')[0]
    }

    // 更新薪资
    userInfo.value.currentSalary = jobData.monthlyGold || jobData.salary

    // 更新入职日期
    userInfo.value.joinDate = completionDate.toISOString().split('T')[0]

    // 添加成就
    addAchievement({
      id: `job_completed_${jobData.id}`,
      title: `完成「${jobData.title}」学习`,
      description: `成功掌握${jobData.title}所需的全部技能`,
      icon: '🎓',
      date: completionDate.toISOString().split('T')[0],
      type: 'job_completion'
    })

    // 保存到本地存储
    saveToStorage()

    return {
      success: true,
      message: `恭喜！你已成功转职为「${jobData.title}」，月薪提升至 ${userInfo.value.currentSalary} 金币！`,
      newSalary: userInfo.value.currentSalary,
      oldSalary: careerHistory.value.length > 0 ? careerHistory.value[careerHistory.value.length - 1].salary : 0
    }
  }

  /**
   * 计算工作时长
   */
  const calculateDuration = (startDate, endDate) => {
    if (!startDate) return '未知'
    const start = new Date(startDate)
    const end = new Date(endDate)
    const months = Math.floor((end - start) / (1000 * 60 * 60 * 24 * 30))
    if (months < 1) return '不足1个月'
    if (months < 12) return `${months}个月`
    const years = Math.floor(months / 12)
    const remainingMonths = months % 12
    return remainingMonths > 0 ? `${years}年${remainingMonths}个月` : `${years}年`
  }

  /**
   * 添加成就
   */
  const addAchievement = (achievement) => {
    // 检查是否已存在
    const exists = userInfo.value.achievements.some(a => a.id === achievement.id)
    if (!exists) {
      userInfo.value.achievements.push({
        ...achievement,
        timestamp: Date.now()
      })
      saveToStorage()
    }
  }

  /**
   * 更新连续学习天数
   */
  const updateStreakDays = () => {
    const today = new Date().toISOString().split('T')[0]
    const lastActive = userInfo.value.lastActiveDate

    if (!lastActive) {
      // 第一次活跃
      userInfo.value.streakDays = 1
    } else if (lastActive === today) {
      // 今天已经活跃过，不增加
      return
    } else {
      const lastDate = new Date(lastActive)
      const todayDate = new Date(today)
      const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24))

      if (diffDays === 1) {
        // 连续的一天
        userInfo.value.streakDays += 1
      } else if (diffDays > 1) {
        // 中断了，重新开始
        userInfo.value.streakDays = 1
      }
    }

    userInfo.value.lastActiveDate = today
    saveToStorage()
  }

  /**
   * 增加经验值
   */
  const addExp = (exp) => {
    userInfo.value.totalExp += exp
    
    // 计算等级（每100经验升1级）
    const newLevel = Math.floor(userInfo.value.totalExp / 100) + 1
    const oldLevel = userInfo.value.level

    if (newLevel > oldLevel) {
      userInfo.value.level = newLevel
      // 可以在这里触发升级事件
      return {
        levelUp: true,
        oldLevel,
        newLevel
      }
    }

    saveToStorage()
    return { levelUp: false }
  }

  /**
   * 更新用户基本信息
   */
  const updateUserInfo = (updates) => {
    userInfo.value = { ...userInfo.value, ...updates }
    saveToStorage()
  }

  /**
   * 更新工作设置
   */
  const updateWorkSettings = (settings) => {
    const { workStart, workEnd, workSchedule, workDays } = settings
    if (workStart) userInfo.value.workStart = workStart
    if (workEnd) userInfo.value.workEnd = workEnd
    if (workSchedule) userInfo.value.workSchedule = workSchedule
    if (workDays !== undefined) userInfo.value.workDays = workDays
    saveToStorage()
  }

  /**
   * 更新生活设置
   */
  const updateLifeSettings = (settings) => {
    const { salary, peopleCount, rent, utilities, savingsRate } = settings
    if (salary !== undefined) userInfo.value.currentSalary = salary
    if (peopleCount !== undefined) userInfo.value.peopleCount = peopleCount
    if (rent !== undefined) userInfo.value.rent = rent
    if (utilities !== undefined) userInfo.value.utilities = utilities
    if (savingsRate !== undefined) userInfo.value.savingsRate = savingsRate
    saveToStorage()
  }

  /**
   * 更新主题设置
   */
  const updateTheme = (theme) => {
    userInfo.value.theme = theme
    saveToStorage()
    
    // 同步到 localStorage 和 DOM
    localStorage.setItem('theme', theme)
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  /**
   * 重置用户数据（用于测试或重新开始）
   */
  const resetUserData = () => {
    const createdAt = userInfo.value.createdAt
    userInfo.value = {
      name: '职场冒险者',
      avatar: '🎮',
      email: '',
      phone: '',
      city: '杭州',
      currentJob: null,
      currentSalary: 10000,
      joinDate: '',
      workStart: '09:00',
      workEnd: '18:00',
      workSchedule: 'double',
      workDays: 22,
      peopleCount: 1,
      rent: 2000,
      utilities: 300,
      savingsRate: 30,
      level: 1,
      totalExp: 0,
      achievements: [],
      streakDays: 0,
      lastActiveDate: null,
      theme: 'light',
      notifications: true,
      weeklyGoal: 10,
      isInitialized: false,
      createdAt: createdAt || new Date().toISOString()
    }
    careerHistory.value = []
    saveToStorage()
  }

  /**
   * 保存到本地存储
   */
  const saveToStorage = () => {
    localStorage.setItem('userStore', JSON.stringify({
      userInfo: userInfo.value,
      careerHistory: careerHistory.value
    }))
  }

  /**
   * 从本地存储加载
   */
  const loadFromStorage = () => {
    const stored = localStorage.getItem('userStore')
    if (stored) {
      try {
        const data = JSON.parse(stored)
        userInfo.value = { ...userInfo.value, ...data.userInfo }
        careerHistory.value = data.careerHistory || []
      } catch (error) {
        console.error('加载用户数据失败:', error)
      }
    }
  }

  /**
   * 获取职业统计数据
   */
  const getCareerStats = computed(() => {
    return {
      totalJobs: careerHistory.value.length + (hasCurrentJob.value ? 1 : 0),
      currentSalary: userInfo.value.currentSalary,
      salaryGrowth: salaryGrowth.value,
      totalAchievements: userInfo.value.achievements.length,
      currentLevel: userInfo.value.level,
      streakDays: userInfo.value.streakDays
    }
  })

  return {
    // 状态
    userInfo,
    careerHistory,
    // 计算属性
    hasCurrentJob,
    currentJobTitle,
    salaryGrowth,
    getCareerStats,
    // 方法
    updateCareer,
    updateUserInfo,
    updateWorkSettings,
    updateLifeSettings,
    updateTheme,
    addAchievement,
    updateStreakDays,
    addExp,
    resetUserData,
    saveToStorage,
    loadFromStorage
  }
})
