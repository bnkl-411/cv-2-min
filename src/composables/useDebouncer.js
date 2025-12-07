import { ref, watch } from 'vue'

export function useDebouncer(modelValue, { delay = 500, isEditing = ref(false) } = {}) {
    const localValue = ref(modelValue.value)
    let debounceTimer = null

    // Synchroniser modelValue vers localValue quand on n'édite pas
    watch(modelValue, (newVal) => {
        if (!isEditing.value) {
            localValue.value = newVal
        }
    })

    const updateModelValue = () => {
        if (debounceTimer) {
            clearTimeout(debounceTimer)
        }
        debounceTimer = setTimeout(() => {
            modelValue.value = localValue.value
        }, delay)
    }

    // Fonction pour forcer la synchronisation immédiate
    const flushUpdate = () => {
        if (debounceTimer) {
            clearTimeout(debounceTimer)
        }
        modelValue.value = localValue.value
    }

    // Fonction pour réinitialiser la valeur locale depuis le model
    const resetLocal = () => {
        localValue.value = modelValue.value
    }

    return {
        localValue,
        updateModelValue,
        flushUpdate,
        resetLocal
    }
}