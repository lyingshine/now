# 组件使用状态检查

## ✅ 已使用的组件

### Quest 相关组件
- ✅ `QuestProgressCard.vue` - 在 Growth.vue 中使用
- ✅ `QuestCompletionModal.vue` - 在 Growth.vue 中使用
- ✅ `AbandonQuestModal.vue` - 在 Growth.vue 中使用
- ✅ `RewardSetup.vue` - 在 JobModal.vue 中使用

### Game 相关组件
- ✅ `LevelDisplay.vue` - 在 Home.vue 和 QuestProgressCard.vue 中使用
- ✅ `ExpBar.vue` - 已存在，在多处使用
- ✅ `GoldCoin.vue` - 已存在，在多处使用
- ✅ `QuestReward.vue` - 在 JobModal.vue 中使用

### 其他组件
- ✅ `EmptyState.vue` - 在 Growth.vue 中使用

## ⚠️ 未使用但有用的组件

### 1. LevelUpModal.vue
**用途**: 升级动画弹窗
**建议**: 应该在 questStore 的 completeSubQuest 方法中触发

**集成位置**: 
- App.vue 或 Layout 组件中全局监听升级事件
- 或在 GrowthDetail.vue 中监听等级变化

### 2. ExpAdjustment.vue
**用途**: 经验值调整界面
**建议**: 可选功能，用于高级用户自定义经验值分配

**集成位置**:
- 可以在 RewardSetup.vue 中添加一个"高级设置"标签页
- 或在任务接取流程中作为可选步骤

## 📋 建议的改进

### 1. 集成 LevelUpModal

在 `src/App.vue` 或创建一个全局事件监听器：

```vue
<template>
  <div id="app">
    <Navbar />
    <router-view />
    
    <!-- 全局升级动画 -->
    <LevelUpModal 
      :isOpen="showLevelUp"
      :newLevel="levelUpData.newLevel"
      :expGained="levelUpData.expGained"
      :milestone="levelUpData.milestone"
      @close="showLevelUp = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuestStore } from './stores/quest'
import LevelUpModal from './components/game/LevelUpModal.vue'

const questStore = useQuestStore()
const showLevelUp = ref(false)
const levelUpData = ref({
  newLevel: 1,
  expGained: 0,
  milestone: null
})

// 监听升级事件
onMounted(() => {
  // 可以通过事件总线或 watch 监听等级变化
})
</script>
```

### 2. 可选：集成 ExpAdjustment

在 `RewardSetup.vue` 中添加高级设置选项：

```vue
<template>
  <div class="reward-setup">
    <!-- 现有内容 -->
    
    <!-- 高级设置（可选） -->
    <div class="advanced-settings">
      <button @click="showExpAdjustment = true">
        ⚙️ 高级：自定义经验值分配
      </button>
    </div>
    
    <!-- 经验值调整弹窗 -->
    <ExpAdjustment 
      v-if="showExpAdjustment"
      :subtasks="subtasks"
      @save="handleExpSave"
      @cancel="showExpAdjustment = false"
    />
  </div>
</template>
```

## 🎯 优先级建议

### 高优先级
1. ✅ 集成 LevelUpModal - 提升用户体验的关键功能

### 低优先级
2. ⏸️ ExpAdjustment - 高级功能，可以作为未来增强

## 📝 当前状态总结

- **核心功能组件**: 全部已集成 ✅
- **游戏化体验**: 基本完成，缺少升级动画 ⚠️
- **高级功能**: 已创建但未集成（可选）⏸️

## 🚀 快速修复建议

如果要快速集成升级动画，最简单的方法是：

1. 在 `GrowthDetail.vue` 中添加 LevelUpModal
2. 监听 questStore.currentLevel 的变化
3. 当等级提升时显示动画

```vue
<script setup>
import { watch } from 'vue'
import LevelUpModal from '../components/game/LevelUpModal.vue'

const showLevelUp = ref(false)
const levelUpData = ref({ newLevel: 1, expGained: 0, milestone: null })

// 监听等级变化
watch(() => questStore.currentLevel, (newLevel, oldLevel) => {
  if (newLevel > oldLevel) {
    levelUpData.value = {
      newLevel,
      expGained: 100, // 或从 questStore 获取
      milestone: getMilestone(newLevel)
    }
    showLevelUp.value = true
  }
})
</script>
```
