<template>
  <AppButtonClose />
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-header">
        <div class="app-icon">
          <img :src="logoSrc" alt="HotSpotter Logo" class="logo" />
        </div>
        <h1>{{ t('auth.loginTitle') }}</h1>
        <p>{{ t('auth.loginSubtitle') }}</p>
      </div>

      <form @submit.prevent="handleLogin" class="auth-form">
        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div class="form-group">
          <label for="email">{{ t('auth.email') }}</label>
          <input
            id="email"
            v-model="email"
            type="email"
            :placeholder="t('auth.emailPlaceholder')"
            required
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <label for="password">{{ t('auth.password') }}</label>
          <input
            id="password"
            v-model="password"
            type="password"
            :placeholder="t('auth.passwordPlaceholder')"
            required
            :disabled="loading"
          />
        </div>

        <AppButton
          type="submit"
          :style="{ width: '100%' }"
          :disabled="loading"
          :label="t('auth.loginButton')"
          variant="primary"
        />
      </form>

      <div class="divider">
        <span>{{ t('auth.or') }}</span>
      </div>

      <button
        @click="(event) => handleGoogleLogin(event)"
        type="button"
        class="google-btn"
        :disabled="loading"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
            fill="#4285F4"
          />
          <path
            d="M9.003 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9.003 18z"
            fill="#34A853"
          />
          <path
            d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.96H.957C.347 6.175 0 7.55 0 9.002c0 1.452.348 2.827.957 4.042l3.007-2.332z"
            fill="#FBBC05"
          />
          <path
            d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.426 0 9.003 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29c.708-2.127 2.692-3.71 5.036-3.71z"
            fill="#EA4335"
          />
        </svg>
        {{ t('auth.continueWithGoogle') }}
      </button>

      <div class="auth-footer">
        <p>
          {{ t('auth.noAccount') }}
          <router-link to="/register">{{ t('auth.signUp') }}</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/authStore'
  import { useUserSettingsStore } from '@/stores/userSettingsStore'
  import { useI18n } from 'vue-i18n'
  import AppButton from '@/components/common/AppButton.vue'
  import AppButtonClose from '@/components/common/AppButtonClose.vue'

  const { t } = useI18n()

  const userSettingsStore = useUserSettingsStore()
  const router = useRouter()
  const authStore = useAuthStore()

  const email = ref('')
  const password = ref('')
  const error = ref('')
  const loading = ref(false)

  const handleLogin = async () => {
    error.value = ''
    loading.value = true

    try {
      await authStore.loginUser(email.value, password.value)
      router.back()
    } catch (err: any) {
      console.error(err)

      if (err?.response?.data?.message) {
        error.value = err.response.data.message
      } else if (err?.message) {
        error.value = err.message
      } else {
        error.value = t('auth.loginError')
      }
    } finally {
      loading.value = false
    }
  }

  const handleGoogleLogin = async (event: Event) => {
    event.preventDefault()
    const baseUrl = import.meta.env.VITE_API_URL
    window.location.href = `${baseUrl}oauth2/authorization/google`
  }

  const logoSrc = computed(() => {
    switch (userSettingsStore.selectedColor) {
      case '#bc1922':
        return '/logo_red.png'
      case '#28abf2':
        return '/logo_blue.png'
      default:
        return '/logo_red.png'
    }
  })
</script>

<style scoped lang="scss">
  .auth-page {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }

  .auth-container {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    padding: 40px;
    width: 100%;
    max-width: 450px;
    backdrop-filter: blur(10px);
  }

  .auth-header {
    text-align: center;
    margin-bottom: 40px;

    .logo {
      width: 85px;
      height: 85px;
      margin-bottom: $spacing-md;
      filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 1));
    }

    h1 {
      color: white;
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 8px;
    }

    p {
      color: rgba(255, 255, 255, 0.6);
      font-size: 14px;
    }
  }

  .auth-form {
    margin-bottom: 24px;
  }

  .error-message {
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
    color: #fca5a5;
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 14px;
    margin-bottom: 20px;
  }

  .form-group {
    margin-bottom: 20px;

    label {
      display: block;
      color: white;
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 8px;
    }

    input {
      width: 100%;
      padding: 12px 16px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      color: white;
      font-size: 15px;
      transition: all 0.3s ease;

      &::placeholder {
        color: rgba(255, 255, 255, 0.3);
      }

      &:focus {
        outline: none;
        border-color: #4ade80;
        background: rgba(255, 255, 255, 0.08);
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  }

  .divider {
    position: relative;
    text-align: center;
    margin: 24px 0;

    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background: rgba(255, 255, 255, 0.1);
    }

    span {
      position: relative;
      display: inline-block;
      padding: 0 16px;
      background: rgba(255, 255, 255, 0.05);
      color: rgba(255, 255, 255, 0.6);
      font-size: 13px;
      font-weight: 500;
    }
  }

  .google-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 12px 24px;
    background: white;
    color: #1f2937;
    border: none;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-bottom: 24px;

    svg {
      flex-shrink: 0;
    }

    &:hover:not(:disabled) {
      background: #f3f4f6;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .auth-footer {
    text-align: center;
    padding-top: 24px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);

    p {
      color: rgba(255, 255, 255, 0.6);
      font-size: 14px;

      a {
        color: #4ade80;
        text-decoration: none;
        font-weight: 600;
        transition: color 0.3s ease;

        &:hover {
          color: #22c55e;
        }
      }
    }
  }
</style>
