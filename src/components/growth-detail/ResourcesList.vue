<template>
  <div class="resources-section">
    <h5 class="resources-title">📖 推荐资源</h5>
    <div class="resources-list">
      <div v-for="(resource, idx) in resources" :key="idx" class="resource-item">
        <span class="resource-icon">{{ resource.type === 'doc' ? '📄' : '🎥' }}</span>
        <span class="resource-name">{{ resource.name }}</span>
        <span class="resource-rating">⭐ {{ resource.rating }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  resources: {
    type: Array,
    required: true
  }
})
</script>

<style scoped>
.resources-section {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.resources-title {
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.resources-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.resource-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.resource-icon {
  font-size: 1rem;
}

.resource-name {
  flex: 1;
}

.resource-rating {
  font-size: 0.75rem;
  color: var(--text-secondary);
}
</style>
