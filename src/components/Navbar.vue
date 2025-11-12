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
        <router-link to="/career" class="nav-btn" :class="{ active: $route.path === '/career' }">
          <span>🗺️</span>
          <span>冒险生涯</span>
        </router-link>
        <router-link to="/settings" class="nav-btn" :class="{ active: $route.path === '/settings' }">
          <span>⚙️</span>
          <span>设置</span>
        </router-link>
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
</script>

<style scoped>
.navbar {
  background: transparent;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-fixed);
  transition: all var(--duration-normal) var(--ease-out-expo);
}

.navbar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--bg-primary);
  opacity: 0;
  transition: opacity var(--duration-normal) ease;
  backdrop-filter: blur(var(--blur-xl)) saturate(180%);
  -webkit-backdrop-filter: blur(var(--blur-xl)) saturate(180%);
  border-bottom: 1px solid transparent;
}

.navbar:hover::before {
  opacity: 0.98;
  border-bottom-color: var(--border-subtle);
  box-shadow: var(--shadow-md);
}

.navbar-content {
  max-width: var(--container-2xl);
  margin: 0 auto;
  padding: var(--space-4) var(--space-12);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-12);
  position: relative;
  z-index: 1;
}

.navbar-logo {
  font-size: var(--text-3xl);
  font-weight: var(--font-black);
  background: linear-gradient(135deg, var(--rank-color, var(--color-primary)) 0%, var(--color-warning) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-out-back);
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  position: relative;
  user-select: none;
}

.navbar-logo::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--rank-color, var(--color-primary));
  transform: scaleX(0);
  transition: transform var(--duration-normal) var(--ease-out-expo);
  border-radius: var(--radius-full);
}

.navbar-logo:hover {
  transform: scale(1.05) translateY(-2px);
  filter: drop-shadow(0 4px 8px rgba(102, 126, 234, 0.4));
}

.navbar-logo:hover::after {
  transform: scaleX(1);
}

.navbar-menu {
  display: flex;
  gap: var(--space-2);
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(var(--blur-md));
  -webkit-backdrop-filter: blur(var(--blur-md));
  border-radius: var(--radius-full);
  padding: var(--space-2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: var(--shadow-md);
}

.nav-btn {
  background: transparent;
  border: none;
  padding: var(--space-3) var(--space-5);
  border-radius: var(--radius-2xl);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  cursor: pointer;
  transition: all 0.2s ease;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;
  min-width: 100px;
  flex-shrink: 0;
}

.nav-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  transform: translate(-50%, -50%);
  transition: width 0.4s ease, height 0.4s ease;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 1);
  transform: translateY(-2px);
}

.nav-btn:hover::before {
  width: 200px;
  height: 200px;
}

.nav-btn.active {
  background: var(--rank-color, linear-gradient(135deg, #667eea 0%, #764ba2 100%));
  color: white;
  box-shadow: 0 4px 12px color-mix(in srgb, var(--rank-color, #667eea) 40%, transparent);
}

.nav-btn.active:hover {
  box-shadow: 0 6px 16px color-mix(in srgb, var(--rank-color, #667eea) 50%, transparent);
  transform: translateY(-2px);
}

.theme-toggle {
  background: transparent;
  border: none;
  padding: 0.75rem 1.25rem;
  border-radius: 1.5rem;
  font-size: 1.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 60px;
  flex-shrink: 0;
}

.theme-toggle:hover {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 1);
  transform: rotate(180deg) scale(1.1);
}

.theme-toggle:active {
  transform: rotate(180deg) scale(0.95);
}

@media (max-width: 768px) {
  .navbar-content {
    padding: 0.75rem 1rem;
  }
  
  .navbar-logo {
    font-size: 1.5rem;
  }
  
  .navbar-menu {
    gap: 0.25rem;
    padding: 0.375rem;
  }
  
  .nav-btn span:last-child {
    display: none;
  }
  
  .nav-btn {
    padding: 0.75rem;
    font-size: 1.25rem;
  }
  
  .theme-toggle {
    padding: 0.625rem;
    font-size: 1.125rem;
  }
}
</style>
