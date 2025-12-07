import { ref, watch } from 'vue'

export function useLocalStorage(key, defaultValue) {
  const originalDefault = structuredClone(defaultValue)
  const data = ref(structuredClone(defaultValue))

  const load = () => {
    try {
      const item = localStorage.getItem(key)
      if (item) {
        data.value = JSON.parse(item)
        return true
      }
    } catch (e) {
      console.error('Erreur de chargement:', e)
    }
    return false
  }

  const save = () => {
    try {
      localStorage.setItem(key, JSON.stringify(data.value))
      console.log('saved data');
    } catch (e) {
      console.error('Erreur de sauvegarde:', e)
    }
  }

  const clear = () => {
    data.value = structuredClone(originalDefault)
    localStorage.removeItem(key)
  }

  const hasLoadedData = load()

  if (!hasLoadedData) {
    save()
  }

  watch(data, save, { deep: true })

  return { data, load, save, clear }
}