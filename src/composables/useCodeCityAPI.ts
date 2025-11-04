import { ref } from 'vue'
import type { CityData } from '@/types/city'

export function useCodeCityAPI() {
  const cityData = ref<CityData | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // API in the future do ogarnięcia
  async function fetchCityData(projectId: string) {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(`/api/`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      cityData.value = data
      
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error occurred'
      console.error('Error fetching city data:', e)
      cityData.value = null
      
    } finally {
      loading.value = false
    }
  }

  function clearData() {
    cityData.value = null
    error.value = null
  }

  return {
    cityData,
    loading,
    error,
    fetchCityData,
    clearData
  }
}