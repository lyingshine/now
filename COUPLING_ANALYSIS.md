# 代码耦合分析报告

## 当前状态概览

### 文件统计
- **Home.vue**: 979 行（仍然是一个巨大的单体文件）
- **已创建的组件**: 4 个（但未使用）
- **已创建的 Composables**: 3 个（但未使用）

## 耦合问题分析

### 🔴 高耦合问题

#### 1. **Home.vue 仍然是单体文件**
**问题**：
- 979 行代码全部在一个文件中
- 模板、逻辑、样式混在一起
- 难以维护和测试

**影响**：
- 代码可读性差
- 修改风险高
- 无法复用
- 团队协作困难

#### 2. **业务逻辑与视图层紧密耦合**
**问题**：
```javascript
// 所有计算逻辑都在 Home.vue 中
const formatMoney = (value) => { ... }
const getPerMinuteRate = () => { ... }
const getTodayWorkMinutes = () => { ... }
const calculateEarnings = () => { ... }
// ... 还有很多
```

**影响**：
- 逻辑无法在其他组件中复用
- 难以进行单元测试
- 职责不清晰

#### 3. **样式耦合**
**问题**：
- 600+ 行样式代码在 Home.vue 中
- 样式与组件紧密绑定
- 无法复用样式

#### 4. **数据流混乱**
**问题**：
```javascript
// 多个 ref 分散在文件中
const perMinute = ref(0)
const workMinutes = ref(0)
const todayEarnings = ref(0)
const monthEarnings = ref(0)
const yearEarnings = ref(0)
const totalEarnings = ref(0)
```

**影响**：
- 状态管理混乱
- 数据流向不清晰
- 难以追踪数据变化

#### 5. **组件未被使用**
**问题**：
- 已创建 RankCard.vue、EarningsCard.vue 等组件
- 但 Home.vue 仍然使用内联模板
- 重构工作未完成

## 耦合度评分

| 维度 | 评分 | 说明 |
|------|------|------|
| **组件耦合** | 🔴 9/10 | 所有内容在一个文件中 |
| **逻辑耦合** | 🔴 8/10 | 业务逻辑与视图混在一起 |
| **样式耦合** | 🔴 8/10 | 样式无法复用 |
| **数据耦合** | 🟡 6/10 | 使用了 composable 但未充分利用 |
| **模块耦合** | 🟡 5/10 | 有模块化意识但未实施 |

**总体耦合度**: 🔴 **7.2/10 (高耦合)**

## 具体耦合点

### 1. Home.vue 内部耦合

```
Home.vue (979 行)
├── Template (100+ 行)
│   ├── 段位显示 (内联)
│   ├── 收入显示 (内联)
│   ├── 统计卡片 (内联)
│   ├── 生活水平 (内联)
│   ├── 岗位推荐 (内联)
│   └── 升级建议 (内联)
├── Script (300+ 行)
│   ├── 数据定义
│   ├── 计算逻辑
│   ├── 工作日计算
│   ├── 收入计算
│   ├── 格式化函数
│   └── 生命周期钩子
└── Style (600+ 行)
    ├── 布局样式
    ├── 卡片样式
    ├── 动画样式
    └── 响应式样式
```

### 2. 其他页面的耦合情况

#### Jobs.vue
- **行数**: ~300 行
- **耦合度**: 🟡 中等
- **问题**: 职位卡片、模态框逻辑混在一起

#### Growth.vue
- **行数**: ~250 行
- **耦合度**: 🟡 中等
- **问题**: 统计和任务列表耦合

#### GrowthDetail.vue
- **行数**: ~400 行
- **耦合度**: 🟡 中等
- **问题**: 技能卡片、步骤、任务混在一起

## 解耦建议

### 🎯 优先级 1: 立即解耦 Home.vue

#### 步骤 1: 使用已创建的组件
```vue
<!-- 替换内联模板 -->
<RankCard :rankInfo="rankInfo" :lifestyleLevel="lifestyleLevel" />
<EarningsCard :perMinute="perMinute" :workMinutes="workMinutes" />
<StatsCards 
  :todayEarnings="todayEarnings"
  :monthEarnings="monthEarnings"
  :yearEarnings="yearEarnings"
  :totalEarnings="totalEarnings"
/>
<LifestyleSection :categories="lifestyleCategories" />
```

#### 步骤 2: 使用已创建的 Composables
```javascript
import { useEarnings } from '../composables/useEarnings'
import { useFormatters } from '../composables/useFormatters'

const { formatMoney } = useFormatters()
const {
  perMinute,
  workMinutes,
  todayEarnings,
  monthEarnings,
  yearEarnings,
  totalEarnings,
  calculateEarnings
} = useEarnings(salaryData)
```

#### 步骤 3: 提取剩余组件
- JobRecommendations.vue
- UpgradeTips.vue

#### 步骤 4: 提取样式
- 创建 src/styles/home.css
- 提取通用样式到 src/styles/common.css

### 🎯 优先级 2: 解耦其他页面

#### Jobs.vue
- 提取 JobCard.vue
- 使用 useJobs.js composable

#### Growth.vue
- 提取 TaskCard.vue
- 使用 useGrowth.js composable

#### GrowthDetail.vue
- 提取 SkillCard.vue
- 提取 StepCard.vue
- 使用 useSkillProgress.js composable

### 🎯 优先级 3: 状态管理优化

#### 创建 Pinia Stores
```javascript
// stores/salary.js
export const useSalaryStore = defineStore('salary', {
  state: () => ({
    salary: 10000,
    peopleCount: 1,
    // ...
  }),
  actions: {
    updateSalary(newSalary) { ... }
  }
})
```

### 🎯 优先级 4: 样式解耦

#### 创建样式系统
```
src/styles/
├── variables.css      # CSS 变量
├── common.css         # 通用样式
├── components/        # 组件样式
│   ├── card.css
│   ├── button.css
│   └── panel.css
└── pages/            # 页面样式
    ├── home.css
    ├── jobs.css
    └── growth.css
```

## 解耦后的预期效果

### 文件大小对比
| 文件 | 当前 | 解耦后 | 减少 |
|------|------|--------|------|
| Home.vue | 979 行 | ~150 行 | 85% ⬇️ |
| Jobs.vue | 300 行 | ~100 行 | 67% ⬇️ |
| Growth.vue | 250 行 | ~80 行 | 68% ⬇️ |
| GrowthDetail.vue | 400 行 | ~120 行 | 70% ⬇️ |

### 耦合度对比
| 维度 | 当前 | 解耦后 | 改善 |
|------|------|--------|------|
| 组件耦合 | 🔴 9/10 | 🟢 2/10 | 78% ⬆️ |
| 逻辑耦合 | 🔴 8/10 | 🟢 2/10 | 75% ⬆️ |
| 样式耦合 | 🔴 8/10 | 🟢 3/10 | 63% ⬆️ |
| 数据耦合 | 🟡 6/10 | 🟢 2/10 | 67% ⬆️ |
| 模块耦合 | 🟡 5/10 | 🟢 2/10 | 60% ⬆️ |

**总体耦合度**: 🔴 7.2/10 → 🟢 **2.2/10** (改善 **69%**)

## 下一步行动

### 立即执行
1. ✅ 已创建组件和 Composables
2. ⏳ 在 Home.vue 中使用这些组件
3. ⏳ 删除 Home.vue 中的重复代码
4. ⏳ 提取剩余的组件

### 短期目标（1-2 天）
1. 完成 Home.vue 的完全解耦
2. 解耦其他 3 个页面
3. 创建样式系统

### 中期目标（1 周）
1. 添加单元测试
2. 优化性能
3. 完善文档

## 总结

**当前状态**: 🔴 **高耦合** (7.2/10)
- 虽然创建了组件和 Composables，但未实际使用
- Home.vue 仍然是 979 行的单体文件
- 需要立即完成重构工作

**建议**: 
1. 立即在 Home.vue 中使用已创建的组件
2. 删除重复代码
3. 继续提取剩余部分
4. 完成其他页面的解耦
