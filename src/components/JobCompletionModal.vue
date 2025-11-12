<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="unified-modal-overlay modal-overlay" @click="handleClose">
        <div class="unified-modal modal-container" @click.stop>
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
              <button @click="goToJobs" class="unified-btn btn-secondary">
                <span>查看更多岗位</span>
              </button>
              <button @click="handleClose" class="unified-btn unified-btn-primary btn-primary">
                <span>太棒了！</span>
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
/* 使用统一设计系统的模态框样式 */
.modal-overlay {
  z-index: 9999;
}

.modal-container {
  max-width: 600px;
  width: 100%;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
}

.modal-content {
  padding: var(--space-10);
  overflow-y: auto;
  flex: 1;
}

.celebration-header {
  text-align: center;
  margin-bottom: var(--space-8);
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
  background: linear-gradient(135deg, var(--rank-color, var(--neon-purple)) 0%, var(--color-success) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-top: var(--space-4);
}

.job-info {
  text-align: center;
  padding: var(--space-8);
  background: linear-gradient(135deg, 
    color-mix(in srgb, var(--rank-color, var(--neon-purple)) 10%, transparent),
    color-mix(in srgb, var(--rank-color, var(--neon-purple)) 5%, transparent));
  border-radius: var(--radius-2xl);
  margin-bottom: var(--space-8);
}

.job-badge {
  width: 80px;
  height: 80px;
  margin: 0 auto var(--space-4);
  background: linear-gradient(135deg, var(--rank-color, var(--neon-purple)) 0%, var(--color-success) 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px color-mix(in srgb, var(--rank-color, var(--neon-purple)) 40%, transparent);
}

.job-icon {
  font-size: 2.5rem;
}

.job-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--immersive-text-primary);
  margin-bottom: var(--space-2);
}

.job-subtitle {
  font-size: 0.875rem;
  color: var(--immersive-text-secondary);
}

.rewards-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  margin-bottom: var(--space-8);
}

.reward-item {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
  background: var(--immersive-bg-secondary);
  border-radius: var(--radius-xl);
  transition: transform var(--transition-fast);
}

.reward-item:hover {
  transform: translateX(4px);
}

.reward-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, var(--color-success) 0%, var(--rank-color, var(--neon-purple)) 100%);
  border-radius: var(--radius-xl);
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
  color: var(--immersive-text-secondary);
  margin-bottom: var(--space-1);
}

.reward-value {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--immersive-text-primary);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.old-value {
  color: var(--immersive-text-tertiary);
  text-decoration: line-through;
  font-size: 0.875rem;
}

.arrow {
  color: var(--immersive-text-tertiary);
}

.new-value {
  color: var(--rank-color, var(--neon-purple));
  font-size: 1.25rem;
}

.growth {
  color: var(--color-success);
  font-size: 0.875rem;
  padding: var(--space-1) var(--space-2);
  background: color-mix(in srgb, var(--color-success) 10%, transparent);
  border-radius: var(--radius-md);
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-4);
  margin-bottom: var(--space-8);
  padding: var(--space-6);
  background: var(--immersive-bg-secondary);
  border-radius: var(--radius-xl);
}

.stat-item {
  text-align: center;
}

.stat-label {
  font-size: 0.75rem;
  color: var(--immersive-text-secondary);
  margin-bottom: var(--space-2);
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--rank-color, var(--neon-purple));
}

.next-steps {
  padding: var(--space-6);
  background: linear-gradient(135deg, 
    color-mix(in srgb, var(--color-warning) 10%, transparent),
    color-mix(in srgb, var(--color-warning) 5%, transparent));
  border-radius: var(--radius-xl);
  margin-bottom: var(--space-8);
}

.next-steps-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--immersive-text-primary);
  margin-bottom: var(--space-4);
}

.next-steps-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.next-steps-list li {
  font-size: 0.875rem;
  color: var(--immersive-text-secondary);
  padding: var(--space-2) 0;
  padding-left: var(--space-6);
  position: relative;
}

.next-steps-list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--color-success);
  font-weight: 700;
}

.modal-actions {
  display: flex;
  gap: var(--space-4);
}

.btn-secondary {
  flex: 1;
  background: var(--immersive-bg-secondary) !important;
  color: var(--immersive-text-primary) !important;
  border: 2px solid var(--immersive-border) !important;
}

.btn-secondary:hover {
  background: var(--immersive-bg-tertiary) !important;
}

.btn-primary {
  flex: 1;
}

/* 过渡动画 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity var(--transition-fast);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* 响应式 */
@media (max-width: 640px) {
  .modal-content {
    padding: var(--space-6);
  }

  .stats-section {
    grid-template-columns: 1fr;
  }

  .modal-actions {
    flex-direction: column;
  }
}
</style>
