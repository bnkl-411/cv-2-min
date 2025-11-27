<script setup>
import { ref, computed } from "vue";
import { exportToPDF } from "../../utils/toPDF";
import { useCvState } from '../../composables/useCvState';
import { dataToJson } from "../../utils/dataToJson";
import ColorPicker from '../ui/ColorPicker.vue';
import LayoutSelector from '../ui/LayoutSelector.vue';
import chevronDown from '@icons/chevron.svg';

import iconExport from '@icons/export.svg';
import iconReset from '@icons/reset.svg';
import iconDownload from '@icons/download.svg';
import iconColor from '@icons/color.svg';
import iconCollapse from '@icons/collapse.svg';
import iconLayout from '@icons/layout.svg';

const { currentModel, initCV } = useCvState();

defineProps({
    isColorWheelOpen: { type: Boolean, required: true },
    currentColor: { type: String, required: true }
});

const isJobLayoutSelectorOpen = ref(false);
const collapsed = ref(false);

const forceExpand = () => {
    if (collapsed.value) collapsed.value = false;
};

defineEmits(['toggleColorWheel', 'changeColor']);

const isLocalhost = window.location.hostname === 'localhost';

const downloadJson = () => dataToJson(currentModel.value);

const toggleCollapse = () => {
    collapsed.value = !collapsed.value;

    if (collapsed.value) {
        isJobLayoutSelectorOpen.value = false;
    }
};

const containerClass = computed(() => ({
    'left-container': true,
    'collapsed': collapsed.value
}));
</script>

<template>
    <div :class="containerClass">
        <button
            class="collapse-btn"
            @click="toggleCollapse"
            :aria-pressed="collapsed"
            :title="collapsed ? 'Ouvrir' : 'Réduire'"
        >
            <img
                :src="iconCollapse"
                alt=""
                class="icon"
            />
        </button>

        <div class="data-actions">
            <div class="category user-actions">ACTIONS</div>
            <button @click="exportToPDF">
                <img
                    :src="iconExport"
                    class="icon"
                />
                <span class="label">Exporter en PDF</span>
            </button>

            <button @click="initCV">
                <img
                    :src="iconReset"
                    class="icon"
                />
                <span class="label">Réinitialiser les données</span>
            </button>

            <div v-show="isLocalhost">
                <button @click="downloadJson">
                    <img
                        :src="iconDownload"
                        class="icon"
                    />
                    <span class="label">Télécharger</span>
                </button>
            </div>
        </div>

        <div class="design-actions">
            <div class="category template-actions">TEMPLATE & DESIGN </div>
            <div class="color-picker-wrapper">
                <button
                    @click="forceExpand(); $emit('toggleColorWheel')"
                    :class="{ active: isColorWheelOpen }"
                >
                    <img
                        :src="iconColor"
                        class="icon"
                    />
                    <span class="label">Couleur principale</span>
                    <span
                        class="chevron"
                        :class="{ open: isColorWheelOpen }"
                    >
                        <img
                            :src="chevronDown"
                            class="icon"
                        />
                    </span>
                </button>

                <Transition name="accordion">
                    <div
                        v-if="isColorWheelOpen"
                        id="sidebar-color-picker"
                        class="color-picker-container"
                    >
                        <ColorPicker
                            :initialColor="currentColor"
                            @changeColor="$emit('changeColor', $event)"
                        />
                    </div>
                </Transition>
            </div>

            <div class="layout-selection-wrapper">
                <button
                    @click="forceExpand(); isJobLayoutSelectorOpen = !isJobLayoutSelectorOpen"
                    :class="{ active: isJobLayoutSelectorOpen }"
                >
                    <img
                        :src="iconLayout"
                        class="icon"
                    />
                    <span class="label">Format</span>
                    <span
                        class="chevron"
                        :class="{ open: isJobLayoutSelectorOpen }"
                    >
                        <img
                            :src="chevronDown"
                            class="icon"
                        />
                    </span>
                </button>

                <Transition name="accordion">
                    <div
                        v-if="isJobLayoutSelectorOpen"
                        id="job-layout-selector"
                        class="layout-selector-container"
                    >
                        <LayoutSelector />
                    </div>
                </Transition>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.left-container {
    position: fixed;
    left: 0;
    top: 0;
    width: 250px;
    box-sizing: border-box;
    z-index: 3;
    display: flex;
    flex-direction: column;
    gap: 18px;
    padding: 24px 16px;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    height: 100%;
    box-shadow: 0 2px 4px rgba(96, 135, 208, 0.3);
    transition: width 0.25s ease;
    overflow: hidden;
}

.left-container.collapsed {
    width: 64px;
    padding-left: 8px;
    padding-right: 8px;

    .category {
        display: none;
    }

    .color-picker-wrapper,
    .layout-selection-wrapper {

        .accordion-enter-from,
        .accordion-leave-to,
        .color-picker-container,
        .layout-selector-container {
            max-height: 0;
            overflow: hidden;
            opacity: 0;
        }
    }
}

.collapse-btn {
    align-self: flex-end;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: white;
    border: none;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.3s ease;

    .icon {
        transition: transform 0.3s ease;
    }
}

.left-container.collapsed .collapse-btn .icon {
    transform: rotate(180deg);
}

.data-actions,
.design-actions {
    display: flex;
    flex-direction: column;
    gap: 8px;
    position: relative;
}

.category {
    font-weight: 600;
    transition: opacity 0.25s ease;
}

.user-actions {
    color: #3b82f6;
}

.template-actions {
    color: #8b5cf6;
}

.left-container button {
    display: flex;
    position: relative;
    width: 100%;
    justify-content: flex-start;
    align-items: center;
    gap: 12px;
    padding: 8px 12px;
    border: none;
    border-radius: 12px;
    background: #ffffff;
    color: #1e293b;
    font-size: 14px;
    font-weight: 600;
    text-align: left;
    letter-spacing: 0.4px;
    line-height: 16px;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    overflow: hidden;
}

.left-container button::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 100%;
    background: var(--button-bg-hover);
    transition: width 0.3s ease;
}

.left-container button:hover {
    transform: translateX(1px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.left-container button:hover::before {
    width: 100%;
}

.left-container button:active {
    transform: scale(0.96) translateX(4px);
}

.data-actions button:hover {
    color: #3b82f6;
}

.design-actions button:hover {
    color: #8b5cf6;
}

.left-container .icon {
    width: 28px;
    height: 28px;
}

.label {
    white-space: normal;
    line-height: 16px;
}

.left-container.collapsed .label {
    display: none;
}

.left-container.collapsed button {
    justify-content: center;
    padding: 8px;
}

.chevron {
    margin-left: auto;
    width: 18px;
    height: 18px;
    transition: transform 0.3s ease;
}

.chevron img {
    display: block;
    transform-origin: center center;
}

.chevron.open {
    transform: rotate(180deg);
}

.left-container.collapsed .chevron {
    display: none;
}

.color-picker-container,
.layout-selector-container {
    border-radius: 0 0 6px 6px;
    background: white;
}

.accordion-enter-active,
.accordion-leave-active {
    transition: all 0.3s ease-in-out;
    overflow: hidden;
}

.accordion-enter-from,
.accordion-leave-to {
    max-height: 0;
    opacity: 0;
    padding: 0;
}

.accordion-enter-to,
.accordion-leave-from {
    max-height: 720px;
    opacity: 1;
}
</style>