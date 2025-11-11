<template>
  <nav class="navbar">
    <div class="navbar-content">
      <div class="navbar-logo">💰 NOW</div>
      <div class="navbar-menu">
        <router-link to="/" class="nav-btn" :class="{ active: $route.path === '/' }">
          <span>🏠</span>
          <span>首页</span>
        </router-link>
        <router-link to="/jobs" class="nav-btn" :class="{ active: $route.path === '/jobs' }">
          <span>💼</span>
          <span>任务大厅</span>
        </router-link>
        <router-link to="/growth" class="nav-btn" :class="{ active: $route.path.startsWith('/growth') }">
          <span>🌱</span>
          <span>成长中心</span>
        </router-link>
        <button class="nav-btn" @click="openSettings">
          <span>⚙️</span>
          <span>设置</span>
        </button>
        <button class="theme-toggle" @click="toggleTheme">
          <span>{{ isDark ? '🌙' : '☀️' }}</span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isDark = ref(false)

onMounted(() => {
  const theme = localStorage.getItem('theme') || 'light'
  isDark.value = theme === 'dark'
})

const toggleTheme = () => {
  isDark.value = !isDark.value
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  document.documentElement.classList.toggle('dark', isDark.value)
}

const openSettings = () => {
  window.dispatchEvent(new Event('openSettings'))
}
</script>

<style scoped>
.navbar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: var(--shadow-sm);
}

.dark .navbar {
  background: rgba(30, 41, 59, 0.95);
}

.navbar-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-logo {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-primary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 0.1em;
}

.navbar-menu {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  background: var(--bg-secondary);
  border-radius: 1.5rem;
  padding: 0.5rem;
}

.nav-btn {
  background: transparent;
  border: none;
  padding: 0.75rem 1.25rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  color: var(--text-secondary);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-btn:hover {
  background: var(--bg-primary);
  color: var(--text-primary);
}

.nav-btn.active {
  background: var(--bg-primary);
  color: var(--text-primary);
  box-shadow: var(--shadow-sm);
}

.theme-toggle {
  background: transparent;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  font-size: 1.125rem;
  cursor: pointer;
  transition: all 0.15s;
  margin-left: 0.5rem;
}

.theme-toggle:hover {
  background: var(--bg-primary);
}
</style>
