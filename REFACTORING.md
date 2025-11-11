# 代码重构文档

## 重构概述

本次重构主要目标是解耦和模块化，提高代码的可维护性和可复用性。

## 重构内容

### 1. Composables（组合式函数）

#### `useFormatters.js`
格式化工具函数集合
- `formatMoney(value)` - 格式化金额（大于1万显示为"万"）
- `formatDate(date)` - 格式化日期
- `formatTime(minutes)` - 格式化时间

#### `useWorkDays.js`
工作日计算逻辑
- `isWorkDay(date, weekNumber, schedule)` - 判断是否为工作日
- `getWeekNumber(date)` - 获取周数
- `getWorkDays(startDate, endDate, schedule)` - 计算工作日天数
- `isTodayAfterJoinDate(joinDate)` - 判断今天是否在入职日期之后

#### `useEarnings.js`
收入计算逻辑
- `getPerMinuteRate()` - 获取每分钟收入
- `getTodayWorkMinutes()` - 获取今日已工作分钟数
- `getMonthWorkDays()` - 获取本月工作日天数
- `getYearWorkDays()` - 获取今年工作日天数
- `getTotalWorkDays()` - 获取总工作日天数
- `calculateEarnings()` - 计算所有收入

### 2. Components（组件）

#### `RankCard.vue`
段位显示卡片
- Props: `rankInfo`, `lifestyleLevel`
- 显示段位图标、名称、描述、百分比和进度条

#### `EarningsCard.vue`
收入显示卡片
- Props: `perMinute`, `workMinutes`
- 显示每分钟收入和今日已工作时间

#### `StatsCards.vue`
统计卡片组
- Props: `todayEarnings`, `monthEarnings`, `yearEarnings`, `totalEarnings`
- 显示今日、本月、今年和入职以来的收入统计

#### `LifestyleSection.vue`
生活水平区域
- Props: `categories`
- 显示分类的生活水平信息

## 使用方法

### 在 Home.vue 中使用

```vue
<script setup>
import { ref, computed } from 'vue'
import RankCard from '../components/RankCard.vue'
import EarningsCard from '../components/EarningsCard.vue'
import StatsCards from '../components/StatsCards.vue'
import LifestyleSection from '../components/LifestyleSection.vue'
import { useEarnings } from '../composables/useEarnings'
import { useLifestyle } from '../composables/useLifestyle'

const salaryData = ref({
  salary: 10000,
  // ... 其他配置
})

// 使用收入计算 composable
const {
  perMinute,
  workMinutes,
  todayEarnings,
  monthEarnings,
  yearEarnings,
  totalEarnings,
  calculateEarnings
} = useEarnings(salaryData)

// 使用生活水平 composable
const { getRankInfo, calculateLifestyle } = useLifestyle()

const rankInfo = computed(() => getRankInfo(salaryData.value.salary))
const lifestyleCategories = computed(() => {
  // ... 计算逻辑
})
</script>

<template>
  <div class="home">
    <div class="left-panel">
      <RankCard :rankInfo="rankInfo" :lifestyleLevel="lifestyleLevel" />
      <EarningsCard :perMinute="perMinute" :workMinutes="workMinutes" />
      <StatsCards 
        :todayEarnings="todayEarnings"
        :monthEarnings="monthEarnings"
        :yearEarnings="yearEarnings"
        :totalEarnings="totalEarnings"
      />
    </div>
    <div class="middle-panel">
      <LifestyleSection :categories="lifestyleCategories" />
    </div>
  </div>
</template>
```

## 重构优势

### 1. 代码复用
- Composables 可以在多个组件中复用
- 组件可以在不同页面中使用

### 2. 职责分离
- 每个 composable 负责特定的业务逻辑
- 每个组件负责特定的 UI 展示

### 3. 易于测试
- 独立的函数和组件更容易编写单元测试
- 逻辑和视图分离，便于测试

### 4. 易于维护
- 代码结构清晰，易于理解
- 修改某个功能不会影响其他部分

### 5. 性能优化
- 组件可以独立优化
- 减少不必要的重渲染

## 下一步计划

1. 继续拆分 Home.vue 中的其他部分
2. 创建更多可复用的组件
3. 添加单元测试
4. 优化性能
5. 添加 TypeScript 支持

## 注意事项

1. 保持向后兼容性
2. 确保所有功能正常工作
3. 更新相关文档
4. 进行充分的测试
