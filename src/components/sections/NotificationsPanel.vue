<template>
  <transition name="fade">
    <div v-if="notificationsStore.showPanel" ref="panelElement" class="notifications-panel">
      <div class="notifications-panel__header">
        <span class="notifications-panel__header-text">{{ t('notifications.header') }}</span>
        <button
          v-if="notificationsStore.notifications.length"
          class="notifications-panel__clear-all"
          @click.stop="notificationsStore.clearAll"
        >
          {{ t('notifications.clearAll') }}
        </button>
      </div>

      <div class="notifications-list">
        <template v-if="notificationsStore.notifications.length">
          <div
            v-for="n in notificationsStore.notifications"
            :key="n.id"
            :class="['notification-item', `notification-item--${n.type}`]"
          >
            <div class="notification-item__header">
              <span class="notification-item__time">{{ n.time }}</span>
              <button
                class="notification-item__close"
                @click.stop="notificationsStore.removeNotification(n.id)"
                :aria-label="t('notifications.remove')"
              >
                ✕
              </button>
            </div>

            <div class="notification-item__content">
              <p class="notification-item__message">{{ n.message }}</p>

              <router-link
                v-if="n.screenRoute"
                :to="n.screenRoute"
                class="notification-item__link"
                @click="notificationsStore.closePanel()"
              >
                {{ t('notifications.viewDetails') }} →
              </router-link>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="no-notifications">
            <svg
              class="no-notifications__icon"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <p class="no-notifications__text">{{ t('notifications.noNotifications') }}</p>
          </div>
        </template>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useNotificationsStore } from '@/stores/notificationsStore'

  const { t } = useI18n()
  const notificationsStore = useNotificationsStore()

  const panelElement = ref<HTMLElement | null>(null)

  defineExpose({
    panelElement,
  })
</script>

<style lang="scss" scoped>
  .notifications-panel {
    position: absolute;
    top: 80px;
    right: 0;
    width: 350px;
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

    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: $spacing-md $spacing-lg;
      border-bottom: 1px solid var(--color-border);
      background-color: var(--color-bg-primary);
      height: 49px;
    }

    &__header-text {
      font-size: $font-size-sm;
      font-weight: $font-weight-semibold;
      color: var(--color-text-primary);
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    &__clear-all {
      background: none;
      border: none;
      color: var(--color-primary);
      cursor: pointer;
      font-size: $font-size-xs;
      font-weight: $font-weight-medium;
      padding: $spacing-xs $spacing-sm;
      border-radius: $radius-sm;
      transition: all $transition-fast;

      &:hover {
        transform: scale(1.05);
      }

      &:active {
        transform: scale(0.95);
      }
    }
  }

  .notifications-list {
    overflow-y: auto;
    flex: 1;
    padding: $spacing-xs;
    @include scrollbar;
  }

  .notification-item {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
    padding: $spacing-md;
    margin-bottom: $spacing-xs;
    border-radius: $radius-md;
    background-color: var(--color-bg-secondary);
    border-left: 3px solid transparent;
    transition: all $transition-fast;

    &:last-child {
      margin-bottom: 0;
    }

    &:hover {
      background-color: var(--color-bg-tertiary);
      transform: translateX(2px);
    }

    &--success {
      border-left-color: $color-success;

      .notification-item__message {
        color: var(--color-text-primary);
      }
    }

    &--error {
      border-left-color: $color-error;

      .notification-item__message {
        color: $color-error-text;
      }
    }

    &--info {
      border-left-color: $color-info;

      .notification-item__message {
        color: var(--color-text-secondary);
      }
    }

    &--warning {
      border-left-color: $color-warning;

      .notification-item__message {
        color: $color-warning-text;
      }
    }

    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    &__time {
      color: var(--color-text-tertiary);
      font-size: $font-size-xs;
      font-weight: $font-weight-medium;
    }

    &__close {
      background: none;
      border: none;
      color: var(--color-text-tertiary);
      cursor: pointer;
      font-size: $font-size-lg;
      padding: 0;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: $radius-sm;
      transition: all $transition-fast;

      &:hover {
        color: var(--color-text-primary);
        background-color: rgba(255, 255, 255, 0.1);
      }
    }

    &__content {
      display: flex;
      flex-direction: column;
      gap: $spacing-sm;
    }

    &__message {
      color: var(--color-text-secondary);
      font-size: $font-size-sm;
      line-height: $line-height-normal;
      margin: 0;
      word-break: break-word;
    }

    &__link {
      align-self: flex-start;
      color: var(--color-primary);
      text-decoration: none;
      font-size: $font-size-xs;
      font-weight: $font-weight-medium;
      padding: $spacing-xs $spacing-sm;
      border-radius: $radius-sm;
      transition: all $transition-fast;
      display: inline-flex;
      align-items: center;
      gap: $spacing-xs;

      &:hover {
        background-color: rgba(var(--color-primary-rgb), 0.1);
        transform: translateX(2px);
      }
    }
  }

  .no-notifications {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: $spacing-2xl;
    text-align: center;
    gap: $spacing-md;

    &__icon {
      color: var(--color-text-tertiary);
      opacity: 0.5;
    }

    &__text {
      color: var(--color-text-tertiary);
      font-size: $font-size-sm;
      font-style: italic;
      margin: 0;
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition:
      opacity $transition-base,
      transform $transition-base;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
    transform: translateY(-10px);
  }

  @include respond-to-sm {
    .notifications-panel {
      width: 100%;
      max-width: 100vw;
      right: 0;
      left: 0;
      border-radius: 0;
      max-height: 70vh;
    }
  }
</style>
