<script setup>
import { exportToPDF } from "../../utils/toPDF";
import { useCvState } from '../../composables/useCvState';
import { dataToJson } from "../../utils/dataToJson";
import ColorPicker from '../ui/ColorPicker.vue';

const { currentModel, initCV, loadModel } = useCvState();

defineProps({
    isColorWheelOpen: {
        type: Boolean,
        required: true
    },
    currentColor: {
        type: String,
        required: true
    }
});

defineEmits(['toggleColorWheel', 'changeColor']);

const isLocalhost = window.location.hostname === 'localhost'

const downloadJson = () => {
    dataToJson(currentModel.value);
};

</script>
<template>
    <div class="left-container">
        <div class="data-actions">
            <button @click="exportToPDF">Exporter en PDF</button>
            <button @click="initCV">Réinitialiser les données</button>
            <div v-show="isLocalhost">
                <button @click="() => loadModel('cvType1')">Charger le modèle n°1</button>
                <button @click="() => loadModel('cvType2')">Charger le modèle n°2</button>
                <button @click="() => loadModel('cvType3')">Charger le modèle n°3</button>
                <button
                    v-show="isLocalhost"
                    @click="downloadJson"
                >Télécharger</button>
            </div>

        </div>

        <div class="design-actions">
            <div class="color-picker-wrapper">
                <button
                    @click="$emit('toggleColorWheel')"
                    class="color-picker-button"
                    :class="{ 'active': isColorWheelOpen }"
                >
                    Couleur de la sidebar
                    <span
                        class="chevron"
                        :class="{ 'open': isColorWheelOpen }"
                    >▼</span>
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
    gap: 28px;
    padding: 24px 16px;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    height: 100%;
    box-shadow: 0 2px 4px rgba(96, 135, 208, 0.3);
}

.data-actions {
    display: flex;
    flex-direction: column;
    gap: 8px;
    position: relative;
}

.data-actions::after {
    content: "Actions sur les données";
    position: absolute;
    top: -20px;
    left: 2px;
    font-size: 14px;
    font-weight: 600;
    color: #3b82f6;
    text-transform: uppercase;
    letter-spacing: 0.8px;
}

.design-actions {
    display: flex;
    flex-direction: column;
    gap: 8px;
    position: relative;
}

.design-actions::after {
    content: "Template & Design";
    position: absolute;
    top: -20px;
    left: 2px;
    font-size: 14px;
    font-weight: 600;
    color: #8b5cf6;
    text-transform: uppercase;
    letter-spacing: 0.8px;
}

.left-container button {
    padding: 13px 16px;
    border: none;
    border-radius: 12px;
    background: #ffffff;
    color: #1e293b;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    position: relative;
    overflow: hidden;
}

.left-container button::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 100%;
    background: linear-gradient(90deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
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

.color-picker-wrapper {
    width: 100%;
}

.color-picker-button {
    width: 100%;
    padding: 12px 16px;
    background: #f5f5f5;
    border: 1px solid #ddd;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    text-align: left;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: background 0.2s ease;
}

.color-picker-button:hover {
    background: #e8e8e8;
}

.color-picker-button.active {
    border-radius: 6px 6px 0 0;
    border-bottom: none;
}

.chevron {
    transition: transform 0.3s ease;
    font-size: 12px;
    color: #666;
}

.chevron.open {
    transform: rotate(180deg);
}

.color-picker-container {
    border-top: none;
    border-radius: 0 0 6px 6px;
    background: white;
}

/* Transition accordéon */
.accordion-enter-active,
.accordion-leave-active {
    transition: all 0.3s ease;
    overflow: hidden;
}

.accordion-enter-from,
.accordion-leave-to {
    max-height: 0;
    opacity: 0;
    padding-top: 0;
    padding-bottom: 0;
}

.accordion-enter-to,
.accordion-leave-from {
    max-height: 500px;
    /* Ajustez selon la hauteur de votre ColorPicker */
    opacity: 1;
}
</style>
