<template>
  <Transition name="slide-fade">
    <div v-if="showPanel" ref="panelElement" class="user-panel">
      <div class="panel-header">
        <h3>{{ t('auth.title') }}</h3>
      </div>

      <div class="panel-content">
        <div v-if="authStore.isAuthenticated" class="user-info">
          <div class="user-avatar">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
              />
            </svg>
          </div>
          <div class="user-details">
            <h4 class="user-name">{{ authStore.user?.name || 'User' }}</h4>
            <p class="user-email">{{ authStore.user?.email }}</p>
          </div>
        </div>

        <div class="panel-actions">
          <RouterLink
            v-if="authStore.isAuthenticated"
            to="/analysis-history"
            class="panel-action-item"
            @click="closePanel"
          >
            <svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <span>{{ t('auth.analysisHistory') }}</span>
          </RouterLink>

          <button
            v-if="authStore.isAuthenticated"
            class="panel-action-item logout-btn"
            @click="handleLogout"
          >
            <svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span>{{ t('auth.logout') }}</span>
          </button>

          <div v-else class="auth-actions">
            <p class="auth-label">{{ t('auth.unlockMessage') }}</p>

            <AppButton :label="$t('auth.login')" variant="primary" @click="onLogin" />
            <AppButton :label="$t('auth.register')" variant="secondary" @click="onRegister" />
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useAuthStore } from '@/stores/authStore'
  import { useRouter } from 'vue-router'
  import AppButton from '@/components/common/AppButton.vue'

  const { t } = useI18n()
  const authStore = useAuthStore()
  const router = useRouter()

  const panelElement = ref<HTMLElement | null>(null)

  const showPanel = defineModel<boolean>('showPanel', { default: false })

  const closePanel = () => {
    showPanel.value = false
  }

  const handleLogout = async () => {
    await authStore.logoutUser()
    closePanel()
    router.push('/')
  }

  defineExpose({
    panelElement,
  })

  function onLogin() {
    closePanel()
    router.push('/login')
  }

  function onRegister() {
    closePanel()
    router.push('/register')
  }
</script>

<style lang="scss" scoped>
  .user-panel {
    position: absolute;
    top: 48px;
    right: -10px;
    width: 250px;
    max-height: 500px;
    background-color: var(--color-bg-secondary);
    color: var(--color-text-secondary);
    border: 1px solid var(--color-border);
    border-radius: $radius-lg;
    overflow: hidden;
    z-index: 2000;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
  }

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $spacing-md $spacing-lg;
    border-bottom: 1px solid var(--color-border);
    background-color: var(--color-bg-primary);
    height: 49px;

    h3 {
      font-size: $font-size-sm;
      font-weight: $font-weight-semibold;
      color: var(--color-text-primary);
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
  }

  .panel-content {
    max-height: 500px;
    overflow-y: auto;
  }

  .user-info {
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    border-bottom: 1px solid var(--color-border);
  }

  .user-avatar {
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, var(--color-primary), var(--color-primary-hover));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    svg {
      width: 32px;
      height: 32px;
      color: white;
    }
  }

  .user-details {
    flex: 1;
    min-width: 0;
  }

  .user-name {
    margin: 0 0 4px 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--color-text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .user-email {
    margin: 0;
    font-size: 13px;
    color: var(--color-text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .panel-actions {
    padding: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .panel-action-item {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    padding: 12px 16px;
    background: none;
    border: none;
    border-radius: 8px;
    color: var(--color-text-primary);
    font-size: 14px;
    cursor: pointer;
    text-decoration: none;
    transition: background-color 0.2s ease;

    &:hover {
      background: var(--color-bg-tertiary);
    }
  }

  .action-icon {
    width: 20px;
    height: 20px;
    color: var(--color-text-secondary);
    flex-shrink: 0;
  }

  .logout-btn {
    color: #ef4444;

    .action-icon {
      color: #ef4444;
    }

    &:hover {
      background: rgba(239, 68, 68, 0.1);
    }
  }

  .auth-actions {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    width: 100%;
    max-width: 270px;
    gap: 8px;
    padding: 12px;
  }

  .auth-label {
    font-size: 14px;
    color: var(--color-text-secondary);
    margin-bottom: 8px;
    line-height: 1.4;
    text-align: center;
  }

  .slide-fade-enter-active {
    transition: all 0.2s ease-out;
  }

  .slide-fade-leave-active {
    transition: all 0.15s ease-in;
  }

  .slide-fade-enter-from {
    transform: translateY(-10px);
    opacity: 0;
  }

  .slide-fade-leave-to {
    transform: translateY(-5px);
    opacity: 0;
  }
</style>
