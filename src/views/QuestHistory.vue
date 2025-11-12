<template>
  <div class="quest-history">
    <div class="container">
      <h1 class="page-title">📜 任务历史</h1>
      <p class="page-subtitle">回顾你的职业成长历程</p>
      
      <div v-if="questStore.questHistory.length === 0" class="empty-state">
        <div class="empty-icon">📭</div>
        <h3>还没有历史记录</h3>
        <p>完成或放弃任务后，记录会显示在这里</p>
      </div>

      <div v-else class="history-list">
        <div 
          v-for="(history, index) in questStore.questHistory" 
          :key="index"
          class="history-item"
          :class="{ 'completed': history.completionType === 'completed' }"
        >
          <div class="history-icon">
            {{ history.completionType === 'completed' ? '✅' : '❌' }}
          </div>
          <div class="history-content">
            <h3>{{ history.quest.jobTitle }}</h3>
            <div class="history-meta">
              <span>{{ formatDate(history.endDate) }}</span>
              <span>等级: {{ history.quest.currentLevel }}</span>
              <span>经验: {{ history.quest.totalExp }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useQuestStore } from '../stores/quest'

const questStore = useQuestStore()

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}
</script>

<style scoped>
.quest-history {
  padding: 3rem 2rem;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  font-size: 3rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.page-subtitle {
  text-align: center;
  color: var(--text-secondary);
  margin-bottom: 3rem;
  font-size: 1.125rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.history-item {
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  background: var(--glass-bg);
  border-radius: var(--radius-2xl);
  border: 2px solid var(--glass-border);
}

.history-item.completed {
  border-color: rgba(16, 185, 129, 0.3);
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(52, 211, 153, 0.05));
}

.history-icon {
  font-size: 2rem;
}

.history-content h3 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.history-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

/* 响应式 */
@media (max-width: 768px) {
  .history-list {
    gap: 1rem;
  }
  
  .history-item {
    padding: 1rem;
  }
  
  .history-meta {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
