<template>
  <AppButtonClose />
  <AppPageHeader :label="t('settingsPage.header')" />
  <div class="content">
    <CollapsibleGroup
      :items="[
        { label: t('settingsPage.appearance'), slotName: 'first' },
        { label: t('settingsPage.mappings'), slotName: 'second' },
        { label: t('settingsPage.performance'), slotName: 'third' },
        { label: t('settingsPage.notifications'), slotName: 'fourth' },
      ]"
    >
      <template #first>
        <SectionHeader :label="t('settingsPage.mainColor')" />
        <RadioButtonGroup
          v-model="useUserSettingsStore().selectedColor"
          name="color"
          :options="colors"
        />
        <SectionHeader :label="t('settingsPage.theme')" />
        <RadioButtonGroup
          v-model="useUserSettingsStore().selectedTheme"
          name="theme"
          :options="themes"
        />
        <SectionHeader :label="t('settingsPage.language')" />
        <AppDropdownSelect
          id="language-select"
          :options="languages"
          v-model="useUserSettingsStore().selectedLanguage"
        />
      </template>

      <template #second>
        <p>{{ t('common.inDevelopmentLabel') }}</p>
      </template>

      <template #third>
        <p>{{ t('common.inDevelopmentLabel') }}</p>
      </template>

      <template #fourth>
        <p>{{ t('common.inDevelopmentLabel') }}</p>
      </template>
    </CollapsibleGroup>
  </div>
</template>

<script setup lang="ts">
  import { useUserSettingsStore } from '@/stores/userSettingsStore'
  import { useI18n } from 'vue-i18n'

  import AppButtonClose from '@/components/common/AppButtonClose.vue'
  import AppPageHeader from '@/components/common/AppPageHeader.vue'
  import CollapsibleGroup from '@/components/settings/CollapsibleGroup.vue'
  import RadioButtonGroup from '@/components/settings/RadioButtonGroup.vue'
  import SectionHeader from '@/components/settings/SectionHeader.vue'
  import AppDropdownSelect from '@/components/common/AppDropdownSelect.vue'

  const { t } = useI18n()

  const languages = [
    { label: t('settingsPage.systemDefault'), value: 'system' },
    { label: 'English', value: 'en' },
    { label: 'Polski', value: 'pl' },
  ]

  const colors = [
    { label: t('settingsPage.red'), value: '#bc1922' },
    { label: t('settingsPage.blue'), value: '#28abf2' },
  ]
  const themes = [
    { label: t('settingsPage.dark'), value: 'dark' },
    { label: t('settingsPage.light'), value: 'light' },
    { label: t('settingsPage.system'), value: 'system' },
  ]
</script>

<style scoped>
  .content {
    margin: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    animation: fadeInUp 0.6s ease-out;
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
