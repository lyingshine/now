<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="completion-modal-overlay" @click="handleClose">
        <div class="completion-modal" @click.stop>
          <!-- 烟花效果 -->
          <div class="fireworks">
            <div v-for="i in 20" :key="i" class="firework" :style="getFireworkStyle(i)"></div>
          </div>
          
          <div class="completion-content">
            <!-- 成就徽章 -->
            <div class="achievement-badge">
              <div class="badge-icon">👑</div>
              <div class="badge-glow"></div>
            </div>
            
            <!-- 标题 -->
            <h1 class="completion-title">任务完成！</h1>
            <h2 class="completion-subtitle">{{ quest.jobTitle }}</h2>
            
            <!-- 任务总结 -->
            <div class="quest-summary">
              <div class="summary-item">
                <div class="summary-icon">📅</div>
                <div class="summary-content">
                  <div class="summary-label">完成时间</div>
                  <div class="summary-value">{{ completionDays }} 天</div>
                </div>
              </div>
              
              <div class="summary-item">
                <div class="summary-icon">⚡</div>
                <div class="summary-content">
                  <div class="summary-label">总经验值</div>
                  <div class="summary-value">{{ quest.totalExp }} EXP</div>
                </div>
              </div>
              
              <div class="summary-item">
                <div class="summary-icon">⭐</div>
                <div class="summary-content">
                  <div class="summary-label">最终等级</div>
                  <div class="summary-value">Lv.{{ quest.currentLevel }}</div>
                </div>
              </div>
              
              <div class="summary-item">
                <div class="summary-icon">✅</div>
                <div class="summary-content">
                  <div class="summary-label">完成子任务</div>
                  <div class="summary-value">{{ quest.completedSubQuests }}/{{ quest.subQuests.length }}</div>
                </div>
              </div>
            </div>
            
            <!-- 终极奖励 -->
            <div class="ultimate-reward">
              <div class="reward-header">
                <div class="reward-icon">🎁</div>
                <div class="reward-title">终极奖励</div>
              </div>
              
              <div class="reward-gold">
                <span class="gold-icon">💰</span>
                <span class="gold-amount">{{ quest.customRewards.completionGold.toLocaleString() }}</span>
                <span class="gold-label">金币</span>
              </div>
              
              <div class="reward-description">
                {{ quest.customRewards.ultimateReward }}
              </div>
            </div>
            
            <!-- 成就解锁 -->
            <div v-if="achievements.length > 0" class="achievements">
              <div class="achievements-title">🏆 解锁成就</div>
              <div class="achievements-list">
                <div 
                  v-for="achievement in achievements" 
                  :key="achievement.id"
                  class="achievement-item"
                >
                  <span class="achievement-icon">{{ achievement.icon }}</span>
                  <span class="achievement-name">{{ achievement.name }}</span>
                </div>
              </div>
            </div>
            
            <!-- 确认按钮 -->
            <button class="confirm-button" @click="handleConfirm">
              确认完成 →
            </button>
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
  quest: {
    type: Object,
    required: true
  },
  achievements: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['confirm', 'close'])

const completionDays = computed(() => {
  if (!props.quest.startDate) return 0
  const start = new Date(props.quest.startDate)
  const end = new Date()
  const diff = end - start
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
})

const getFireworkStyle = (index) => {
  const angle = (index / 20) * 360
  const distance = 150 + Math.random() * 100
  const delay = Math.random() * 2
  const duration = 1 + Math.random()
  
  return {
    '--angle': `${angle}deg`,
    '--distance': `${distance}px`,
    '--delay': `${delay}s`,
    '--duration': `${duration}s`
  }
}

const handleConfirm = () => {
  emit('confirm')
}

const handleClose = () => {
  // 不允许点击外部关闭，必须点击确认按钮
}
</script>

<style scoped>
.completion-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(10px);
}

.completion-modal {
  position: relative;
  width: 90%;
  max-width: 600px;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #dc2626 100%);
  border-radius: var(--radius-3xl);
  padding: 3rem 2rem;
  box-shadow: 0 20px 60px rgba(251, 191, 36, 0.6);
  animation: modalEnter 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
  overflow: hidden;
}

@keyframes modalEnter {
  0% {
    transform: scale(0.3) rotate(-10deg);
    opacity: 0;
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

/* 烟花效果 */
.fireworks {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.firework {
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 4px;
  background: white;
  border-radius: 50%;
  opacity: 0;
  animation: fireworkExplode var(--duration) ease-out var(--delay) infinite;
}

@keyframes fireworkExplode {
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

.completion-content {
  position: relative;
  z-index: 2;
  text-align: center;
}

/* 成就徽章 */
.achievement-badge {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 2rem;
  animation: badgeBounce 1s ease-out;
}

@keyframes badgeBounce {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-30px) scale(1.1);
  }
}

.badge-icon {
  position: relative;
  z-index: 2;
  font-size: 6rem;
  animation: badgeRotate 3s ease-in-out infinite;
}

@keyframes badgeRotate {
  0%, 100% {
    transform: rotate(-10deg);
  }
  50% {
    transform: rotate(10deg);
  }
}

.badge-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.6), transparent);
  border-radius: 50%;
  animation: glowPulse 2s ease-in-out infinite;
}

@keyframes glowPulse {
  0%, 100% {
    opacity: 0.5;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.2);
  }
}

/* 标题 */
.completion-title {
  font-size: 3rem;
  font-weight: 900;
  color: white;
  margin-bottom: 0.5rem;
  text-shadow: 
    0 0 20px rgba(255, 255, 255, 0.8),
    0 0 40px rgba(251, 191, 36, 0.6),
    4px 4px 8px rgba(0, 0, 0, 0.3);
  animation: titlePulse 2s ease-in-out infinite;
}

@keyframes titlePulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.completion-subtitle {
  font-size: 1.5rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2rem;
}

/* 任务总结 */
.quest-summary {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-2xl);
  backdrop-filter: blur(10px);
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.3);
  border-radius: var(--radius-xl);
}

.summary-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.summary-content {
  text-align: left;
}

.summary-label {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 0.25rem;
}

.summary-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
}

/* 终极奖励 */
.ultimate-reward {
  padding: 2rem;
  background: rgba(255, 255, 255, 0.3);
  border-radius: var(--radius-2xl);
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
}

.reward-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.reward-icon {
  font-size: 2rem;
}

.reward-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
}

.reward-gold {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.gold-icon {
  font-size: 2rem;
}

.gold-amount {
  font-size: 2.5rem;
  font-weight: 900;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.gold-label {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
}

.reward-description {
  font-size: 1.125rem;
  color: white;
  line-height: 1.6;
}

/* 成就 */
.achievements {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-2xl);
}

.achievements-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1rem;
}

.achievements-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
}

.achievement-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.3);
  border-radius: var(--radius-full);
  font-weight: 600;
  color: white;
}

.achievement-icon {
  font-size: 1.25rem;
}

/* 确认按钮 */
.confirm-button {
  padding: 1.25rem 3rem;
  background: white;
  color: #f59e0b;
  border: none;
  border-radius: var(--radius-xl);
  font-size: 1.25rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.confirm-button:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
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

@media (max-width: 600px) {
  .quest-summary {
    grid-template-columns: 1fr;
  }
  
  .completion-title {
    font-size: 2rem;
  }
  
  .completion-subtitle {
    font-size: 1.25rem;
  }
}
</style>
