import { ref } from 'vue'

const isGeneratingPdf = ref(false)

export const usePdfGeneration = () => {
    const setGeneratingPdf = (value) => {
        isGeneratingPdf.value = value
    }

    return {
        isGeneratingPdf,
        setGeneratingPdf
    }
}