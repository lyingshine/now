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
  background: var(--glass-bg);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid var(--glass-border);
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
  transition: all var(--transition-base);
}

.dark .navbar {
  background: rgba(15, 23, 42, 0.8);
  border-bottom-color: rgba(255, 255, 255, 0.05);
}

.navbar-content {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0.75rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-logo {
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-primary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all var(--transition-base);
}

.navbar-logo:hover {
  transform: scale(1.03);
}

.navbar-menu {
  display: flex;
  gap: 0.375rem;
  align-items: center;
  background: var(--bg-secondary);
  border-radius: var(--radius-full);
  padding: 0.375rem;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
}

.dark .navbar-menu {
  background: var(--bg-secondary);
  border-color: var(--border-color);
}

.nav-btn {
  background: transparent;
  border: none;
  padding: 0.625rem 1rem;
  border-radius: var(--radius-full);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
  color: var(--text-secondary);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;
}

.nav-btn:hover {
  background: var(--bg-primary);
  color: var(--text-primary);
}

.nav-btn.active {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
  color: white;
  box-shadow: var(--shadow-md);
}

.nav-btn.active:hover {
  box-shadow: var(--shadow-lg), var(--shadow-glow);
}

.theme-toggle {
  background: transparent;
  border: none;
  padding: 0.625rem 0.875rem;
  border-radius: var(--radius-full);
  font-size: 1.125rem;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.3s ease;
  margin-left: 0.375rem;
  position: relative;
}

.theme-toggle:hover {
  background: var(--bg-primary);
  transform: rotate(180deg);
}

.theme-toggle:active {
  transform: rotate(180deg) scale(0.9);
}

@media (max-width: 768px) {
  .navbar-content {
    padding: 0.75rem 1rem;
  }
  
  .navbar-logo {
    font-size: 1.25rem;
  }
  
  .nav-btn span:last-child {
    display: none;
  }
  
  .nav-btn {
    padding: 0.75rem;
  }
}
</style>
