<template>
  <div class="lifestyle-comparison">
    <div class="comparison-title">💰 接取后的生活变化</div>
    <div class="comparison-subtitle">看看你的生活将如何改变</div>
    
    <div class="comparison-grid">
      <!-- 当前生活 -->
      <div class="comparison-card current">
        <div class="comparison-card-header">
          <span class="comparison-icon">{{ currentLifestyle.satisfaction.emoji }}</span>
          <span class="comparison-label">当前生活</span>
        </div>
        <div class="comparison-salary">¥{{ currentSalary.toLocaleString() }}</div>
        <div class="comparison-items">
          <div v-for="(item, index) in currentLifestyleItems" :key="index" class="comparison-item">
            <span class="comparison-item-icon">{{ item.icon }}</span>
            <span>{{ item.desc }}</span>
          </div>
        </div>
      </div>
      
      <!-- 箭头 -->
      <div class="comparison-arrow">
        <div class="arrow-icon">→</div>
        <div class="arrow-text">升级</div>
      </div>
      
      <!-- 接取后生活 -->
      <div class="comparison-card future">
        <div class="comparison-card-header">
          <span class="comparison-icon">{{ futureLifestyle.satisfaction.emoji }}</span>
          <span class="comparison-label">接取后</span>
        </div>
        <div class="comparison-salary">¥{{ futureSalary.toLocaleString() }}</div>
        <div class="comparison-items">
          <div v-for="(item, index) in futureLifestyleItems" :key="index" class="comparison-item">
            <span class="comparison-item-icon">{{ item.icon }}</span>
            <span>{{ item.desc }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 亮点对比 -->
    <div class="comparison-highlights">
      <div class="highlight-title">✨ 主要改善</div>
      <div class="highlight-items">
        <div v-for="(highlight, index) in highlights" :key="index" class="highlight-item">
          <span class="highlight-icon">{{ highlight.icon }}</span>
          <span>{{ highlight.text }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useLifestyle } from '../composables/useLifestyle'

const props = defineProps({
  currentSalary: {
    type: Number,
    required: true
  },
  futureSalary: {
    type: Number,
    required: true
  }
})

const { calculateLifestyle } = useLifestyle()

// 计算当前和未来的生活水平
const currentLifestyle = computed(() => {
  return calculateLifestyle(props.currentSalary)
})

const futureLifestyle = computed(() => {
  return calculateLifestyle(props.futureSalary)
})

// 提取关键生活项目
const currentLifestyleItems = computed(() => {
  const items = currentLifestyle.value
  return [
    { icon: '🏠', desc: items.find(i => i.title.includes('住房'))?.desc.split('，')[1] || '住房' },
    { icon: '🍚', desc: items.find(i => i.title.includes('三餐'))?.desc.split('，')[0] || '饮食' },
    { icon: '👕', desc: items.find(i => i.title.includes('服装'))?.desc || '服装' }
  ]
})

const futureLifestyleItems = computed(() => {
  const items = futureLifestyle.value
  return [
    { icon: '🏠', desc: items.find(i => i.title.includes('住房'))?.desc.split('，')[1] || '住房' },
    { icon: '🍚', desc: items.find(i => i.title.includes('三餐'))?.desc.split('，')[0] || '饮食' },
    { icon: '👕', desc: items.find(i => i.title.includes('服装'))?.desc || '服装' }
  ]
})

// 计算亮点改善
const highlights = computed(() => {
  const diff = props.futureSalary - props.currentSalary
  const percentIncrease = ((diff / props.currentSalary) * 100).toFixed(0)
  
  const items = [
    { icon: '💰', text: `月薪增加 ¥${diff.toLocaleString()}（+${percentIncrease}%）` },
    { icon: '📈', text: `年收入增加 ¥${(diff * 12).toLocaleString()}` }
  ]
  
  // 根据薪资增幅添加更多亮点
  if (diff >= 5000) {
    items.push({ icon: '🏠', text: '可以租更好的房子' })
  }
  if (diff >= 10000) {
    items.push({ icon: '✈️', text: '每年可以出国旅游' })
  }
  if (props.futureSalary >= 20000) {
    items.push({ icon: '🚗', text: '有能力考虑买车' })
  }
  
  return items
})
</script>

<style scoped>
.lifestyle-comparison {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.08) 0%, rgba(33, 150, 243, 0.08) 100%);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 24px;
  border: 2px solid rgba(76, 175, 80, 0.2);
}

.comparison-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--growth-primary);
  text-align: center;
  margin-bottom: 6px;
}

.comparison-subtitle {
  font-size: 14px;
  color: var(--color-gray-600);
  text-align: center;
  margin-bottom: 20px;
}

body.dark-mode .comparison-subtitle {
  color: var(--color-gray-400);
}

.comparison-grid {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 16px;
  margin-bottom: 20px;
}

.comparison-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  transition: all 0.3s;
}

body.dark-mode .comparison-card {
  background: var(--color-gray-700);
}

.comparison-card.current {
  border: 2px solid var(--color-gray-300);
}

.comparison-card.future {
  border: 2px solid var(--growth-primary);
  background: linear-gradient(135deg, #ffffff 0%, #f1f8f4 100%);
}

body.dark-mode .comparison-card.future {
  background: linear-gradient(135deg, var(--color-gray-700) 0%, rgba(76, 175, 80, 0.1) 100%);
}

.comparison-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.12);
}

.comparison-card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.comparison-icon {
  font-size: 24px;
}

.comparison-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-gray-600);
}

body.dark-mode .comparison-label {
  color: var(--color-gray-400);
}

.comparison-salary {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-gray-900);
  margin-bottom: 16px;
}

body.dark-mode .comparison-salary {
  color: var(--color-gray-100);
}

.comparison-card.future .comparison-salary {
  background: linear-gradient(135deg, var(--growth-primary) 0%, var(--growth-secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.comparison-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.comparison-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--color-gray-700);
  padding: 6px 10px;
  background: var(--color-gray-50);
  border-radius: 8px;
}

body.dark-mode .comparison-item {
  color: var(--color-gray-300);
  background: var(--color-gray-600);
}

.comparison-item-icon {
  font-size: 16px;
}

.comparison-arrow {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.arrow-icon {
  font-size: 32px;
  color: var(--growth-primary);
  font-weight: bold;
}

.arrow-text {
  font-size: 12px;
  color: var(--growth-primary);
  font-weight: 600;
}

.comparison-highlights {
  background: white;
  border-radius: 12px;
  padding: 16px;
  border-left: 4px solid var(--growth-primary);
}

body.dark-mode .comparison-highlights {
  background: var(--color-gray-700);
}

.highlight-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--growth-primary);
  margin-bottom: 12px;
}

.highlight-items {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
}

.highlight-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--color-gray-700);
  padding: 8px 12px;
  background: rgba(76, 175, 80, 0.08);
  border-radius: 8px;
}

body.dark-mode .highlight-item {
  color: var(--color-gray-300);
  background: rgba(76, 175, 80, 0.15);
}

.highlight-icon {
  font-size: 18px;
}

@media (max-width: 768px) {
  .comparison-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .comparison-arrow {
    transform: rotate(90deg);
  }

  .comparison-card {
    padding: 16px;
  }

  .comparison-salary {
    font-size: 24px;
  }

  .highlight-items {
    grid-template-columns: 1fr;
  }
}
</style>
