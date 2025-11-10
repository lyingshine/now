# NOW 应用设计系统重构 - 设计文档

## 概述

本文档描述如何将 NOW 应用完全重构为符合 `design-system-guide.md` 规范的现代简约风格。

## 架构

### 设计令牌层
- CSS 变量系统
- 色彩、间距、圆角、阴影、动画参数
- 支持主题切换

### 组件层
- 按钮组件
- 卡片组件
- 输入框组件
- 导航组件
- 模态框组件

### 页面层
- 主页（收入展示）
- 任务大厅（职位列表）

## 组件设计

### 1. 色彩系统

#### 主题配色
```css
/* 日间模式（默认） */
--color-primary: #2563eb;
--color-accent: #f59e0b;
--bg-primary: #ffffff;
--bg-secondary: #f8fafc;
--text-primary: #0f172a;

/* 夜间模式 */
body.dark-mode {
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --text-primary: #f8fafc;
}
```

#### 应用场景
- **主色调**: 导航激活状态、链接、重要信息
- **强调色**: 主要按钮、收入数字、段位进度
- **中性色**: 文本、边框、背景

### 2. 按钮组件

#### 主要按钮
```css
.btn-primary {
  background: var(--color-accent);
  color: white;
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-xl);
  font-weight: 600;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-sm);
}

.btn-primary:hover {
  background: var(--color-accent-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}
```

#### 次要按钮
```css
.btn-secondary {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--color-gray-200);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-xl);
  transition: all var(--transition-fast);
}
```

### 3. 卡片组件

#### 基础卡片
```css
.card {
  background: var(--bg-elevated);
  border-radius: var(--radius-3xl);
  padding: var(--space-8);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-gray-200);
  transition: all var(--transition-fast);
  backdrop-filter: blur(8px);
}

.card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: var(--shadow-xl);
}
```

#### 装饰卡片
```css
.card-decorated::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--color-accent), var(--color-primary));
  border-radius: var(--radius-3xl) var(--radius-3xl) 0 0;
}
```

### 4. 导航组件

#### 胶囊式导航
```css
.nav-pills {
  display: flex;
  gap: var(--space-1);
  background: var(--bg-secondary);
  border-radius: var(--radius-2xl);
  padding: var(--space-1);
}

.nav-pill {
  padding: var(--space-3) var(--space-5);
  border-radius: var(--radius-xl);
  font-weight: 500;
  font-size: 0.875rem;
  color: var(--text-secondary);
  transition: all var(--transition-fast);
}

.nav-pill.active {
  background: var(--bg-elevated);
  color: var(--text-primary);
  box-shadow: var(--shadow-sm);
}
```

### 5. 输入框组件

```css
.input {
  width: 100%;
  padding: var(--space-4) var(--space-5);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-2xl);
  font-size: 0.875rem;
  background: var(--bg-secondary);
  transition: all var(--transition-fast);
}

.input:focus {
  outline: none;
  border-color: var(--color-accent);
  background: var(--bg-primary);
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.15);
}
```

## 页面布局

### 主页布局

```
┌─────────────────────────────────────┐
│         导航栏（胶囊式）              │
├──────────────┬──────────────────────┤
│              │                      │
│  左侧面板     │    右侧面板          │
│              │                      │
│  - 段位卡片   │  - 生活水平          │
│  - 收入展示   │  - 岗位推荐          │
│  - 统计数据   │  - 升级建议          │
│              │                      │
└──────────────┴──────────────────────┘
```

### 任务大厅布局

```
┌─────────────────────────────────────┐
│         导航栏（胶囊式）              │
├─────────────────────────────────────┤
│            页面标题                  │
├─────────────────────────────────────┤
│  ┌────────┐  ┌────────┐  ┌────────┐│
│  │职位卡片 │  │职位卡片 │  │职位卡片 ││
│  └────────┘  └────────┘  └────────┘│
│  ┌────────┐  ┌────────┐  ┌────────┐│
│  │职位卡片 │  │职位卡片 │  │职位卡片 ││
│  └────────┘  └────────┘  └────────┘│
└─────────────────────────────────────┘
```

## 数据模型

### 设计令牌
```typescript
interface DesignTokens {
  colors: {
    primary: string;
    accent: string;
    gray: string[];
  };
  spacing: number[];
  radius: number[];
  shadows: string[];
  transitions: string[];
}
```

### 主题配置
```typescript
interface Theme {
  mode: 'light' | 'dark';
  tokens: DesignTokens;
}
```

## 错误处理

### CSS 变量回退
```css
.element {
  color: var(--text-primary, #0f172a);
  background: var(--bg-primary, #ffffff);
}
```

### 浏览器兼容性
- 使用 @supports 检测 backdrop-filter
- 提供降级方案

## 测试策略

### 视觉回归测试
- 截图对比
- 不同主题下的表现
- 不同设备尺寸

### 无障碍测试
- 键盘导航
- 屏幕阅读器
- 颜色对比度

### 性能测试
- Lighthouse 评分
- 动画性能
- 首屏加载时间

## 实现优先级

### 阶段 1: 基础设施
1. CSS 变量系统
2. 主题切换机制
3. 响应式断点

### 阶段 2: 核心组件
1. 按钮组件
2. 卡片组件
3. 输入框组件
4. 导航组件

### 阶段 3: 页面重构
1. 主页重新设计
2. 任务大厅重新设计
3. 模态框优化

### 阶段 4: 优化增强
1. 动画优化
2. 无障碍增强
3. 性能优化
4. 细节打磨

## 设计决策

### 为什么选择日间模式为默认？
- 符合设计文档规范
- 更好的可读性
- 更广泛的用户接受度
- 保留夜间模式选项

### 为什么使用胶囊式导航？
- 现代化设计趋势
- 清晰的视觉层次
- 优秀的交互反馈
- 符合设计文档规范

### 为什么使用大圆角？
- 友好温和的视觉感受
- 符合当前设计趋势
- 与卡片式布局完美配合
- 提升整体美感

## 技术栈

- **CSS**: 原生 CSS + CSS 变量
- **JavaScript**: 原生 JavaScript
- **无依赖**: 保持轻量级

## 性能考虑

### CSS 优化
- 使用 CSS 变量减少重复
- 合理使用 will-change
- 避免过度使用 backdrop-filter

### JavaScript 优化
- 防抖和节流
- 事件委托
- 懒加载

### 动画优化
- 使用 transform 和 opacity
- 避免触发重排
- 支持减少动画偏好

## 无障碍设计

### 键盘导航
- Tab 键顺序合理
- 焦点指示器清晰
- 支持快捷键

### 屏幕阅读器
- 语义化 HTML
- ARIA 标签
- 替代文本

### 颜色对比度
- 文本至少 4.5:1
- 大文本至少 3:1
- 交互元素至少 3:1

## 浏览器支持

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 总结

本设计方案完全遵循 `design-system-guide.md` 规范，采用现代简约的设计风格，确保一致性、可访问性和优秀的用户体验。通过系统化的设计令牌和组件库，实现可维护、可扩展的设计系统。
