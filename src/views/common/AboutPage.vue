<template>
  <AppButtonClose />
  <section class="about">
    <div class="header">
      <h2 class="project-name">
        <img src="/logo.svg" class="logo" />
        <span>uasar</span>
      </h2>
    </div>

    <div class="content">
      <div class="f">
        <h3 class="title">
          <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="18" cy="18" r="15.75" stroke="#60A5FA" stroke-width="1.125" fill="none" />
            <circle cx="18" cy="18" r="2.25" fill="#60A5FA" />
            <path d="M18 4.5 L20.25 15.75 L18 18 L15.75 15.75 Z" fill="#60A5FA" />
            <path d="M31.5 18 L20.25 20.25 L18 18 L20.25 15.75 Z" fill="#A78BFA" />
            <path d="M18 31.5 L15.75 20.25 L18 18 L20.25 20.25 Z" fill="#C084FC" />
            <path d="M4.5 18 L15.75 15.75 L18 18 L15.75 20.25 Z" fill="#8B5CF6" />
          </svg>
          {{ t('about.description.title1') }}
        </h3>
        <p class="text">{{ t('about.description.p1') }}</p>
      </div>

      <div class="about__section about__section--intro">
        <h3 class="about__section-title">
          <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="4.5" y="19.69" width="5.63" height="11.25" fill="#60A5FA" />
            <rect x="4.5" y="18.56" width="5.63" height="1.13" fill="#93C5FD" />
            <rect x="12.38" y="11.25" width="6.75" height="19.69" fill="#A78BFA" />
            <rect x="12.38" y="10.13" width="6.75" height="1.13" fill="#C4B5FD" />
            <rect x="21.38" y="15.75" width="4.5" height="15.19" fill="#8B5CF6" />
            <rect x="21.38" y="14.63" width="4.5" height="1.13" fill="#A78BFA" />
            <rect x="28.13" y="22.5" width="4.5" height="8.44" fill="#60A5FA" />
            <rect x="28.13" y="21.38" width="4.5" height="1.13" fill="#93C5FD" />
            <line x1="0" y1="30.94" x2="36" y2="30.94" stroke="#475569" stroke-width="1.125" />
          </svg>
          {{ t('about.description.title2') }}
        </h3>
        <p class="about__text">{{ t('about.description.p2') }}</p>
      </div>

      <div class="about__section about__section--intro">
        <h3 class="about__section-title">
          <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="18" cy="18" r="4.5" fill="#FCD34D">
              <animate attributeName="r" values="4.5;5.63;4.5" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="18" cy="18" r="7.88" fill="#FCD34D" opacity="0.4">
              <animate
                attributeName="r"
                values="7.88;10.13;7.88"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="18" cy="18" r="11.25" fill="#FCD34D" opacity="0.2">
              <animate
                attributeName="r"
                values="11.25;13.5;11.25"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            <path d="M18 2.25 L19.13 15.75 L18 18 L16.88 15.75 Z" fill="#FBBF24" />
            <path d="M33.75 18 L20.25 19.13 L18 18 L20.25 16.88 Z" fill="#FBBF24" />
            <path d="M18 33.75 L16.88 20.25 L18 18 L19.13 20.25 Z" fill="#FBBF24" />
            <path d="M2.25 18 L15.75 16.88 L18 18 L15.75 19.13 Z" fill="#FBBF24" />
          </svg>
          {{ t('about.description.title3') }}
        </h3>
        <p class="about__text">{{ t('about.description.p3') }}</p>
      </div>

      <div class="about__section about__section--intro">
        <h3 class="about__section-title">
          <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="18" cy="15" r="3.94" fill="#60A5FA" />
            <path
              d="M18 15.75 C13.5 15.75 11.25 18 11.25 21.38 L24.75 21.38 C24.75 18 22.5 15.75 18 15.75 Z"
              transform="translate(0,6)"
              fill="#60A5FA"
            />
            <circle cx="9" cy="17" r="2.81" fill="#A78BFA" />
            <path
              d="M9 16.88 C6.19 16.88 4.5 18.56 4.5 20.81 L13.5 20.81 C13.5 19.69 12.38 18 10.13 17.44 Z"
              transform="translate(0,6)"
              fill="#A78BFA"
            />
            <circle cx="27" cy="17" r="2.81" fill="#A78BFA" />
            <path
              d="M27 16.88 C29.81 16.88 31.5 18.56 31.5 20.81 L22.5 20.81 C22.5 19.69 23.63 18 25.88 17.44 Z"
              transform="translate(0,6)"
              fill="#A78BFA"
            />
          </svg>
          {{ t('about.description.title4') }}
        </h3>
        <p class="about__text">{{ t('about.description.p4') }}</p>
      </div>

      <div class="about__section about__section--intro">
        <h3 class="about__section-title">
          <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M24 39 C24 39 9 28.5 9 18 C9 13.5 12 10.5 15.75 10.5 C18.75 10.5 21.75 12.75 24 15 C26.25 12.75 29.25 10.5 32.25 10.5 C36 10.5 39 13.5 39 18 C39 28.5 24 39 24 39 Z"
              transform="scale(0.675) translate(6,3)"
              fill="#EC4899"
            />
            <path
              d="M21 21 L22.5 25.5 L27 25.5 L23.25 28.5 L24.75 33 L21 30 L17.25 33 L18.75 28.5 L15 25.5 L19.5 25.5 Z"
              transform="scale(0.675) translate(6,3)"
              fill="#FCD34D"
            />
            <circle cx="18" cy="14.63" r="1.5" fill="#FDE68A" />
            <circle cx="24" cy="17.06" r="1.13" fill="#FDE68A" />
            <circle cx="13" cy="17.06" r="1.13" fill="#FDE68A" />
          </svg>
          {{ t('about.description.title5') }}
        </h3>
        <p class="about__text">{{ t('about.description.p5') }}</p>
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
            <span class="about__tech-label">{{ t('about.technologies.backendLabel') }}:</span>
            {{ t('about.technologies.backend') }}
          </li>
          <li class="about__list-item about__list-item--tech">
            <span class="about__tech-label">{{ t('about.technologies.analysisLabel') }}:</span>
            {{ t('about.technologies.analysis') }}
          </li>
        </ul>
      </div>

      <div class="about__section about__section--team">
        <h3 class="about__section-title">
          <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="0.75"
              y="6"
              width="34.5"
              height="24"
              rx="1.5"
              stroke="#8b5cf6"
              stroke-width="1.5"
            />
            <circle cx="10.5" cy="16.5" r="2.25" fill="#60A5FA" />
            <path
              d="M10.5 19.5 L7.5 22.5 M10.5 19.5 L13.5 22.5"
              stroke="#60A5FA"
              stroke-width="1.5"
            />
            <rect x="18" y="15" width="13.5" height="2.25" rx="0.75" fill="#A78BFA" />
            <rect x="18" y="19.5" width="10.5" height="2.25" rx="0.75" fill="#A78BFA" />
          </svg>
          {{ t('about.team.title') }}
        </h3>
        <p class="about__supervisor">
          <span class="about__supervisor-label">{{ t('about.team.supervisorLabel') }}:</span>
          {{ t('about.team.supervisorDegree') }} {{ supervisor }}
        </p>
        <ul class="about__list about__list--team">
          <li
            v-for="(member, index) in teamMembers"
            :key="index"
            class="about__list-item about__list-item--member"
          >
            <a
              :href="member.link"
              target="_blank"
              rel="noopener noreferrer"
              class="about__member-link"
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <circle cx="16" cy="16" r="15" stroke="#8b5cf6" stroke-width="2" />
                <circle cx="16" cy="12" r="4" fill="#8b5cf6" />
                <path
                  d="M32 36 C20 36 12 42 12 52 C12 56 12 58 12 58 L52 58 C52 58 52 56 52 52 C52 42 44 36 32 36 Z"
                  transform="scale(0.4) translate(8,6)"
                  fill="#8b5cf6"
                />
              </svg>

              <span class="about__member-name">
                {{ member.name }}
              </span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { t } from '@/plugins/i18n'
  import AppButtonClose from '@/components/common/AppButtonClose.vue'

  const teamMembers = [
    { name: 'Wiktor Piekarski', link: 'https://github.com/Vixoner' },
    { name: 'Jan Powęski', link: 'https://github.com/marg4ryn' },
    { name: 'Michał Sosnowski', link: 'https://github.com/SosnowskiMichal' },
    { name: 'Michał Wąsiński', link: 'https://github.com/micwasi15' },
  ]
  const supervisor = 'Michał Szczepanik'
</script>

<style scoped lang="scss">
  .about {
    flex: 1;
    width: 100%;
    min-width: 0;
    padding: 3rem 0.5rem;
    overflow-y: auto;
    max-width: 900px;
    margin: 0 auto;
    animation: fadeInUp 0.6s ease-out;

    .header {
      text-align: center;
      margin-bottom: $spacing-3xl;
      padding-bottom: $spacing-2xl;
      border-bottom: 2px solid var(--color-border);
      position: relative;

      .project-name {
        font-size: $font-size-3xl;
        font-weight: $font-weight-semibold;
        color: var(--color-text-secondary);
        margin: 0;
        letter-spacing: 0.5px;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);

        .logo {
          width: 32px;
        }
      }

      &::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 50%;
        transform: translateX(-50%);
        width: 100px;
        height: 2px;
        background: linear-gradient(90deg, transparent, #fd98eb, transparent);
      }
    }

    .content {
      display: flex;
      flex-direction: column;
      gap: $spacing-3xl;

      .f {
        display: flex;
        flex-direction: column;
        background: var(--color-bg-primary);
        padding: $spacing-2xl;
        border-radius: $radius-lg;
        border: 1px solid var(--color-border);
        transition: all $transition-base;

        .title {
          font-size: $font-size-2xl;
          font-weight: $font-weight-semibold;
          color: var(--color-text-primary);
          margin: 0 0 $spacing-xl;
          display: flex;
          align-items: center;
          gap: $spacing-md;
        }

        .text {
          font-size: $font-size-base;
          line-height: $line-height-relaxed;
          color: var(--color-text-secondary);
          margin: 0 0 $spacing-lg;
          text-align: justify;

          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }

    &__section {
      background: var(--color-bg-primary);
      padding: $spacing-2xl;
      border-radius: $radius-lg;
      border: 1px solid var(--color-border);
      transition: all $transition-base;
      text-align: justify;
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

    &__icon2 {
      width: 28px;
      height: 28px;
      color: $color-success;
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
        background: var(--color-bg-secondary);
        border-radius: $radius-md;
        border-left: 3px solid $color-success;
        transition: all $transition-fast;
      }

      &--member {
        padding: $spacing-md;
        background: var(--color-bg-secondary);
        border-radius: $radius-md;
        border: 1px solid var(--color-border);
        transition: all $transition-fast;
        align-items: center;

        .about__member-link {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          gap: 12px;

          text-decoration: none;
          color: inherit;

          padding: 8px 12px;
          border-radius: 8px;

          transition:
            background-color 0.2s ease,
            transform 0.2s ease;

          &:focus-visible {
            outline: 2px solid #8b5cf6;
            outline-offset: 2px;
          }
        }

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
      color: $color-success;
      min-width: 120px;
    }

    &__member-icon {
      font-size: $font-size-xl;
      flex-shrink: 0;
    }

    &__supervisor {
      margin-bottom: $spacing-2xl;
      padding: $spacing-lg;
      background: var(--color-bg-secondary);
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
