// v-wcag-adapter.js
export default {
    mounted(el, binding) {
        updateTextColor(el, binding.value);
    },
    updated(el, binding) {
        updateTextColor(el, binding.value);
    }
};

function updateTextColor(el, bgColor) {
    if (!bgColor) return
    el.style.color = getWCAGTextColor(bgColor);
};

function getWCAGTextColor(hex) {
    console.log(hex);
    const rgb = hexToRgb(hex);
    if (!rgb) return '#000000';

    const bgLuminance = getLuminance(rgb.r, rgb.g, rgb.b);

    const whiteContrast = getContrastRatio(1, bgLuminance);
    const blackContrast = getContrastRatio(0, bgLuminance);

    return whiteContrast > blackContrast ? '#FFFFFF' : '#000000';
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function getLuminance(r, g, b) {
    const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(l1, l2) {
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
}

// Usage: <div v-wcag-adapter="boxColor">Texte</div>