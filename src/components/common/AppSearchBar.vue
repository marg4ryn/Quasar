<template>
  <div :class="['search-bar', type]">
    <input v-model="searchQuery" type="text" :placeholder="placeholder" class="search-input" />
    <button v-if="searchQuery" class="clear-button" @click="clear" type="button">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
    <span v-else class="search-icon">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2" />
        <path d="M12.5 12.5L17 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      </svg>
    </span>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue'

  const props = withDefaults(
    defineProps<{
      placeholder?: string
      type?: 'normal' | 'mini'
      items?: any[]
    }>(),
    {
      placeholder: 'Search...',
      type: 'normal',
      items: () => [],
    }
  )

  const emit = defineEmits<{
    (e: 'filtered', items: any[]): void
  }>()

  const searchQuery = ref('')

  const filteredItems = computed(() => {
    if (!searchQuery.value || !props.items.length) {
      return props.items
    }

    const query = searchQuery.value.toLowerCase()
    return props.items.filter((item) => item.name?.toLowerCase().includes(query))
  })

  watch(
    filteredItems,
    (newFilteredItems) => {
      emit('filtered', newFilteredItems)
    },
    { immediate: true }
  )

  function clear() {
    searchQuery.value = ''
  }
</script>

<style scoped lang="scss">
  .search-bar {
    @include input-base;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 24px;
    height: 48px;

    &.normal {
      width: 400px;
    }

    &.mini {
      width: 100%;
      font-size: 0.85rem;
    }

    .search-input {
      width: 100%;
      padding: 0.5rem 1rem;
      background: transparent;
      border: 0;
      border-radius: 24px;
      color: var(--color-text-secondary);
      font-size: 0.95rem;
      transition: all 0.3s ease;

      &::placeholder {
        color: var(--color-text-muted);
      }

      &:focus {
        outline: none;
      }
    }

    .search-icon {
      padding: 0 0.8rem;
      background: transparent;
      border: 0;
      border-radius: 50%;
      color: var(--color-icon);
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: default;
    }

    .clear-button {
      padding: 0 0.8rem;
      background: transparent;
      border: 0;
      border-radius: 50%;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: var(--color-button);
      font-size: 1.2rem;

      &:hover {
        color: var(--color-button-hover);
      }

      &:focus {
        color: var(--color-primary);
        outline: none;
      }
    }
  }
</style>
