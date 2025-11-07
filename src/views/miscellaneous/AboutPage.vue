<template>
  <AppButtonClose />
  <section class="about">
    <div class="about__container">
      <div class="about__header">
        <h2 class="about__project-name">
          <span class="about__project-name appname">Hot</span>
          <span>Spotter</span>
        </h2>
      </div>

      <div class="about__content">
        <div class="about__section about__section--intro">
          <h3 class="about__section-title">
            <svg class="about__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            {{ t('about.description.title') }}
          </h3>
          <p class="about__text">{{ t('about.description.p1') }}</p>
          <p class="about__text">{{ t('about.description.p2') }}</p>
          <p class="about__text">{{ t('about.description.p3') }}</p>
        </div>

        <div class="about__section">
          <h3 class="about__section-title">
            <svg class="about__icon2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
            {{ t('about.technologies.title') }}
          </h3>
          <ul class="about__list about__list--tech">
            <li class="about__list-item about__list-item--tech">
              <span class="about__tech-label">{{ t('about.technologies.backendLabel') }}:</span>
              {{ t('about.technologies.backend') }}
            </li>
            <li class="about__list-item about__list-item--tech">
              <span class="about__tech-label">{{ t('about.technologies.frontendLabel') }}:</span>
              {{ t('about.technologies.frontend') }}
            </li>
            <li class="about__list-item about__list-item--tech">
              <span class="about__tech-label"
                >{{ t('about.technologies.visualizationsLabel') }}:</span
              >
              {{ t('about.technologies.visualizations') }}
            </li>
            <li class="about__list-item about__list-item--tech">
              <span class="about__tech-label">{{ t('about.technologies.analysisLabel') }}:</span>
              {{ t('about.technologies.analysis') }}
            </li>
            <li class="about__list-item about__list-item--tech">
              <span class="about__tech-label">{{ t('about.technologies.hostingLabel') }}:</span>
              {{ t('about.technologies.hosting') }}
            </li>
          </ul>
        </div>

        <div class="about__section about__section--team">
          <h3 class="about__section-title">
            <svg class="about__icon3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {{ t('about.team.title') }}
          </h3>
          <ul class="about__list about__list--team">
            <li
              v-for="(member, index) in teamMembers"
              :key="index"
              class="about__list-item about__list-item--member"
            >
              <span class="about__member-icon">👤</span>
              {{ member }}
            </li>
          </ul>
          <p class="about__supervisor">
            <span class="about__supervisor-label">{{ t('about.team.supervisorLabel') }}:</span>
            {{ t('about.team.supervisorDegree') }} {{ supervisor }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import AppButtonClose from '@/components/common/AppButtonClose.vue'
  const { t } = useI18n()

  const teamMembers = ['Wiktor Piekarski', 'Jan Powęski', 'Michał Sosnowski', 'Michał Wąsiński']
  const supervisor = 'Michał Szczepanik'
</script>

<style scoped lang="scss">
  .about {
    flex: 1;
    width: 100%;
    padding: $spacing-2xl $spacing-xl;
    overflow-y: auto;

    &__container {
      max-width: 900px;
      margin: 0 auto;
      animation: fadeInUp 0.6s ease-out;
    }

    &__header {
      text-align: center;
      margin-bottom: $spacing-3xl;
      padding-bottom: $spacing-2xl;
      border-bottom: 2px solid var(--color-border);
      position: relative;

      &::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 50%;
        transform: translateX(-50%);
        width: 100px;
        height: 2px;
        background: linear-gradient(90deg, transparent, var(--color-primary), transparent);
      }
    }

    &__title {
      font-size: $font-size-3xl;
      font-weight: $font-weight-bold;
      color: var(--color-text-primary);
      margin: 0 0 $spacing-md;
      background: var(--color-primary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    &__project-name {
      font-size: $font-size-3xl;
      font-weight: $font-weight-semibold;
      color: var(--color-text-secondary);
      margin: 0;
      letter-spacing: 0.5px;

      &.appname {
        color: var(--color-primary);
      }
    }

    &__content {
      display: flex;
      flex-direction: column;
      gap: $spacing-3xl;
    }

    &__section {
      background: var(--color-bg-secondary);
      padding: $spacing-2xl;
      border-radius: $radius-lg;
      border: 1px solid var(--color-border);
      transition: all $transition-base;

      &:hover {
        border-color: rgba(var(--color-primary-rgb), 0.3);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        transform: translateY(-2px);
      }

      &--intro {
        text-align: justify;
      }
    }

    &__section-title {
      font-size: $font-size-2xl;
      font-weight: $font-weight-semibold;
      color: var(--color-text-primary);
      margin: 0 0 $spacing-xl;
      display: flex;
      align-items: center;
      gap: $spacing-md;
    }

    &__icon {
      width: 28px;
      height: 28px;
      color: var(--color-primary);
      flex-shrink: 0;
    }

    &__icon2 {
      width: 28px;
      height: 28px;
      color: var(--color-success);
      flex-shrink: 0;
    }

    &__icon3 {
      width: 28px;
      height: 28px;
      color: #8b5cf6;
      flex-shrink: 0;
    }

    &__text {
      font-size: $font-size-base;
      line-height: $line-height-relaxed;
      color: var(--color-text-secondary);
      margin: 0 0 $spacing-lg;

      &:last-child {
        margin-bottom: 0;
      }
    }

    &__list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: $spacing-md;

      &--tech {
        gap: $spacing-lg;
      }

      &--team {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: $spacing-lg;
      }
    }

    &__list-item {
      font-size: $font-size-base;
      color: var(--color-text-secondary);
      line-height: $line-height-normal;
      display: flex;
      align-items: flex-start;
      gap: $spacing-md;
      padding: $spacing-sm 0;

      &--tech {
        padding: $spacing-md;
        background: var(--color-bg-primary);
        border-radius: $radius-md;
        border-left: 3px solid var(--color-success);
        transition: all $transition-fast;

        &:hover {
          background: var(--color-bg-tertiary);
          transform: translateX(4px);
        }
      }

      &--member {
        padding: $spacing-md;
        background: var(--color-bg-primary);
        border-radius: $radius-md;
        border: 1px solid var(--color-border);
        transition: all $transition-fast;

        &:hover {
          border-color: #8b5cf6;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);
          transform: scale(1.02);
        }
      }
    }

    &__bullet {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--color-primary);
      flex-shrink: 0;
      margin-top: 6px;
    }

    &__tech-label {
      font-weight: $font-weight-semibold;
      color: var(--color-success);
      min-width: 120px;
    }

    &__member-icon {
      font-size: $font-size-xl;
      flex-shrink: 0;
    }

    &__supervisor {
      margin-top: $spacing-2xl;
      padding: $spacing-lg;
      background: var(--color-bg-primary);
      border-radius: $radius-md;
      border: 2px solid #8b5cf6;
      font-size: $font-size-base;
      color: var(--color-text-secondary);
      text-align: center;
    }

    &__supervisor-label {
      font-weight: $font-weight-semibold;
      color: #8b5cf6;
    }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
