<script setup>
import { inject } from 'vue'

const cvData = inject('cvData')

const setLayout = (layoutConf) => {
    cvData.value.layout.mainSectionLayout = layoutConf
}
</script>

<template>
    <div class="layout-selector">
        <h3>Affichage</h3>
        <div class="selectors">

            <button
                @click="setLayout('open')"
                :class="{ active: cvData.layout.mainSectionLayout === 'open' }"
            >
                Aéré
            </button>
            <button
                @click="setLayout('close')"
                :class="{ active: cvData.layout.mainSectionLayout === 'close' }"
            >
                Condensé
            </button>
        </div>
    </div>
</template>

<style scoped lang="scss">
.layout-selector {
    display: flex;
    flex-direction: column;
    padding: 16px;

}

.selectors {
    display: flex;
    justify-content: center;
    gap: 8px;
}

h3:first-child {
    margin-top: 0;
}

h3 {
    margin: 20px 0 12px 0;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: #8b5cf6;
}

.layout-selector button {
    flex: 1;
    max-width: 100px;
    padding: 10px 0;
    border: none;
    border-radius: 8px;
    background: #f1f5f9;
    color: #1e293b;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transform: translateY(0);

    &:hover {
        box-shadow: 0 6px 8px rgba(0, 0, 0, 0.12);
        background: #e2e8f0;
    }

    &:active {
        transform: translateY(2px);
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }

    &.active {
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        color: white;
        box-shadow: 0 1px 2px rgba(99, 102, 241, 0.2);
        transform: translateY(2px);
    }
}
</style>