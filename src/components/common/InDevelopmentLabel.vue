<template>
  <div class="info-label">
    <p>{{ t('common.inDevelopmentLabel') }}</p>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n()
</script>

<style lang="scss" scoped>
  .info-label {
    @include flex-center;
    font-weight: 300;
    font-size: 22px;
    width: 100%;
    height: 100%;
  }
</style>
