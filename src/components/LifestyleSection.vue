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
  gap: var(--space-6);
}

/* 分类背景色 */
.lifestyle-category.income {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(16, 185, 129, 0.03) 100%);
}

.lifestyle-category.basic {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(99, 102, 241, 0.03) 100%);
}

.lifestyle-category.daily,
.lifestyle-category.optional {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(245, 158, 11, 0.03) 100%);
}

.lifestyle-category.summary {
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.08) 0%, rgba(236, 72, 153, 0.03) 100%);
}

.lifestyle-category {
  backdrop-filter: blur(var(--blur-md));
  -webkit-backdrop-filter: blur(var(--blur-md));
  border-radius: var(--radius-2xl);
  padding: var(--space-6);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-md);
  transition: all var(--duration-normal) var(--ease-smooth);
  position: relative;
  overflow: visible;
}

.lifestyle-category::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.5) 50%, transparent 100%);
  opacity: 0.5;
}

.lifestyle-category:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.dark .lifestyle-category,
body.dark-mode .lifestyle-category {
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: var(--shadow-lg);
}

.dark .lifestyle-category.income,
body.dark-mode .lifestyle-category.income {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.08) 100%);
}

.dark .lifestyle-category.basic,
body.dark-mode .lifestyle-category.basic {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0.08) 100%);
}

.dark .lifestyle-category.daily,
.dark .lifestyle-category.optional,
body.dark-mode .lifestyle-category.daily,
body.dark-mode .lifestyle-category.optional {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0.08) 100%);
}

.dark .lifestyle-category.summary,
body.dark-mode .lifestyle-category.summary {
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(236, 72, 153, 0.08) 100%);
}

.lifestyle-category-title {
  font-size: var(--text-base);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-3);
  padding-left: var(--space-3);
  border-bottom: 1px solid var(--border-default);
  border-left: 3px solid;
  letter-spacing: -0.01em;
}

.lifestyle-category.income .lifestyle-category-title {
  border-left-color: var(--color-success);
}

.lifestyle-category.basic .lifestyle-category-title {
  border-left-color: var(--color-primary);
}

.lifestyle-category.daily .lifestyle-category-title,
.lifestyle-category.optional .lifestyle-category-title {
  border-left-color: var(--color-warning);
}

.lifestyle-category.summary .lifestyle-category-title {
  border-left-color: #ec4899;
}

.dark .lifestyle-category-title,
body.dark-mode .lifestyle-category-title {
  color: var(--text-primary);
  border-bottom-color: var(--border-default);
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
  background: var(--glass-bg);
  backdrop-filter: blur(var(--blur-sm));
  -webkit-backdrop-filter: blur(var(--blur-sm));
  padding: var(--space-4);
  border-radius: var(--radius-xl);
  border: 1px solid var(--glass-border);
  transition: all var(--duration-fast) var(--ease-smooth);
  display: flex;
  gap: var(--space-3);
  position: relative;
  overflow: visible;
  min-height: 80px;
}

.lifestyle-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.1), transparent 70%);
  opacity: 0;
  transition: opacity var(--duration-fast);
  pointer-events: none;
}

.lifestyle-item:hover {
  background: var(--glass-bg-strong);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: rgba(255, 255, 255, 0.4);
}

.lifestyle-item:hover::before {
  opacity: 1;
}

.dark .lifestyle-item,
body.dark-mode .lifestyle-item {
  background: rgba(30, 41, 59, 0.6);
  border-color: rgba(255, 255, 255, 0.1);
}

.dark .lifestyle-item:hover,
body.dark-mode .lifestyle-item:hover {
  background: rgba(30, 41, 59, 0.9);
  border-color: rgba(255, 255, 255, 0.2);
}

.lifestyle-icon {
  font-size: var(--text-2xl);
  line-height: 1;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  flex-shrink: 0;
}

.lifestyle-title {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: var(--space-1);
  line-height: var(--leading-tight);
  word-break: keep-all;
  white-space: nowrap;
}

.lifestyle-desc {
  font-size: var(--text-xs);
  color: var(--text-secondary);
  line-height: var(--leading-relaxed);
  word-break: break-word;
}

.dark .lifestyle-title,
body.dark-mode .lifestyle-title {
  color: var(--text-primary);
}

.dark .lifestyle-desc,
body.dark-mode .lifestyle-desc {
  color: var(--text-secondary);
}
</style>
