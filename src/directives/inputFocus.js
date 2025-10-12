export default {
    updated(el, binding) {
        if (binding.value) {
            el.focus()
        }
    }
}