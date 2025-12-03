<script setup>

import { ref, nextTick, inject, computed } from "vue"
import ItemEditable from '../ui/ItemEditable.vue'
import TextareaSection from '../ui/TextareaSection.vue'

const cvData = inject('cvData')

const layout = computed(() => {
    return cvData.value.configuration.mainSection.layout
})

const modelValue = defineModel({ type: Object, required: true })

const props = defineProps({
    index: { type: Number, required: true },
    type: { type: String, required: true }
})

const focusExtraInfo = ref(false)

const extraInfo = ref(modelValue.value.extraInfo !== '');

const handleExtra = () => {
    nextTick(() => {
        extraInfo.value = modelValue.value.extraInfo !== '' ?? false
        focusExtraInfo.value = false
    })
}

const config = {
    jobs: {
        mainField: 'job',
        placeholder: 'Poste',
        hasExtraInfo: true
    },
    education: {
        mainField: 'school',
        placeholder: 'Intitulé',
        hasExtraInfo: false
    }
}

const category = config[props.type]

</script>
<template>
    <div v-if="layout === 'open'">
        <ItemEditable
            class="date extra-padding hoverable"
            label="date"
            v-model="modelValue.period"
            placeholder="Date"
        />
    </div>
    <div class="right">
        <div class="top-line">
            <ItemEditable
                class="job-label extra-padding hoverable"
                label="label"
                v-model="modelValue[category.mainField]"
                :placeholder="category.placeholder"
            />
            <div v-if="layout === 'close'">
                <ItemEditable
                    class="date extra-padding hoverable"
                    label="date"
                    v-model="modelValue.period"
                    placeholder="Date"
                />
            </div>
        </div>
        <div v-if="category.hasExtraInfo">
            <div :class="{ ' add-extra-info': !extraInfo }">
                <ItemEditable
                    class="hoverable"
                    :must-focus=focusExtraInfo
                    label="extra-info"
                    v-model="modelValue.extraInfo"
                    :placeholder="'Entreprise, durée...'"
                    @handleExtra="handleExtra"
                />
            </div>
        </div>
        <TextareaSection
            class="ta-desc"
            :name="`${props.type}-desc-${props.index}`"
            v-model="modelValue.description"
            placeholder="Description"
        />
    </div>
</template>

<style scoped lang="scss">
.top-line {
    display: flex;
    justify-content: space-between;
}

.experience {
    position: relative;
}

.left {
    display: flex;
    flex-direction: column;
}

.draggable {
    display: flex;
    position: relative;
    flex: 1;
    align-items: center;
    justify-content: center;
    flex-wrap: nowrap;
    opacity: 0;
    cursor: move;

    &:hover {
        transition: all 111ms ease;
        opacity: 1;
    }

    &>* {
        color: #4b4b4b;
    }
}

.draggable:active>* {
    transform: scale(0.9);
    color: #70b5ff;
    filter: drop-shadow(0 0 8px rgba(112, 181, 255, 0.8));
}

.right {
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
    min-width: 0;
}

:deep(.ta-desc >*) {
    font-size: 10.3pt;
}

.add-extra-info {
    position: relative;
    height: 0px;
    font-style: italic;
    padding: 0px 0px;
    font-size: 10pt;
    transition: all 0.15s ease-in-out;
    transition-delay: 250ms;
    opacity: 0;
}

.item:hover .add-extra-info {
    height: 18px;
    padding: 2px 0px;
    border-radius: var(--border-radius-base);
    color: var(--greyed-text);
    width: 35%;
    opacity: 1;
}
</style>