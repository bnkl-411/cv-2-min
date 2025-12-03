import { watch, onMounted } from 'vue'

export function useCssSync(dataRef, mappings) {
    const applyCssVars = () => {
        mappings.forEach(({ path, cssVar, transform }) => {
            const value = getNestedValue(dataRef.value, path)
            if (value !== undefined) {
                const finalValue = transform ? transform(value) : value
                document.documentElement.style.setProperty(cssVar, finalValue)
            }
        })
    }

    // Helper pour accéder aux propriétés imbriquées
    const getNestedValue = (obj, path) => {
        return path.split('.').reduce((current, key) => current?.[key], obj)
    }

    // Appliquer au montage (chargement initial depuis localStorage)
    onMounted(() => {
        applyCssVars()
    })

    // Synchroniser
    watch(dataRef, applyCssVars, { deep: true })

    return { applyCssVars }
}