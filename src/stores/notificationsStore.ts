import { defineStore } from 'pinia'
import { ref, watch, computed } from 'vue'
import type { Notification } from '@/types'
import { useToast } from '@/composables/useToast'

export const useNotificationsStore = defineStore('notifications', () => {
  const showPanel = ref(false)
  const notifications = ref<Notification[]>(
    JSON.parse(localStorage.getItem('notifications') || '[]')
  )
  const { showToast } = useToast()

  const unreadCount = computed(() => notifications.value.filter((n) => !n.read).length)
  const hasUnread = computed(() => notifications.value.some((n) => !n.read))

  const togglePanel = () => {
    showPanel.value = !showPanel.value
    if (showPanel.value) {
      markAllAsRead()
    }
  }

  const closePanel = () => {
    showPanel.value = false
  }

  const removeNotification = (id: number) => {
    notifications.value = notifications.value.filter((n) => n.id !== id)
  }

  const addNotification = (notification: Omit<Notification, 'id' | 'date' | 'time' | 'read'>) => {
    const now = new Date()
    const date = now.toISOString().split('T')[0]
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    notifications.value.unshift({
      id: Date.now(),
      date,
      time,
      read: false,
      ...notification,
    })

    const variantMap: Record<string, 'success' | 'error' | 'info' | 'warning'> = {
      success: 'success',
      error: 'error',
      info: 'info',
      warning: 'warning',
    }

    showToast(notification.message, variantMap[notification.type] || 'info', 5000)
  }

  const formatNotificationTime = (notificationDate: string, notificationTime: string) => {
    const today = new Date().toISOString().split('T')[0]

    if (notificationDate === today) {
      return notificationTime
    }

    return `${notificationDate} ${notificationTime}`
  }

  const markAsRead = (id: number) => {
    const n = notifications.value.find((n) => n.id === id)
    if (n) n.read = true
  }

  const markAllAsRead = () => {
    notifications.value.forEach((n) => (n.read = true))
  }

  const clearAll = () => {
    notifications.value = []
  }

  watch(
    notifications,
    (value) => {
      localStorage.setItem('notifications', JSON.stringify(value))
    },
    { deep: true }
  )

  return {
    showPanel,
    notifications,
    unreadCount,
    hasUnread,
    togglePanel,
    closePanel,
    removeNotification,
    addNotification,
    formatNotificationTime,
    markAsRead,
    markAllAsRead,
    clearAll,
  }
})
