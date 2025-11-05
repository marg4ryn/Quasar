<template>
  <div class="collapsible-group">
    <CollapsibleBox
      v-for="(item, index) in items"
      :key="index"
      :label="item.label"
      :is-collapsed="openIndex !== index"
      @toggle="toggleBox(index)"
    >
      <slot :name="item.slotName"></slot>
    </CollapsibleBox>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import CollapsibleBox from '@/components/settings/CollapsibleBox.vue'

  defineOptions({ name: 'CollapsibleGroup' })

  defineProps<{
    items: { label: string; slotName: string }[]
  }>()

  const openIndex = ref(0)

  const toggleBox = (index: number) => {
    openIndex.value = openIndex.value === index ? -1 : index
  }
</script>

<style scoped>
  .collapsible-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    min-width: 800px;
  }
</style>
