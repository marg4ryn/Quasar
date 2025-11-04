<template>
  <div class="mesh-gradient" :style="gradientStyle"></div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'

  interface Props {
    primaryColor: string
    secondaryColor: string
  }

  const props = defineProps<Props>()

  const gradientStyle = computed(() => ({
    '--color1': props.primaryColor,
    '--color2': props.secondaryColor,
  }))
</script>

<style lang="scss" scoped>
  .mesh-gradient {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;

    background:
      radial-gradient(circle at 30% 30%, var(--color1), transparent 60%),
      radial-gradient(circle at 70% 70%, var(--color2), transparent 60%);
    background-blend-mode: screen;
    animation: moveMesh 2s ease-in-out infinite alternate;

    @keyframes moveMesh {
      0% {
        background-position:
          30% 30%,
          70% 70%;
      }
      100% {
        background-position:
          40% 60%,
          60% 40%;
      }
    }
  }
</style>
