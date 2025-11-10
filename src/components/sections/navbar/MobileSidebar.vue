<template>
  <div>
    <button
      class="burger-button"
      :class="{ 'burger-button--open': isOpen }"
      @click="toggleSidebar"
      aria-label="Toggle menu"
    >
      <span class="burger-line"></span>
      <span class="burger-line"></span>
      <span class="burger-line"></span>
    </button>

    <Transition name="sidebar">
      <aside v-show="isOpen" class="mobile-sidebar">
        <div class="sidebar-content">
          <SidebarItem
            v-for="item in items"
            :key="item.label"
            :label="item.label"
            :icon="item.icon"
            :to="item.to"
            :submenu="item.submenu"
            @navigate="handleNavigate"
          />
        </div>
      </aside>
    </Transition>

    <Transition name="overlay">
      <div v-show="isOpen" class="overlay" @click="closeSidebar"></div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import SidebarItem from '@/components/sections/navbar/SideBarItem.vue'

  interface SubmenuItem {
    label: string
    to: string
  }

  interface NavItem {
    label: string
    icon?: string
    to?: string
    submenu?: SubmenuItem[]
  }

  defineProps<{
    items: NavItem[]
  }>()

  const isOpen = ref(false)

  const toggleSidebar = () => {
    isOpen.value = !isOpen.value
  }

  const closeSidebar = () => {
    isOpen.value = false
  }

  const handleNavigate = () => {
    closeSidebar()
  }
</script>

<style scoped lang="scss">
  .burger-button {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 30px;
    height: 25px;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    z-index: 1001;
    position: relative;
    color: var(--color-text-primary);

    &:hover {
      color: var(--color-primary);
    }

    &:focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: 4px;
      border-radius: 4px;
    }

    .burger-line {
      width: 30px;
      height: 3px;
      background-color: currentColor;
      border-radius: 2px;
      transition: all 0.3s ease;
      transform-origin: center;
    }

    &--open {
      .burger-line:nth-child(1) {
        transform: translateY(8px) rotate(45deg);
      }

      .burger-line:nth-child(2) {
        opacity: 0;
      }

      .burger-line:nth-child(3) {
        transform: translateY(-8px) rotate(-45deg);
      }
    }
  }

  .mobile-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: 320px;
    height: 100vh;
    background-color: var(--color-bg-primary);
    box-shadow: 2px 0 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    border-right: 1px solid var(--color-border);

    .sidebar-content {
      padding: 150px $spacing-lg $spacing-lg $spacing-lg;
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;

      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-track {
        background: transparent;
      }

      &::-webkit-scrollbar-thumb {
        background: color-mix(in srgb, var(--color-text-primary) 20%, transparent);
        border-radius: 3px;

        &:hover {
          background: color-mix(in srgb, var(--color-text-primary) 30%, transparent);
        }
      }
    }
  }

  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
    backdrop-filter: blur(2px);
  }

  .sidebar-enter-active,
  .sidebar-leave-active {
    transition: transform 0.3s ease;
  }

  .sidebar-enter-from,
  .sidebar-leave-to {
    transform: translateX(-100%);
  }

  .overlay-enter-active,
  .overlay-leave-active {
    transition: opacity 0.3s ease;
  }

  .overlay-enter-from,
  .overlay-leave-to {
    opacity: 0;
  }

  @media (max-width: 768px) {
    .mobile-sidebar {
      width: 280px;

      .sidebar-content {
        padding: 70px $spacing-md $spacing-md $spacing-md;
      }
    }
  }
</style>
