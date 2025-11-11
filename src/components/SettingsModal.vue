<template>
  <div v-if="isOpen" class="modal" @click.self="close">
    <div class="modal-content">
      <div class="modal-header">
        <div class="modal-title">⚙️ 设置</div>
        <button class="close-btn" @click="close">×</button>
      </div>

      <div class="input-group">
        <label for="salary">月薪（元）</label>
        <input type="number" v-model.number="formData.salary" placeholder="请输入你的月薪">
      </div>

      <div class="input-group">
        <label for="peopleCount">几个人生活</label>
        <input type="number" v-model.number="formData.peopleCount" placeholder="默认 1 人" min="1" max="10">
      </div>

      <div class="input-group">
        <label for="rent">每月房租（元）</label>
        <input type="number" v-model.number="formData.rent" placeholder="请输入每月房租">
      </div>

      <div class="input-group">
        <label for="utilities">每月水电网费（元）</label>
        <input type="number" v-model.number="formData.utilities" placeholder="请输入每月水电网费">
      </div>

      <div class="input-group">
        <label for="savingsRate">储蓄率（%）</label>
        <input type="number" v-model.number="formData.savingsRate" placeholder="建议20-40%" min="0" max="100">
        <div v-if="savingsRateRecommendation" class="savings-recommendation">
          💡 基于您的段位，建议储蓄率 {{ savingsRateRecommendation.recommended }}%
        </div>
        <small class="input-hint">设置为0表示月光族，不储蓄</small>
      </div>

      <div class="input-group">
        <label for="joinDate">入职日期</label>
        <input type="date" v-model="formData.joinDate">
      </div>

      <div class="input-group">
        <label for="workStart">上班时间</label>
        <input type="time" v-model="formData.workStart">
      </div>

      <div class="input-group">
        <label for="workEnd">下班时间</label>
        <input type="time" v-model="formData.workEnd">
      </div>

      <div class="input-group">
        <label for="workSchedule">工作制度</label>
        <select v-model="formData.workSchedule" class="input">
          <option value="double">双休（周六日休息）</option>
          <option value="alternate">大小休（隔周单休）</option>
          <option value="single">单休（仅周日休息）</option>
          <option value="full">全勤（无休息日）</option>
          <option value="custom">自定义工作天数</option>
        </select>
      </div>

      <div v-if="formData.workSchedule === 'custom'" class="input-group">
        <label for="workDays">每月工作天数</label>
        <input type="number" v-model.number="formData.workDays" placeholder="默认 22 天" min="1" max="31">
      </div>

      <button class="save-btn" @click="handleSave">保存设置</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useLifestyle } from '../composables/useLifestyle'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'save'])

const { getRank, rankSystem } = useLifestyle()

const formData = ref({
  salary: 10000,
  peopleCount: 1,
  rent: 2000,
  utilities: 300,
  savingsRate: 30,
  joinDate: '',
  workStart: '09:00',
  workEnd: '18:00',
  workSchedule: 'double',
  workDays: 22
})

const savingsRateRecommendation = computed(() => {
  if (formData.value.salary > 0) {
    return rankSystem.getSavingsRateRecommendation(formData.value.salary)
  }
  return null
})

const loadData = () => {
  const saved = localStorage.getItem('salaryData')
  if (saved) {
    const data = JSON.parse(saved)
    formData.value = { ...formData.value, ...data }
  }
}

const handleSave = () => {
  localStorage.setItem('salaryData', JSON.stringify(formData.value))
  emit('save', formData.value)
  close()
}

const close = () => {
  emit('close')
}

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    loadData()
  }
})
</script>

<style scoped>
.modal {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: white;
  border-radius: var(--radius-3xl);
  padding: var(--space-10);
  max-width: 500px;
  width: 90%;
  max-height: 85vh;
  overflow-y: auto;
  position: relative;
  animation: slideUp 0.3s ease;
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--color-gray-200);
}

/* 美化滚动条 */
.modal-content::-webkit-scrollbar {
  width: 10px;
}

.modal-content::-webkit-scrollbar-track {
  background: var(--color-gray-100);
  border-radius: 10px;
}

.modal-content::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, var(--color-accent) 0%, var(--color-primary) 100%);
  border-radius: 10px;
  border: 2px solid var(--color-gray-100);
}

.modal-content::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, var(--color-accent-hover) 0%, var(--color-primary-hover) 100%);
}

body.dark-mode .modal-content {
  background: var(--color-gray-800);
  border-color: var(--color-gray-700);
}

body.dark-mode .modal-content::-webkit-scrollbar-track {
  background: var(--color-gray-700);
}

body.dark-mode .modal-content::-webkit-scrollbar-thumb {
  border-color: var(--color-gray-700);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.modal-title {
  font-size: 1.5rem;
  color: var(--color-gray-900);
  font-weight: 700;
}

body.dark-mode .modal-title {
  color: var(--color-gray-100);
}

.close-btn {
  background: var(--color-gray-100);
  border: none;
  font-size: 1.5rem;
  color: var(--color-gray-600);
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  border-radius: 50%;
}

.close-btn:hover {
  background: var(--color-accent);
  color: white;
  transform: rotate(90deg);
}

body.dark-mode .close-btn {
  background: var(--color-gray-700);
  color: var(--color-gray-400);
}

.input-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: var(--space-2);
  color: var(--color-gray-700);
  font-weight: 500;
  font-size: 0.875rem;
}

body.dark-mode label {
  color: var(--color-gray-300);
}

input, select {
  width: 100%;
  padding: var(--space-4) var(--space-5);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-2xl);
  font-size: 0.875rem;
  font-weight: 500;
  background: var(--color-gray-100);
  color: var(--color-gray-900);
  transition: all var(--transition-fast);
}

input:focus, select:focus {
  outline: none;
  border-color: var(--color-accent);
  background: white;
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.15);
}

body.dark-mode input,
body.dark-mode select {
  background: var(--color-gray-700);
  border-color: var(--color-gray-600);
  color: var(--color-gray-100);
}

.savings-recommendation {
  color: var(--color-accent);
  font-size: 0.8125rem;
  margin-top: 6px;
  font-weight: 500;
}

.input-hint {
  color: var(--color-gray-500);
  font-size: 0.75rem;
  margin-top: 4px;
  display: block;
}

.save-btn {
  width: 100%;
  padding: var(--space-3) var(--space-6);
  background: var(--color-accent);
  color: white;
  border: none;
  border-radius: var(--radius-xl);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-sm);
}

.save-btn:hover {
  background: var(--color-accent-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}
</style>
