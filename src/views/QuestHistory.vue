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
  height: 100vh;
  padding: 80px var(--space-6) var(--space-6);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: var(--immersive-bg-primary);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  flex-shrink: 0;
}

.page-subtitle {
  text-align: center;
  color: var(--text-secondary);
  margin-bottom: var(--space-6);
  font-size: 1rem;
  flex-shrink: 0;
}

.empty-state {
  text-align: center;
  padding: var(--space-12) var(--space-8);
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.history-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding-right: var(--space-2);
  min-height: 0;
}

.history-item {
  display: flex;
  gap: var(--space-4);
  padding: var(--space-4);
  background: var(--glass-bg);
  border-radius: var(--radius-2xl);
  border: 2px solid var(--glass-border);
  flex-shrink: 0;
}

.history-item.completed {
  border-color: rgba(16, 185, 129, 0.3);
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(52, 211, 153, 0.05));
}

.history-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.history-content {
  flex: 1;
  min-width: 0;
}

.history-content h3 {
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: var(--space-2);
}

.history-meta {
  display: flex;
  gap: var(--space-3);
  font-size: 0.875rem;
  color: var(--text-secondary);
  flex-wrap: wrap;
}

/* 响应式 */
@media (max-width: 768px) {
  .quest-history {
    padding: 70px var(--space-4) var(--space-4);
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .history-list {
    gap: var(--space-2);
  }
  
  .history-item {
    padding: var(--space-3);
    gap: var(--space-3);
  }
  
  .history-meta {
    flex-direction: column;
    gap: var(--space-1);
  }
}

@media (max-height: 800px) {
  .quest-history {
    padding-top: 70px;
    padding-bottom: var(--space-4);
  }
  
  .page-title {
    font-size: 2rem;
    margin-bottom: var(--space-2);
  }
  
  .page-subtitle {
    margin-bottom: var(--space-4);
  }
}
</style>
