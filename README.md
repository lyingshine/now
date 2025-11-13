# NOW - 职场成长平台

> 一个帮助职场人规划成长路径、追踪学习进度的沉浸式 Web 应用

![Vue 3](https://img.shields.io/badge/Vue-3.x-4FC08D?logo=vue.js)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite)
![Pinia](https://img.shields.io/badge/Pinia-2.x-FFD859?logo=pinia)
![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ 特性

- 🎯 **职位探索** - 浏览和筛选职位，制定个性化学习计划
- 📈 **成长追踪** - 可视化展示学习进度和技能掌握度
- 🛤️ **职业路径** - 时间线展示职业发展路径和里程碑
- 🎨 **沉浸式设计** - 全屏无滚动条，玻璃态效果，流畅动画
- 🌓 **主题切换** - 支持浅色/暗色模式
- 📱 **响应式设计** - 完美适配桌面、平板、手机
- 💾 **本地存储** - 数据持久化，无需后端

## 🚀 快速开始

### 环境要求

- Node.js 16.x 或更高版本
- npm 或 yarn

### 安装

```bash
# 克隆项目
git clone <repository-url>
cd now

# 安装依赖
npm install
```

### 开发

```bash
# 启动开发服务器
npm run dev

# 访问 http://localhost:5173
```

### 构建

```bash
# 生产构建
npm run build

# 预览构建结果
npm run preview
```

## 📁 项目结构

```
now/
├── src/
│   ├── assets/          # 静态资源
│   ├── components/      # 公共组件
│   ├── composables/     # 组合式函数
│   ├── data/            # 静态数据
│   ├── router/          # 路由配置
│   ├── stores/          # 状态管理
│   ├── styles/          # 样式系统
│   ├── utils/           # 工具函数
│   ├── views/           # 页面组件
│   ├── App.vue          # 根组件
│   └── main.js          # 入口文件
├── public/              # 公共资源
├── docs/                # 文档目录
│   ├── ARCHITECTURE.md           # 系统架构文档
│   └── STYLE_ARCHITECTURE.md     # 样式架构文档
└── README.md            # 本文档
```

## 🏗️ 技术栈

### 核心框架
- **Vue 3** - 渐进式 JavaScript 框架
- **Vue Router** - 官方路由管理器
- **Pinia** - 新一代状态管理库
- **Vite** - 下一代前端构建工具

### 样式方案
- **CSS Modules** - 模块化 CSS
- **设计令牌系统** - 统一的设计变量
- **响应式设计** - 移动端优先策略

### 开发工具
- **ESLint** - 代码质量检查
- **Git** - 版本控制

## 📖 文档

### 核心文档
- **[系统架构文档](./docs/ARCHITECTURE.md)** - 完整的系统架构说明
  - 项目概述和技术栈
  - 模块架构和数据流
  - 组件架构和状态管理
  - 性能优化和开发规范

- **[样式架构文档](./docs/STYLE_ARCHITECTURE.md)** - 样式系统详细说明
  - 设计原则和架构层级
  - 设计令牌系统
  - 组件样式库
  - 响应式设计和主题系统
  - 动画系统和工具类
  - 最佳实践和扩展指南

📁 更多文档请查看 [docs 目录](./docs/)

## 🎨 样式系统

### 设计令牌
所有样式值都来自统一的设计令牌，确保一致性：

```css
/* 颜色 */
--color-primary: #667eea;
--text-primary: #171717;
--bg-primary: #ffffff;

/* 间距（8px 基准） */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */

/* 字体 */
--text-base: 1rem;
--font-semibold: 600;

/* 动画 */
--duration-normal: 400ms;
--ease-default: cubic-bezier(0.165, 0.84, 0.44, 1);
```

### 组件示例

```html
<!-- 按钮 -->
<button class="btn btn-primary btn-lg">
  大号主要按钮
</button>

<!-- 卡片 -->
<div class="card hover-lift">
  <div class="card-header">
    <h3 class="card-title">标题</h3>
  </div>
  <div class="card-body">
    <p class="card-text">内容</p>
  </div>
</div>

<!-- 使用工具类 -->
<div class="d-flex justify-between items-center gap-4 p-6">
  <span class="text-lg font-semibold">文本</span>
  <button class="btn btn-sm">操作</button>
</div>
```

## 🔧 核心功能

### 1. 职位探索
- 浏览职位列表
- 多维度筛选（类型、薪资、技能）
- 创建学习计划
- 轮播展示

### 2. 成长追踪
- 学习进度可视化
- 技能掌握度展示
- 成就系统
- 段位系统

### 3. 职业路径
- 时间线展示
- 里程碑标记
- 技能要求分析
- 薪资增长预测

### 4. 个人设置
- 用户信息管理
- 主题切换
- 数据导出
- 偏好设置

## 💾 数据管理

### 状态管理
使用 Pinia 管理应用状态：

```javascript
// User Store
const userStore = useUserStore()
userStore.updateUserInfo({ name: '张三' })

// Jobs Store
const jobsStore = useJobsStore()
jobsStore.filterJobs({ type: 'frontend' })

// Quest Store
const questStore = useQuestStore()
questStore.updateProgress(skillId)
```

### 数据持久化
所有数据自动保存到 LocalStorage：

```javascript
// 自动保存
watch(
  () => store.state,
  (newState) => {
    localStorage.setItem(key, JSON.stringify(newState))
  },
  { deep: true }
)

// 自动加载
onMounted(() => {
  store.loadFromStorage()
})
```

## 🎯 开发规范

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

## 🚀 性能优化

### 已实现的优化
- ✅ 路由懒加载
- ✅ 组件懒加载
- ✅ 计算属性缓存
- ✅ 防抖和节流
- ✅ 图片懒加载
- ✅ CSS 模块化
- ✅ GPU 加速动画

### 性能指标
- **首次加载：** < 2 秒
- **FPS：** 稳定 60
- **CSS 文件：** ~30KB (压缩后)
- **JS 文件：** ~150KB (压缩后)

## 🌐 浏览器支持

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 📱 响应式设计

### 断点系统
```css
/* 移动端（默认） */
/* < 640px */

/* 小屏幕 */
@media (min-width: 640px) { }

/* 平板 */
@media (min-width: 768px) { }

/* 桌面 */
@media (min-width: 1024px) { }

/* 大屏幕 */
@media (min-width: 1280px) { }
```

### 移动端优化
- 触摸友好的交互
- 增大可点击区域
- 优化字体大小
- 简化布局

## 🤝 贡献指南

### 开发流程
1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 代码审查
- 遵循代码规范
- 添加必要的注释
- 更新相关文档
- 确保测试通过

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [Pinia](https://pinia.vuejs.org/) - Vue 状态管理库
- [Chart.js](https://www.chartjs.org/) - 简单灵活的图表库

## 📞 联系方式

- 项目仓库：[GitHub](https://github.com/your-username/now)
- 问题反馈：[Issues](https://github.com/your-username/now/issues)
- 邮箱：your-email@example.com

---

**Made with ❤️ by NOW Team**
