<script setup>
import { computed } from 'vue';

defineProps({
    targetEl: {
        type: Object,
        required: true
    },
    currentSize: {
        type: Number,
        required: true
    },
    isMaxSize: {
        type: Boolean,
        default: false
    },
    isMinSize: {
        type: Boolean,
        default: false
    },
    onIncrease: {
        type: Function,
        required: true
    },
    onDecrease: {
        type: Function,
        required: true
    }
});

const modalStyle = computed(() => ({
    position: 'absolute',
    top: '5px',
    left: '50%',
    transform: 'translateX(-50%) translateY(-100%)',
    border: '2px solid #eee',
    background: 'white',
    borderRadius: '11px',
    padding: '6px 8px',
    boxShadow: '0 5px 8px rgba(0,0,0,0.2)',
    zIndex: 999
}));
</script>

<template>
    <Teleport :to="targetEl">
        <div
            class="font-size-modal"
            :style="modalStyle"
        >
            <div class="button-container">
                <button
                    @click="onDecrease"
                    class="size-button size-button-decrease"
                    :disabled="isMinSize"
                    :class="{ 'disabled': isMinSize }"
                >
                    A-
                </button>

                <button
                    @click="onIncrease"
                    class="size-button size-button-increase"
                    :disabled="isMaxSize"
                    :class="{ 'disabled': isMaxSize }"
                >
                    A+
                </button>
            </div>
        </div>
    </Teleport>
</template>

<style scoped>
.font-size-modal::before {
    content: '';
    position: absolute;
    top: 95%;
    left: 50%;
    transform: translateX(-50%);
    border: 8px solid transparent;
    border-top-color: white;
}

.button-container {
    display: flex;
    align-items: end;
}

.size-button {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0 4px;
    display: flex;
    align-items: center;
    font-weight: 600;
    border-radius: 6px;
    transition: background-color 0.2s ease;
}

.size-button:hover:not(.disabled) {
    background: rgba(221, 234, 255, 0.5);
}

.size-button:active:not(.disabled) {
    background: rgba(221, 234, 255, 0.8);
    transform: scale(0.95);
}

.size-button.disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.size-button-decrease {
    font-size: medium;
}

.size-button-increase {
    margin-left: 10px;
    font-size: large;
}
</style>