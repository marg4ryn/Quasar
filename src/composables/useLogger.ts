export function useLogger(moduleName?: string) {
  const isDev = import.meta.env.DEV
  const isDebug = import.meta.env.VITE_DEBUG === 'true'

  const prefix = moduleName ? `[${moduleName}]` : '[App]'

  function info(...args: any[]) {
    if (isDev || isDebug) console.log(prefix, ...args)
  }

  function warn(...args: any[]) {
    if (isDev || isDebug) console.warn(prefix, ...args)
  }

  function error(...args: any[]) {
    console.error(prefix, ...args)
  }

  return { info, warn, error }
}
