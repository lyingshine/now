<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="level-up-modal-overlay" @click="handleClose">
        <div class="level-up-modal" @click.stop>
          <div class="level-up-content">
            <!-- 光芒效果 -->
            <div class="rays-container">
              <div class="ray" v-for="i in 12" :key="i" :style="{ transform: `rotate(${i * 30}deg)` }"></div>
            </div>
            
            <!-- 等级数字 -->
            <div class="level-number-container">
              <div class="level-up-text">LEVEL UP!</div>
              <div class="level-number">{{ newLevel }}</div>
              <div class="level-subtitle">恭喜升级！</div>
            </div>
            
            <!-- 经验值信息 -->
            <div class="exp-info">
              <div class="exp-gained">
                <span class="exp-icon">⚡</span>
                <span>+{{ expGained }} EXP</span>
              </div>
            </div>
            
            <!-- 里程碑提示 -->
            <div v-if="milestone" class="milestone-badge">
              <div class="milestone-icon">{{ getMilestoneIcon(newLevel) }}</div>
              <div class="milestone-text">{{ milestone }}</div>
            </div>
            
            <!-- 关闭按钮 -->
            <button class="close-button" @click="handleClose">
              继续前进 →
            </button>
          </div>
          
          <!-- 粒子效果 -->
          <div class="particles">
            <div 
              v-for="i in 30" 
              :key="i" 
              class="particle"
              :style="getParticleStyle(i)"
            ></div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  newLevel: {
    type: Number,
    required: true
  },
  expGained: {
    type: Number,
    required: true
  },
  milestone: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['close'])

const handleClose = () => {
  emit('close')
}

const getMilestoneIcon = (level) => {
  if (level === 25) return '🎉'
  if (level === 50) return '🌟'
  if (level === 75) return '🏆'
  if (level === 100) return '👑'
  return '⭐'
}

const getParticleStyle = (index) => {
  const angle = (index / 30) * 360
  const distance = 100 + Math.random() * 100
  const duration = 1 + Math.random() * 2
  const delay = Math.random() * 0.5
  
  return {
    '--angle': `${angle}deg`,
    '--distance': `${distance}px`,
    '--duration': `${duration}s`,
    '--delay': `${delay}s`
  }
}
</script>

<style scoped>
.level-up-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(8px);
}

.level-up-modal {
  position: relative;
  width: 90%;
  max-width: 500px;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  border-radius: var(--radius-3xl);
  padding: 3rem 2rem;
  box-shadow: 0 20px 60px rgba(251, 191, 36, 0.5);
  animation: modalEnter 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes modalEnter {
  0% {
    transform: scale(0.5) rotate(-10deg);
    opacity: 0;
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

.level-up-content {
  position: relative;
  z-index: 2;
  text-align: center;
}

/* 光芒效果 */
.rays-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 300px;
  animation: rotate 10s linear infinite;
}

@keyframes rotate {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

.ray {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4px;
  height: 150px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.8), transparent);
  transform-origin: top center;
  opacity: 0.6;
  animation: rayPulse 2s ease-in-out infinite;
}

@keyframes rayPulse {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.8;
  }
}

/* 等级数字 */
.level-number-container {
  margin-bottom: 2rem;
}

.level-up-text {
  font-size: 1.5rem;
  font-weight: 800;
  color: #78350f;
  margin-bottom: 1rem;
  animation: bounce 0.6s ease-out;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

.level-number {
  font-size: 6rem;
  font-weight: 900;
  color: white;
  line-height: 1;
  text-shadow: 
    0 0 20px rgba(255, 255, 255, 0.8),
    0 0 40px rgba(251, 191, 36, 0.6),
    4px 4px 8px rgba(0, 0, 0, 0.3);
  animation: numberGrow 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes numberGrow {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.level-subtitle {
  font-size: 1.125rem;
  color: #78350f;
  font-weight: 600;
  margin-top: 0.5rem;
}

/* 经验值信息 */
.exp-info {
  margin-bottom: 2rem;
}

.exp-gained {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.3);
  border-radius: var(--radius-full);
  font-size: 1.125rem;
  font-weight: 700;
  color: #78350f;
  animation: fadeInUp 0.6s ease-out 0.3s both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.exp-icon {
  font-size: 1.5rem;
}

/* 里程碑徽章 */
.milestone-badge {
  margin-bottom: 2rem;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.4);
  border-radius: var(--radius-2xl);
  animation: fadeInUp 0.6s ease-out 0.5s both;
}

.milestone-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.milestone-text {
  font-size: 1rem;
  font-weight: 600;
  color: #78350f;
}

/* 关闭按钮 */
.close-button {
  padding: 1rem 2rem;
  background: white;
  color: #f59e0b;
  border: none;
  border-radius: var(--radius-xl);
  font-size: 1.125rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  animation: fadeInUp 0.6s ease-out 0.7s both;
}

.close-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}

/* 粒子效果 */
.particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
  border-radius: var(--radius-3xl);
}

.particle {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
  opacity: 0;
  animation: particleFloat var(--duration) ease-out var(--delay) forwards;
}

@keyframes particleFloat {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  100% {
    transform: 
      translate(
        calc(cos(var(--angle)) * var(--distance)),
        calc(sin(var(--angle)) * var(--distance))
      )
      scale(0);
    opacity: 0;
  }
}

/* 模态框过渡 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .level-up-modal {
  animation: modalEnter 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-leave-active .level-up-modal {
  animation: modalExit 0.3s ease-out;
}

@keyframes modalExit {
  from {
    transform: scale(1);
    opacity: 1;
  }
  to {
    transform: scale(0.8);
    opacity: 0;
  }
}
</style>
