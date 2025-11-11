<template>
  <div class="growth">
    <div class="container">
      <h1 class="page-title">🌱 成长中心</h1>
      <p class="page-subtitle">你的职业成长之旅</p>
      
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">⏱️</div>
          <div class="stat-value">0</div>
          <div class="stat-label">学习时长（小时）</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🔥</div>
          <div class="stat-value">0</div>
          <div class="stat-label">连续学习（天）</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">💻</div>
          <div class="stat-value">0</div>
          <div class="stat-label">完成项目（个）</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🏆</div>
          <div class="stat-value">0</div>
          <div class="stat-label">获得成就（个）</div>
        </div>
      </div>

      <div class="empty-state">
        <div class="empty-icon">📚</div>
        <h2>还没有接取任务</h2>
        <p>去任务大厅接取你的第一个任务，开始成长之旅吧！</p>
        <router-link to="/jobs" class="btn-primary">前往任务大厅</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
// 数据将从 Pinia store 加载
</script>

<style scoped>
.growth {
  padding: 2rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, var(--growth-primary) 0%, var(--growth-secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.page-subtitle {
  text-align: center;
  color: var(--text-secondary);
  margin-bottom: 3rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: var(--bg-secondary);
  padding: 2rem;
  border-radius: 1.5rem;
  text-align: center;
  border: 2px solid var(--border-color);
  transition: all 0.2s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--growth-primary);
}

.stat-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--growth-primary);
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: var(--bg-secondary);
  border-radius: 2rem;
  border: 2px dashed var(--border-color);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
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
  padding: 1rem 2rem;
  background: var(--growth-primary);
  color: white;
  text-decoration: none;
  border-radius: 1rem;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: #45a049;
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
