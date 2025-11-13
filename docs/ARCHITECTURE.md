# NOW 职场成长平台 - 系统架构文档

## 📋 目录

- [项目概述](#项目概述)
- [技术栈](#技术栈)
- [项目结构](#项目结构)
- [模块架构](#模块架构)
- [数据流架构](#数据流架构)
- [路由架构](#路由架构)
- [状态管理](#状态管理)
- [组件架构](#组件架构)
- [数据持久化](#数据持久化)
- [性能优化](#性能优化)

---

## 项目概述

NOW 是一个职场成长平台，帮助用户规划职业发展路径、学习技能、追踪成长进度。

### 核心功能
- 🏠 **首页** - 全屏滚动展示，介绍平台功能
- 💼 **职位探索** - 浏览和筛选职位，制定学习计划
- 📈 **成长追踪** - 可视化展示学习进度和成就
- 🎯 **职业路径** - 时间线展示职业发展路径
- ⚙️ **个人设置** - 用户信息和偏好设置

### 设计理念
- **沉浸式体验** - 全屏设计，无滚动条
- **视觉吸引** - 玻璃态效果，流畅动画
- **数据驱动** - 可视化展示用户数据
- **响应式设计** - 适配多种设备

---

## 技术栈

### 前端框架
- **Vue 3** - 渐进式 JavaScript 框架
- **Composition API** - 组合式 API，更好的逻辑复用
- **Vue Router** - 官方路由管理器
- **Pinia** - 新一代状态管理库

### 构建工具
- **Vite** - 下一代前端构建工具
- **ESBuild** - 极速 JavaScript 打包器

### 样式方案
- **CSS Modules** - 模块化 CSS
- **设计令牌** - 统一的设计变量系统
- **响应式设计** - 移动端优先策略

### 数据可视化
- **Chart.js** - 图表库
- **自定义组件** - 定制化可视化组件

### 开发工具
- **ESLint** - 代码质量检查
- **Git** - 版本控制

---

## 项目结构

```
now/
├── public/                 # 静态资源
│   └── favicon.ico
├── src/
│   ├── assets/            # 资源文件
│   │   ├── images/        # 图片资源
│   │   └── icons/         # 图标资源
│   ├── components/        # 公共组件
│   │   ├── Navbar.vue           # 导航栏
│   │   ├── WelcomeWizard.vue    # 欢迎向导
│   │   ├── JobCard.vue          # 职位卡片
│   │   ├── SkillTag.vue         # 技能标签
│   │   ├── ProgressRing.vue     # 进度环
│   │   ├── TimelineItem.vue     # 时间线项
│   │   └── ...
│   ├── composables/       # 组合式函数
│   │   ├── useLifestyle.js      # 生活方式逻辑
│   │   ├── useCareer.js         # 职业路径逻辑
│   │   └── useTheme.js          # 主题切换逻辑
│   ├── data/              # 静态数据
│   │   ├── jobs-data.js         # 职位数据
│   │   ├── skills-data.js       # 技能数据
│   │   └── career-paths.js      # 职业路径数据
│   ├── router/            # 路由配置
│   │   └── index.js
│   ├── stores/            # 状态管理
│   │   ├── user.js              # 用户状态
│   │   ├── jobs.js              # 职位状态
│   │   └── quest.js             # 任务状态
│   ├── styles/            # 样式系统
│   │   ├── tokens/              # 设计令牌
│   │   ├── base/                # 基础样式
│   │   ├── layout/              # 布局系统
│   │   ├── components/          # 组件样式
│   │   ├── patterns/            # 模式样式
│   │   ├── animations/          # 动画系统
│   │   ├── utilities/           # 工具类
│   │   ├── responsive/          # 响应式
│   │   └── main.css             # 主入口
│   ├── utils/             # 工具函数
│   │   ├── dataMigration.js     # 数据迁移
│   │   ├── storage.js           # 本地存储
│   │   └── helpers.js           # 辅助函数
│   ├── views/             # 页面组件
│   │   ├── Home.vue             # 首页
│   │   ├── Jobs.vue             # 职位页
│   │   ├── Growth.vue           # 成长页
│   │   ├── Career.vue           # 职业页
│   │   └── Settings.vue         # 设置页
│   ├── App.vue            # 根组件
│   └── main.js            # 入口文件
├── .gitignore
├── package.json
├── vite.config.js
├── README.md
├── ARCHITECTURE.md        # 本文档
└── STYLE_ARCHITECTURE.md  # 样式架构文档
```

---

## 模块架构

### 核心模块

#### 1. 用户模块 (User Module)
**职责：** 管理用户信息、偏好设置、成长数据

**组成：**
- `stores/user.js` - 用户状态管理
- `views/Settings.vue` - 设置页面
- `components/WelcomeWizard.vue` - 欢迎向导

**核心功能：**
- 用户信息管理（姓名、职位、薪资等）
- 主题切换（浅色/暗色模式）
- 学习进度追踪
- 连续学习天数统计
- 数据持久化（LocalStorage）

**数据结构：**
```javascript
{
  name: String,           // 用户名
  currentJob: String,     // 当前职位
  currentSalary: Number,  // 当前薪资
  targetJob: String,      // 目标职位
  targetSalary: Number,   // 目标薪资
  theme: String,          // 主题（light/dark）
  learningDays: Number,   // 学习天数
  streakDays: Number,     // 连续学习天数
  lastActiveDate: String, // 最后活跃日期
  isInitialized: Boolean  // 是否已初始化
}
```

#### 2. 职位模块 (Jobs Module)
**职责：** 管理职位数据、学习计划、职位筛选

**组成：**
- `stores/jobs.js` - 职位状态管理
- `views/Jobs.vue` - 职位页面
- `components/JobCard.vue` - 职位卡片
- `data/jobs-data.js` - 职位数据源

**核心功能：**
- 职位列表展示
- 职位筛选（类型、薪资、技能）
- 学习计划创建
- 职位收藏
- 轮播展示

**数据结构：**
```javascript
{
  id: String,
  title: String,          // 职位名称
  company: String,        // 公司名称
  type: String,           // 职位类型
  salary: String,         // 薪资范围
  description: String,    // 职位描述
  requirements: Array,    // 技能要求
  benefits: Array,        // 福利待遇
  icon: String,           // 图标
  color: String          // 主题色
}
```

#### 3. 成长模块 (Growth Module)
**职责：** 追踪学习进度、展示成就、可视化数据

**组成：**
- `stores/quest.js` - 任务状态管理
- `views/Growth.vue` - 成长页面
- `components/ProgressRing.vue` - 进度环
- `composables/useLifestyle.js` - 生活方式逻辑

**核心功能：**
- 学习进度可视化
- 技能掌握度展示
- 成就系统
- 段位系统（基于薪资）
- 生活方式预测

**数据结构：**
```javascript
{
  questId: String,
  title: String,          // 任务标题
  targetJob: Object,      // 目标职位
  skills: Array,          // 技能列表
  progress: Number,       // 总体进度
  startDate: String,      // 开始日期
  estimatedDays: Number,  // 预计天数
  completedSkills: Array  // 已完成技能
}
```

#### 4. 职业路径模块 (Career Module)
**职责：** 展示职业发展路径、规划职业目标

**组成：**
- `views/Career.vue` - 职业页面
- `components/TimelineItem.vue` - 时间线项
- `data/career-paths.js` - 职业路径数据
- `composables/useCareer.js` - 职业逻辑

**核心功能：**
- 职业路径时间线
- 里程碑展示
- 技能要求分析
- 薪资增长预测

**数据结构：**
```javascript
{
  id: String,
  title: String,          // 阶段标题
  level: Number,          // 职业等级
  salary: String,         // 薪资范围
  duration: String,       // 持续时间
  skills: Array,          // 所需技能
  achievements: Array,    // 成就要求
  description: String     // 描述
}
```

---

## 数据流架构

### 单向数据流

```
┌─────────────┐
│   用户操作   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Actions    │ (组件方法)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Store     │ (Pinia)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   State     │ (响应式数据)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    View     │ (组件渲染)
└─────────────┘
```

### 数据持久化流程

```
┌─────────────┐
│  State 变化  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ saveToStorage│ (自动保存)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ LocalStorage │
└──────┬──────┘
       │
       ▼ (页面刷新)
┌─────────────┐
│loadFromStorage│
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  恢复 State  │
└─────────────┘
```

---

## 路由架构

### 路由配置

```javascript
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: '首页' }
  },
  {
    path: '/jobs',
    name: 'Jobs',
    component: Jobs,
    meta: { title: '职位探索' }
  },
  {
    path: '/growth',
    name: 'Growth',
    component: Growth,
    meta: { title: '成长追踪' }
  },
  {
    path: '/career',
    name: 'Career',
    component: Career,
    meta: { title: '职业路径' }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    meta: { title: '个人设置' }
  }
]
```

### 路由守卫

```javascript
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = `${to.meta.title} - NOW`
  
  // 检查用户初始化状态
  const userStore = useUserStore()
  if (!userStore.userInfo.isInitialized && to.path !== '/') {
    // 首次访问，显示欢迎向导
  }
  
  next()
})
```

---

## 状态管理

### Pinia Store 架构

#### User Store
```javascript
export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: {
      name: '',
      currentJob: '',
      currentSalary: 0,
      targetJob: '',
      targetSalary: 0,
      theme: 'light',
      learningDays: 0,
      streakDays: 0,
      lastActiveDate: '',
      isInitialized: false
    }
  }),
  
  actions: {
    updateUserInfo(info) { },
    updateStreakDays() { },
    saveToStorage() { },
    loadFromStorage() { }
  },
  
  getters: {
    salaryGap: (state) => { },
    progressPercentage: (state) => { }
  }
})
```

#### Jobs Store
```javascript
export const useJobsStore = defineStore('jobs', {
  state: () => ({
    jobs: [],
    filters: {
      type: 'all',
      salaryRange: 'all',
      skills: []
    },
    learningPlans: []
  }),
  
  actions: {
    filterJobs() { },
    createLearningPlan(job) { },
    saveToStorage() { },
    loadFromStorage() { }
  },
  
  getters: {
    filteredJobs: (state) => { },
    recommendedJobs: (state) => { }
  }
})
```

#### Quest Store
```javascript
export const useQuestStore = defineStore('quest', {
  state: () => ({
    currentQuest: null,
    completedQuests: []
  }),
  
  actions: {
    startQuest(job) { },
    updateProgress(skillId) { },
    completeQuest() { },
    saveToStorage() { },
    loadFromStorage() { }
  },
  
  getters: {
    overallProgress: (state) => { },
    nextMilestone: (state) => { }
  }
})
```

---

## 组件架构

### 组件分类

#### 1. 布局组件 (Layout Components)
- `Navbar.vue` - 全局导航栏
- `PageContainer.vue` - 页面容器
- `Section.vue` - 区域容器

#### 2. 展示组件 (Presentational Components)
- `JobCard.vue` - 职位卡片
- `SkillTag.vue` - 技能标签
- `ProgressRing.vue` - 进度环
- `TimelineItem.vue` - 时间线项
- `StatCard.vue` - 统计卡片

#### 3. 容器组件 (Container Components)
- `JobsList.vue` - 职位列表容器
- `SkillsGrid.vue` - 技能网格容器
- `Timeline.vue` - 时间线容器

#### 4. 功能组件 (Functional Components)
- `WelcomeWizard.vue` - 欢迎向导
- `FilterPanel.vue` - 筛选面板
- `SearchBar.vue` - 搜索栏
- `ThemeToggle.vue` - 主题切换

### 组件通信

```
父组件
  │
  ├─ Props ──────────▶ 子组件
  │
  ◀─ Emits ────────── 子组件
  │
  ├─ Provide ────────▶ 后代组件
  │
  ◀─ Inject ───────── 后代组件
```

### 组件设计原则

1. **单一职责** - 每个组件只负责一个功能
2. **可复用性** - 通过 props 实现灵活配置
3. **低耦合** - 减少组件间的依赖
4. **高内聚** - 相关功能集中在一起
5. **可测试性** - 易于单元测试

---

## 数据持久化

### LocalStorage 策略

#### 存储结构
```javascript
{
  'now_user': {
    // 用户信息
  },
  'now_jobs': {
    // 职位数据
  },
  'now_quest': {
    // 任务数据
  }
}
```

#### 自动保存机制
```javascript
// 监听 state 变化，自动保存
watch(
  () => store.state,
  (newState) => {
    localStorage.setItem(key, JSON.stringify(newState))
  },
  { deep: true }
)
```

#### 数据迁移
```javascript
// 版本检查和数据迁移
if (needsMigration()) {
  migrateOldData()
  cleanupOldData()
}
```

---

## 性能优化

### 1. 代码分割
```javascript
// 路由懒加载
const Jobs = () => import('./views/Jobs.vue')
const Growth = () => import('./views/Growth.vue')
```

### 2. 组件懒加载
```javascript
// 异步组件
const HeavyComponent = defineAsyncComponent(() =>
  import('./components/HeavyComponent.vue')
)
```

### 3. 虚拟滚动
```javascript
// 大列表优化
<VirtualList :items="jobs" :item-height="200" />
```

### 4. 计算属性缓存
```javascript
// 使用 computed 缓存计算结果
const filteredJobs = computed(() => {
  return jobs.value.filter(job => /* 筛选逻辑 */)
})
```

### 5. 防抖和节流
```javascript
// 搜索输入防抖
const debouncedSearch = debounce(search, 300)
```

### 6. 图片优化
- 使用 WebP 格式
- 懒加载图片
- 响应式图片

### 7. CSS 优化
- 使用 CSS Modules
- 避免深层嵌套
- 使用 GPU 加速动画

---

## 开发规范

### 命名规范
- **组件名：** PascalCase (如 `JobCard.vue`)
- **文件名：** kebab-case (如 `use-theme.js`)
- **变量名：** camelCase (如 `currentJob`)
- **常量名：** UPPER_SNAKE_CASE (如 `MAX_SALARY`)

### 代码组织
```vue
<script setup>
// 1. 导入
import { ref, computed } from 'vue'

// 2. Props 和 Emits
const props = defineProps({ })
const emit = defineEmits(['update'])

// 3. 响应式数据
const count = ref(0)

// 4. 计算属性
const doubled = computed(() => count.value * 2)

// 5. 方法
function increment() { }

// 6. 生命周期
onMounted(() => { })
</script>

<template>
  <!-- 模板 -->
</template>

<style scoped>
/* 样式 */
</style>
```

### Git 提交规范
```
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式调整
refactor: 重构
perf: 性能优化
test: 测试相关
chore: 构建/工具相关
```

---

## 部署架构

### 构建流程
```bash
# 开发环境
npm run dev

# 生产构建
npm run build

# 预览构建结果
npm run preview
```

### 部署策略
1. **静态托管** - Vercel, Netlify, GitHub Pages
2. **CDN 加速** - 静态资源 CDN 分发
3. **环境变量** - 区分开发/生产环境
4. **错误监控** - Sentry 等错误追踪

---

## 未来规划

### 短期计划
- [ ] 添加更多职位数据
- [ ] 优化移动端体验
- [ ] 添加数据导出功能
- [ ] 实现社交分享

### 中期计划
- [ ] 后端 API 集成
- [ ] 用户认证系统
- [ ] 实时数据同步
- [ ] 多语言支持

### 长期计划
- [ ] AI 职业规划助手
- [ ] 社区功能
- [ ] 课程推荐系统
- [ ] 移动应用

---

**文档版本：** 1.0  
**最后更新：** 2024  
**维护者：** NOW 开发团队
