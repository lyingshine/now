# NOW 应用设计系统重构需求文档

## 简介

基于 `design-system-guide.md` 完全重新设计 NOW 应用，采用现代简约的设计风格，确保一致性、可访问性和优秀的用户体验。

## 术语表

- **NOW**: 实时收入计算应用
- **Design System**: 设计系统，包含色彩、字体、间距、组件等规范
- **CSS Variables**: CSS 自定义属性，用于实现设计令牌
- **Accessibility**: 无障碍性，确保所有用户都能使用
- **Responsive Design**: 响应式设计，适配不同设备

## 需求

### 需求 1: 应用设计系统色彩规范

**用户故事**: 作为用户，我希望看到统一协调的配色方案，以获得专业的视觉体验

#### 验收标准

1. WHEN 页面加载时，THE 应用 SHALL 使用主蓝色 (#2563eb) 作为主色调
2. WHEN 需要强调内容时，THE 应用 SHALL 使用琥珀色 (#f59e0b) 作为强调色
3. WHEN 显示文本时，THE 应用 SHALL 使用中性灰色系统确保可读性
4. WHEN 用户切换主题时，THE 应用 SHALL 保持色彩对比度符合 WCAG 标准
5. THE 应用 SHALL 使用 CSS 变量定义所有颜色值

### 需求 2: 实现标准化间距系统

**用户故事**: 作为用户，我希望界面元素间距统一，以获得整洁有序的视觉体验

#### 验收标准

1. THE 应用 SHALL 使用 8px 基础间距单位系统
2. WHEN 设置组件内边距时，THE 应用 SHALL 使用 --space-4 到 --space-6
3. WHEN 设置组件间距时，THE 应用 SHALL 使用 --space-8 到 --space-12
4. WHEN 设置区块间距时，THE 应用 SHALL 使用 --space-16
5. THE 应用 SHALL 通过 CSS 变量统一管理所有间距值

### 需求 3: 应用圆角和阴影系统

**用户故事**: 作为用户，我希望界面元素有统一的圆角和阴影，以获得现代化的视觉效果

#### 验收标准

1. WHEN 显示按钮时，THE 应用 SHALL 使用 --radius-xl (1rem) 圆角
2. WHEN 显示卡片时，THE 应用 SHALL 使用 --radius-3xl (2rem) 圆角
3. WHEN 显示输入框时，THE 应用 SHALL 使用 --radius-2xl (1.5rem) 圆角
4. WHEN 卡片处于默认状态时，THE 应用 SHALL 使用 --shadow-sm 阴影
5. WHEN 卡片悬停时，THE 应用 SHALL 使用 --shadow-xl 阴影并有 transform 效果

### 需求 4: 实现标准化按钮组件

**用户故事**: 作为用户，我希望按钮有清晰的视觉层次和交互反馈

#### 验收标准

1. WHEN 显示主要操作按钮时，THE 应用 SHALL 使用琥珀色背景和白色文字
2. WHEN 用户悬停按钮时，THE 应用 SHALL 显示 translateY(-2px) 效果和加深的阴影
3. WHEN 显示次要按钮时，THE 应用 SHALL 使用浅灰背景和边框
4. THE 按钮 SHALL 使用 --space-3 和 --space-6 作为内边距
5. THE 按钮 SHALL 使用 --transition-fast 作为过渡时长

### 需求 5: 重新设计卡片组件

**用户故事**: 作为用户，我希望卡片有优雅的外观和流畅的交互动画

#### 验收标准

1. WHEN 显示卡片时，THE 应用 SHALL 使用白色背景和细边框
2. WHEN 用户悬停卡片时，THE 应用 SHALL 执行 translateY(-6px) scale(1.02) 变换
3. WHEN 卡片需要装饰时，THE 应用 SHALL 在顶部显示渐变色线条
4. THE 卡片 SHALL 使用 --space-8 作为内边距
5. THE 卡片 SHALL 使用 backdrop-filter: blur(8px) 实现毛玻璃效果

### 需求 6: 优化输入框组件

**用户故事**: 作为用户，我希望输入框有清晰的状态反馈

#### 验收标准

1. WHEN 输入框处于默认状态时，THE 应用 SHALL 使用浅灰背景
2. WHEN 用户悬停输入框时，THE 应用 SHALL 改变边框颜色
3. WHEN 输入框获得焦点时，THE 应用 SHALL 显示琥珀色边框和光晕效果
4. THE 输入框 SHALL 使用 --space-4 和 --space-5 作为内边距
5. THE 输入框 SHALL 使用 --transition-fast 作为过渡时长

### 需求 7: 实现胶囊式导航

**用户故事**: 作为用户，我希望导航栏有现代化的胶囊式设计

#### 验收标准

1. WHEN 显示导航栏时，THE 应用 SHALL 使用浅灰背景的胶囊容器
2. WHEN 导航项处于激活状态时，THE 应用 SHALL 显示白色背景和阴影
3. WHEN 用户悬停导航项时，THE 应用 SHALL 改变背景色
4. THE 导航项 SHALL 使用 --space-3 和 --space-5 作为内边距
5. THE 导航容器 SHALL 使用 --space-1 作为内部间距

### 需求 8: 实现响应式布局

**用户故事**: 作为用户，我希望在任何设备上都能获得良好的浏览体验

#### 验收标准

1. WHEN 屏幕宽度小于 768px 时，THE 应用 SHALL 切换为单列布局
2. WHEN 屏幕宽度小于 600px 时，THE 应用 SHALL 调整字体大小和间距
3. WHEN 在移动设备上时，THE 应用 SHALL 确保交互元素至少 44px
4. THE 应用 SHALL 使用移动优先的开发策略
5. THE 应用 SHALL 在所有断点下保持内容可读性

### 需求 9: 增强无障碍性

**用户故事**: 作为有特殊需求的用户，我希望能够无障碍地使用应用

#### 验收标准

1. WHEN 元素获得焦点时，THE 应用 SHALL 显示清晰的焦点指示器
2. WHEN 用户启用减少动画偏好时，THE 应用 SHALL 禁用所有动画
3. WHEN 用户启用高对比度模式时，THE 应用 SHALL 增加边框宽度
4. THE 应用 SHALL 确保所有文本对比度至少为 4.5:1
5. THE 应用 SHALL 支持完整的键盘导航

### 需求 10: 优化动画系统

**用户故事**: 作为用户，我希望看到流畅自然的动画效果

#### 验收标准

1. WHEN 页面加载时，THE 应用 SHALL 显示淡入动画
2. WHEN 用户交互时，THE 应用 SHALL 使用 150ms 快速过渡
3. WHEN 显示复杂动画时，THE 应用 SHALL 使用 350ms 慢速过渡
4. THE 应用 SHALL 使用 ease-in-out 缓动函数
5. THE 应用 SHALL 优先使用 transform 和 opacity 属性以提升性能

### 需求 11: 重新设计主页布局

**用户故事**: 作为用户，我希望主页信息清晰、布局合理

#### 验收标准

1. WHEN 访问主页时，THE 应用 SHALL 显示左右分栏布局
2. WHEN 在左侧面板时，THE 应用 SHALL 显示段位、收入和统计信息
3. WHEN 在右侧面板时，THE 应用 SHALL 显示生活水平、岗位推荐和升级建议
4. THE 主页 SHALL 使用白色/浅色背景
5. THE 主页 SHALL 在移动端切换为上下堆叠布局

### 需求 12: 重新设计任务大厅

**用户故事**: 作为用户，我希望任务大厅有吸引人的职位卡片设计

#### 验收标准

1. WHEN 显示职位卡片时，THE 应用 SHALL 使用网格布局
2. WHEN 用户悬停职位卡片时，THE 应用 SHALL 显示提升和缩放效果
3. WHEN 显示职位详情时，THE 应用 SHALL 使用模态框
4. THE 职位卡片 SHALL 显示段位标识和薪资信息
5. THE 任务大厅 SHALL 在移动端切换为单列布局
