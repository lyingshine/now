<template>
  <div class="jobs">
    <div class="container">
      <h1 class="page-title">💼 任务大厅</h1>
      <p class="page-subtitle">选择你的职业目标，开启成长之旅</p>
      
      <div class="jobs-grid">
        <div v-for="job in jobs" :key="job.id" class="job-card">
          <div class="job-title">{{ job.title }}</div>
          <div class="job-salary">¥{{ job.salary.toLocaleString() }}/月</div>
          <div class="job-tags">
            <span v-for="tag in job.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
          <button class="btn-primary" @click="viewJob(job)">查看详情</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const jobs = ref([
  { id: 1, title: '前端工程师', salary: 18000, tags: ['互联网', '技术'] },
  { id: 2, title: 'Java 后端工程师', salary: 20000, tags: ['互联网', '技术'] },
  { id: 3, title: 'AI 产品经理', salary: 26000, tags: ['AI', '产品'] },
  // 更多职位数据将从 store 加载
])

const viewJob = (job) => {
  alert(`查看职位：${job.title}`)
}
</script>

<style scoped>
.jobs {
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
}

.page-subtitle {
  text-align: center;
  color: var(--text-secondary);
  margin-bottom: 3rem;
}

.jobs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.job-card {
  background: var(--bg-secondary);
  padding: 2rem;
  border-radius: 1.5rem;
  border: 2px solid var(--border-color);
  transition: all 0.2s;
}

.job-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.job-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.job-salary {
  font-size: 1.25rem;
  color: var(--growth-primary);
  font-weight: 700;
  margin-bottom: 1rem;
}

.job-tags {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.tag {
  padding: 0.25rem 0.75rem;
  background: var(--bg-primary);
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.btn-primary {
  width: 100%;
  padding: 0.75rem;
  background: var(--growth-primary);
  color: white;
  border: none;
  border-radius: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: #45a049;
  transform: translateY(-2px);
}
</style>
