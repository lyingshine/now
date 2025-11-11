import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useJobsStore = defineStore('jobs', () => {
  // 状态
  const jobs = ref([])
  const learningPlans = ref([])
  const userProgress = ref({})

  // 计算属性
  const acceptedJobs = computed(() => {
    return jobs.value.filter(job => userProgress.value[job.id]?.accepted)
  })

  const totalLearningHours = computed(() => {
    return learningPlans.value.reduce((total, plan) => {
      return total + plan.skills.reduce((skillTotal, skill) => {
        return skillTotal + skill.steps.reduce((stepTotal, step) => {
          return stepTotal + step.tasks.reduce((taskTotal, task) => {
            return taskTotal + (task.completed ? task.actualHours : 0)
          }, 0)
        }, 0)
      }, 0)
    }, 0)
  })

  // 方法
  const loadJobs = (jobsData) => {
    jobs.value = jobsData
  }

  const acceptJob = (jobId) => {
    const job = jobs.value.find(j => j.id === jobId)
    if (!job) return

    // 标记为已接取
    if (!userProgress.value[jobId]) {
      userProgress.value[jobId] = {}
    }
    userProgress.value[jobId].accepted = true
    userProgress.value[jobId].acceptedDate = new Date().toISOString().split('T')[0]

    // 生成学习计划
    generateLearningPlan(job)

    // 保存到 localStorage
    saveToStorage()
  }

  const generateLearningPlan = (job) => {
    const plan = {
      jobId: job.id,
      jobTitle: job.title,
      salary: job.salary,
      acceptedDate: new Date().toISOString().split('T')[0],
      startDate: new Date().toISOString().split('T')[0],
      weeklyHours: 10,
      overallProgress: 0,
      estimatedWeeks: job.requirements.length * 4,
      estimatedEndDate: '',
      skills: []
    }

    // 为每项技能生成学习步骤
    job.requirements.forEach((req, index) => {
      const skill = {
        skillId: req.id,
        skillName: req.text,
        reward: extractReward(req.reward || ''),
        progress: 0,
        status: 'not_started',
        steps: generateSteps(req, index)
      }
      plan.skills.push(skill)
    })

    // 计算结束日期
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + plan.estimatedWeeks * 7)
    plan.estimatedEndDate = endDate.toISOString().split('T')[0]

    // 添加到学习计划列表
    const existingIndex = learningPlans.value.findIndex(p => p.jobId === job.id)
    if (existingIndex >= 0) {
      learningPlans.value[existingIndex] = plan
    } else {
      learningPlans.value.push(plan)
    }
  }

  const extractReward = (rewardText) => {
    const match = rewardText.match(/\+(\d+)/)
    return match ? parseInt(match[1]) : 0
  }

  const generateSteps = (requirement, skillIndex) => {
    const steps = []
    const baseWeek = skillIndex * 4

    // 解析成长任务
    const tasks = parseGrowthTask(requirement.growthTask)
    const tasksPerWeek = Math.ceil(tasks.length / 4)

    for (let week = 1; week <= 4; week++) {
      const weekTasks = tasks.slice((week - 1) * tasksPerWeek, week * tasksPerWeek)
      steps.push({
        week: baseWeek + week,
        title: `第${baseWeek + week}周：${getWeekTitle(requirement, week)}`,
        description: getWeekDescription(week),
        tasks: weekTasks.map((task, idx) => ({
          id: `task_${skillIndex}_${week}_${idx}`,
          text: task,
          estimatedHours: 8,
          actualHours: 0,
          completed: false,
          completedDate: null,
          notes: ''
        })),
        resources: getWeekResources(),
        completed: false
      })
    }

    return steps
  }

  const parseGrowthTask = (taskText) => {
    taskText = taskText.replace(/【任务】/g, '')
    const tasks = taskText.split('+').map(t => t.trim()).filter(t => t)
    return tasks.length > 0 ? tasks : ['学习相关知识', '完成实践项目', '总结学习笔记']
  }

  const getWeekTitle = (requirement, week) => {
    const skillName = requirement.text.split('：')[0] || requirement.text.substring(0, 20)
    const weekTitles = {
      1: `${skillName} - 基础学习`,
      2: `${skillName} - 实践项目`,
      3: `${skillName} - 进阶学习`,
      4: `${skillName} - 综合应用`
    }
    return weekTitles[week] || `${skillName} - 学习`
  }

  const getWeekDescription = (week) => {
    const descriptions = {
      1: '掌握基础理论知识，了解核心概念',
      2: '通过实践项目巩固所学知识',
      3: '学习进阶内容，提升技能水平',
      4: '综合运用所学，完成完整项目'
    }
    return descriptions[week] || '继续学习和实践'
  }

  const getWeekResources = () => {
    return [
      {
        type: 'doc',
        name: '官方文档',
        url: '#',
        rating: 5,
        reason: '最权威的学习资料'
      },
      {
        type: 'video',
        name: '视频教程',
        url: '#',
        rating: 4.5,
        reason: '适合初学者的视频课程'
      }
    ]
  }

  const toggleTask = (planId, skillIndex, stepIndex, taskIndex) => {
    const plan = learningPlans.value.find(p => p.jobId === planId)
    if (!plan) return

    const task = plan.skills[skillIndex].steps[stepIndex].tasks[taskIndex]
    task.completed = !task.completed
    if (task.completed) {
      task.completedDate = new Date().toISOString().split('T')[0]
      task.actualHours = task.estimatedHours
    } else {
      task.completedDate = null
      task.actualHours = 0
    }

    // 更新进度
    updateProgress(plan)
    saveToStorage()
  }

  const updateProgress = (plan) => {
    // 更新每个技能的进度
    plan.skills.forEach(skill => {
      const totalTasks = skill.steps.reduce((sum, step) => sum + step.tasks.length, 0)
      const completedTasks = skill.steps.reduce((sum, step) => 
        sum + step.tasks.filter(t => t.completed).length, 0
      )
      skill.progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

      // 更新技能状态
      if (skill.progress === 0) {
        skill.status = 'not_started'
      } else if (skill.progress === 100) {
        skill.status = 'completed'
      } else {
        skill.status = 'in_progress'
      }
    })

    // 更新整体进度
    const avgProgress = plan.skills.reduce((sum, skill) => sum + skill.progress, 0) / plan.skills.length
    plan.overallProgress = Math.round(avgProgress)

    // 检查是否完成所有任务
    if (plan.overallProgress === 100 && !plan.completed) {
      completeJob(plan)
    }
  }

  const completeJob = (plan) => {
    // 标记计划为已完成
    plan.completed = true
    plan.completedDate = new Date().toISOString().split('T')[0]

    // 更新用户进度
    if (userProgress.value[plan.jobId]) {
      userProgress.value[plan.jobId].completed = true
      userProgress.value[plan.jobId].completedDate = plan.completedDate
    }

    // 触发职业更新事件（通过自定义事件通知其他组件）
    const jobData = jobs.value.find(j => j.id === plan.jobId)
    if (jobData) {
      // 派发自定义事件
      window.dispatchEvent(new CustomEvent('job-completed', {
        detail: {
          jobId: plan.jobId,
          jobData: jobData,
          completedDate: plan.completedDate
        }
      }))
    }

    saveToStorage()
  }

  const abandonJob = (jobId) => {
    // 删除用户进度
    if (userProgress.value[jobId]) {
      delete userProgress.value[jobId]
    }

    // 删除学习计划
    const planIndex = learningPlans.value.findIndex(p => p.jobId === jobId)
    if (planIndex >= 0) {
      learningPlans.value.splice(planIndex, 1)
    }

    // 保存到 localStorage
    saveToStorage()
  }

  const saveToStorage = () => {
    localStorage.setItem('jobsStore', JSON.stringify({
      userProgress: userProgress.value,
      learningPlans: learningPlans.value
    }))
  }

  const loadFromStorage = () => {
    const stored = localStorage.getItem('jobsStore')
    if (stored) {
      const data = JSON.parse(stored)
      userProgress.value = data.userProgress || {}
      learningPlans.value = data.learningPlans || []
    }
  }

  return {
    // 状态
    jobs,
    learningPlans,
    userProgress,
    // 计算属性
    acceptedJobs,
    totalLearningHours,
    // 方法
    loadJobs,
    acceptJob,
    abandonJob,
    toggleTask,
    saveToStorage,
    loadFromStorage
  }
})
