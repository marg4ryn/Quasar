import { createApp } from 'vue'
import App from '@/App.vue'

import { pinia } from '@/plugins/pinia'
import { routerPlugin } from '@/plugins/router'
import { i18n } from '@/plugins/i18n'

import '@/styles/main.scss'

createApp(App).use(pinia).use(routerPlugin).use(i18n).mount('#app')
