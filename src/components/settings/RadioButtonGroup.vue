<template>
  <div class="radio-button-group">
    <div class="options-container">
      <label
        v-for="option in options"
        :key="option.value"
        :for="`${name}-${option.value}`"
        class="radio-option"
      >
        <input
          type="radio"
          :id="`${name}-${option.value}`"
          :name="name"
          :value="option.value"
          v-model="internalValue"
        />
        <span class="label-text">{{ option.label }}</span>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'

  interface RadioOption {
    label: string
    value: string
  }

  const props = defineProps<{
    name: string
    options: RadioOption[]
    modelValue?: string
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
  }>()

  const internalValue = ref(props.modelValue ?? '')

  watch(internalValue, (newVal) => {
    emit('update:modelValue', newVal)
  })

  watch(
    () => props.modelValue,
    (newVal) => {
      internalValue.value = newVal ?? ''
    }
  )
</script>

<style lang="scss" scoped>
  .radio-button-group {
    margin-bottom: 26px;

    .options-container {
      display: flex;
      gap: 20px;
    }

    .radio-option {
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 8px 12px;
      border-radius: 8px;
      transition: background-color 0.2s ease;
      width: 130px;

      &:hover {
        background-color: var(--color-button-secondary-hover, rgba(0, 0, 0, 0.05));
      }

      input[type='radio'] {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        border: 2px solid var(--color-text-primary);
        border-radius: 50%;
        width: 18px;
        height: 18px;
        margin-right: 8px;
        background-color: transparent;
        transition:
          border-color 0.2s ease,
          background-color 0.2s ease;
        position: relative;
        cursor: pointer;
        flex-shrink: 0;

        &:checked {
          border-color: var(--color-primary);

          &::before {
            content: '';
            display: block;
            width: 10px;
            height: 10px;
            background-color: var(--color-primary);
            border-radius: 50%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        }

        &:hover {
          border-color: var(--color-primary);
        }

        &:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(var(--color-primary), 0.5);
        }
      }

      .label-text {
        color: var(--color-text-primary);
        cursor: pointer;
        user-select: none;
      }
    }
  }
</style>
