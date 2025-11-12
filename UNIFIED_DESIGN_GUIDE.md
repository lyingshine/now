# NOW 统一设计风格应用指南

## 📌 概述

本指南说明如何在整个系统中应用统一的设计风格，确保视觉一致性和用户体验的连贯性。

---

## 🎯 核心原则

### 1. 一致性优先
- 所有页面使用相同的组件样式
- 统一的间距、圆角、颜色系统
- 一致的交互反馈和动画效果

### 2. 段位主题色
- 全局使用 `--rank-color` CSS 变量
- 根据用户薪资段位动态变化
- 应用于关键视觉元素

### 3. 响应式设计
- 移动优先的设计思路
- 统一的断点系统
- 自适应布局和组件

---

## 🎨 统一样式类使用指南

### 卡片组件

#### 基础卡片
```html
<div class="unified-card">
  <!-- 内容 -->
</div>
```

#### 大卡片
```html
<div class="unified-card unified-card-large">
  <!-- 内容 -->
</div>
```

#### 带顶部装饰条的卡片
```html
<div class="unified-card unified-card-accent">
  <!-- 悬停时显示顶部装饰条 -->
</div>
```

### 按钮组件

#### 基础按钮
```html
<button class="unified-btn">
  <span>按钮文字</span>
</button>
```

#### 主要按钮
```html
<button class="unified-btn unified-btn-primary">
  <span>主要操作</span>
</button>
```

#### 大按钮
```html
<button class="unified-btn unified-btn-large unified-btn-primary">
  <span>大按钮</span>
</button>
```

### 标题组件

#### 页面标题
```html
<div class="section-header-text">
  <h1 class="unified-title">页面标题</h1>
  <p class="unified-subtitle">副标题描述</p>
</div>
```

#### 区块标题
```html
<h2 class="unified-section-title">区块标题</h2>
```

#### 卡片标题
```html
<h3 class="unified-card-title">卡片标题</h3>
```

### 输入框组件

```html
<input 
  type="text" 
  class="unified-input" 
  placeholder="请输入..."
/>
```

### 标签组件

```html
<!-- 基础标签 -->
<span class="unified-tag">标签</span>

<!-- 主题色标签 -->
<span class="unified-tag unified-tag-primary">重要</span>

<!-- 成功标签 -->
<span class="unified-tag unified-tag-success">成功</span>

<!-- 警告标签 -->
<span class="unified-tag unified-tag-warning">警告</span>

<!-- 错误标签 -->
<span class="unified-tag unified-tag-error">错误</span>
```

### 进度条组件

```html
<div class="unified-progress">
  <div 
    class="unified-progress-bar" 
    :style="{ width: progress + '%' }"
  ></div>
</div>
```

### 徽章组件

```html
<!-- 数字徽章 -->
<span class="unified-badge">5</span>

<!-- 圆点徽章 -->
<span class="unified-badge unified-badge-dot"></span>
```

### 网格布局

```html
<!-- 2列网格 -->
<div class="unified-grid unified-grid-2">
  <div>列1</div>
  <div>列2</div>
</div>

<!-- 3列网格 -->
<div class="unified-grid unified-grid-3">
  <div>列1</div>
  <div>列2</div>
  <div>列3</div>
</div>
```

### 容器组件

```html
<!-- 标准容器 (1200px) -->
<div class="unified-container">
  <!-- 内容 -->
</div>

<!-- 宽容器 (1400px) -->
<div class="unified-container unified-container-wide">
  <!-- 内容 -->
</div>

<!-- 窄容器 (800px) -->
<div class="unified-container unified-container-narrow">
  <!-- 内容 -->
</div>
```

### 模态框组件

```html
<div class="unified-modal-overlay">
  <div class="unified-modal">
    <div class="unified-modal-header">
      <h2 class="unified-card-title">模态框标题</h2>
    </div>
    <div class="unified-modal-body">
      <!-- 内容 -->
    </div>
    <div class="unified-modal-footer">
      <button class="unified-btn">取消</button>
      <button class="unified-btn unified-btn-primary">确认</button>
    </div>
  </div>
</div>
```

### 列表组件

```html
<div class="unified-list">
  <div class="unified-list-item">
    列表项1
  </div>
  <div class="unified-list-item">
    列表项2
  </div>
</div>
```

### 加载状态

```html
<!-- 标准加载 -->
<div class="unified-loading"></div>

<!-- 小加载 -->
<div class="unified-loading unified-loading-small"></div>

<!-- 大加载 -->
<div class="unified-loading unified-loading-large"></div>
```

### 空状态

```html
<div class="unified-empty">
  <div class="unified-empty-icon">📭</div>
  <div class="unified-empty-text">暂无数据</div>
  <div class="unified-empty-hint">快去添加一些内容吧</div>
</div>
```

---

## 🔧 页面改造清单

### ✅ 已完成
- [x] Home.vue - 首页（全屏滚动布局）
- [x] Navbar.vue - 导航栏
- [x] App.vue - 根组件（段位主题色注入）

### 🔄 待改造

#### 高优先级
- [ ] Jobs.vue - 任务大厅
- [ ] Growth.vue - 成长中心
- [ ] Career.vue - 冒险生涯

#### 中优先级
- [ ] GrowthDetail.vue - 成长详情
- [ ] QuestHistory.vue - 任务历史
- [ ] SettingsModal.vue - 设置弹窗
- [ ] WelcomeWizard.vue - 欢迎向导

#### 低优先级
- [ ] JobModal.vue - 任务弹窗
- [ ] JobCompletionModal.vue - 任务完成弹窗
- [ ] 其他小组件

---

## 📋 改造步骤

### 1. 替换卡片样式
**旧代码：**
```css
.custom-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
}
```

**新代码：**
```html
<div class="unified-card">
  <!-- 内容 -->
</div>
```

### 2. 替换按钮样式
**旧代码：**
```css
.custom-button {
  background: #667eea;
  padding: 12px 24px;
  border-radius: 8px;
}
```

**新代码：**
```html
<button class="unified-btn unified-btn-primary">
  按钮文字
</button>
```

### 3. 替换标题样式
**旧代码：**
```css
.page-title {
  font-size: 2rem;
  font-weight: bold;
  color: #667eea;
}
```

**新代码：**
```html
<h1 class="unified-title">页面标题</h1>
```

### 4. 添加段位主题色
**在组件根元素添加：**
```html
<div :style="{ '--rank-color': rankColor }">
  <!-- 内容 -->
</div>
```

**或在 App.vue 中全局注入（已完成）**

### 5. 统一间距
**使用统一的间距变量：**
```css
margin-bottom: var(--space-4);  /* 16px */
padding: var(--space-6);        /* 24px */
gap: var(--space-3);            /* 12px */
```

---

## 🎨 颜色使用规范

### 主题色（动态）
```css
/* 使用段位主题色 */
background: var(--rank-color, var(--neon-purple));
border-color: var(--rank-color, #667eea);
color: var(--rank-color, #667eea);
```

### 文字颜色
```css
color: var(--immersive-text-primary);    /* 主文字 */
color: var(--immersive-text-secondary);  /* 次级文字 */
color: var(--immersive-text-tertiary);   /* 三级文字 */
```

### 背景颜色
```css
background: var(--immersive-bg-primary);    /* 主背景 */
background: var(--immersive-bg-secondary);  /* 次级背景 */
background: var(--immersive-bg-tertiary);   /* 三级背景 */
```

### 功能色
```css
color: var(--color-success);  /* #10b981 成功 */
color: var(--color-warning);  /* #f59e0b 警告 */
color: var(--color-error);    /* #ef4444 错误 */
color: var(--color-info);     /* #3b82f6 信息 */
```

---

## 🔍 检查清单

### 视觉一致性
- [ ] 所有卡片使用 `unified-card` 类
- [ ] 所有按钮使用 `unified-btn` 类
- [ ] 所有标题使用统一标题类
- [ ] 间距使用 CSS 变量
- [ ] 圆角使用 CSS 变量

### 主题色应用
- [ ] 关键元素使用 `--rank-color`
- [ ] 悬停效果使用主题色
- [ ] 进度条使用主题色
- [ ] 徽章使用主题色

### 交互反馈
- [ ] 悬停效果统一
- [ ] 点击效果统一
- [ ] 过渡动画统一
- [ ] 加载状态统一

### 响应式
- [ ] 移动端布局正常
- [ ] 平板端布局正常
- [ ] 桌面端布局正常
- [ ] 触摸目标足够大

---

## 💡 最佳实践

### 1. 优先使用统一样式类
```html
<!-- ✅ 推荐 -->
<div class="unified-card">
  <h3 class="unified-card-title">标题</h3>
  <button class="unified-btn unified-btn-primary">操作</button>
</div>

<!-- ❌ 不推荐 -->
<div style="background: rgba(255,255,255,0.05); padding: 24px;">
  <h3 style="font-size: 1.25rem; font-weight: 700;">标题</h3>
  <button style="background: #667eea; padding: 12px 24px;">操作</button>
</div>
```

### 2. 使用工具类组合
```html
<!-- ✅ 推荐 -->
<div class="flex items-center justify-between gap-4 mb-6">
  <span>左侧内容</span>
  <span>右侧内容</span>
</div>

<!-- ❌ 不推荐 -->
<div style="display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 24px;">
  <span>左侧内容</span>
  <span>右侧内容</span>
</div>
```

### 3. 保持语义化
```html
<!-- ✅ 推荐 -->
<article class="unified-card">
  <header class="unified-card-title">文章标题</header>
  <section>文章内容</section>
</article>

<!-- ❌ 不推荐 -->
<div class="unified-card">
  <div class="unified-card-title">文章标题</div>
  <div>文章内容</div>
</div>
```

### 4. 合理使用变体
```html
<!-- 根据场景选择合适的变体 -->
<button class="unified-btn">普通按钮</button>
<button class="unified-btn unified-btn-primary">主要按钮</button>
<button class="unified-btn unified-btn-large">大按钮</button>
<button class="unified-btn unified-btn-small">小按钮</button>
```

---

## 🚀 快速开始

### 1. 在新组件中使用
```vue
<template>
  <div class="unified-container">
    <div class="section-header-text">
      <h1 class="unified-title">页面标题</h1>
      <p class="unified-subtitle">页面描述</p>
    </div>
    
    <div class="unified-grid unified-grid-3">
      <div class="unified-card unified-card-accent">
        <h3 class="unified-card-title">卡片1</h3>
        <p>内容</p>
        <button class="unified-btn unified-btn-primary">操作</button>
      </div>
      <!-- 更多卡片 -->
    </div>
  </div>
</template>

<style scoped>
/* 只需要添加特殊的自定义样式 */
</style>
```

### 2. 改造现有组件
1. 识别现有的卡片、按钮、标题等元素
2. 替换为对应的统一样式类
3. 移除冗余的自定义样式
4. 测试响应式和交互效果
5. 确保段位主题色正确应用

---

## 📞 支持

如有疑问或需要帮助，请参考：
- [设计系统文档](./DESIGN_SYSTEM.md)
- [统一设计样式文件](./src/styles/unified-design.css)

---

**最后更新：** 2024-01
