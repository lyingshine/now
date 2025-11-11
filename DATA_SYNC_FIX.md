# 数据同步修复说明

## 问题描述

生活水平卡片中显示的房租、水电网费等数据与设置面板中的数据不一致。

## 问题原因

1. **数据来源不统一**：
   - 生活水平卡片使用 `salaryData` 计算
   - 设置面板使用 `userStore.userInfo` 存储
   - 两者没有实时同步

2. **加载顺序问题**：
   - `Home.vue` 先从 localStorage 加载 `salaryData`
   - 然后才加载 `userStore`
   - 导致使用的是旧的 localStorage 数据

## 解决方案

### 1. 统一数据源

修改 `Home.vue` 中的数据同步逻辑，优先使用 `userStore` 的数据：

```javascript
// 从 userStore 同步所有数据
const syncDataFromUser = () => {
  const user = userStore.userInfo
  
  // 同步所有用户设置
  if (user.currentSalary) salaryData.value.salary = user.currentSalary
  if (user.rent !== undefined) salaryData.value.rent = user.rent
  if (user.utilities !== undefined) salaryData.value.utilities = user.utilities
  if (user.savingsRate !== undefined) salaryData.value.savingsRate = user.savingsRate
  if (user.peopleCount) salaryData.value.peopleCount = user.peopleCount
  // ... 其他字段
}
```

### 2. 调整加载顺序

```javascript
onMounted(() => {
  // 1. 先加载 stores
  questStore.loadFromStorage()
  userStore.loadFromStorage()
  
  // 2. 从 userStore 同步数据（优先级最高）
  syncDataFromUser()
  
  // 3. 如果 userStore 没有数据，再从 localStorage 加载
  if (!userStore.userInfo.currentSalary) {
    loadData()
  }
  
  // 4. 计算收入
  calculateEarnings()
})
```

### 3. 设置保存时同步

```javascript
const handleSettingsSave = (data) => {
  salaryData.value = { ...salaryData.value, ...data }
  
  // 同步到 userStore（确保数据一致性）
  syncDataFromUser()
  
  calculateEarnings()
}
```

## 数据流程

```
用户修改设置
    ↓
SettingsModal 保存到 userStore
    ↓
userStore 保存到 localStorage
    ↓
触发 handleSettingsSave
    ↓
syncDataFromUser() 同步到 salaryData
    ↓
calculateEarnings() 重新计算
    ↓
生活水平卡片更新显示
```

## 修改的文件

- `src/views/Home.vue`
  - 新增 `syncDataFromUser()` 函数
  - 修改 `onMounted()` 加载顺序
  - 修改 `handleSettingsSave()` 添加同步逻辑

## 测试验证

1. 打开设置面板，修改房租、水电网费
2. 保存设置
3. 查看首页生活水平卡片
4. 确认显示的数据与设置一致

## 注意事项

1. **数据优先级**：userStore > localStorage
2. **向后兼容**：如果 userStore 没有数据，仍然从 localStorage 加载
3. **实时同步**：设置保存后立即同步到所有使用的地方

## 未来优化

- [ ] 考虑完全移除 `salaryData`，直接使用 `userStore`
- [ ] 使用 Pinia 的 `$subscribe` 监听数据变化
- [ ] 统一所有组件的数据来源

---

**修复日期**: 2024-11-12
**影响范围**: 首页生活水平显示
