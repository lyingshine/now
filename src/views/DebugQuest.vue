<template>
  <div class="debug-quest">
    <div class="container">
      <h1>🔍 任务系统调试</h1>
      
      <div class="debug-section">
        <h2>Store 状态</h2>
        <ul>
          <li>hasActiveQuest: {{ questStore.hasActiveQuest }}</li>
          <li>currentQuest 是否为 null: {{ questStore.currentQuest === null }}</li>
          <li>历史任务数量: {{ questStore.questHistory.length }}</li>
        </ul>
      </div>

      <div class="debug-section">
        <h2>LocalStorage 数据</h2>
        <div>
          <h3>questStore:</h3>
          <pre>{{ localStorageQuestStore }}</pre>
        </div>
        <div>
          <h3>jobsStore:</h3>
          <pre>{{ localStorageJobsStore }}</pre>
        </div>
      </div>

      <div class="debug-section">
        <h2>当前任务详情</h2>
        <pre>{{ JSON.stringify(questStore.currentQuest, null, 2) }}</pre>
      </div>

      <div class="debug-section">
        <h2>等级信息</h2>
        <ul>
          <li>当前等级: {{ questStore.currentLevel }}</li>
          <li>总经验值: {{ questStore.currentQuest?.totalExp || 0 }}</li>
          <li>当前等级经验: {{ currentLevelExp }}</li>
          <li>升级进度: {{ questStore.currentLevelProgress }}%</li>
        </ul>
      </div>

      <div class="debug-section">
        <h2>子任务列表</h2>
        <div v-if="questStore.currentQuest">
          <div v-for="(sq, index) in questStore.currentQuest.subQuests" :key="sq.id" class="subtask-debug">
            <h3>{{ index + 1 }}. {{ sq.title }}</h3>
            <ul>
              <li>状态: {{ sq.status }}</li>
              <li>进度: {{ sq.progress }}%</li>
              <li>经验值奖励: {{ sq.expReward }}</li>
              <li>已完成任务: {{ sq.tasks.filter(t => t.completed).length }}/{{ sq.tasks.length }}</li>
            </ul>
          </div>
        </div>
        <p v-else>没有活跃任务</p>
      </div>

      <div class="debug-section">
        <h2>测试操作</h2>
        <button @click="testAcceptQuest" class="btn-test" v-if="!questStore.currentQuest">
          接取测试任务
        </button>
        <button @click="testCompleteTask" class="btn-test" v-if="questStore.currentQuest">
          完成第一个学习任务
        </button>
        <button @click="testCompleteSubQuest" class="btn-test" v-if="questStore.currentQuest">
          完成第一个子任务
        </button>
        <button @click="clearData" class="btn-danger">
          清空所有数据
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useQuestStore } from '../stores/quest'
import { getCurrentLevelExp } from '../utils/expCalculator'

const questStore = useQuestStore()

const currentLevelExp = computed(() => {
  if (!questStore.currentQuest) return 0
  return getCurrentLevelExp(questStore.currentQuest.totalExp)
})

const localStorageQuestStore = computed(() => {
  const data = localStorage.getItem('questStore')
  return data ? JSON.parse(data) : null
})

const localStorageJobsStore = computed(() => {
  const data = localStorage.getItem('jobsStore')
  return data ? JSON.parse(data) : null
})

onMounted(() => {
  questStore.loadFromStorage()
  console.log('调试页面加载，questStore 状态:', {
    hasActiveQuest: questStore.hasActiveQuest,
    currentQuest: questStore.currentQuest,
    questHistory: questStore.questHistory
  })
})

const testAcceptQuest = () => {
  // 模拟接取第一个职位
  const jobsData = [
    {
      id: 1,
      title: '前端开发工程师',
      salary: 15000,
      requirements: [
        { skill: 'HTML/CSS', text: 'HTML/CSS' },
        { skill: 'JavaScript', text: 'JavaScript' },
        { skill: 'Vue.js', text: 'Vue.js' }
      ]
    }
  ]
  
  const job = jobsData[0]
  const success = questStore.acceptQuest(job.id, job)
  
  if (success) {
    alert('成功接取任务：' + job.title)
  } else {
    alert('接取任务失败')
  }
}

const testCompleteTask = () => {
  if (!questStore.currentQuest || questStore.currentQuest.subQuests.length === 0) {
    alert('请先接取一个任务')
    return
  }

  const firstSubQuest = questStore.currentQuest.subQuests[0]
  if (firstSubQuest.tasks.length === 0) {
    alert('该子任务没有学习任务')
    return
  }

  const firstTask = firstSubQuest.tasks[0]
  questStore.completeTask(firstSubQuest.id, firstTask.id)
  alert('已完成第一个学习任务')
}

const testCompleteSubQuest = () => {
  if (!questStore.currentQuest || questStore.currentQuest.subQuests.length === 0) {
    alert('请先接取一个任务')
    return
  }

  const firstSubQuest = questStore.currentQuest.subQuests[0]
  
  // 完成所有学习任务
  firstSubQuest.tasks.forEach(task => {
    if (!task.completed) {
      questStore.completeTask(firstSubQuest.id, task.id)
    }
  })
  
  alert('已完成第一个子任务的所有学习任务')
}

const clearData = () => {
  if (confirm('确定要清空所有数据吗？')) {
    localStorage.removeItem('questStore')
    localStorage.removeItem('jobsStore')
    location.reload()
  }
}
</script>

<style scoped>
.debug-quest {
  padding: 2rem;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  font-size: 2rem;
  margin-bottom: 2rem;
}

.debug-section {
  background: var(--glass-bg);
  padding: 1.5rem;
  border-radius: var(--radius-xl);
  margin-bottom: 1.5rem;
  border: 1px solid var(--glass-border);
}

.debug-section h2 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: var(--growth-primary);
}

pre {
  background: var(--bg-primary);
  padding: 1rem;
  border-radius: var(--radius-lg);
  overflow-x: auto;
  font-size: 0.875rem;
}

ul {
  list-style: none;
  padding: 0;
}

ul li {
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border-color);
}

.subtask-debug {
  background: var(--bg-primary);
  padding: 1rem;
  border-radius: var(--radius-lg);
  margin-bottom: 1rem;
}

.subtask-debug h3 {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.btn-test,
.btn-danger {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--radius-lg);
  font-weight: 600;
  cursor: pointer;
  margin-right: 1rem;
  margin-bottom: 0.5rem;
}

.btn-test {
  background: var(--growth-primary);
  color: white;
}

.btn-danger {
  background: #ef4444;
  color: white;
}
</style>
