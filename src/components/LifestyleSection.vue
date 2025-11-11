<template>
  <div class="lifestyle-content">
    <div 
      v-for="category in categories" 
      :key="category.class" 
      :class="['lifestyle-category', category.class]"
    >
      <div class="lifestyle-category-title">{{ category.title }}</div>
      <div class="lifestyle-category-items">
        <div v-for="item in category.items" :key="item.title" class="lifestyle-item">
          <div class="lifestyle-icon">{{ item.icon }}</div>
          <div>
            <div class="lifestyle-title">{{ item.title }}</div>
            <div class="lifestyle-desc">{{ item.desc }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  categories: {
    type: Array,
    required: true
  }
})
</script>

<style scoped>
.lifestyle-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

/* 第1行：收入储蓄 */
.lifestyle-category.income {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(16, 185, 129, 0.05) 100%);
}

/* 第2行：基础开销 */
.lifestyle-category.basic {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(99, 102, 241, 0.05) 100%);
}

/* 第3行：日常消费（含饮食）和大件消费 */
.lifestyle-category.daily,
.lifestyle-category.optional {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(245, 158, 11, 0.05) 100%);
}

/* 第4行：整体满意度 */
.lifestyle-category.summary {
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.08) 0%, rgba(236, 72, 153, 0.05) 100%);
}

.lifestyle-category {
  backdrop-filter: blur(10px);
  border-radius: var(--radius-xl);
  padding: var(--space-5);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
  overflow: visible;
}

.lifestyle-category:hover {
  box-shadow: var(--shadow-md);
  transform: translateX(2px);
}

body.dark-mode .lifestyle-category {
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: var(--shadow-md);
}

body.dark-mode .lifestyle-category.income {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(16, 185, 129, 0.08) 100%);
}

body.dark-mode .lifestyle-category.basic {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(99, 102, 241, 0.08) 100%);
}

body.dark-mode .lifestyle-category.daily,
body.dark-mode .lifestyle-category.optional {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(245, 158, 11, 0.08) 100%);
}

body.dark-mode .lifestyle-category.summary {
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.12) 0%, rgba(236, 72, 153, 0.08) 100%);
}

.lifestyle-category-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-gray-900);
  margin-bottom: var(--space-3);
  padding-bottom: var(--space-2);
  padding-left: var(--space-2);
  border-bottom: 1px solid var(--color-gray-200);
  border-left: 3px solid;
}

.lifestyle-category.income .lifestyle-category-title {
  border-left-color: #10b981;
}

.lifestyle-category.basic .lifestyle-category-title {
  border-left-color: #6366f1;
}

.lifestyle-category.daily .lifestyle-category-title,
.lifestyle-category.optional .lifestyle-category-title {
  border-left-color: #f59e0b;
}

.lifestyle-category.summary .lifestyle-category-title {
  border-left-color: #ec4899;
}

body.dark-mode .lifestyle-category-title {
  color: var(--color-gray-100);
  border-bottom-color: var(--color-gray-700);
}

.lifestyle-category-items {
  display: grid;
  gap: var(--space-2);
}

/* 第1行：收入储蓄 - 1列 */
.lifestyle-category.income .lifestyle-category-items {
  grid-template-columns: 1fr;
}

/* 第2行：基础开销 - 4列 */
.lifestyle-category.basic .lifestyle-category-items {
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-3);
}

/* 第3行：日常消费（含饮食） + 大件消费 - 4列 */
.lifestyle-category.daily .lifestyle-category-items,
.lifestyle-category.optional .lifestyle-category-items {
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-3);
}

/* 第4行：整体评价 - 1列 */
.lifestyle-category.summary .lifestyle-category-items {
  grid-template-columns: 1fr;
}

.lifestyle-item {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(5px);
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: transform 0.15s ease, background 0.15s ease, box-shadow 0.15s ease;
  display: flex;
  gap: var(--space-3);
  position: relative;
  overflow: visible;
  min-height: 80px;
}

.lifestyle-item:hover {
  background: rgba(255, 255, 255, 0.9);
  transform: translateX(4px);
  box-shadow: var(--shadow-sm);
}

body.dark-mode .lifestyle-item {
  background: rgba(30, 41, 59, 0.6);
  border-color: rgba(255, 255, 255, 0.1);
}

body.dark-mode .lifestyle-item:hover {
  background: rgba(30, 41, 59, 0.9);
}

.lifestyle-icon {
  font-size: 1.5rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  flex-shrink: 0;
}

.lifestyle-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-gray-900);
  margin-bottom: 4px;
  line-height: 1.3;
  word-break: keep-all;
  white-space: nowrap;
}

.lifestyle-desc {
  font-size: 0.8125rem;
  color: var(--color-gray-600);
  line-height: 1.5;
  word-break: break-word;
}

body.dark-mode .lifestyle-title {
  color: var(--color-gray-100);
}

body.dark-mode .lifestyle-desc {
  color: var(--color-gray-400);
}
</style>
