<template>
  <div class="dialog-overlay" @click.self="emitClose">
    <div class="dialog-box">
      <h2 class="subtitle">{{ label }}</h2>

      <div class="button-group">
        <AppButton :label="t('common.cancel')" variant="secondary" @click="emitClose" />
        <AppButton :label="t('common.confirm')" variant="danger" @click="handleConfirm" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import AppButton from '@/components/common/AppButton.vue'

  const { t } = useI18n()

  const props = defineProps<{
    label: string
    onConfirm: () => void
  }>()

  const emit = defineEmits(['close'])

  const emitClose = () => emit('close')

  const handleConfirm = () => {
    props.onConfirm()
    emitClose()
  }
</script>

<style scoped lang="scss">
  .dialog-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .dialog-box {
    background: var(--color-bg-secondary);
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    width: 420px;
    text-align: center;

    .subtitle {
      font-size: $font-size-xl;
      font-weight: $font-weight-normal;
      color: var(--color-text-priamry);
      margin-top: 0.75rem;
      margin-bottom: 1.5rem;
      line-height: $line-height-normal;
    }

    .button-group {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-top: 1.5rem;
    }
  }
</style>
