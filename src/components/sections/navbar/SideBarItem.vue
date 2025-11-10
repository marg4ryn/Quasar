<template>
  <div class="sidebar-item-wrapper">
    <component
      :is="to ? RouterLink : 'div'"
      class="sidebar-item"
      :class="{ 'sidebar-item--active': isActive, 'sidebar-item--expanded': isExpanded }"
      v-bind="to ? { to } : {}"
      @click="handleClick"
    >
      <img v-if="icon" :src="icon" class="sidebar-item__icon" alt="" />
      <span class="sidebar-item__text">{{ label }}</span>
      <svg
        v-if="submenu && submenu.length"
        class="sidebar-item__arrow"
        :class="{ 'sidebar-item__arrow--open': isExpanded }"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      </svg>
    </component>

    <Transition name="submenu-slide">
      <ul v-show="isExpanded && submenu && submenu.length" class="sidebar-submenu">
        <li v-for="item in submenu" :key="item.label">
          <RouterLink :to="item.to" @click="$emit('navigate')" class="sidebar-submenu__link">
            {{ item.label }}
          </RouterLink>
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
  }

  const props = defineProps<{
    label: string
    icon?: string
    to?: string
    submenu?: SubmenuItem[]
  }>()

  const emit = defineEmits<{
    navigate: []
  }>()

  const route = useRoute()
  const isExpanded = ref(false)

  const isActive = computed(() => {
    if (props.to && route.path === props.to) return true
    if (props.submenu?.some((item) => route.path === item.to)) return true
    return false
  })

  const handleClick = () => {
    if (props.submenu && props.submenu.length) {
      isExpanded.value = !isExpanded.value
    } else if (props.to) {
      emit('navigate')
    }
  }
</script>

<style lang="scss" scoped>
  .sidebar-item-wrapper {
    width: 100%;
    margin-bottom: $spacing-xs;
  }

  .sidebar-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    border-radius: 10px;
    cursor: pointer;
    color: var(--color-text-primary);
    text-decoration: none;
    font-size: 16px;
    width: 100%;
    transition: all 0.2s ease;
    background: transparent;

    &:hover {
      background: linear-gradient(
        to right,
        color-mix(in srgb, var(--color-primary) 20%, transparent) 0%,
        transparent 30%,
        transparent 70%,
        color-mix(in srgb, var(--color-primary) 20%, transparent) 100%
      );
    }

    &:active {
      transform: scale(0.98);
    }

    &__icon {
      width: 22px;
      height: 22px;
      object-fit: contain;
      flex-shrink: 0;
    }

    &__text {
      flex: 1;
      text-align: left;
    }

    &__arrow {
      flex-shrink: 0;
      transition: transform 0.3s ease;
      color: var(--color-text-secondary);

      &--open {
        transform: rotate(180deg);
      }
    }

    &--active {
      font-weight: 600;
      background: linear-gradient(
        to right,
        color-mix(in srgb, var(--color-primary) 20%, transparent) 0%,
        transparent 30%,
        transparent 70%,
        color-mix(in srgb, var(--color-primary) 20%, transparent) 100%
      );
      position: relative;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 70%;
        background-color: var(--color-primary);
        border-radius: 0 2px 2px 0;
      }
    }
  }

  .sidebar-submenu {
    list-style: none;
    margin: 0;
    padding: 4px 0 8px 0;
    overflow: hidden;

    li {
      margin: 0;
      padding: 0;
    }

    &__link {
      display: block;
      padding: 10px 16px 10px 50px;
      color: var(--color-text-primary);
      text-decoration: none;
      font-size: 15px;
      border-radius: 8px;
      transition: all 0.2s ease;
      position: relative;

      &:hover {
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

        &::before {
          content: '';
          position: absolute;
          left: 30px;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 60%;
          background-color: var(--color-primary);
          border-radius: 1.5px;
        }
      }
    }
  }

  .submenu-slide-enter-active,
  .submenu-slide-leave-active {
    transition: all 0.3s ease;
  }

  .submenu-slide-enter-from,
  .submenu-slide-leave-to {
    opacity: 0;
    max-height: 0;
  }

  .submenu-slide-enter-to,
  .submenu-slide-leave-from {
    opacity: 1;
    max-height: 500px;
  }
</style>
