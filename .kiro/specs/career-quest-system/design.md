# 职业任务系统设计文档

## 概述

本文档描述职业任务系统的技术设计，实现"一生少数任务，专注当前目标，100级满级成长"的核心理念。

## 架构设计

### 系统架构

```
┌─────────────────────────────────────────────────────────┐
│                      用户界面层                          │
├─────────────────────────────────────────────────────────┤
│  任务大厅  │  当前任务  │  任务详情  │  历史记录  │  设置  │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                      业务逻辑层                          │
├─────────────────────────────────────────────────────────┤
│  任务管理  │  等级系统  │  经验计算  │  奖励系统  │  状态机 │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                      数据持久层                          │
├─────────────────────────────────────────────────────────┤
│         Pinia Store + LocalStorage                      │
└─────────────────────────────────────────────────────────┘
```

### 状态机设计

```
[无任务] ──接取任务──> [进行中] ──完成所有子任务──> [待确认]
   ↑                      │                          │
   │                   放弃任务                    确认完成
   │                      │                          │
   └──────────────────────┴──────────────────────────┘
```

## 组件设计

### 1. 任务大厅组件 (QuestHall.vue)

**职责**: 展示可选任务，处理任务接取

**Props**:
- `jobs`: Array - 所有可用职位
- `hasActiveQuest`: Boolean - 是否有进行中的任务

**Events**:
- `accept-quest`: 接取任务
- `view-detail`: 查看任务详情

**状态**:
```javascript
{
  selectedJob: null,
  showRewardSetup: false,
  customRewards: {}
}
```

### 2. 当前任务组件 (CurrentQuest.vue)

**职责**: 显示当前任务进度，管理子任务

**Props**:
- `quest`: Object - 当前任务数据

**Events**:
- `complete-subtask`: 完成子任务
- `abandon-quest`: 放弃任务
- `confirm-completion`: 确认任务完成

**计算属性**:
```javascript
{
  currentLevel: computed(() => Math.floor(quest.totalExp / 100) + 1),
  expProgress: computed(() => quest.totalExp % 100),
  completionRate: computed(() => completedSubtasks / totalSubtasks * 100)
}
```

### 3. 等级系统组件 (LevelSystem.vue)

**职责**: 显示等级、经验值、升级动画

**Props**:
- `level`: Number - 当前等级 (1-100)
- `currentExp`: Number - 当前经验值
- `maxExp`: Number - 升级所需经验值

**特性**:
- 经验值进度条动画
- 升级时的特效动画
- 等级里程碑提示（25级、50级、75级、100级）

### 4. 奖励设置组件 (RewardSetup.vue)

**职责**: 让用户设置子任务和终极奖励

**Props**:
- `subtasks`: Array - 子任务列表
- `initialRewards`: Object - 初始奖励设置

**Events**:
- `save-rewards`: 保存奖励设置

**数据结构**:
```javascript
{
  subtaskRewards: {
    'subtask-1': '给自己买一杯咖啡',
    'subtask-2': '看一场电影',
    // ...
  },
  ultimateReward: '升职加薪，实现财务自由'
}
```

### 5. 任务完成确认组件 (QuestCompletionModal.vue)

**职责**: 显示任务完成总结，确认完成

**Props**:
- `quest`: Object - 完成的任务
- `stats`: Object - 统计数据

**特性**:
- 烟花动画效果
- 终极奖励展示
- 成就徽章解锁
- 分享功能

## 数据模型

### Quest (任务)

```typescript
interface Quest {
  id: number
  jobId: number
  jobTitle: string
  salary: number
  status: 'in_progress' | 'completed' | 'abandoned'
  
  // 时间信息
  startDate: string
  completedDate?: string
  estimatedDuration: number // 预计天数
  
  // 等级系统
  currentLevel: number // 1-100
  totalExp: number // 0-10000
  maxExp: number // 固定10000
  
  // 子任务
  subtasks: SubTask[]
  completedSubtasks: number
  
  // 奖励
  rewards: {
    subtaskRewards: Record<string, string>
    ultimateReward: string
  }
  
  // 统计
  stats: {
    totalLearningHours: number
    daysSpent: number
    levelUps: number
  }
}
```

### SubTask (子任务)

```typescript
interface SubTask {
  id: string
  name: string
  description: string
  difficulty: 'basic' | 'intermediate' | 'advanced' | 'expert'
  
  // 经验值
  expReward: number // 根据难度和权重计算
  weight: number // 1.0, 1.5, 2.0, 2.5
  
  // 状态
  completed: boolean
  completedDate?: string
  
  // 学习步骤
  steps: LearningStep[]
  
  // 自定义奖励
  customReward?: string
}
```

### LearningStep (学习步骤)

```typescript
interface LearningStep {
  id: string
  title: string
  description: string
  estimatedHours: number
  completed: boolean
  resources: Resource[]
}
```

## 核心算法

### 1. 经验值分配算法

```javascript
function calculateExpDistribution(subtasks) {
  const TOTAL_EXP = 10000 // 100级 * 100经验/级
  
  // 计算总权重
  const totalWeight = subtasks.reduce((sum, task) => {
    const weight = getWeightByDifficulty(task.difficulty)
    return sum + weight
  }, 0)
  
  // 分配经验值
  return subtasks.map(task => {
    const weight = getWeightByDifficulty(task.difficulty)
    const exp = Math.floor((weight / totalWeight) * TOTAL_EXP)
    return { ...task, expReward: exp }
  })
}

function getWeightByDifficulty(difficulty) {
  const weights = {
    basic: 1.0,
    intermediate: 1.5,
    advanced: 2.0,
    expert: 2.5
  }
  return weights[difficulty] || 1.0
}
```

### 2. 等级计算算法

```javascript
function calculateLevel(totalExp) {
  const EXP_PER_LEVEL = 100
  return Math.min(Math.floor(totalExp / EXP_PER_LEVEL) + 1, 100)
}

function getExpForNextLevel(currentExp) {
  const EXP_PER_LEVEL = 100
  return EXP_PER_LEVEL - (currentExp % EXP_PER_LEVEL)
}

function getLevelProgress(currentExp) {
  const EXP_PER_LEVEL = 100
  return (currentExp % EXP_PER_LEVEL) / EXP_PER_LEVEL * 100
}
```

### 3. 任务状态验证

```javascript
function canAcceptNewQuest(currentQuest) {
  // 只有在没有进行中的任务时才能接取新任务
  return !currentQuest || currentQuest.status !== 'in_progress'
}

function canCompleteQuest(quest) {
  // 所有子任务都完成才能确认完成
  return quest.completedSubtasks === quest.subtasks.length
}

function validateQuestCompletion(quest) {
  const allSubtasksCompleted = quest.subtasks.every(st => st.completed)
  const reachedMaxLevel = quest.currentLevel === 100
  return allSubtasksCompleted && reachedMaxLevel
}
```

## Store 设计

### QuestStore (Pinia)

```javascript
export const useQuestStore = defineStore('quest', () => {
  // 状态
  const currentQuest = ref(null)
  const questHistory = ref([])
  const availableJobs = ref([])
  
  // 计算属性
  const hasActiveQuest = computed(() => {
    return currentQuest.value?.status === 'in_progress'
  })
  
  const currentLevel = computed(() => {
    if (!currentQuest.value) return 1
    return calculateLevel(currentQuest.value.totalExp)
  })
  
  // 方法
  function acceptQuest(jobId, rewards) {
    // 创建新任务
    // 初始化等级为1
    // 分配经验值
    // 保存到 localStorage
  }
  
  function completeSubtask(subtaskId) {
    // 标记子任务完成
    // 增加经验值
    // 检查是否升级
    // 触发升级动画
  }
  
  function confirmQuestCompletion() {
    // 验证任务完成
    // 标记为已完成
    // 添加到历史记录
    // 解锁成就
  }
  
  function abandonQuest() {
    // 标记为已放弃
    // 添加到历史记录
    // 清空当前任务
  }
  
  return {
    currentQuest,
    questHistory,
    hasActiveQuest,
    currentLevel,
    acceptQuest,
    completeSubtask,
    confirmQuestCompletion,
    abandonQuest
  }
})
```

## UI/UX 设计

### 视觉层次

1. **首页** - 当前任务进度（如果有）
   - 大型等级显示（Lv.XX / 100）
   - 经验值进度条
   - 子任务完成进度
   - "继续任务"按钮

2. **任务大厅** - 职位选择
   - 仅在无进行中任务时可访问
   - 职位卡片展示
   - 难度标识
   - 预计学习时长

3. **任务详情** - 子任务列表
   - 任务树状结构
   - 完成状态标识
   - 经验值奖励
   - 自定义奖励

4. **历史记录** - 已完成任务
   - 时间线展示
   - 成就徽章
   - 统计数据

### 动画效果

1. **升级动画**
   - 光芒四射效果
   - 等级数字放大
   - 音效（可选）

2. **任务完成动画**
   - 烟花特效
   - 成就解锁
   - 奖励展示

3. **经验值增加**
   - 数字滚动动画
   - 进度条填充
   - 粒子效果

### 交互设计

1. **任务接取流程**
   ```
   选择职位 → 查看详情 → 设置奖励 → 确认接取 → 开始任务
   ```

2. **子任务完成流程**
   ```
   查看子任务 → 完成学习步骤 → 勾选完成 → 获得经验 → 升级（如果满足）
   ```

3. **任务完成流程**
   ```
   完成所有子任务 → 达到100级 → 点击确认 → 查看总结 → 获得终极奖励
   ```

## 错误处理

### 1. 数据一致性

- 定期验证经验值总和
- 检查等级计算准确性
- 防止重复接取任务

### 2. 边界情况

- 经验值溢出处理（最大10000）
- 等级上限处理（最大100）
- 空任务列表处理

### 3. 用户操作

- 防止误操作（二次确认）
- 数据丢失保护（自动保存）
- 网络异常处理（本地优先）

## 性能优化

1. **懒加载** - 历史记录按需加载
2. **虚拟滚动** - 大量子任务列表
3. **防抖节流** - 经验值更新
4. **缓存策略** - 计算结果缓存

## 测试策略

### 单元测试

- 经验值分配算法
- 等级计算函数
- 任务状态验证

### 集成测试

- 任务接取流程
- 子任务完成流程
- 任务完成确认流程

### E2E 测试

- 完整用户旅程
- 多任务切换
- 数据持久化

## 技术栈

- **框架**: Vue 3 (Composition API)
- **状态管理**: Pinia
- **路由**: Vue Router
- **动画**: CSS Animations + Transition
- **存储**: LocalStorage
- **构建**: Vite

## 迁移计划

### 阶段1: 数据模型重构
- 创建新的 Quest 数据结构
- 迁移现有 learningPlans 数据
- 实现经验值计算

### 阶段2: 核心功能实现
- 单一任务限制
- 100级系统
- 子任务管理

### 阶段3: UI 改造
- 等级显示组件
- 任务进度界面
- 奖励设置界面

### 阶段4: 高级功能
- 历史记录
- 成就系统
- 智能推荐

---

**文档版本**: 1.0  
**创建日期**: 2025-01-XX  
**状态**: 待审核
