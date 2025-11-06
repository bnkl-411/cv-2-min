<script setup>
import { ref, computed, onMounted } from 'vue'

const emit = defineEmits(['changeColor'])

const H = ref(194)
const S = ref(0.5124378109452736)
const V = ref(0.788235294117647)

const svEl = ref(null)
const hueEl = ref(null)
const hex = ref('#62b1c9')

const sample = {
    vives: [
        '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#10b981',
        '#14b8a6', '#62b1c9', '#0ea5e9', '#3b82f6', '#6366f1',
        '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#64748b'
    ],
    pastels: [
        '#E7BDBD',
        '#F6CFAF',
        '#F3E8B6',
        '#D2E5C3',
        '#B8D5E6',
        '#E3CBE2'
    ],
    neutres: [
        '#F5F5F4',
        '#9CA3AF'
    ]
};

function clamp(v, a, b) { return Math.max(a, Math.min(b, v)) }

function hsvToRgb(h, s, v) {
    const c = v * s
    const x = c * (1 - Math.abs((h / 60) % 2 - 1))
    const m = v - c
    let r = 0, g = 0, b = 0

    if (h < 60) { r = c; g = x; b = 0 }
    else if (h < 120) { r = x; g = c; b = 0 }
    else if (h < 180) { r = 0; g = c; b = x }
    else if (h < 240) { r = 0; g = x; b = c }
    else if (h < 300) { r = x; g = 0; b = c }
    else { r = c; g = 0; b = x }

    return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)]
}

function rgbToHex([r, g, b]) {
    return '#' + [r, g, b].map(n => n.toString(16).padStart(2, '0')).join('')
}

function hexToRgb(hexv) {
    if (!hexv) return null
    let h = hexv.replace('#', '')
    if (h.length === 3) h = h.split('').map(x => x + x).join('')
    if (h.length !== 6) return null
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

const thumbStyle = computed(() => {
    return {
        left: `${clamp(S.value, 0, 1) * 100}%`,
        top: `${(1 - clamp(V.value, 0, 1)) * 100}%`
    }
})

const hthumbStyle = computed(() => {
    return {
        top: `${(H.value / 360) * 100}%`,
        transform: 'translateY(-50%)'
    }
})

function renderFromHSV() {
    const rgb = hsvToRgb(H.value, S.value, V.value)
    hex.value = rgbToHex(rgb)

    emit('changeColor', hex.value)
}

function setFromHex(v) {
    const rgb = hexToRgb(v)

    if (!rgb) return

    const r = rgb[0] / 255, g = rgb[1] / 255, b = rgb[2] / 255
    const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min
    let h = 0

    if (d === 0) h = 0
    else if (max === r) h = ((g - b) / d) % 6 * 60
    else if (max === g) h = ((b - r) / d + 2) * 60
    else h = ((r - g) / d + 4) * 60
    if (h < 0) h += 360

    const vval = max
    const sval = max === 0 ? 0 : d / max

    H.value = Math.round(h)
    S.value = sval
    V.value = vval

    renderFromHSV()
}

function onHexChange() {
    setFromHex(hex.value.trim())
}

function svPointer(e) {
    const rect = svEl.value.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    const x = clamp(clientX - rect.left, 0, rect.width)
    const y = clamp(clientY - rect.top, 0, rect.height)
    S.value = x / rect.width
    V.value = 1 - y / rect.height

    renderFromHSV()
}

function startSvPointer(ev) {
    const target = ev.currentTarget
    target.setPointerCapture(ev.pointerId)

    svPointer(ev)
}

function moveSvPointer(ev) {
    const target = ev.currentTarget
    if (target.hasPointerCapture(ev.pointerId)) {
        svPointer(ev)
    }
}

function huePointer(e) {
    const rect = hueEl.value.getBoundingClientRect()
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    const y = clamp(clientY - rect.top, 0, rect.height)
    H.value = Math.round((y / rect.height) * 360)
    renderFromHSV()
}

function startHuePointer(ev) {
    const target = ev.currentTarget
    target.setPointerCapture(ev.pointerId)
    huePointer(ev)
}

function moveHuePointer(ev) {
    const target = ev.currentTarget
    if (target.hasPointerCapture(ev.pointerId)) {
        huePointer(ev)
    }
}

onMounted(() => { renderFromHSV() })

</script>

<template>
    <div class="card">
        <div class="picker-wrap">
            <div class="left">
                <div class="palette-select">
                    <div
                        ref="svEl"
                        class="sv"
                        :style="{
                            background: `linear-gradient(transparent, #000), linear-gradient(90deg, #fff, hsl(${H}, 100%, 50%))`
                        }"
                        @pointerdown="startSvPointer"
                        @pointermove="moveSvPointer"
                        tabindex="0"
                        aria-label="Saturation et valeur"
                    >
                        <div
                            class="thumb"
                            :style="{
                                ...thumbStyle,
                                transform: 'translate(-7px, -7px)'
                            }"
                        ></div>
                    </div>

                    <div
                        ref="hueEl"
                        class="hue"
                        :style="{
                            background: 'linear-gradient(180deg, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)'
                        }"
                        @pointerdown="startHuePointer"
                        @pointermove="moveHuePointer"
                        tabindex="0"
                        aria-label="Teinte"
                    >
                        <div
                            class="hthumb"
                            :style="hthumbStyle"
                        ></div>
                    </div>
                </div>

                <div class="hue-row">
                    <div class="controls">
                        <input
                            type="text"
                            v-model.trim="hex"
                            @change="onHexChange"
                            @keydown.enter="onHexChange"
                            aria-label="Code hexadécimal"
                        />
                    </div>
                </div>

                <div class="palette">
                    <template
                        v-for="(palette, category) in sample"
                        :key="category"
                    >
                        <h3>{{ category }}</h3>
                        <div class="swatches">
                            <div
                                v-for="c in palette"
                                :key="c"
                                :class="['sw', { active: hex === c }]"
                                :style="{ background: c }"
                                @click="setFromHex(c)"
                                @keydown.enter="setFromHex(c)"
                                tabindex="0"
                                :title="c"
                            ></div>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

.color-picker-container {
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    padding: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.card {
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 6px 18px rgba(10, 20, 30, 0.06);
}

.picker-wrap {
    display: grid;
    grid-template-columns: 130px 1fr;
    gap: 12px;
}

.left {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.palette-select {
    display: flex;
    justify-content: space-between;
}

.sv {
    width: 130px;
    height: 130px;
    border-radius: 10px;
    position: relative;
    cursor: pointer;
    border: 1px solid #e6e9ef;
}

.sv .thumb {
    position: absolute;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 2px solid #fff;
    box-shadow: 0 2px 6px rgba(3, 12, 30, 0.25);
    pointer-events: none;
}

.palette {
    margin-top: 12px;
}

.palette h3 {
    margin: 16px 0 8px 0;
}

.palette h3:first-child {
    margin-top: 0;
}

.swatches {
    display: grid;
    gap: 8px;
}

.palette h3:first-child+.swatches {
    grid-template-columns: repeat(4, 36px);
}

.palette h3:nth-of-type(2)+.swatches {
    grid-template-columns: repeat(3, 36px);
}

.palette h3:nth-of-type(3)+.swatches {
    grid-template-columns: repeat(2, 36px);
}

.sw {
    width: 36px;
    height: 36px;
    border-radius: 6px;
    border: 1px solid #e3e6ee;
    cursor: pointer;
    transition: transform 0.2s;
}

.sw:hover {
    transform: scale(1.1);
}

.sw:focus,
.active {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
}

.hue-row {
    display: flex;
    gap: 12px;
    align-items: center;
}

.hue {
    height: 130px;
    width: 28px;
    border-radius: 10px;
    cursor: pointer;
    border: 1px solid #e6e9ef;
    position: relative;
}

.hue .hthumb {
    position: absolute;
    width: 100%;
    height: 6px;
    background: #fff;
    border-radius: 3px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
    pointer-events: none;
}

.controls {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
}

input[type="text"] {
    padding: 8px 10px;
    border-radius: 8px;
    border: 1px solid #e2e6ef;
    font-family: monospace;
    width: 120px;
    font-size: 14px;
}

input[type="text"]:focus {
    outline: none;
    border-color: #3b82f6;
}

@media (max-width: 720px) {
    .picker-wrap {
        grid-template-columns: 1fr;
        grid-auto-rows: auto;
    }

    .preview {
        width: 100%;
    }
}
</style>