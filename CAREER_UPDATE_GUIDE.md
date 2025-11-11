# 职业自动更新功能说明

## 功能概述

实现了任务完成后自动更新用户职业和月薪的功能，让用户的职业发展路径更加清晰和真实。

## 核心功能

### 1. 任务完成自动更新职业

当用户完成任务大厅的学习任务后，系统会自动：

- ✅ 更新用户当前职业信息
- ✅ 更新月薪到新职位的薪资水平
- ✅ 记录职业变更历史
- ✅ 添加职业成就
- ✅ 更新用户经验值
- ✅ 更新连续学习天数

### 2. 职业信息展示

**在设置面板中显示：**
- 当前职业名称
- 当前月薪
- 入职时间
- 职业历史记录

**在首次使用向导中：**
- 可选填写当前职业
- 设置初始月薪

## 技术实现

### 1. Quest Store 更新

修改了 `confirmQuestCompletion` 方法，返回完整的任务数据：

```javascript
function confirmQuestCompletion() {
  // ... 验证逻辑
  
  const jobData = {
    id: completedQuest.jobId,
    title: completedQuest.jobTitle,
    salary: completedQuest.salary,
    completedDate: new Date().toISOString(),
    totalExp: completedQuest.totalExp,
    level: completedQuest.currentLevel,
    stats: { ...completedQuest.stats }
  }
  
  return { 
    success: true, 
    jobData,
    message: '恭喜完成任务！'
  }
}
```

### 2. Growth.vue 更新

在任务完成处理函数中集成职业更新：

```javascript
const handleCompleteQuest = () => {
  // 保存当前任务数据
  const currentQuestData = questStore.currentQuest
  
  // 确认完成任务
  const result = questStore.confirmQuestCompletion()
  
  if (result.success) {
    // 获取岗位数据
    const jobData = jobsData.find(j => j.id === result.jobData.id)
    
    // 更新用户职业信息
    const oldSalary = userStore.userInfo.currentSalary
    const careerResult = userStore.updateCareer(jobData, new Date())
    
    // 增加经验值
    userStore.addExp(result.jobData.totalExp)
    
    // 显示完成弹窗
    showJobCompletionModal.value = true
  }
}
```

### 3. User Store 职业管理

`updateCareer` 方法负责更新职业信息：

```javascript
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
    completedDate: completionDate.toISOString().split('T')[0]
  }

  // 更新薪资
  userInfo.value.currentSalary = jobData.monthlyGold || jobData.salary
  
  // 添加成就
  addAchievement({
    id: `job_completed_${jobData.id}`,
    title: `完成「${jobData.title}」学习`,
    icon: '🎓',
    date: completionDate.toISOString().split('T')[0]
  })

  saveToStorage()
  
  return {
    success: true,
    message: `恭喜！你已成功转职为「${jobData.title}」`,
    newSalary: userInfo.value.currentSalary
  }
}
```

## 数据流程

```
用户完成所有子任务
    ↓
点击"确认完成任务"
    ↓
questStore.confirmQuestCompletion()
    ↓
返回任务完成数据
    ↓
userStore.updateCareer(jobData)
    ↓
更新职业信息和薪资
    ↓
保存到 localStorage
    ↓
显示完成弹窗
    ↓
展示薪资增长和成就
```

## UI 更新

### 1. 设置面板 - 个人信息标签

新增"当前职业"卡片，显示：
- 💼 职业图标
- 职业名称
- 月薪
- 入职时间

```vue
<div class="current-job-card">
  <div class="job-card-header">
    <span class="job-icon">💼</span>
    <span class="job-label">当前职业</span>
  </div>
  <div class="job-card-content">
    <div class="job-title">{{ currentJobInfo.title }}</div>
    <div class="job-salary">月薪：¥{{ formatNumber(currentJobInfo.salary) }}</div>
    <div class="job-date">入职时间：{{ currentJobInfo.startDate }}</div>
  </div>
</div>
```

### 2. 欢迎向导 - 生活信息步骤

新增"当前职业"输入框（可选）：
- 用户可以填写已有的职业
- 系统会保存为初始职业信息

### 3. 任务完成弹窗

显示完整的职业变更信息：
- 旧薪资 → 新薪资
- 薪资增长百分比
- 学习时长统计
- 完成任务数量
- 掌握技能数量

## 数据结构

### userInfo.currentJob

```javascript
{
  id: 'job_id',
  title: '前端开发工程师',
  salary: 15000,
  startDate: '2024-01-01',
  completedDate: '2024-03-01'
}
```

### careerHistory

```javascript
[
  {
    id: 'job_1',
    title: '初级前端开发',
    salary: 10000,
    startDate: '2023-06-01',
    endDate: '2024-01-01',
    duration: '7个月'
  },
  {
    id: 'job_2',
    title: '前端开发工程师',
    salary: 15000,
    startDate: '2024-01-01',
    endDate: '2024-03-01',
    duration: '2个月'
  }
]
```

## 使用示例

### 1. 完成任务流程

```javascript
// 1. 用户在任务大厅接取任务
questStore.acceptQuest(jobId, jobData)

// 2. 完成所有子任务
questStore.completeTask(subQuestId, taskId)

// 3. 确认完成任务
const result = questStore.confirmQuestCompletion()

// 4. 自动更新职业
if (result.success) {
  userStore.updateCareer(jobData)
}
```

### 2. 查看职业信息

```javascript
// 获取当前职业
const currentJob = userStore.userInfo.currentJob

// 获取职业历史
const history = userStore.careerHistory

// 获取职业统计
const stats = userStore.getCareerStats
// {
//   totalJobs: 3,
//   currentSalary: 15000,
//   salaryGrowth: '50%',
//   totalAchievements: 5
// }
```

## 注意事项

1. **数据持久化**
   - 所有职业信息自动保存到 localStorage
   - 刷新页面不会丢失数据

2. **向后兼容**
   - 保留了旧的 jobsStore 逻辑
   - 新旧系统可以并存

3. **错误处理**
   - 如果找不到职位数据，会显示提示
   - 任务完成失败会返回错误信息

4. **成就系统**
   - 每完成一个职位自动添加成就
   - 成就记录在用户信息中

## 未来扩展

- [ ] 职业发展路径可视化
- [ ] 薪资增长趋势图表
- [ ] 职业推荐系统
- [ ] 技能树关联
- [ ] 行业对比分析
- [ ] 职业证书系统

---

**更新日期**: 2024-11-12
**版本**: 2.1.0
