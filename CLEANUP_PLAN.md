# 组件清理计划

## 🗑️ 需要删除的旧组件

### Growth 相关（已被 Quest 系统替代）
- ❌ `src/components/growth/TasksList.vue` - 被 QuestProgressCard 替代
- ❌ `src/components/growth/TaskCard.vue` - 被 QuestProgressCard 替代
- ❌ `src/components/growth/StatsGrid.vue` - 不再使用

### 保留的组件
- ✅ `src/components/growth/EmptyState.vue` - 仍在使用（Growth.vue）

## ✅ 所有新组件使用状态

### Quest 组件（全部已使用）
1. ✅ `QuestProgressCard.vue` - Growth.vue
2. ✅ `QuestCompletionModal.vue` - Growth.vue
3. ✅ `AbandonQuestModal.vue` - Growth.vue
4. ✅ `RewardSetup.vue` - JobModal.vue
5. ⏸️ `ExpAdjustment.vue` - 高级功能（可选，保留）

### Game 组件（全部已使用）
1. ✅ `LevelDisplay.vue` - Home.vue, QuestProgressCard.vue
2. ✅ `LevelUpModal.vue` - GrowthDetail.vue
3. ✅ `ExpBar.vue` - 多处使用
4. ✅ `GoldCoin.vue` - 多处使用
5. ✅ `QuestReward.vue` - JobModal.vue
6. ✅ `QuestBadge.vue` - 多处使用
7. ✅ `AchievementBadge.vue` - 多处使用

## 📋 清理操作

### 第一步：删除不再使用的组件
```bash
# 删除旧的 growth 组件
rm src/components/growth/TasksList.vue
rm src/components/growth/TaskCard.vue
rm src/components/growth/StatsGrid.vue
```

### 第二步：验证没有引用
确保没有其他文件引用这些组件

### 第三步：提交更改
```bash
git add .
git commit -m "🧹 清理旧组件 - 删除被 Quest 系统替代的组件"
git push
```

## 🎯 清理后的组件结构

```
src/components/
├── game/                    # 游戏化组件（全部使用中）
│   ├── LevelDisplay.vue
│   ├── LevelUpModal.vue
│   ├── ExpBar.vue
│   ├── GoldCoin.vue
│   ├── QuestReward.vue
│   ├── QuestBadge.vue
│   └── AchievementBadge.vue
├── quest/                   # 任务系统组件（全部使用中）
│   ├── QuestProgressCard.vue
│   ├── QuestCompletionModal.vue
│   ├── AbandonQuestModal.vue
│   ├── RewardSetup.vue
│   └── ExpAdjustment.vue    # 高级功能（保留）
├── growth/                  # 成长相关（仅保留必要的）
│   └── EmptyState.vue       # 仍在使用
├── growth-detail/           # 任务详情（全部使用中）
│   ├── ProgressHeader.vue
│   ├── PlanInfoCards.vue
│   ├── SkillCard.vue
│   ├── StepCard.vue
│   ├── TaskItem.vue
│   └── ResourcesList.vue
├── jobs/                    # 职位相关（全部使用中）
│   ├── JobCard.vue
│   └── JobsGrid.vue
└── [其他通用组件]
```

## ✨ 清理收益

1. **减少代码冗余** - 删除重复功能的组件
2. **提高可维护性** - 更清晰的组件结构
3. **避免混淆** - 只保留实际使用的组件
4. **减小包体积** - 移除未使用的代码
