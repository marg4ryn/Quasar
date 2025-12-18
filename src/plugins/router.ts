import type { App, Plugin } from 'vue'
import createRouter from '@/router'

export const routerPlugin: Plugin = {
  install(app: App) {
    const router = createRouter()
    app.use(router)
  },
}
