// 格式化工具 Composable
export function useFormatters() {
  /**
   * 格式化金额
   * @param {number} value - 金额
   * @returns {string} 格式化后的金额字符串
   */
  const formatMoney = (value) => {
    if (value >= 10000) {
      return (value / 10000).toFixed(2) + '万'
    }
    return value.toFixed(2)
  }

  /**
   * 格式化日期
   * @param {Date} date - 日期对象
   * @returns {string} 格式化后的日期字符串
   */
  const formatDate = (date) => {
    if (!date) return ''
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  /**
   * 格式化时间
   * @param {number} minutes - 分钟数
   * @returns {string} 格式化后的时间字符串
   */
  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = Math.floor(minutes % 60)
    if (hours > 0) {
      return `${hours}小时${mins}分钟`
    }
    return `${mins}分钟`
  }

  return {
    formatMoney,
    formatDate,
    formatTime
  }
}
