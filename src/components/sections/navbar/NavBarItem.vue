<template>
  <div class="nav-item-wrapper" @mouseenter="hover = true" @mouseleave="hover = false">
    <component
      :is="submenu && submenu.length && !to ? 'div' : RouterLink"
      class="nav-item"
      :class="{ 'nav-item--active': isActive }"
      v-bind="to ? { to } : {}"
      :tabindex="!to && submenu && submenu.length ? 0 : undefined"
    >
      <img v-if="icon" :src="icon" class="nav-item__icon" alt="" />
      <span class="nav-item__text">{{ label }}</span>
    </component>

    <Transition name="submenu-fade-slide">
      <ul v-show="submenu && submenu.length && hover" class="submenu">
        <li v-for="item in submenu" :key="item.label">
          <RouterLink :to="item.to" @click="hideSubmenu">{{ item.label }}</RouterLink>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { RouterLink, useRoute } from 'vue-router'

  interface SubmenuItem {
    label: string
    to: string
    active?: boolean
  }

  const props = defineProps<{
    label: string
    icon?: string
    to?: string
    active?: boolean
    submenu?: SubmenuItem[]
  }>()

  const route = useRoute()
  const hover = ref(false)

  const isActive = computed(() => {
    if (props.active) return true
    if (props.to && route.path === props.to) return true
    if (props.submenu?.some((item) => route.path === item.to)) return true
    return false
  })
  const hideSubmenu = () => {
    hover.value = false
  }
</script>

<style lang="scss" scoped>
  .nav-item-wrapper {
    position: relative;
    display: flex;
    align-items: flex-end;
    height: 100%;

    .nav-item {
      @include flex-center;
      gap: 10px;
      padding: 10px 20px;
      border-radius: 10px;
      cursor: pointer;
      position: relative;
      color: var(--color-text-primary);
      text-decoration: none;
      font-size: 16px;
      min-width: 210px;
      max-width: 250px;
      transition: font-weight 0.3s ease;

      &[is='div'],
      &[is='span'] {
        pointer-events: auto;
      }

      &:hover,
      &:focus {
        background: linear-gradient(
          to right,
          color-mix(in srgb, var(--color-primary) 20%, transparent) 0%,
          transparent 30%,
          transparent 70%,
          color-mix(in srgb, var(--color-primary) 20%, transparent) 100%
        );
      }

      &__icon {
        width: 20px;
        height: 20px;
        object-fit: contain;
      }

      &--active {
        font-weight: 600;

        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 6px;
          width: 94%;
          height: 3px;
          background-color: var(--color-primary);
          border-radius: 2px;
        }
      }
    }

    .submenu {
      position: absolute;
      top: 100%;
      left: 0;
      margin: 0;
      padding: 5px 0;
      list-style: none;
      background-color: var(--color-bg-secondary);
      border-radius: 8px;
      min-width: 210px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
      z-index: 100;
      overflow: hidden;

      li {
        padding: 4px 10px;

        a {
          color: var(--color-text-primary);
          text-decoration: none;
          display: block;
          padding: 4px 6px;
          border-radius: 6px;
          position: relative;
          transition:
            color 0.3s ease,
            font-weight 0.3s ease;

          &:hover,
          &:focus {
            background: linear-gradient(
              to right,
              color-mix(in srgb, var(--color-primary) 20%, transparent) 0%,
              transparent 30%,
              transparent 70%,
              color-mix(in srgb, var(--color-primary) 20%, transparent) 100%
            );
          }

          &.router-link-active,
          &.router-link-exact-active {
            font-weight: 600;
            color: var(--color-primary);
            &::after {
              content: '';
              position: absolute;
              right: 0;
              top: 50%;
              transform: translateY(-50%);
              width: 3px;
              height: 80%;
              background-color: var(--color-primary);
              border-radius: 1.5px;
            }
          }
        }
      }
    }

    .submenu-fade-slide-enter-active,
    .submenu-fade-slide-leave-active {
      transition:
        opacity 0.3s ease,
        transform 0.3s ease,
        max-height 0.3s ease;
    }

    .submenu-fade-slide-enter-from,
    .submenu-fade-slide-leave-to {
      opacity: 0;
      max-height: 0;
      transform: translateY(-10px);
    }

    .submenu-fade-slide-enter-to,
    .submenu-fade-slide-leave-from {
      opacity: 1;
      max-height: 200px;
      transform: translateY(0);
    }
  }
</style>
