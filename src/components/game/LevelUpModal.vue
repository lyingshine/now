<template>
  <Transition name="modal">
    <div v-if="show" class="modal-overlay" @click="$emit('close')">
      <div class="level-up-modal" @click.stop>
        <div class="level-up-animation">
          <div class="level-up-rays"></div>
          <div class="level-up-icon">⭐</div>
          <h2 class="level-up-title">升级了！</h2>
          <div class="new-level">Lv.{{ newLevel }}</div>
          <p class="level-up-message">恭喜你达到新的等级！</p>
          
          <div class="rewards">
            <div class="reward-title">🎁 升级奖励</div>
            <div class="reward-items">
              <div class="reward-item">
                <span class="reward-icon">💰</span>
                <span class="reward-text">+{{ goldReward }} 金币</span>
              </div>
              <div class="reward-item">
                <span class="reward-icon">🎯</span>
                <span class="reward-text">解锁新任务</span>
              </div>
            </div>
          </div>
          
          <button class="btn-continue" @click="$emit('close')">
            继续冒险
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    default: false
  },
  newLevel: {
    type: Number,
    required: true
  },
  goldReward: {
    type: Number,
    default: 1000
  }
})

defineEmits(['close'])
</script>

<style scoped>
.modal-overlay {
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
  backdrop-filter: blur(10px);
}

.level-up-modal {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border-radius: var(--radius-3xl);
  padding: 3rem;
  max-width: 500px;
  width: 90%;
  border: 2px solid #fbbf24;
  box-shadow: 0 0 60px rgba(251, 191, 36, 0.6);
  position: relative;
  overflow: hidden;
}

.level-up-animation {
  text-align: center;
  position: relative;
  z-index: 1;
}

.level-up-rays {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 300px;
  background: conic-gradient(
    from 0deg,
    transparent 0deg,
    #fbbf24 45deg,
    transparent 90deg,
    transparent 180deg,
    #fbbf24 225deg,
    transparent 270deg
  );
  animation: rotate 4s linear infinite;
  opacity: 0.3;
}

@keyframes rotate {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

.level-up-icon {
  font-size: 5rem;
  animation: bounce 1s ease infinite;
  filter: drop-shadow(0 0 20px rgba(251, 191, 36, 0.8));
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-20px) scale(1.1);
  }
}

.level-up-title {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 1rem 0;
  text-shadow: 0 0 30px rgba(251, 191, 36, 0.5);
}

.new-level {
  font-size: 3rem;
  font-weight: 900;
  color: #fbbf24;
  text-shadow: 0 0 20px rgba(251, 191, 36, 0.8);
  margin: 1rem 0;
}

.level-up-message {
  color: #94a3b8;
  font-size: 1.125rem;
  margin-bottom: 2rem;
}

.rewards {
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.3);
  border-radius: var(--radius-xl);
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.reward-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #fbbf24;
  margin-bottom: 1rem;
}

.reward-items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.reward-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1rem;
  color: white;
  font-weight: 600;
}

.reward-icon {
  font-size: 1.5rem;
}

.btn-continue {
  width: 100%;
  padding: 1.25rem;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: #78350f;
  border: none;
  border-radius: var(--radius-xl);
  font-size: 1.125rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(251, 191, 36, 0.4);
}

.btn-continue:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 30px rgba(251, 191, 36, 0.6);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .level-up-modal {
  animation: modalZoom 0.5s ease;
}

@keyframes modalZoom {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
