<template>
  <div class="exp-adjustment">
    <div class="adjustment-header">
      <h3>⚡ 经验值分配调整</h3>
      <p class="header-subtitle">自定义每个子任务的经验值奖励（总和必须等于 10000）</p>
    </div>

    <div class="exp-summary">
      <div class="summary-item">
        <span class="summary-label">总经验值</span>
        <span class="summary-value" :class="{ 'valid': isValid, 'invalid': !isValid }">
          {{ totalExp }} / 10000
        </span>
      </div>
      <div class="summary-item">
        <span class="summary-label">剩余经验值</span>
        <span class="summary-value" :class="{ 'positive': remainingExp > 0, 'negative': remainingExp < 0, 'zero': remainingExp === 0 }">
          {{ remainingExp > 0 ? '+' : '' }}{{ remainingExp }}
        </span>
      </div>
      <div class="summary-item">
        <span class="summary-label">状态</span>
        <span class="status-badge" :class="{ 'valid': isValid, 'invalid': !isValid }">
          {{ isValid ? '✓ 有效' : '✗ 无效' }}
        </span>
      </div>
    </div>

    <div class="subtasks-list">
      <div 
        v-for="(subtask, index) in localSubtasks" 
        :key="subtask.id"
        class="subtask-item"
      >
        <div class="subtask-header">
          <div class="subtask-info">
            <div class="subtask-title">
              <span class="subtask-number">{{ index + 1 }}.</span>
              {{ subtask.title }}
            </div>
            <div class="subtask-difficulty">
              <span class="difficulty-badge" :class="subtask.difficulty">
                {{ getDifficultyText(subtask.difficulty) }}
              </span>
              <span class="weight-text">权重: {{ subtask.weight.toFixed(1) }}</span>
            </div>
          </div>
          
          <div class="exp-input-group">
            <button 
              @click="adjustExp(index, -50)" 
              class="btn-adjust"
              :disabled="subtask.expReward <= 50"
            >
              -50
            </button>
            <button 
              @click="adjustExp(index, -10)" 
              class="btn-adjust"
              :disabled="subtask.expReward <= 10"
            >
              -10
            </button>
            <input 
              v-model.number="subtask.expReward"
              type="number"
              min="0"
              max="10000"
              class="exp-input"
              @input="handleExpChange"
            />
            <button 
              @click="adjustExp(index, 10)" 
              class="btn-adjust"
            >
              +10
            </button>
            <button 
              @click="adjustExp(index, 50)" 
              class="btn-adjust"
            >
              +50
            </button>
          </div>
        </div>
        
        <div class="exp-bar-container">
          <div 
            class="exp-bar-fill" 
            :style="{ width: `${(subtask.expReward / 10000) * 100}%` }"
          ></div>
        </div>
      </div>
    </div>

    <div class="adjustment-actions">
      <button @click="resetToDefault" class="btn-reset">
        重置为默认
      </button>
      <button 
        @click="autoBalance" 
        class="btn-balance"
        v-if="!isValid"
      >
        自动平衡
      </button>
      <button 
        @click="saveAdjustment" 
        class="btn-save"
        :disabled="!isValid"
      >
        保存调整
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { calculateExpDistribution, validateExpDistribution } from '../../utils/expCalculator'

const props = defineProps({
  subtasks: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['save', 'cancel'])

// 本地副本
const localSubtasks = ref(JSON.parse(JSON.stringify(props.subtasks)))

// 计算属性
const totalExp = computed(() => {
  return localSubtasks.value.reduce((sum, st) => sum + (st.expReward || 0), 0)
})

const remainingExp = computed(() => {
  return 10000 - totalExp.value
})

const isValid = computed(() => {
  return totalExp.value === 10000
})

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

const adjustExp = (index, amount) => {
  const newValue = localSubtasks.value[index].expReward + amount
  if (newValue >= 0) {
    localSubtasks.value[index].expReward = newValue
  }
}

const handleExpChange = () => {
  // 确保输入值为数字
  localSubtasks.value.forEach(st => {
    if (isNaN(st.expReward) || st.expReward < 0) {
      st.expReward = 0
    }
  })
}

const resetToDefault = () => {
  // 重新计算默认分配
  const resetTasks = calculateExpDistribution(
    localSubtasks.value.map(st => ({
      ...st,
      expReward: 0
    }))
  )
  localSubtasks.value = resetTasks
}

const autoBalance = () => {
  if (remainingExp.value === 0) return
  
  // 将剩余经验值平均分配到所有子任务
  const perTask = Math.floor(remainingExp.value / localSubtasks.value.length)
  const remainder = remainingExp.value % localSubtasks.value.length
  
  localSubtasks.value.forEach((st, index) => {
    st.expReward += perTask
    // 将余数分配给前几个任务
    if (index < remainder) {
      st.expReward += 1
    }
  })
}

const saveAdjustment = () => {
  if (!isValid.value) {
    alert('经验值总和必须等于 10000')
    return
  }
  
  emit('save', localSubtasks.value)
}

// 监听 props 变化
watch(() => props.subtasks, (newVal) => {
  localSubtasks.value = JSON.parse(JSON.stringify(newVal))
}, { deep: true })
</script>

<style scoped>
.exp-adjustment {
  background: var(--glass-bg);
  border-radius: var(--radius-2xl);
  padding: 2rem;
  border: 2px solid var(--glass-border);
}

body.dark-mode .exp-adjustment {
  background: rgba(30, 41, 59, 0.7);
  border-color: rgba(255, 255, 255, 0.1);
}

.adjustment-header {
  margin-bottom: 2rem;
  text-align: center;
}

.adjustment-header h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.header-subtitle {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.exp-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.summary-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.summary-value {
  font-size: 1.5rem;
  font-weight: 700;
}

.summary-value.valid {
  color: var(--growth-primary);
}

.summary-value.invalid {
  color: #ef4444;
}

.summary-value.positive {
  color: #f59e0b;
}

.summary-value.negative {
  color: #ef4444;
}

.summary-value.zero {
  color: var(--growth-primary);
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: var(--radius-full);
  font-size: 0.875rem;
  font-weight: 600;
}

.status-badge.valid {
  background: rgba(16, 185, 129, 0.1);
  color: var(--growth-primary);
}

.status-badge.invalid {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.subtasks-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.subtask-item {
  padding: 1.5rem;
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-color);
}

.subtask-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.subtask-info {
  flex: 1;
}

.subtask-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.subtask-number {
  color: var(--text-secondary);
  margin-right: 0.5rem;
}

.subtask-difficulty {
  display: flex;
  align-items: center;
  gap: 1rem;
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

.weight-text {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.exp-input-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-adjust {
  padding: 0.5rem 0.75rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-adjust:hover:not(:disabled) {
  background: var(--growth-primary);
  color: white;
  border-color: var(--growth-primary);
}

.btn-adjust:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.exp-input {
  width: 100px;
  padding: 0.5rem;
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  text-align: center;
  font-weight: 700;
  font-size: 1rem;
}

.exp-input:focus {
  outline: none;
  border-color: var(--growth-primary);
}

.exp-bar-container {
  height: 8px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: var(--radius-full);
  overflow: hidden;
}

body.dark-mode .exp-bar-container {
  background: rgba(0, 0, 0, 0.3);
}

.exp-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981 0%, #34d399 100%);
  border-radius: var(--radius-full);
  transition: width 0.3s ease;
}

.adjustment-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.btn-reset,
.btn-balance,
.btn-save {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--radius-xl);
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-reset {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-reset:hover {
  background: var(--bg-primary);
}

.btn-balance {
  background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
  color: #78350f;
}

.btn-balance:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

.btn-save {
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  color: white;
}

.btn-save:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.btn-save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
