<template>
  <div 
    class="carousel-container" 
    :class="{ 
      vertical: direction === 'vertical',
      fade: effect === 'fade',
      'touch-enabled': enableTouch,
      loop: enableLoop
    }"
    @mouseenter="pauseAutoPlay"
    @mouseleave="resumeAutoPlay"
  >
    <!-- 轮播内容 -->
    <div 
      class="carousel-wrapper"
      :style="wrapperStyle"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
    >
      <div 
        v-for="(item, index) in items" 
        :key="index"
        class="carousel-item"
        :class="{ active: currentIndex === index }"
      >
        <slot :item="item" :index="index"></slot>
      </div>
    </div>

    <!-- 导航按钮 -->
    <button 
      v-if="showNav && items.length > 1"
      class="carousel-nav prev"
      @click="prev"
      :disabled="!enableLoop && currentIndex === 0"
    >
      {{ direction === 'vertical' ? '↑' : '←' }}
    </button>
    <button 
      v-if="showNav && items.length > 1"
      class="carousel-nav next"
      @click="next"
      :disabled="!enableLoop && currentIndex === items.length - 1"
    >
      {{ direction === 'vertical' ? '↓' : '→' }}
    </button>

    <!-- 指示器 -->
    <div 
      v-if="showIndicators && items.length > 1"
      class="carousel-indicators"
      :class="{ compact: compactIndicators }"
    >
      <div
        v-for="(item, index) in items"
        :key="index"
        class="carousel-indicator"
        :class="{ active: currentIndex === index }"
        @click="goTo(index)"
      ></div>
    </div>

    <!-- 自动播放进度条 -->
    <div v-if="autoPlay && showProgress" class="carousel-progress">
      <div class="carousel-progress-bar" :style="{ width: progress + '%' }"></div>
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
  direction: {
    type: String,
    default: 'horizontal', // 'horizontal' | 'vertical'
    validator: (value) => ['horizontal', 'vertical'].includes(value)
  },
  effect: {
    type: String,
    default: 'slide', // 'slide' | 'fade'
    validator: (value) => ['slide', 'fade'].includes(value)
  },
  autoPlay: {
    type: Boolean,
    default: false
  },
  interval: {
    type: Number,
    default: 5000
  },
  showNav: {
    type: Boolean,
    default: true
  },
  showIndicators: {
    type: Boolean,
    default: true
  },
  showProgress: {
    type: Boolean,
    default: false
  },
  enableLoop: {
    type: Boolean,
    default: true
  },
  enableTouch: {
    type: Boolean,
    default: true
  },
  compactIndicators: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['change'])

const currentIndex = ref(0)
const progress = ref(0)
const autoPlayTimer = ref(null)
const progressTimer = ref(null)
const isPaused = ref(false)
const touchStartX = ref(0)
const touchStartY = ref(0)

const wrapperStyle = computed(() => {
  if (props.effect === 'fade') return {}
  
  const translateValue = -currentIndex.value * 100
  const translateProp = props.direction === 'vertical' ? 'translateY' : 'translateX'
  
  return {
    transform: `${translateProp}(${translateValue}%)`
  }
})

const next = () => {
  if (props.enableLoop) {
    currentIndex.value = (currentIndex.value + 1) % props.items.length
  } else {
    if (currentIndex.value < props.items.length - 1) {
      currentIndex.value++
    }
  }
  resetProgress()
}

const prev = () => {
  if (props.enableLoop) {
    currentIndex.value = currentIndex.value === 0 ? props.items.length - 1 : currentIndex.value - 1
  } else {
    if (currentIndex.value > 0) {
      currentIndex.value--
    }
  }
  resetProgress()
}

const goTo = (index) => {
  currentIndex.value = index
  resetProgress()
}

const startAutoPlay = () => {
  if (!props.autoPlay || props.items.length <= 1) return
  
  stopAutoPlay()
  
  autoPlayTimer.value = setInterval(() => {
    if (!isPaused.value) {
      next()
    }
  }, props.interval)
  
  if (props.showProgress) {
    startProgress()
  }
}

const stopAutoPlay = () => {
  if (autoPlayTimer.value) {
    clearInterval(autoPlayTimer.value)
    autoPlayTimer.value = null
  }
  if (progressTimer.value) {
    clearInterval(progressTimer.value)
    progressTimer.value = null
  }
}

const pauseAutoPlay = () => {
  isPaused.value = true
}

const resumeAutoPlay = () => {
  isPaused.value = false
}

const startProgress = () => {
  progress.value = 0
  if (progressTimer.value) {
    clearInterval(progressTimer.value)
  }
  
  const step = 100 / (props.interval / 100)
  progressTimer.value = setInterval(() => {
    if (!isPaused.value) {
      progress.value += step
      if (progress.value >= 100) {
        progress.value = 0
      }
    }
  }, 100)
}

const resetProgress = () => {
  progress.value = 0
  if (props.autoPlay && props.showProgress) {
    startProgress()
  }
}

const handleTouchStart = (e) => {
  if (!props.enableTouch) return
  touchStartX.value = e.touches[0].clientX
  touchStartY.value = e.touches[0].clientY
}

const handleTouchMove = (e) => {
  if (!props.enableTouch) return
  // 可以添加实时跟随手指的效果
}

const handleTouchEnd = (e) => {
  if (!props.enableTouch) return
  
  const touchEndX = e.changedTouches[0].clientX
  const touchEndY = e.changedTouches[0].clientY
  const diffX = touchStartX.value - touchEndX
  const diffY = touchStartY.value - touchEndY
  
  const threshold = 50
  
  if (props.direction === 'horizontal') {
    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        next()
      } else {
        prev()
      }
    }
  } else {
    if (Math.abs(diffY) > threshold) {
      if (diffY > 0) {
        next()
      } else {
        prev()
      }
    }
  }
}

watch(currentIndex, (newIndex) => {
  emit('change', newIndex)
})

onMounted(() => {
  if (props.autoPlay) {
    startAutoPlay()
  }
})

onUnmounted(() => {
  stopAutoPlay()
})
</script>

<style scoped>
/* 组件特定样式已在 carousel.css 中定义 */
</style>
