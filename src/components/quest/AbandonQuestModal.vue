<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="abandon-modal-overlay" @click="handleClose">
        <div class="abandon-modal" @click.stop>
          <div class="warning-icon">⚠️</div>
          
          <h2 class="modal-title">确认放弃任务？</h2>
          
          <div class="warning-content">
            <p class="warning-text">
              你即将放弃职业任务：<strong>{{ quest.jobTitle }}</strong>
            </p>
            
            <div class="consequences">
              <div class="consequence-title">放弃后果：</div>
              <ul class="consequence-list">
                <li>❌ 当前等级将重置为 1 级</li>
                <li>❌ 所有经验值将清空（{{ quest.totalExp }} EXP）</li>
                <li>❌ 所有子任务进度将丢失</li>
                <li>❌ 任务将被标记为"已放弃"</li>
              </ul>
            </div>
            
            <div class="current-progress">
              <div class="progress-title">当前进度：</div>
              <div class="progress-stats">
                <div class="stat">等级 {{ quest.currentLevel }}</div>
                <div class="stat">{{ quest.completedSubQuests }}/{{ quest.subQuests.length }} 子任务</div>
                <div class="stat">{{ quest.overallProgress }}% 完成</div>
              </div>
            </div>
          </div>
          
          <div class="confirmation-input">
            <label for="confirm-text">请输入 <strong>"我确认放弃"</strong> 以继续：</label>
            <input 
              id="confirm-text"
              v-model="confirmText"
              type="text"
              placeholder="我确认放弃"
              class="confirm-input"
              @keyup.enter="handleConfirm"
            />
          </div>
          
          <div class="modal-actions">
            <button @click="handleClose" class="btn-cancel">
              取消
            </button>
            <button 
              @click="handleConfirm" 
              class="btn-confirm"
              :disabled="!isConfirmValid"
            >
              确认放弃
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  quest: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['confirm', 'close'])

const confirmText = ref('')

const isConfirmValid = computed(() => {
  return confirmText.value.trim() === '我确认放弃'
})

const handleConfirm = () => {
  if (!isConfirmValid.value) {
    alert('请输入正确的确认文本')
    return
  }
  
  emit('confirm')
  confirmText.value = ''
}

const handleClose = () => {
  confirmText.value = ''
  emit('close')
}
</script>

<style scoped>
.abandon-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(8px);
}

.abandon-modal {
  width: 90%;
  max-width: 500px;
  background: white;
  border-radius: var(--radius-2xl);
  padding: 2rem;
  box-shadow: 0 20px 60px rgba(239, 68, 68, 0.5);
  animation: modalShake 0.5s ease-out;
}

body.dark-mode .abandon-modal {
  background: var(--color-gray-800);
}

@keyframes modalShake {
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-10px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(10px);
  }
}

.warning-icon {
  font-size: 4rem;
  text-align: center;
  margin-bottom: 1rem;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.modal-title {
  font-size: 1.75rem;
  font-weight: 700;
  text-align: center;
  color: #ef4444;
  margin-bottom: 1.5rem;
}

.warning-content {
  margin-bottom: 1.5rem;
}

.warning-text {
  font-size: 1rem;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  text-align: center;
}

.warning-text strong {
  color: #ef4444;
}

.consequences {
  padding: 1rem;
  background: rgba(239, 68, 68, 0.1);
  border-radius: var(--radius-lg);
  border-left: 4px solid #ef4444;
  margin-bottom: 1rem;
}

.consequence-title {
  font-weight: 700;
  color: #ef4444;
  margin-bottom: 0.75rem;
}

.consequence-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.consequence-list li {
  padding: 0.5rem 0;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.current-progress {
  padding: 1rem;
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
}

.progress-title {
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--text-primary);
}

.progress-stats {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.stat {
  padding: 0.5rem 1rem;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.confirmation-input {
  margin-bottom: 1.5rem;
}

.confirmation-input label {
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: var(--text-primary);
}

.confirmation-input strong {
  color: #ef4444;
}

.confirm-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--border-color);
  border-radius: var(--radius-lg);
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.confirm-input:focus {
  outline: none;
  border-color: #ef4444;
}

.modal-actions {
  display: flex;
  gap: 1rem;
}

.btn-cancel,
.btn-confirm {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--radius-lg);
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-cancel:hover {
  background: var(--bg-primary);
}

.btn-confirm {
  background: #ef4444;
  color: white;
}

.btn-confirm:hover:not(:disabled) {
  background: #dc2626;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.btn-confirm:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
</style>
