// autoResize.js - Version optimisée SANS Layout Shift

export const autoResize = {
    mounted(el) {
        // Créer l'élément miroir
        const mirror = document.createElement('span')
        mirror.style.cssText = `
            visibility: hidden;
            white-space: pre;
            position: absolute;
            left: -9999px;
            top: 0;
            pointer-events: none;
        `
        mirror.setAttribute('aria-hidden', 'true')
        document.body.appendChild(mirror)

        el._autoResizeMirror = mirror

        // ✅ Fonction SYNCHRONE de calcul
        const adjustWidth = () => {
            const computedStyle = window.getComputedStyle(el)

            // Copier les styles pertinents
            mirror.style.font = computedStyle.font
            mirror.style.fontFamily = computedStyle.fontFamily
            mirror.style.fontSize = computedStyle.fontSize
            mirror.style.fontWeight = computedStyle.fontWeight
            mirror.style.letterSpacing = computedStyle.letterSpacing
            mirror.style.textTransform = computedStyle.textTransform

            // Contenu ou placeholder
            mirror.textContent = el.value || el.placeholder || ''

            // Calculer dimensions
            const paddingLeft = parseFloat(computedStyle.paddingLeft) || 0
            const paddingRight = parseFloat(computedStyle.paddingRight) || 0
            const borderLeft = parseFloat(computedStyle.borderLeftWidth) || 0
            const borderRight = parseFloat(computedStyle.borderRightWidth) || 0

            const textWidth = mirror.offsetWidth
            const totalWidth = textWidth + paddingLeft + paddingRight + borderLeft + borderRight

            // Largeur minimale
            const minWidth = 40
            const parentWidth = el.parentElement?.offsetWidth || Infinity

            const maxAllowedWidth = parentWidth - (parseFloat(computedStyle.marginLeft) || 0) - (parseFloat(computedStyle.marginRight) || 0)

            const newWidth = Math.min(Math.max(totalWidth, minWidth), maxAllowedWidth)

            // ✅ Appliquer immédiatement, pas d'animation
            el.style.width = newWidth + 'px'

            return newWidth
        }

        el._autoResizeAdjust = adjustWidth

        // ✅ CRITIQUE : Ajuster IMMÉDIATEMENT au montage (synchrone)
        adjustWidth()

        // ✅ Ajuster pendant la saisie (synchrone)
        el.addEventListener('input', adjustWidth)

        // ✅ Précharger les fonts pour éviter le Layout Shift
        // Mais NE PAS réajuster après coup
        if (document.fonts && !document.fonts.check(`1em ${getComputedStyle(el).fontFamily}`)) {
            document.fonts.ready.then(() => {
                // Seulement si l'input est encore vide (pas de saisie utilisateur)
                if (!el.value || el.value === el.defaultValue) {
                    adjustWidth()
                }
            })
        }
    },

    updated(el) {
        // ✅ Réajuster IMMÉDIATEMENT (synchrone), pas de setTimeout
        if (el._autoResizeAdjust) {
            el._autoResizeAdjust()
        }
    },

    unmounted(el) {
        if (el._autoResizeMirror) {
            el._autoResizeMirror.remove()
        }
        if (el._autoResizeAdjust) {
            el.removeEventListener('input', el._autoResizeAdjust)
        }
    }
}

export default autoResize