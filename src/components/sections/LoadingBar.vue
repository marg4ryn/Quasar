<template>
  <Transition name="fade">
    <div v-if="show" class="loading-overlay">
      <div class="loading-content">
        <div class="spinner">
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
        </div>
        <p class="loading-label">{{ label || t('common.loading') }}</p>

        <AppButton
          v-if="showCancelButton && onCancel"
          :label="t('common.abort')"
          variant="danger"
          @click="showDialog = true"
        />
      </div>
    </div>
  </Transition>
  <ModalBox
    v-if="showDialog"
    :label="modalLabel || ''"
    :onConfirm="handleCancel"
    @close="showDialog = false"
  />
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import ModalBox from '@/components/modals/ModalBox.vue'
  import AppButton from '@/components/common/AppButton.vue'

  const { t } = useI18n()

  const showDialog = ref(false)

  const props = defineProps<{
    label?: string
    show: boolean
    onCancel?: () => void
    showCancelButton?: boolean
    modalLabel?: string
  }>()

  const handleCancel = () => {
    if (props.onCancel) {
      props.onCancel()
    }
  }
</script>

<style scoped lang="scss">
  .loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    z-index: 1000;
  }

  .loading-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  .spinner {
    position: relative;
    width: 80px;
    height: 80px;
  }

  .spinner-ring {
    position: absolute;
    width: 100%;
    height: 100%;
    border: 4px solid transparent;
    border-top-color: #0ea5e9;
    border-radius: 50%;
    animation: spin 1.5s cubic-bezier(0.5, 0, 0.5, 1) infinite;

    &:nth-child(1) {
      animation-delay: -0.45s;
      border-top-color: #bc1922;
    }

    &:nth-child(2) {
      animation-delay: -0.3s;
      border-top-color: #8b5cf6;
    }

    &:nth-child(3) {
      animation-delay: -0.15s;
      border-top-color: #28abf2;
    }
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .loading-label {
    font-size: 1.125rem;
    color: white;
    margin: 0;
    font-weight: 500;
    letter-spacing: 0.5px;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
