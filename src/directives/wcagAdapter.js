export default {
    mounted(el, binding) {
        updateTextColor(el, binding.value);
    },
    updated(el, binding) {
        updateTextColor(el, binding.value);
    }
};

function updateTextColor(el, bgColor) {
    if (!bgColor) return;
    el.style.color = getFinalTextColor(bgColor);
}

function getFinalTextColor(hex) {
    const rgb = hexToRgb(hex);
    if (!rgb) return '#000000';

    const bgLuminance = getLuminance(rgb.r, rgb.g, rgb.b);
    const whiteContrast = getContrastRatio(1, bgLuminance);
    const blackContrast = getContrastRatio(0, bgLuminance);
    const minContrast = 4.5;

    const { h, s, l } = rgbToHsl(rgb.r, rgb.g, rgb.b);

    const score = (0.5 - l) + (s * 0.3) + ((h >= 150 && h <= 260) ? 0.2 : 0);

    if (score > 0) return '#FFFFFF';
    if (whiteContrast >= minContrast) return '#FFFFFF';
    if (blackContrast >= minContrast) return '#000000';

    return '#000000';
}

function hexToRgb(hex) {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(c);
    return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
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

function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)); break;
            case g: h = ((b - r) / d + 2); break;
            case b: h = ((r - g) / d + 4); break;
        }
        h /= 6;
        h *= 360;
    }

    return { h, s, l };
}
