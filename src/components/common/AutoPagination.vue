<template>
  <div class="paginated-content">
    <div class="page-container">
      <!-- 当前页内容 -->
      <div 
        class="page-items" 
        :class="contentClass"
        :style="gridStyle"
      >
        <template v-for="(item, index) in displayItems" :key="getItemKey(item, index)">
          <slot 
            :item="item"
            :index="getItemIndex(index)"
          ></slot>
        </template>
      </div>

      <!-- 分页导航 -->
      <div v-if="showPagination" class="pagination-nav">
        <button 
          class="pagination-btn"
          @click="prevPage(); restartAutoplay()"
          :disabled="currentPage === 0"
          aria-label="上一页"
        >
          ←
        </button>
        <span class="pagination-info">
          {{ currentPage + 1 }} / {{ totalPages }}
        </span>
        <button 
          class="pagination-btn"
          @click="nextPage(); restartAutoplay()"
          :disabled="!autoplay && currentPage === totalPages - 1"
          aria-label="下一页"
        >
          →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  columns: {
    type: Number,
    default: 3
  },
  rows: {
    type: Number,
    default: 2
  },
  gap: {
    type: String,
    default: 'var(--space-4)'
  },
  autoDetect: {
    type: Boolean,
    default: true
  },
  minItemsForPagination: {
    type: Number,
    default: 6
  },
  autoplay: {
    type: Boolean,
    default: false
  },
  autoplayInterval: {
    type: Number,
    default: 5000
  }
})

const emit = defineEmits(['page-change'])

const currentPage = ref(0)
let autoplayTimer = null

// 计算每页显示的项目数
const itemsPerPage = computed(() => props.columns * props.rows)

// 计算总页数
const totalPages = computed(() => {
  if (props.items.length <= props.minItemsForPagination) {
    return 1 // 元素少时不分页
  }
  return Math.ceil(props.items.length / itemsPerPage.value)
})

// 是否显示分页
const showPagination = computed(() => totalPages.value > 1)

// 当前页的起始和结束索引
const startIndex = computed(() => {
  if (!showPagination.value) return 0
  return currentPage.value * itemsPerPage.value
})

const endIndex = computed(() => {
  if (!showPagination.value) return props.items.length
  return Math.min(startIndex.value + itemsPerPage.value, props.items.length)
})

// 显示的项目
const displayItems = computed(() => {
  if (!showPagination.value) {
    return props.items // 不分页时显示所有项目
  }
  return props.items.slice(startIndex.value, endIndex.value)
})

// 内容类名（根据项目数量调整）
const contentClass = computed(() => {
  const itemCount = displayItems.value.length
  if (!showPagination.value && itemCount <= 3) {
    return 'few-items'
  }
  if (!showPagination.value && itemCount <= 6) {
    return 'some-items'
  }
  return ''
})

// 网格样式
const gridStyle = computed(() => {
  const itemCount = displayItems.value.length
  let cols = props.columns
  let gap = props.gap
  
  // 元素少时调整列数和间距
  if (!showPagination.value) {
    if (itemCount <= 3) {
      cols = itemCount
      gap = 'var(--space-6)'
    } else if (itemCount <= 6) {
      cols = Math.min(3, itemCount)
      gap = 'var(--space-5)'
    }
  }
  
  return {
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gap: gap
  }
})

// 获取项目的key
const getItemKey = (item, index) => {
  return item.id || index
}

// 获取项目的实际索引
const getItemIndex = (index) => {
  return startIndex.value + index
}

const nextPage = () => {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++
    emit('page-change', currentPage.value)
  } else if (props.autoplay) {
    // 自动轮播模式下，到最后一页后回到第一页
    currentPage.value = 0
    emit('page-change', currentPage.value)
  }
}

const prevPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--
    emit('page-change', currentPage.value)
  }
}

const goToPage = (page) => {
  if (page >= 0 && page < totalPages.value) {
    currentPage.value = page
    emit('page-change', currentPage.value)
  }
}

// 启动自动轮播
const startAutoplay = () => {
  if (!props.autoplay || totalPages.value <= 1) return
  
  stopAutoplay() // 先清除已有的定时器
  autoplayTimer = setInterval(() => {
    nextPage()
  }, props.autoplayInterval)
}

// 停止自动轮播
const stopAutoplay = () => {
  if (autoplayTimer) {
    clearInterval(autoplayTimer)
    autoplayTimer = null
  }
}

// 重启自动轮播（用户交互后）
const restartAutoplay = () => {
  if (!props.autoplay) return
  stopAutoplay()
  setTimeout(() => {
    startAutoplay()
  }, props.autoplayInterval)
}

// 键盘导航
const handleKeydown = (e) => {
  if (e.key === 'ArrowLeft') {
    prevPage()
  } else if (e.key === 'ArrowRight') {
    nextPage()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  startAutoplay()
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  stopAutoplay()
})

// 监听items变化，重置到第一页
watch(() => props.items.length, () => {
  currentPage.value = 0
  stopAutoplay()
  startAutoplay()
})

// 监听autoplay属性变化
watch(() => props.autoplay, (newVal) => {
  if (newVal) {
    startAutoplay()
  } else {
    stopAutoplay()
  }
})

// 监听totalPages变化
watch(totalPages, () => {
  if (totalPages.value <= 1) {
    stopAutoplay()
  } else if (props.autoplay) {
    startAutoplay()
  }
})

defineExpose({
  nextPage,
  prevPage,
  goToPage,
  currentPage,
  totalPages
})
</script>

<style scoped>
/* 样式已在 single-screen.css 中定义 */
</style>
