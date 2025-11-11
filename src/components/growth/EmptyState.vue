<template>
  <div class="empty-state">
    <div class="empty-icon">📚</div>
    <h2>还没有接取任务</h2>
    <p>去任务大厅接取你的第一个任务，开始成长之旅吧！</p>
    <router-link to="/jobs" class="btn-primary">前往任务大厅</router-link>
  </div>
</template>

<style scoped>
.empty-state {
  text-align: center;
  padding: 5rem 3rem;
  background: var(--glass-bg);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-radius: var(--radius-3xl);
  border: 2px dashed var(--border-color);
  box-shadow: var(--shadow-xl);
  position: relative;
  overflow: hidden;
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 1.5rem;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

body.dark-mode .empty-state {
  background: rgba(30, 41, 59, 0.7);
  border-color: rgba(255, 255, 255, 0.2);
}

.empty-state h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.empty-state p {
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

.btn-primary {
  display: inline-block;
  padding: 1.25rem 2.5rem;
  background: linear-gradient(135deg, var(--growth-primary) 0%, var(--growth-secondary) 100%);
  color: white;
  text-decoration: none;
  border-radius: var(--radius-xl);
  font-weight: 700;
  font-size: 1.125rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: var(--shadow-lg);
  position: relative;
  overflow: hidden;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-xl);
}
</style>
