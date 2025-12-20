<template>
  <div class="login-success">
    <div v-if="loading">
      <p>Trwa logowanie...</p>
    </div>
    <div v-else-if="error">
      <p>Błąd logowania: {{ error }}</p>
      <button @click="router.push('/login')">Powrót do logowania</button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/authStore'

  const authStore = useAuthStore()
  const router = useRouter()
  const loading = ref(true)
  const error = ref<string | null>(null)

  onMounted(async () => {
    try {
      await authStore.fetchCurrentUser()
      router.push('/')
    } catch (err) {
      error.value = 'Nie udało się pobrać danych użytkownika'
      console.error('Login callback error:', err)
    } finally {
      loading.value = false
    }
  })
</script>
