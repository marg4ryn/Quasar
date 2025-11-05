import { defineStore } from 'pinia'

export type NotificationType = 'success' | 'error' | 'info' | 'warning'

export interface Notification {
  id: number
  time: string
  message: string
  type: NotificationType
  screenId?: string
  screenRoute?: string
  read?: boolean
}

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    showPanel: false,
    notifications: [] as Notification[],
  }),
  getters: {
    unreadCount: (state) => state.notifications.filter((n) => !n.read).length,
    hasUnread: (state) => state.notifications.some((n) => !n.read),
  },
  actions: {
    togglePanel() {
      this.showPanel = !this.showPanel
      if (this.showPanel) {
        this.markAllAsRead()
      }
    },
    closePanel() {
      this.showPanel = false
    },
    removeNotification(id: number) {
      this.notifications = this.notifications.filter((n) => n.id !== id)
    },
    addNotification(notification: Omit<Notification, 'id' | 'time' | 'read'>) {
      const now = new Date()
      const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

      this.notifications.unshift({
        id: Date.now(),
        time,
        read: false,
        ...notification,
      })

      if (this.notifications.length > 50) {
        this.notifications = this.notifications.slice(0, 50)
      }
    },
    markAsRead(id: number) {
      const notification = this.notifications.find((n) => n.id === id)
      if (notification) {
        notification.read = true
      }
    },
    markAllAsRead() {
      this.notifications.forEach((n) => (n.read = true))
    },
    clearAll() {
      this.notifications = []
    },
  },
})
