import { ref, watch } from 'vue'

export function useLocalStorage(key, defaultValue) {
  const originalDefault = structuredClone(defaultValue)
  const value = ref(structuredClone(defaultValue))
  const isEmpty = (val) => val === undefined || val === null || String(val).trim() === ''

  const mergeWithDefaults = (stored, defaults, path = '') => {
    const result = { ...stored }
    for (const k in defaults) {
      const defaultVal = defaults[k]
      const storedVal = stored?.[k]
      const currentPath = path ? `${path}.${k}` : k

      if (!(k in stored)) {
        result[k] = defaultVal
      }
      else if (Array.isArray(defaultVal)) {
        result[k] = storedVal
      }
      else if (defaultVal && typeof defaultVal === 'object') {
        result[k] = mergeWithDefaults(storedVal, defaultVal, currentPath)
      } else {
        result[k] = isEmpty(storedVal) || storedVal === '' ? defaultVal : storedVal
      }
    }
    return result
  }

  const load = () => {
    try {
      const item = localStorage.getItem(key)
      if (item) {
        // value.value = mergeWithDefaults(JSON.parse(item), defaultValue)
        value.value = JSON.parse(item)
      }
    } catch (e) {
      console.error('Erreur de chargement:', e)
    }
  }

  const save = () => {
    try {
      localStorage.setItem(key, JSON.stringify(value.value))
    } catch (e) {
      console.error('Erreur de sauvegarde:', e)
    }
  }

  const clear = () => {
    value.value = structuredClone(originalDefault)
    localStorage.removeItem(key)
  }

  watch(value, save, { deep: true })
  load()

  return { value, clear, load }
}