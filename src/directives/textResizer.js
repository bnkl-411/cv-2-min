export default {
    mounted(el, binding) {
        const options = {
            minFontSize: binding.value.minFontSize,
            default: binding.value.default,
            id: binding.value.id,
            maxHeight: '',
            active: binding.value,
        }


        const resize = () => {
            const target = document.getElementById(options.id)
            if (!target) return

            target.style.fontSize = options.default + 'pt'

            //-10px pour prendre en compte le padding 
            const parentWidth = target.parentElement.clientWidth - 10
            const textWidth = target.scrollWidth
            const textHeight = target.offsetHeight

            let fontSize = options.default

            if (textWidth > parentWidth) {
                const ratio = parentWidth / textWidth
                fontSize = Math.floor(options.default * ratio)
            }

            if (options.maxHeight && textHeight > options.maxHeight) {
                const heightRatio = options.maxHeight / textHeight
                const heightFontSize = Math.floor(options.default * heightRatio)

                fontSize = Math.min(fontSize, heightFontSize)
            }

            if (fontSize < options.minFontSize) fontSize = options.minFontSize

            target.style.fontSize = fontSize + 'pt'
        }
        el._resizeHandler = resize

        const target = options.id ? document.getElementById(options.id) : el

        if (target?.parentElement) {
            const observer = new ResizeObserver(() => {
                resize()
            })
            observer.observe(target.parentElement)
            el._resizeObserver = observer
        }

        el.addEventListener('blur', resize)
        el.addEventListener('input', resize)
    },
    unmounted(el) {
        if (el._resizeHandler) {
            el.removeEventListener('blur', el._resizeHandler)
            el.removeEventListener('input', el._resizeHandler)
            delete el._resizeHandler
        }

    }
}