import { ref } from 'vue'
import { useCityStore } from '@/stores/cityStore'
import { cityData } from '@/utils/city/cityData'
import type { CityNode } from '@/types'
import { useLogger } from '@/composables/useLogger'

const log = useLogger('cityDataMock')
const initialized = ref(false)

export function initializeCityDataMock() {
  if (initialized.value) return
  initialized.value = true
  const cityStore = useCityStore()
  cityStore.setCityData(cityData as CityNode)
  log.info('Loaded city data mock')
}
