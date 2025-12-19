import { ref, watch, computed } from 'vue'

export function useLocalStorage(key, defaultValue) {
  const originalDefault = structuredClone(defaultValue)
  const data = ref(structuredClone(defaultValue))
  const needsSync = ref(false)

  const load = () => {
    try {
      const item = localStorage.getItem(key)
      if (item) {
        const parsed = JSON.parse(item)
        data.value = parsed.data
        needsSync.value = parsed.needsSync || false
        return parsed
      }
    } catch (e) {
      console.error('Erreur de chargement localStorage:', e)
      localStorage.removeItem(key)
    }
    return null
  }

  const save = () => {
    try {
      needsSync.value = true
      localStorage.setItem(key, JSON.stringify({
        data: data.value,
        lastModifiedAt: Date.now(),
        needsSync: needsSync.value
      }))
    } catch (e) {
      console.error('Erreur de sauvegarde localStorage:', e)
    }
  }

  const markAsSynced = () => {
    try {
      needsSync.value = false
      const item = localStorage.getItem(key)
      if (item) {
        const parsed = JSON.parse(item)
        parsed.needsSync = false
        localStorage.setItem(key, JSON.stringify(parsed))
      }
    } catch (e) {
      console.error('Erreur markAsSynced:', e)
    }
  }

  const clear = () => {
    data.value = structuredClone(originalDefault)
    needsSync.value = false
    localStorage.removeItem(key)
  }

  const stored = load()

  if (!stored) {
    needsSync.value = true
    save()
  }

  watch(data, save, { deep: true })

  return {
    data,
    needsSync: computed(() => needsSync.value),
    save,
    clear,
    markAsSynced
  }
}