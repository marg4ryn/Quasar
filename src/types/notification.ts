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
