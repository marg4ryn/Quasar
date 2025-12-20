<template>
  <AppButtonClose />
  <div class="page-container">
    <h1 class="page-header">{{ t('settingsPage.header') }}</h1>
    <div class="content">
      <div class="collapsible-group">
        <CollapsibleBox
          v-for="(item, index) in items"
          :key="index"
          :label="item.label"
          :is-collapsed="openIndex !== index"
          @toggle="toggleBox(index)"
        >
          <template v-if="index === 0">
            <SectionHeader :label="t('settingsPage.appearance.gradient')" />
            <RadioButtonGroup
              v-model="useUserSettingsStore().isGradientOn"
              name="gradient"
              :options="gradient"
            />
            <SectionHeader :label="t('settingsPage.appearance.language')" />
            <AppDropdownSelect
              id="language-select"
              :options="languages"
              v-model="useUserSettingsStore().selectedLanguage"
            />
          </template>

          <template v-else>
            <p>{{ t('common.inDevelopmentLabel') }}</p>
          </template>
        </CollapsibleBox>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useUserSettingsStore } from '@/stores/userSettingsStore'
  import { useI18n } from 'vue-i18n'

  import AppButtonClose from '@/components/common/AppButtonClose.vue'
  import CollapsibleBox from '@/components/settings/CollapsibleBox.vue'
  import RadioButtonGroup from '@/components/settings/RadioButtonGroup.vue'
  import SectionHeader from '@/components/settings/SectionHeader.vue'
  import AppDropdownSelect from '@/components/common/AppDropdownSelect.vue'

  const { t } = useI18n()

  const items = [
    { label: 'settingsPage.appearance.header', slotName: 'first' },
    { label: 'settingsPage.analysis-preferences.header', slotName: 'second' },
    { label: 'settingsPage.notifications.header', slotName: 'third' },
  ]

  const openIndex = ref(0)

  const toggleBox = (index: number) => {
    openIndex.value = openIndex.value === index ? -1 : index
  }

  const languages = [
    { label: 'settingsPage.appearance.systemDefault', value: 'system' },
    { label: 'settingsPage.appearance.english', value: 'en' },
    { label: 'settingsPage.appearance.polish', value: 'pl' },
  ]

  const colors = [
    { label: 'settingsPage.appearance.red', value: '#bc1922' },
    { label: 'settingsPage.appearance.blue', value: '#28abf2' },
  ]

  const gradient = [
    { label: 'settingsPage.appearance.on', value: 'on' },
    { label: 'settingsPage.appearance.off', value: 'off' },
  ]
</script>

<style scoped lang="scss">
  .page-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
    flex: 1;
    animation: slideInFromTop 0.6s ease-out;
  }

  .page-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 1.8em;
    font-weight: 400;
    color: var(--color-text-primary);
    margin: 8px;
    text-align: center;
    flex: 0 1 auto;
    min-height: 50px;
    height: 150px;
  }

  .content {
    margin: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    flex: 1 1 auto;
    overflow-y: auto;
  }

  .collapsible-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  @keyframes slideInFromTop {
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
