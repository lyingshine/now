# NOW 职场成长平台 - 设计系统文档

## 📋 目录

1. [设计理念](#设计理念)
2. [色彩系统](#色彩系统)
3. [排版系统](#排版系统)
4. [间距系统](#间距系统)
5. [圆角系统](#圆角系统)
6. [组件样式](#组件样式)
7. [动画效果](#动画效果)
8. [响应式设计](#响应式设计)

---

## 🎨 设计理念

### 核心价值
- **沉浸式体验**：全屏滚动设计，每屏专注展示一个主题
- **游戏化交互**：段位系统、经验值、成就系统增强参与感
- **个性化主题**：根据用户段位动态调整主题色
- **数据可视化**：直观展示收入、成长、职业发展数据

### 设计原则
1. **简约而不简单**：界面简洁，但功能丰富
2. **一致性**：统一的视觉语言和交互模式
3. **可访问性**：良好的对比度和可读性
4. **响应式**：适配各种屏幕尺寸

---

## 🎨 色彩系统

### 主题色（动态）
根据用户段位动态变化的主题色：

```css
--rank-color: 动态计算（基于薪资段位）
```

**段位色彩映射：**
- 🌱 新手（<5K）：`#10b981` 绿色
- 🔰 初级（5-8K）：`#3b82f6` 蓝色
- ⚔️ 中级（8-12K）：`#8b5cf6` 紫色
- 🏆 高级（12-20K）：`#f59e0b` 橙色
- 💎 专家（20-35K）：`#ec4899` 粉色
- 👑 大师（35-50K）：`#ef4444` 红色
- ⭐ 传奇（50K+）：`#fbbf24` 金色

### 基础色彩

#### 背景色
```css
--immersive-bg-primary: #0a0e1a;      /* 主背景 */
--immersive-bg-secondary: #111827;    /* 次级背景 */
--immersive-bg-tertiary: #1f2937;     /* 三级背景 */
```

#### 文字色
```css
--immersive-text-primary: #f9fafb;    /* 主文字 */
--immersive-text-secondary: #d1d5db;  /* 次级文字 */
--immersive-text-tertiary: #9ca3af;   /* 三级文字 */
```

#### 强调色
```css
--neon-purple: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
--neon-green: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
--neon-blue: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

#### 功能色
```css
--color-success: #10b981;   /* 成功 */
--color-warning: #f59e0b;   /* 警告 */
--color-error: #ef4444;     /* 错误 */
--color-info: #3b82f6;      /* 信息 */
```

---

## 📝 排版系统

### 字体家族
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 
             'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
```

### 字号标尺
```css
--text-xs: 0.75rem;      /* 12px - 辅助文字 */
--text-sm: 0.875rem;     /* 14px - 次要文字 */
--text-base: 1rem;       /* 16px - 正文 */
--text-lg: 1.125rem;     /* 18px - 小标题 */
--text-xl: 1.25rem;      /* 20px - 标题 */
--text-2xl: 1.5rem;      /* 24px - 大标题 */
--text-3xl: 1.875rem;    /* 30px - 特大标题 */
--text-4xl: 2.25rem;     /* 36px - 超大标题 */
```

### 字重
```css
font-weight: 400;   /* 常规 */
font-weight: 600;   /* 半粗 */
font-weight: 700;   /* 粗体 */
font-weight: 900;   /* 特粗 */
```

### 行高
```css
line-height: 1.2;   /* 紧凑 - 标题 */
line-height: 1.5;   /* 标准 - 正文 */
line-height: 1.8;   /* 宽松 - 长文本 */
```

---

## 📏 间距系统

### 间距标尺（基于 4px）
```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
```

### 使用场景
- **space-1/2**：元素内部微小间距
- **space-3/4**：组件内部间距
- **space-6/8**：组件之间间距
- **space-10/12**：区块之间间距

---

## 🔲 圆角系统

```css
--radius-sm: 0.25rem;    /* 4px - 小元素 */
--radius-md: 0.375rem;   /* 6px - 标准 */
--radius-lg: 0.5rem;     /* 8px - 卡片 */
--radius-xl: 0.75rem;    /* 12px - 大卡片 */
--radius-2xl: 1rem;      /* 16px - 特大卡片 */
--radius-3xl: 1.5rem;    /* 24px - 超大卡片 */
--radius-4xl: 2rem;      /* 32px - 主要容器 */
--radius-full: 9999px;   /* 完全圆形 */
```

---

## 🧩 组件样式

### 1. 段位卡片（Rank Card）

**尺寸：** 600-1200px 宽，自适应高度

**样式特征：**
- 背景：`rgba(255, 255, 255, 0.05)` + 毛玻璃效果
- 边框：`2px solid rgba(255, 255, 255, 0.15)`
- 圆角：`var(--radius-4xl)`
- 顶部装饰条：4px 高，使用段位主题色
- 内边距：`var(--space-10) var(--space-12)`

**内容结构：**
```
┌─────────────────────────────────┐
│ [顶部装饰条 - 段位色]            │
│                                  │
│         [段位图标 6rem]          │
│         [段位名称 4xl]           │
│         [段位描述 lg]            │
│      [百分比标签 sm]             │
│                                  │
│ ─────────────────────────────── │
│                                  │
│  [月薪]    [年薪]    [生活水平]  │
│  [3xl]     [3xl]     [3xl]      │
│                                  │
└─────────────────────────────────┘
```

### 2. 收入卡片（Earning Card）

**尺寸：** 1/3 网格宽度

**样式特征：**
- 背景：`rgba(255, 255, 255, 0.05)`
- 边框：`2px solid rgba(255, 255, 255, 0.15)`
- 圆角：`var(--radius-2xl)`
- 悬停效果：上移 4px + 阴影增强

**内容结构：**
```
┌──────────────┐
│   [图标 2xl] │
│   [标签 xs]  │
│   [数值 lg]  │
│  [进度条 6px]│
└──────────────┘
```

### 3. 导航栏（Navbar）

**高度：** 80px（含内边距）

**样式特征：**
- 背景：半透明 + 毛玻璃效果
- 按钮最小宽度：100px
- 按钮圆角：`var(--radius-xl)`
- 活动状态：使用段位主题色

**布局：**
```
[Logo]  ────  [首页] [任务大厅] [成长中心] [冒险生涯] [设置] [主题]
```

### 4. 页面指示器（Page Indicator）

**位置：** 固定在右侧，垂直居中

**样式特征：**
- 圆点尺寸：12x12px
- 间距：`var(--space-4)`
- 活动状态：放大 1.5 倍 + 段位主题色
- 悬停效果：放大 1.3 倍

### 5. 滚动提示（Scroll Hint）

**位置：** 固定在右侧，指示器右边

**样式特征：**
- 尺寸：40x40px
- 圆角：`var(--radius-xl)`
- 背景：`rgba(0, 0, 0, 0.5)` + 毛玻璃
- 动画：缩放弹跳效果

---

## 🎬 动画效果

### 过渡时长
```css
--duration-fast: 150ms;      /* 快速交互 */
--duration-normal: 300ms;    /* 标准过渡 */
--duration-slow: 500ms;      /* 慢速过渡 */
```

### 缓动函数
```css
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);     /* 平滑 */
--ease-in: cubic-bezier(0.4, 0, 1, 1);           /* 进入 */
--ease-out: cubic-bezier(0, 0, 0.2, 1);          /* 退出 */
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55); /* 弹跳 */
```

### 常用动画

#### 1. 淡入上移（fadeInUp）
```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

#### 2. 浮动（float）
```css
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
```

#### 3. 闪光（shimmer）
```css
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
```

#### 4. 弹跳（bounce）
```css
@keyframes bounce {
  0%, 100% { transform: translateY(-50%) scale(1); }
  50% { transform: translateY(-50%) scale(1.1); }
}
```

### 交互动画

**悬停效果：**
- 卡片：上移 2-8px + 阴影增强
- 按钮：背景变亮 + 轻微上移
- 图标：放大 1.1-1.2 倍

**点击效果：**
- 缩小至 0.95 倍
- 持续时间：150ms

---

## 📱 响应式设计

### 断点系统
```css
/* 移动设备 */
@media (max-width: 768px) { }

/* 平板设备 */
@media (max-width: 1024px) { }

/* 桌面设备 */
@media (min-width: 1025px) { }
```

### 移动端适配

#### 导航栏
- 隐藏文字标签，只显示图标
- 按钮内边距减小
- Logo 字号缩小

#### 段位卡片
- 宽度改为 100%
- 内边距减小
- 图标和文字缩小
- 关键数据改为垂直布局

#### 内容区域
- 最大宽度改为 100%
- 左右内边距减小
- 网格布局改为单列

---

## 🎯 特殊效果

### 毛玻璃效果
```css
backdrop-filter: blur(10px);
-webkit-backdrop-filter: blur(10px);
background: rgba(255, 255, 255, 0.05);
```

### 渐变文字
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
```

### 光晕效果
```css
box-shadow: 0 0 20px var(--rank-color);
```

### 阴影层级
```css
/* 轻微阴影 */
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

/* 标准阴影 */
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

/* 强阴影 */
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);

/* 超强阴影 */
box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
```

---

## 📐 布局规范

### 全屏滚动布局

**容器：**
```css
.fullpage-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
```

**区块：**
```css
.fullpage-section {
  width: 100%;
  height: 100vh;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

**内容区域：**
```css
.section-content {
  max-width: 1400px;
  width: 100%;
  height: calc(100vh - 160px);
  overflow: hidden;
  justify-content: center;
}
```

**主内容宽度：**
```css
max-width: 1200px;
margin: 0 auto;
```

### 标题区域

**固定高度：**
```css
.section-header-text {
  min-height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
```

---

## 🎨 主题色应用场景

### 段位主题色使用位置

1. **段位卡片顶部装饰条**
2. **页面标题渐变**
3. **活动导航按钮背景**
4. **活动页面指示器**
5. **收入卡片顶部装饰条**
6. **建议编号背景**
7. **职位卡片悬停边框**
8. **进度条填充色**

### 实现方式
```css
/* 在根容器注入 CSS 变量 */
:style="{ '--rank-color': rankInfo.current.color }"

/* 在样式中使用 */
background: var(--rank-color, var(--neon-purple));
```

---

## 📊 数据可视化

### 进度条
- 高度：4-8px
- 圆角：`var(--radius-full)`
- 背景：`rgba(255, 255, 255, 0.1)`
- 填充：段位主题色或功能色
- 动画：1s 缓动填充

### 数值显示
- 字体：等宽数字 `font-variant-numeric: tabular-nums`
- 字重：900（特粗）
- 渐变色：增强视觉冲击力

---

## ✅ 设计检查清单

### 视觉一致性
- [ ] 所有卡片使用统一的圆角和边框
- [ ] 间距遵循 4px 基准
- [ ] 文字大小符合层级规范
- [ ] 颜色使用符合主题系统

### 交互反馈
- [ ] 所有可点击元素有悬停效果
- [ ] 过渡动画流畅自然
- [ ] 加载状态有明确提示
- [ ] 错误状态有清晰反馈

### 可访问性
- [ ] 文字对比度 ≥ 4.5:1
- [ ] 可键盘导航
- [ ] 有意义的语义化标签
- [ ] 适当的 ARIA 属性

### 响应式
- [ ] 移动端布局合理
- [ ] 触摸目标 ≥ 44x44px
- [ ] 内容不溢出
- [ ] 图片自适应

---

## 🔄 版本历史

### v1.0.0 (2024-01)
- 初始设计系统建立
- 沉浸式全屏滚动布局
- 段位主题色系统
- 游戏化视觉元素

---

## 📚 参考资源

- [Material Design](https://material.io/design)
- [Tailwind CSS](https://tailwindcss.com/)
- [Ant Design](https://ant.design/)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/)

---

**文档维护：** 随设计系统更新而更新  
**最后更新：** 2024-01
