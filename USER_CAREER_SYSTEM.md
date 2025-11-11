# 用户职业系统说明

## 📋 功能概述

当用户完成岗位的所有子任务后，系统会自动更新用户的职业信息，包括：
- 当前职位
- 月薪水平
- 入职日期
- 职业历史记录
- 成就解锁
- 经验值增加

---

## 🎯 核心功能

### 1. 用户状态管理（User Store）

新增 `src/stores/user.js`，管理用户的职业信息：

```javascript
// 用户基本信息
userInfo: {
  name: '职场冒险者',
  avatar: '🎮',
  currentJob: null,        // 当前职位
  currentSalary: 10000,    // 当前薪资
  joinDate: '',            // 入职日期
  level: 1,                // 用户等级
  totalExp: 0,             // 总经验值
  achievements: [],        // 成就列表
  streakDays: 0,           // 连续学习天数
  lastActiveDate: null     // 最后活跃日期
}

// 职业历史记录
careerHistory: [
  {
    id: 1,
    title: '前端工程师',
    salary: 18000,
    startDate: '2024-01-01',
    endDate: '2024-06-01',
    duration: '5个月'
  }
]
```

### 2. 自动职业更新

#### 触发时机
当用户完成岗位的所有子任务（进度达到 100%）时，系统会：

1. **检测完成状态**（jobs.js）
```javascript
const updateProgress = (plan) => {
  // ... 更新进度逻辑
  
  // 检查是否完成所有任务
  if (plan.overallProgress === 100 && !plan.completed) {
    completeJob(plan)  // 触发完成流程
  }
}
```

2. **派发完成事件**
```javascript
window.dispatchEvent(new CustomEvent('job-completed', {
  detail: {
    jobId: plan.jobId,
    jobData: jobData,
    completedDate: plan.completedDate
  }
}))
```

3. **更新用户职业**（Growth.vue）
```javascript
const handleCompleteQuest = () => {
  // 获取岗位数据
  const jobData = jobsData.find(j => j.id === questStore.currentQuest.jobId)
  
  // 更新用户职业信息
  const result = userStore.updateCareer(jobData, new Date())
  
  // 增加经验值
  userStore.addExp(jobData.expReward)
  
  // 更新连续学习天数
  userStore.updateStreakDays()
  
  // 显示完成弹窗
  showJobCompletionModal.value = true
}
```

### 3. 职业完成弹窗

新增 `JobCompletionModal.vue` 组件，展示：

- 🎉 庆祝动画
- 💰 薪资提升对比（旧薪资 → 新薪资）
- ⭐ 经验值奖励
- 🏆 成就解锁
- 📊 学习统计（学习时长、完成任务数、掌握技能数）
- 🚀 下一步建议

---

## 🔄 完整流程

### 用户视角

1. **接取任务**
   - 在任务大厅选择岗位
   - 点击"接取任务"

2. **学习过程**
   - 按照"理论-实践-输出"三阶段学习
   - 完成每个子任务
   - 获得阶段性金币奖励

3. **任务完成**
   - 所有子任务完成后，进度达到 100%
   - 点击"确认完成任务"按钮
   - 系统自动更新职业信息

4. **职业更新**
   - 弹出完成庆祝弹窗
   - 显示薪资提升、经验值、成就
   - 职业信息自动更新
   - 职业历史记录保存

5. **继续成长**
   - 查看更多岗位
   - 继续学习更高级的职位

### 系统流程

```
用户完成最后一个子任务
    ↓
jobs.updateProgress() 检测进度 = 100%
    ↓
jobs.completeJob() 标记任务完成
    ↓
派发 'job-completed' 事件
    ↓
Growth.vue 监听事件
    ↓
userStore.updateCareer() 更新职业
    ↓
保存职业历史记录
    ↓
添加成就
    ↓
增加经验值
    ↓
显示完成弹窗
    ↓
用户确认后跳转首页
```

---

## 📊 数据结构

### 当前职位信息
```javascript
currentJob: {
  id: 1,
  title: '前端工程师',
  salary: 18000,
  experience: '1-3年',
  education: '本科',
  tags: ['互联网', '技术'],
  completedDate: '2024-11-11'
}
```

### 职业历史记录
```javascript
careerHistory: [
  {
    id: 1,
    title: '前端工程师',
    salary: 18000,
    startDate: '2024-01-01',
    endDate: '2024-06-01',
    duration: '5个月'
  },
  {
    id: 2,
    title: 'Java 后端工程师',
    salary: 20000,
    startDate: '2024-06-01',
    endDate: '2024-11-11',
    duration: '5个月'
  }
]
```

### 成就系统
```javascript
achievements: [
  {
    id: 'job_completed_1',
    title: '完成「前端工程师」学习',
    description: '成功掌握前端工程师所需的全部技能',
    icon: '🎓',
    date: '2024-06-01',
    type: 'job_completion',
    timestamp: 1717200000000
  }
]
```

---

## 🎮 游戏化元素

### 1. 经验值系统
- 完成任务获得经验值（expReward）
- 每 100 经验值升 1 级
- 等级显示在首页顶部

### 2. 成就系统
- 完成岗位解锁成就
- 成就显示在用户信息中
- 可扩展更多成就类型

### 3. 连续学习天数
- 每天活跃自动更新
- 中断后重新计算
- 激励用户持续学习

### 4. 薪资增长统计
- 计算薪资增长百分比
- 展示职业发展轨迹
- 可视化收入提升

---

## 🔧 API 说明

### userStore 方法

#### updateCareer(jobData, completionDate)
更新用户职业信息
```javascript
const result = userStore.updateCareer(jobData, new Date())
// 返回: { success: true, message: '...', newSalary: 18000, oldSalary: 10000 }
```

#### addAchievement(achievement)
添加成就
```javascript
userStore.addAchievement({
  id: 'job_completed_1',
  title: '完成「前端工程师」学习',
  icon: '🎓',
  type: 'job_completion'
})
```

#### addExp(exp)
增加经验值
```javascript
const result = userStore.addExp(3600)
// 返回: { levelUp: true, oldLevel: 1, newLevel: 2 }
```

#### updateStreakDays()
更新连续学习天数
```javascript
userStore.updateStreakDays()
```

#### getCareerStats
获取职业统计数据
```javascript
const stats = userStore.getCareerStats
// {
//   totalJobs: 2,
//   currentSalary: 20000,
//   salaryGrowth: '100.0',
//   totalAchievements: 5,
//   currentLevel: 3,
//   streakDays: 15
// }
```

---

## 💾 数据持久化

所有用户数据自动保存到 localStorage：

```javascript
// 保存
userStore.saveToStorage()

// 加载
userStore.loadFromStorage()
```

存储键：`userStore`

---

## 🎨 UI 组件

### JobCompletionModal
任务完成弹窗，展示：
- 庆祝动画
- 职位信息
- 奖励详情
- 学习统计
- 下一步建议

Props:
- `isOpen`: Boolean - 是否显示
- `jobData`: Object - 岗位数据
- `oldSalary`: Number - 旧薪资
- `newSalary`: Number - 新薪资
- `learningDuration`: String - 学习时长
- `completedTasks`: Number - 完成任务数
- `totalSkills`: Number - 总技能数

Events:
- `close` - 关闭弹窗

---

## 🚀 使用示例

### 在组件中使用

```vue
<script setup>
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// 加载用户数据
onMounted(() => {
  userStore.loadFromStorage()
})

// 显示当前职位
const currentJob = computed(() => userStore.currentJobTitle)

// 显示薪资增长
const salaryGrowth = computed(() => userStore.salaryGrowth)

// 显示成就数量
const achievementCount = computed(() => userStore.userInfo.achievements.length)
</script>
```

---

## 📈 未来扩展

### 1. 职业路径推荐
根据当前职位推荐下一个合适的岗位

### 2. 技能树可视化
展示已掌握的技能和待学习的技能

### 3. 职业对比
对比不同职位的薪资、难度、前景

### 4. 社交功能
分享职业成就，查看其他用户的职业路径

### 5. 数据分析
统计学习效率、薪资增长趋势等

---

## 🐛 注意事项

1. **数据同步**
   - userStore 和 salaryData 需要保持同步
   - 在 Home.vue 中调用 `syncSalaryFromUser()`

2. **事件监听**
   - 记得在组件卸载时移除事件监听
   - 避免内存泄漏

3. **数据验证**
   - 检查 jobData 是否存在
   - 处理异常情况

4. **用户体验**
   - 完成弹窗要有庆祝感
   - 动画流畅自然
   - 信息展示清晰

---

**更新时间**：2025-11-11  
**版本**：v1.0  
**状态**：已完成
