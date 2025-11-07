<template>
  <footer class="footer">
    <div class="footer-left">2025 HotSpotter</div>

    <div class="footer-right">
      <RouterLink to="/about" class="footer-btn" :aria-label="t('footer.aria.about')">
        {{ t('footer.about') }}
      </RouterLink>
    </div>
  </footer>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { RouterLink } from 'vue-router'

  const { t } = useI18n()
</script>

<style lang="scss" scoped>
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 30px;
    min-width: 1100px;
    padding: $spacing-md $spacing-xl;
    background-color: var(--color-bg-secondary);
    color: var(--color-text-secondary);
    font-size: $font-size-sm;
    font-weight: $font-weight-light;
    border-top: 1px solid var(--color-border);
  }

  .footer-right {
    @include flex-row(10px);
  }

  .footer-btn {
    color: var(--color-text-secondary);
    text-decoration: none;
    transition:
      color $transition-base,
      transform $transition-base;

    &:hover {
      color: var(--color-primary);
      transform: scale(1.1);
    }

    &.router-link-active {
      color: var(--color-primary);
      font-weight: $font-weight-normal;
    }
  }
</style>
