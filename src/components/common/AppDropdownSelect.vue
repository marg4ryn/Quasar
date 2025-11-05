<template>
  <div class="dropdown-select-container">
    <div class="custom-select-wrapper">
      <select :id="id" :value="modelValue" @change="handleChange" class="dropdown-select">
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>

      <span class="select-arrow">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface SelectOption {
    label: string
    value: string
  }

  defineOptions({ name: 'DropdownSelect' })

  defineProps<{
    label?: string
    id: string
    options: SelectOption[]
    modelValue: string
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
  }>()

  function handleChange(event: Event) {
    const target = event.target as HTMLSelectElement
    emit('update:modelValue', target.value)
  }
</script>

<style lang="scss" scoped>
  .dropdown-select-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin-bottom: 16px;

    .custom-select-wrapper {
      position: relative;
      display: inline-block;
      min-width: 200px;
    }

    .dropdown-select {
      width: 100%;
      padding: 10px 12px;
      padding-right: 40px;
      border: 1px solid var(--color-border);
      border-radius: 4px;
      background-color: var(--color-bg-primary);
      color: var(--color-text-primary);
      font-size: 1em;
      cursor: pointer;
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;

      &:focus {
        outline: none;
        border-color: var(--color-primary);
        box-shadow: 0 0 0 2px rgba(var(--color-primary), 0.5);
      }
    }

    .select-arrow {
      position: absolute;
      top: 50%;
      right: 12px;
      transform: translateY(-50%);
      pointer-events: none;
      color: var(--color-text-primary);

      svg {
        width: 20px;
        height: 20px;
      }
    }
  }
</style>
