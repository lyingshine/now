# �  NOW - 职场成长平台

<div align="center">

![Vue 3](https://img.shields.io/badge/Vue-3.4-42b883?style=flat-square&logo=vue.js)
![Vite](https://img.shields.io/badge/Vite-5.0-646cff?style=flat-square&logo=vite)
![Pinia](https://img.shields.io/badge/Pinia-2.1-ffd859?style=flat-square&logo=pinia)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)

**一个现代化的互动式职场成长模拟平台**

通过游戏化的方式，帮助用户规划职业发展路径、学习技能、模拟薪资增长

[在线演示](https://your-demo-url.com) · [报告问题](https://github.com/lyingshine/now/issues) · [功能建议](https://github.com/lyingshine/now/issues)

</div>

---

## 📖 目录

- [✨ 核心特性](#-核心特性)
- [🎮 功能模块](#-功能模块)
- [🚀 快速开始](#-快速开始)
- [📊 项目统计](#-项目统计)
- [🏗️ 技术架构](#️-技术架构)
- [📁 项目结构](#-项目结构)
- [🎨 设计系统](#-设计系统)
- [🔧 开发指南](#-开发指南)
- [📱 响应式设计](#-响应式设计)
- [🤝 贡献指南](#-贡献指南)
- [📄 许可证](#-许可证)

---

## ✨ 核心特性

### 🎯 职业规划系统
- **智能职位推荐** - 基于当前薪资推荐合适的职业发展路径
- **技能树系统** - 系统化的技能学习路径，清晰的成长脉络
- **任务大厅** - 浏览和接取职业任务，开启学习之旅

### 💰 收入模拟系统
- **实时收入计算** - 精确到秒的收入模拟，包含今日、本月、年度收入
- **段位系统** - 从青铜到王者的 8 个段位，直观展示职业水平
- **生活水平评估** - 基于薪资的生活质量可视化展示

### 🎮 游戏化体验
- **经验值系统** - 完成任务获得经验，升级解锁新内容
- **成就系统** - 记录职业成长的每个里程碑
- **冒险生涯** - 时间线展示职业发展历程

### 🎨 现代化设计
- **高级动画系统** - 流畅的非线性动画，提升用户体验
- **玻璃态设计** - 精致的毛玻璃效果和层次感
- **深色/浅色模式** - 支持主题切换，保护视力
- **响应式布局** - 完美适配桌面、平板、移动设备

---

## 🎮 功能模块

### 🏠 首页 - 全屏滚动展示
采用现代化的全屏滚动设计，分为三个核心区块：

#### 第一屏：段位排名 & 收入统计
- **段位展示** - 大型卡片展示当前段位、图标、描述
- **关键指标** - 月薪、年薪、生活水平一目了然
- **收入统计** - 今日、本月、年度、累计收入实时更新
- **工作时长** - 自动计算入职以来的工作时长

#### 第二屏：生活水平评估
- **总体评价** - 基于薪资的生活质量综合评分
- **分类展示** - 收入储蓄、基础开销、日常消费、大件消费
- **智能轮播** - 每个类别的详细项目自动轮播展示
- **状态标识** - 艰难、温饱、小康、舒适、富足等级别

#### 第三屏：职业发展建议
- **职位推荐** - 基于当前薪资推荐合适的进阶职位
- **升级建议** - 针对性的职业发展建议和学习方向
- **快速跳转** - 一键跳转到任务大厅接取任务

### ⚔️ 任务大厅
- **职位浏览** - 网格布局展示所有可用职位
- **智能分页** - 自动分页，支持轮播浏览
- **详情查看** - 点击查看职位详情、薪资、技能要求
- **任务接取** - 接取任务开始学习之旅
- **状态提示** - 已接取任务的视觉反馈

### 🌱 成长中心
- **任务进度** - 显示当前任务的整体进度
- **等级系统** - 展示当前等级和经验值
- **统计数据** - 子任务完成情况、学习天数
- **快速操作** - 继续任务、完成任务、放弃任务

### 📚 任务详情
- **技能树展示** - 树状结构展示所有技能点
- **分步学习** - 每个技能包含多个学习步骤
- **任务追踪** - 勾选完成的学习任务
- **进度可视化** - 实时显示完成百分比
- **经验奖励** - 完成任务获得经验值

### 🗺️ 冒险生涯
- **时间线展示** - 横向滚动的职业发展时间线
- **三阶段展示** - 学习期、实习期、转正完整流程
- **当前冒险** - 高亮显示进行中的任务
- **历史记录** - 查看已完成的所有职业任务
- **统计数据** - 总冒险次数、完成数、薪资增长

### ⚙️ 设置中心
- **基本信息** - 姓名、入职日期设置
- **工作信息** - 薪资、工作制度、工作时间配置
- **生活信息** - 家庭人数、租金、水电费、储蓄率
- **数据管理** - 清除所有数据功能（双重确认）

---

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0 或 pnpm >= 7.0.0

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/lyingshine/now.git
cd now
```

2. **安装依赖**
```bash
npm install
# 或使用 pnpm
pnpm install
```

3. **启动开发服务器**
```bash
npm run dev
```

4. **访问应用**
打开浏览器访问 `http://localhost:5173`

### 构建部署

```bash
# 生产构建
npm run build

# 预览构建结果
npm run preview
```

构建产物将生成在 `dist` 目录。

---

## 📊 项目统计

### 代码规模
- **总文件数**: 77 个
- **总代码行数**: 21,622 行
  - Vue 组件: 13,247 行 (43 个文件)
  - JavaScript: 4,993 行 (23 个文件)
  - CSS 样式: 3,382 行 (11 个文件)
- **项目大小**: 638.44 KB

### 代码质量
经过完整的架构优化和重构：
- ✅ **组件化程度**: 高度模块化，43 个可复用组件
- ✅ **代码复用**: 6 个 Composables 共享逻辑
- ✅ **类型安全**: 完整的 Props 类型定义
- ✅ **性能优化**: GPU 加速、will-change 优化
- ✅ **无障碍**: 支持键盘导航和屏幕阅读器

---

## 🏗️ 技术架构

### 核心技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue 3 | 3.4+ | 渐进式前端框架 |
| Vite | 5.0+ | 下一代前端构建工具 |
| Pinia | 2.1+ | Vue 官方状态管理 |
| Vue Router | 4.0+ | 官方路由管理 |
| Tailwind CSS | 3.0+ | 原子化 CSS 框架 |

### 架构设计原则

#### 1. 组件化设计
- **原子组件** - 最小可复用单元（按钮、输入框等）
- **业务组件** - 特定功能组件（任务卡片、技能树等）
- **页面组件** - 路由级别组件（首页、任务大厅等）
- **布局组件** - 导航栏、容器等布局元素

#### 2. 状态管理
```javascript
stores/
├── user.js          # 用户信息、设置
├── quest.js         # 任务系统、进度
└── jobs.js          # 职位数据（兼容旧版）
```

#### 3. 逻辑复用 (Composables)
```javascript
composables/
├── useLifestyle.js      # 生活水平计算
├── useEarnings.js       # 收入计算
├── useJobModal.js       # 弹窗管理
├── useSkillExpansion.js # 技能展开
└── useFormatters.js     # 格式化工具
```

#### 4. 数据流向
```
用户操作 → 组件事件 → Store Action → 状态更新 → 组件响应
```

### 设计模式

- **Composition API** - 逻辑组合和复用
- **单向数据流** - Props down, Events up
- **依赖注入** - Provide/Inject 跨层级通信
- **观察者模式** - 响应式数据系统

---

## 📁 项目结构

```
now/
├── public/                      # 静态资源
├── src/
│   ├── assets/                  # 资源文件
│   ├── components/              # 组件库
│   │   ├── common/             # 通用组件
│   │   │   ├── AutoPagination.vue
│   │   │   └── Modal.vue
│   │   ├── game/               # 游戏化组件
│   │   │   ├── LevelDisplay.vue
│   │   │   ├── ExpBar.vue
│   │   │   └── LevelUpModal.vue
│   │   ├── growth/             # 成长中心组件
│   │   │   ├── EmptyState.vue
│   │   │   └── ...
│   │   ├── growth-detail/      # 任务详情组件
│   │   │   ├── ProgressHeader.vue
│   │   │   ├── PlanInfoCards.vue
│   │   │   └── SkillCard.vue
│   │   ├── jobs/               # 任务大厅组件
│   │   │   ├── JobCard.vue
│   │   │   └── JobsGrid.vue
│   │   ├── quest/              # 任务系统组件
│   │   │   ├── QuestProgressCard.vue
│   │   │   └── QuestCompletionModal.vue
│   │   ├── JobModal.vue        # 职位详情弹窗
│   │   ├── JobCompletionModal.vue
│   │   ├── Navbar.vue          # 导航栏
│   │   ├── SettingsModal.vue   # 设置弹窗
│   │   └── WelcomeWizard.vue   # 欢迎向导
│   ├── composables/            # 组合式函数
│   │   ├── useLifestyle.js     # 生活水平系统
│   │   ├── useEarnings.js      # 收入计算
│   │   ├── useJobModal.js      # 弹窗管理
│   │   ├── useSkillExpansion.js
│   │   └── useFormatters.js
│   ├── data/                   # 数据文件
│   │   └── jobs-data.js        # 职位数据
│   ├── router/                 # 路由配置
│   │   └── index.js
│   ├── stores/                 # 状态管理
│   │   ├── user.js             # 用户 Store
│   │   ├── quest.js            # 任务 Store
│   │   └── jobs.js             # 职位 Store
│   ├── styles/                 # 样式系统
│   │   ├── design-tokens.css   # 设计令牌
│   │   ├── base.css            # 基础样式
│   │   ├── animations.css      # 动画系统
│   │   ├── unified-design.css  # 统一组件
│   │   ├── premium-effects.css # 高级效果
│   │   └── main.css            # 主样式
│   ├── types/                  # 类型定义
│   ├── utils/                  # 工具函数
│   │   ├── achievements.js     # 成就系统
│   │   ├── expCalculator.js    # 经验计算
│   │   └── dataMigration.js    # 数据迁移
│   ├── views/                  # 页面组件
│   │   ├── Home.vue            # 首页
│   │   ├── Jobs.vue            # 任务大厅
│   │   ├── Growth.vue          # 成长中心
│   │   ├── GrowthDetail.vue    # 任务详情
│   │   ├── Career.vue          # 冒险生涯
│   │   ├── QuestHistory.vue    # 任务历史
│   │   └── Settings.vue        # 设置中心
│   ├── App.vue                 # 根组件
│   └── main.js                 # 入口文件
├── index.html                  # HTML 模板
├── vite.config.js             # Vite 配置
├── package.json               # 项目配置
└── README.md                  # 项目文档
```

---

## 🎨 设计系统

### 设计令牌 (Design Tokens)

#### 颜色系统
```css
/* 主色 */
--color-primary: #667eea;
--color-accent: #764ba2;
--color-success: #10b981;
--color-warning: #f59e0b;
--color-error: #ef4444;

/* 段位颜色 */
--rank-bronze: #cd7f32;
--rank-silver: #c0c0c0;
--rank-gold: #ffd700;
--rank-platinum: #e5e4e2;
--rank-diamond: #b9f2ff;
--rank-master: #9d4edd;
--rank-grandmaster: #ff006e;
--rank-king: #ffbe0b;
```

#### 间距系统 (8px 基准)
```css
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
```

#### 圆角系统
```css
--radius-sm: 0.375rem;
--radius-md: 0.5rem;
--radius-lg: 0.75rem;
--radius-xl: 1rem;
--radius-2xl: 1.25rem;
--radius-3xl: 1.5rem;
--radius-full: 9999px;
```

### 动画系统

#### 缓动函数
```css
/* 标准缓动 */
--ease-out-quad: cubic-bezier(0.25, 0.46, 0.45, 0.94);
--ease-out-cubic: cubic-bezier(0.215, 0.61, 0.355, 1);
--ease-out-quart: cubic-bezier(0.165, 0.84, 0.44, 1);
--ease-out-quint: cubic-bezier(0.23, 1, 0.32, 1);
--ease-out-expo: cubic-bezier(0.19, 1, 0.22, 1);

/* 弹性缓动 */
--ease-out-back: cubic-bezier(0.34, 1.56, 0.64, 1);
--ease-in-out-back: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

#### 动画时长
```css
--duration-fast: 250ms;
--duration-normal: 400ms;
--duration-slow: 600ms;
--duration-slower: 800ms;
```

### 玻璃态效果
```css
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
```

---

## 🔧 开发指南

### 添加新页面

1. **创建页面组件**
```bash
# 在 src/views/ 创建新组件
touch src/views/NewPage.vue
```

2. **配置路由**
```javascript
// src/router/index.js
{
  path: '/new-page',
  name: 'NewPage',
  component: () => import('../views/NewPage.vue')
}
```

3. **添加导航**
```vue
<!-- src/components/Navbar.vue -->
<router-link to="/new-page" class="nav-btn">
  <span>🎯</span>
  <span>新页面</span>
</router-link>
```

### 创建新组件

```vue
<template>
  <div class="my-component">
    <h2>{{ title }}</h2>
    <button @click="handleClick">{{ buttonText }}</button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Props 定义
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  buttonText: {
    type: String,
    default: '点击'
  }
})

// Events 定义
const emit = defineEmits(['click'])

// 响应式数据
const count = ref(0)

// 计算属性
const doubleCount = computed(() => count.value * 2)

// 方法
const handleClick = () => {
  count.value++
  emit('click', count.value)
}
</script>

<style scoped>
.my-component {
  padding: var(--space-4);
  background: var(--glass-bg);
  border-radius: var(--radius-xl);
  transition: all var(--duration-normal) var(--ease-hover);
}

.my-component:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
</style>
```

### 使用 Composables

```javascript
// src/composables/useCounter.js
import { ref, computed } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  
  const double = computed(() => count.value * 2)
  
  const increment = () => count.value++
  const decrement = () => count.value--
  const reset = () => count.value = initialValue
  
  return {
    count,
    double,
    increment,
    decrement,
    reset
  }
}

// 在组件中使用
import { useCounter } from '@/composables/useCounter'

const { count, double, increment } = useCounter(10)
```

### 状态管理

```javascript
// src/stores/example.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useExampleStore = defineStore('example', () => {
  // State
  const items = ref([])
  const loading = ref(false)
  
  // Getters
  const itemCount = computed(() => items.value.length)
  
  // Actions
  const addItem = (item) => {
    items.value.push(item)
  }
  
  const removeItem = (id) => {
    items.value = items.value.filter(item => item.id !== id)
  }
  
  const loadItems = async () => {
    loading.value = true
    try {
      // 加载数据
      const data = await fetchData()
      items.value = data
    } finally {
      loading.value = false
    }
  }
  
  return {
    items,
    loading,
    itemCount,
    addItem,
    removeItem,
    loadItems
  }
})
```

### 样式规范

#### 使用设计令牌
```css
/* ✅ 推荐 */
.card {
  padding: var(--space-4);
  border-radius: var(--radius-xl);
  transition: all var(--duration-normal) var(--ease-hover);
}

/* ❌ 不推荐 */
.card {
  padding: 16px;
  border-radius: 12px;
  transition: all 0.3s ease;
}
```

#### 命名规范
- 使用 BEM 命名法：`block__element--modifier`
- 组件类名与组件名一致
- 使用语义化的类名

#### 响应式设计
```css
/* 移动优先 */
.container {
  padding: var(--space-4);
}

/* 平板 */
@media (min-width: 768px) {
  .container {
    padding: var(--space-6);
  }
}

/* 桌面 */
@media (min-width: 1024px) {
  .container {
    padding: var(--space-8);
  }
}
```

### 性能优化

#### 1. 组件懒加载
```javascript
// 路由懒加载
{
  path: '/jobs',
  component: () => import('../views/Jobs.vue')
}

// 组件懒加载
const HeavyComponent = defineAsyncComponent(() =>
  import('./components/HeavyComponent.vue')
)
```

#### 2. 使用 v-memo
```vue
<template>
  <div v-memo="[item.id, item.status]">
    <!-- 只在 id 或 status 变化时更新 -->
  </div>
</template>
```

#### 3. 虚拟滚动
对于长列表，使用虚拟滚动优化性能。

#### 4. 图片优化
- 使用 WebP 格式
- 添加 loading="lazy"
- 使用适当的尺寸

---

## 📱 响应式设计

### 断点系统

| 断点 | 宽度 | 设备 |
|------|------|------|
| xs | < 640px | 手机 |
| sm | 640px - 768px | 大屏手机 |
| md | 768px - 1024px | 平板 |
| lg | 1024px - 1280px | 小屏笔记本 |
| xl | 1280px - 1536px | 桌面 |
| 2xl | > 1536px | 大屏桌面 |

### 适配策略

#### 移动端 (< 768px)
- 单列布局
- 隐藏次要信息
- 优化触摸交互
- 简化导航

#### 平板端 (768px - 1024px)
- 两列布局
- 保留主要功能
- 优化横屏体验

#### 桌面端 (> 1024px)
- 多列布局
- 完整功能展示
- 优化鼠标交互
- 全屏滚动体验

---

## 🧪 测试

### 单元测试
```bash
npm run test:unit
```

### E2E 测试
```bash
npm run test:e2e
```

### 代码覆盖率
```bash
npm run test:coverage
```

---

## 📦 构建优化

### 生产构建配置

```javascript
// vite.config.js
export default {
  build: {
    // 代码分割
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'ui-components': ['./src/components']
        }
      }
    },
    // 压缩
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
}
```

### 性能指标

- **首屏加载**: < 2s
- **交互响应**: < 100ms
- **动画帧率**: 60 FPS
- **包体积**: < 500KB (gzip)

---

## 🔒 安全性

### 数据存储
- 使用 localStorage 存储用户数据
- 敏感信息不存储在客户端
- 定期清理过期数据

### XSS 防护
- Vue 自动转义输出
- 避免使用 v-html
- 验证用户输入

### CSRF 防护
- 使用 CORS 策略
- Token 验证

---

## 🤝 贡献指南

### 提交规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Type 类型
- `feat`: 新功能
- `fix`: 修复 Bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具相关

#### 示例
```bash
git commit -m "feat(jobs): 添加职位筛选功能"
git commit -m "fix(home): 修复收入计算错误"
git commit -m "docs: 更新 README 文档"
```

### 开发流程

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

### 代码审查

- 遵循项目代码规范
- 添加必要的注释
- 更新相关文档
- 通过所有测试

---

## 📝 更新日志

### v2.0.0 (2024-01-XX)

#### ✨ 新增
- 全新的设计系统和动画系统
- 高级非线性动画效果
- 玻璃态设计风格
- 全屏滚动首页
- 冒险生涯时间线
- 清除数据功能

#### 🎨 优化
- 统一所有页面视觉风格
- 优化动画性能和流畅度
- 改进响应式布局
- 提升用户交互体验

#### 🐛 修复
- 修复导航栏遮挡问题
- 修复滚动条显示问题
- 修复翻页动画问题

---

## 📄 许可证

本项目采用 [MIT License](LICENSE) 开源协议。

---

## 🙏 致谢

感谢以下开源项目：

- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [Pinia](https://pinia.vuejs.org/) - Vue 状态管理
- [Tailwind CSS](https://tailwindcss.com/) - 原子化 CSS 框架

---

## 📮 联系方式

- **Issues**: [GitHub Issues](https://github.com/lyingshine/now/issues)
- **Discussions**: [GitHub Discussions](https://github.com/lyingshine/now/discussions)

---

<div align="center">

**Made with ❤️ using Vue 3**

⭐ 如果这个项目对你有帮助，请给一个 Star！

[返回顶部](#-now---职场成长平台)

</div>
