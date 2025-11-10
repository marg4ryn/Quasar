import { ref } from 'vue'

export interface ToastItem {
  id: number
  message: string
  variant: 'success' | 'error' | 'info' | 'warning'
  duration?: number
}

const toasts = ref<ToastItem[]>([])

export function useToast() {
  const showToast = (
    message: string,
    variant: 'success' | 'error' | 'info' | 'warning' = 'info',
    duration = 5000
  ) => {
    const id = Date.now() + Math.random()
    toasts.value.push({ id, message, variant, duration })
  }

  const removeToast = (id: number) => {
    toasts.value = toasts.value.filter((toast) => toast.id !== id)
  }

  const success = (message: string, duration?: number) => {
    showToast(message, 'success', duration)
  }

  const error = (message: string, duration?: number) => {
    showToast(message, 'error', duration)
  }

  const info = (message: string, duration?: number) => {
    showToast(message, 'info', duration)
  }

  const warning = (message: string, duration?: number) => {
    showToast(message, 'warning', duration)
  }

  return {
    toasts,
    showToast,
    removeToast,
    success,
    error,
    info,
    warning,
  }
}
