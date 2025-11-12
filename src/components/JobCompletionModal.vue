<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click="handleClose">
        <div class="modal-container" @click.stop>
          <div class="modal-content">
            <!-- 庆祝动画 -->
            <div class="celebration-header">
              <div class="celebration-icon">🎉</div>
              <h2 class="celebration-title">恭喜完成学习！</h2>
            </div>

            <!-- 职位信息 -->
            <div class="job-info">
              <div class="job-badge">
                <span class="job-icon">🎓</span>
              </div>
              <h3 class="job-title">{{ jobData?.title }}</h3>
              <p class="job-subtitle">你已掌握该岗位所需的全部技能</p>
            </div>

            <!-- 奖励信息 -->
            <div class="rewards-section">
              <div class="reward-item">
                <div class="reward-icon">💰</div>
                <div class="reward-info">
                  <div class="reward-label">月薪提升</div>
                  <div class="reward-value">
                    <span class="old-value">{{ formatNumber(oldSalary) }}</span>
                    <span class="arrow">→</span>
                    <span class="new-value">{{ formatNumber(newSalary) }}</span>
                    <span class="growth">+{{ salaryGrowth }}%</span>
                  </div>
                </div>
              </div>

              <div class="reward-item">
                <div class="reward-icon">⭐</div>
                <div class="reward-info">
                  <div class="reward-label">达到等级</div>
                  <div class="reward-value">Lv.100 满级</div>
                </div>
              </div>

              <div class="reward-item">
                <div class="reward-icon">🏆</div>
                <div class="reward-info">
                  <div class="reward-label">成就解锁</div>
                  <div class="reward-value">「{{ jobData?.title }}」专家</div>
                </div>
              </div>
            </div>

            <!-- 学习统计 -->
            <div class="stats-section">
              <div class="stat-item">
                <div class="stat-label">学习时长</div>
                <div class="stat-value">{{ learningDuration }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">完成任务</div>
                <div class="stat-value">{{ completedTasks }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">掌握技能</div>
                <div class="stat-value">{{ totalSkills }}</div>
              </div>
            </div>

            <!-- 下一步建议 -->
            <div class="next-steps">
              <h4 class="next-steps-title">🚀 下一步建议</h4>
              <ul class="next-steps-list">
                <li>继续学习更高级的岗位，提升薪资水平</li>
                <li>在实际项目中应用所学技能，积累经验</li>
                <li>关注行业动态，保持技能的持续更新</li>
              </ul>
            </div>

            <!-- 操作按钮 -->
            <div class="modal-actions">
              <button @click="goToJobs" class="btn-secondary">
                查看更多岗位
              </button>
              <button @click="handleClose" class="btn-primary">
                太棒了！
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  jobData: {
    type: Object,
    default: null
  },
  oldSalary: {
    type: Number,
    default: 0
  },
  newSalary: {
    type: Number,
    default: 0
  },
  learningDuration: {
    type: String,
    default: '0天'
  },
  completedTasks: {
    type: Number,
    default: 0
  },
  totalSkills: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['close'])
const router = useRouter()

const salaryGrowth = computed(() => {
  if (props.oldSalary === 0) return 0
  return Math.round(((props.newSalary - props.oldSalary) / props.oldSalary) * 100)
})

const formatNumber = (num) => {
  return num.toLocaleString('zh-CN')
}

const handleClose = () => {
  emit('close')
}

const goToJobs = () => {
  emit('close')
  router.push('/jobs')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.modal-container {
  background: var(--bg-primary);
  border-radius: var(--radius-3xl);
  max-width: 600px;
  width: 100%;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: modalSlideUp 0.4s ease-out;
}

.modal-container::-webkit-scrollbar {
  width: 8px;
}

.modal-container::-webkit-scrollbar-track {
  background: transparent;
}

.modal-container::-webkit-scrollbar-thumb {
  background: var(--color-gray-300);
  border-radius: 4px;
}

body.dark-mode .modal-container::-webkit-scrollbar-thumb {
  background: var(--color-gray-600);
}

@keyframes modalSlideUp {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-content {
  padding: 2.5rem;
  overflow-y: auto;
  flex: 1;
}

.modal-content::-webkit-scrollbar {
  width: 6px;
}

.modal-content::-webkit-scrollbar-track {
  background: transparent;
}

.modal-content::-webkit-scrollbar-thumb {
  background: var(--color-gray-300);
  border-radius: 3px;
}

body.dark-mode .modal-content::-webkit-scrollbar-thumb {
  background: var(--color-gray-600);
}

.celebration-header {
  text-align: center;
  margin-bottom: 2rem;
}

.celebration-icon {
  font-size: 4rem;
  animation: celebrate 1s ease-in-out infinite;
}

@keyframes celebrate {
  0%, 100% {
    transform: scale(1) rotate(0deg);
  }
  25% {
    transform: scale(1.1) rotate(-10deg);
  }
  75% {
    transform: scale(1.1) rotate(10deg);
  }
}

.celebration-title {
  font-size: 1.75rem;
  font-weight: 700;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-top: 1rem;
}

.job-info {
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
  border-radius: var(--radius-2xl);
  margin-bottom: 2rem;
}

.job-badge {
  width: 80px;
  height: 80px;
  margin: 0 auto 1rem;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
}

.job-icon {
  font-size: 2.5rem;
}

.job-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.job-subtitle {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.rewards-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.reward-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: var(--radius-xl);
  transition: transform 0.2s ease;
}

.reward-item:hover {
  transform: translateX(4px);
}

.reward-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.reward-info {
  flex: 1;
}

.reward-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-bottom: 0.25rem;
}

.reward-value {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.old-value {
  color: var(--text-secondary);
  text-decoration: line-through;
  font-size: 0.875rem;
}

.arrow {
  color: var(--text-secondary);
}

.new-value {
  color: var(--growth-primary);
  font-size: 1.25rem;
}

.growth {
  color: var(--growth-primary);
  font-size: 0.875rem;
  padding: 0.25rem 0.5rem;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 6px;
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-radius: var(--radius-xl);
}

.stat-item {
  text-align: center;
}

.stat-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-primary);
}

.next-steps {
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(251, 191, 36, 0.1));
  border-radius: var(--radius-xl);
  margin-bottom: 2rem;
}

.next-steps-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.next-steps-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.next-steps-list li {
  font-size: 0.875rem;
  color: var(--text-secondary);
  padding: 0.5rem 0;
  padding-left: 1.5rem;
  position: relative;
}

.next-steps-list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--growth-primary);
  font-weight: 700;
}

.modal-actions {
  display: flex;
  gap: 1rem;
}

.btn-primary,
.btn-secondary {
  flex: 1;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: var(--radius-xl);
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(99, 102, 241, 0.5);
}

.btn-secondary {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 2px solid var(--border-color);
}

.btn-secondary:hover {
  background: var(--bg-tertiary);
  transform: translateY(-2px);
}

/* 暗色模式 */
body.dark-mode .modal-container {
  background: var(--bg-secondary);
}

body.dark-mode .job-info {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.15));
}

body.dark-mode .next-steps {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(251, 191, 36, 0.15));
}

/* 过渡动画 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* 响应式 */
@media (max-width: 640px) {
  .modal-content {
    padding: 1.5rem;
  }

  .stats-section {
    grid-template-columns: 1fr;
  }

  .modal-actions {
    flex-direction: column;
  }
}
</style>
