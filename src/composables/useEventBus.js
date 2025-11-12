/**
 * Event Bus Composable
 * 使用 Vue 的响应式系统替代全局事件
 */

import { ref } from 'vue'

// 创建事件总线
const eventBus = {
  // 设置弹窗状态
  settingsModalOpen: ref(false),
  
  // 方法
  openSettings() {
    this.settingsModalOpen.value = true
  },
  
  closeSettings() {
    this.settingsModalOpen.value = false
  }
}

/**
 * 使用事件总线
 */
export function useEventBus() {
  return eventBus
}
