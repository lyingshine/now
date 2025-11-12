<template>
  <div class="reward-setup">
    <div class="setup-header">
      <h3>🎁 自定义奖励设置</h3>
      <p class="header-subtitle">为你的职业目标设置激励奖励</p>
    </div>

    <!-- 全局奖励设置 -->
    <div class="global-rewards">
      <h4>🌟 终极奖励</h4>
      
      <div class="reward-item">
        <label class="reward-label">
          <span class="label-icon">🏆</span>
          <span>完成任务后的奖励</span>
        </label>
        <textarea 
          v-model="localRewards.ultimateReward"
          class="reward-textarea"
          placeholder="描述你完成任务后想要的奖励，例如：升职加薪、买一台新电脑、去旅行..."
          rows="3"
        ></textarea>
      </div>
    </div>

    <!-- 子任务奖励设置 -->
    <div class="subtask-rewards">
      <h4>⚔️ 子任务奖励</h4>
      <p class="section-subtitle">为每个子任务设置自定义奖励</p>

      <div class="subtask-list">
        <div 
          v-for="(subtask, index) in localSubtasks" 
          :key="subtask.id"
          class="subtask-reward-item"
        >
          <div class="subtask-header">
            <div class="subtask-title">
              <span class="subtask-number">{{ index + 1 }}.</span>
              {{ subtask.title }}
            </div>
            <div class="subtask-meta">
              <span class="difficulty-badge" :class="subtask.difficulty">
                {{ getDifficultyText(subtask.difficulty) }}
              </span>
              <span class="exp-badge">{{ subtask.expReward }} EXP</span>
            </div>
          </div>

          <div class="reward-inputs">
            <div class="input-group full-width">
              <label>🎁 自定义奖励</label>
              <input 
                v-model="subtask.customReward"
                type="text"
                placeholder="例如：给自己买杯咖啡、看一场电影、休息一天..."
                class="small-input"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 奖励建议 -->
    <div class="reward-suggestions">
      <h4>💡 奖励建议</h4>
      <div class="suggestions-grid">
        <div 
          v-for="suggestion in rewardSuggestions" 
          :key="suggestion.title"
          class="suggestion-card"
          @click="applySuggestion(suggestion)"
        >
          <div class="suggestion-icon">{{ suggestion.icon }}</div>
          <div class="suggestion-title">{{ suggestion.title }}</div>
          <div class="suggestion-desc">{{ suggestion.description }}</div>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="setup-actions">
      <button @click="useDefaults" class="btn-default">
        使用默认奖励
      </button>
      <button @click="saveRewards" class="btn-save">
        保存奖励设置
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  subtasks: {
    type: Array,
    required: true
  },
  jobSalary: {
    type: Number,
    required: true
  },
  initialRewards: {
    type: Object,
    default: () => ({
      ultimateReward: '',
      milestoneRewards: []
    })
  }
})

const emit = defineEmits(['save', 'cancel'])

// 本地数据
const localRewards = ref({
  ultimateReward: props.initialRewards.ultimateReward || `恭喜你胜任该职位！`,
  milestoneRewards: props.initialRewards.milestoneRewards || []
})

const localSubtasks = ref(JSON.parse(JSON.stringify(props.subtasks)))

// 奖励建议
const rewardSuggestions = [
  {
    icon: '☕',
    title: '小确幸',
    description: '咖啡、奶茶、小零食',
    rewards: ['给自己买杯咖啡', '吃一顿好吃的', '买个小礼物']
  },
  {
    icon: '🎬',
    title: '娱乐放松',
    description: '电影、游戏、音乐会',
    rewards: ['看一场电影', '玩一个新游戏', '听一场音乐会']
  },
  {
    icon: '🏃',
    title: '健康运动',
    description: '健身、运动、户外',
    rewards: ['去健身房锻炼', '户外徒步', '游泳放松']
  },
  {
    icon: '📚',
    title: '学习成长',
    description: '书籍、课程、工具',
    rewards: ['买一本想读的书', '报名一门课程', '购买学习工具']
  },
  {
    icon: '✈️',
    title: '旅行探索',
    description: '短途旅行、周末游',
    rewards: ['周末短途旅行', '探索新地方', '尝试新餐厅']
  },
  {
    icon: '🎁',
    title: '购物奖励',
    description: '衣服、电子产品',
    rewards: ['买件新衣服', '升级电子设备', '购买心仪物品']
  }
]

// 方法
const getDifficultyText = (difficulty) => {
  const map = {
    'basic': '基础',
    'intermediate': '进阶',
    'advanced': '高级',
    'expert': '专家'
  }
  return map[difficulty] || difficulty
}

const applySuggestion = (suggestion) => {
  // 将建议应用到子任务
  suggestion.rewards.forEach((reward, index) => {
    if (index < localSubtasks.value.length) {
      localSubtasks.value[index].customReward = reward
    }
  })
}

const useDefaults = () => {
  localRewards.value = {
    ultimateReward: `恭喜你胜任该职位！`,
    milestoneRewards: []
  }
  
  localSubtasks.value.forEach(st => {
    st.customReward = null
  })
}

const saveRewards = () => {
  emit('save', {
    globalRewards: localRewards.value,
    subtasks: localSubtasks.value
  })
}
</script>

<style scoped>
.reward-setup {
  background: var(--glass-bg);
  border-radius: var(--radius-2xl);
  padding: 2rem;
  border: 2px solid var(--glass-border);
  max-height: 80vh;
  overflow-y: auto;
}

body.dark-mode .reward-setup {
  background: rgba(30, 41, 59, 0.7);
  border-color: rgba(255, 255, 255, 0.1);
}

.setup-header {
  margin-bottom: 2rem;
  text-align: center;
}

.setup-header h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.header-subtitle {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.global-rewards,
.subtask-rewards,
.reward-suggestions {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
}

.global-rewards h4,
.subtask-rewards h4,
.reward-suggestions h4 {
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.section-subtitle {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.reward-item {
  margin-bottom: 1.5rem;
}

.reward-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.label-icon {
  font-size: 1.25rem;
}

.reward-input,
.reward-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--border-color);
  border-radius: var(--radius-lg);
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.reward-input:focus,
.reward-textarea:focus {
  outline: none;
  border-color: var(--growth-primary);
}

.reward-textarea {
  resize: vertical;
  font-family: inherit;
}

.reward-hint {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.subtask-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.subtask-reward-item {
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
}

.subtask-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.subtask-title {
  font-weight: 600;
}

.subtask-number {
  color: var(--text-secondary);
  margin-right: 0.5rem;
}

.subtask-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.difficulty-badge {
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-md);
  font-size: 0.75rem;
  font-weight: 600;
}

.difficulty-badge.basic {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.difficulty-badge.intermediate {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.difficulty-badge.advanced {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.difficulty-badge.expert {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.exp-badge {
  padding: 0.25rem 0.75rem;
  background: rgba(16, 185, 129, 0.1);
  color: var(--growth-primary);
  border-radius: var(--radius-md);
  font-size: 0.75rem;
  font-weight: 600;
}

.reward-inputs {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group.full-width {
  width: 100%;
}

.input-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.small-input {
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
}

.small-input:focus {
  outline: none;
  border-color: var(--growth-primary);
}

.suggestions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.suggestion-card {
  padding: 1rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.suggestion-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--growth-primary);
}

.suggestion-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.suggestion-title {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.suggestion-desc {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.setup-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-default,
.btn-save {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--radius-xl);
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-default {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-default:hover {
  background: var(--bg-primary);
}

.btn-save {
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  color: white;
}

.btn-save:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}
</style>
