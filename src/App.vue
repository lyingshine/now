<template>
  <div id="app" :class="{ 'dark': isDark }">
    <Navbar />
    <router-view />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Navbar from './components/Navbar.vue'

const isDark = ref(false)

onMounted(() => {
  const theme = localStorage.getItem('theme') || 'light'
  isDark.value = theme === 'dark'
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  }
})
</script>

<style>
#app {
  min-height: 100vh;
  background: var(--bg-primary);
  color: var(--text-primary);
  transition: background 0.3s, color 0.3s;
}
</style>
