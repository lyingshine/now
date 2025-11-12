<template>
  <div class="jobs-grid-wrapper" :class="{ 'disabled': disabled }">
    <AutoPagination 
      :items="jobs"
      :columns="gridColumns"
      :rows="gridRows"
      :min-items-for-pagination="7"
      :autoplay="true"
      :autoplay-interval="5000"
      @page-change="handlePageChange"
      v-slot="{ item, index }"
    >
      <JobCard
        :job="item"
        :isAccepted="isJobAccepted(item.id)"
        :disabled="disabled"
        @click="!disabled && $emit('job-click', item)"
      />
    </AutoPagination>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import JobCard from './JobCard.vue'
import AutoPagination from '../common/AutoPagination.vue'

const props = defineProps({
  jobs: {
    type: Array,
    required: true
  },
  isJobAccepted: {
    type: Function,
    required: true
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

defineEmits(['job-click'])

// 响应式网格配置
const gridColumns = ref(3)
const gridRows = ref(2)

const updateGridLayout = () => {
  const width = window.innerWidth
  const height = window.innerHeight
  
  // 根据宽度调整列数
  if (width < 768) {
    gridColumns.value = 1
    gridRows.value = 4
  } else if (width < 1024) {
    gridColumns.value = 2
    gridRows.value = 3
  } else if (width < 1440) {
    gridColumns.value = 3
    gridRows.value = 2
  } else {
    gridColumns.value = 4
    gridRows.value = 2
  }
  
  // 根据高度调整行数
  if (height < 700) {
    gridRows.value = Math.max(1, Math.floor(gridRows.value * 0.7))
  } else if (height < 800) {
    gridRows.value = Math.max(1, gridRows.value - 1)
  } else if (height > 1000) {
    gridRows.value = gridRows.value + 1
  }
}

const handlePageChange = (page) => {
  console.log('切换到页面:', page + 1)
}

onMounted(() => {
  updateGridLayout()
  window.addEventListener('resize', updateGridLayout)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateGridLayout)
})
</script>

<style scoped>
.jobs-grid-wrapper {
  flex: 1;
  min-height: 0;
  overflow: visible;
  display: flex;
  flex-direction: column;
  padding: var(--space-2) 0;
}

.jobs-grid-wrapper.disabled {
  opacity: 0.5;
  pointer-events: none;
  filter: grayscale(0.5);
}
</style>
