import { ref } from 'vue'

const isEditing = ref(false)
const editingCount = ref(0)

export function useEditingState() {
    const editing = ref(false)

    const startEditing = () => {
        editing.value = true
        editingCount.value++
        isEditing.value = true
    }

    const endEditing = () => {
        editing.value = false
        editingCount.value--
        if (editingCount.value <= 0) {
            editingCount.value = 0
            isEditing.value = false
        }
    }

    return {
        editing,
        isEditing,
        startEditing,
        endEditing
    }
}