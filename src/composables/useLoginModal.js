import { ref } from 'vue'

const isOpen = ref(false)
const redirectTo = ref(null)

export function useLoginModal() {
    function open(redirect) {
        isOpen.value = true
        redirectTo.value = redirect || null
    }

    function close() {
        isOpen.value = false
        redirectTo.value = null
    }

    return {
        isOpen,
        redirectTo,
        open,
        close
    }
}