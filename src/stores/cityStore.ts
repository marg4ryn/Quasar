import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { CityNode } from '@/types'

export const useCityStore = defineStore('city', () => {
  const cityData = ref<CityNode>({} as CityNode)

  function setCityData(value: CityNode) {
    cityData.value = value
  }

  function clearCityData() {
    cityData.value = {} as CityNode
  }

  return {
    cityData,
    setCityData,
    clearCityData,
  }
})
