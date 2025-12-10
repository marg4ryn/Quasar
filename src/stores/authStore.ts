import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {
  login,
  logout,
  register,
  googleAuth,
  getCurrentUser,
  type User,
} from '@/services/authService'

const USER_STORAGE_KEY = 'auth_user'

export const useAuthStore = defineStore('authStore', () => {
  const storedUser = localStorage.getItem(USER_STORAGE_KEY)
  const user = ref<User | null>(storedUser ? JSON.parse(storedUser) : null)
  const loading = ref(false)

  const isAuthenticated = computed(() => user.value !== null)
  const userRole = computed(() => user.value?.role)

  function saveUser(userData: User | null) {
    user.value = userData
    if (userData) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData))
    } else {
      localStorage.removeItem(USER_STORAGE_KEY)
    }
  }

  async function loginUser(email: string, password: string) {
    loading.value = true
    try {
      const loggedUser = await login({ email, password })
      saveUser(loggedUser)
      return loggedUser
    } finally {
      loading.value = false
    }
  }

  async function logoutUser() {
    await logout()
    saveUser(null)
  }

  async function registerUser(email: string, password: string, name: string) {
    loading.value = true
    try {
      const registeredUser = await register({ email, password, name })
      saveUser(registeredUser)
      return registeredUser
    } finally {
      loading.value = false
    }
  }

  async function loginWithGoogle() {
    googleAuth()
  }

  async function fetchCurrentUser() {
    loading.value = true
    try {
      const currentUser = await getCurrentUser()
      saveUser(currentUser)
      return currentUser
    } catch (error) {
      saveUser(null)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    // state
    user,
    loading,

    // getters
    isAuthenticated,
    userRole,

    // actions
    loginUser,
    logoutUser,
    registerUser,
    loginWithGoogle,
    fetchCurrentUser,
  }
})
