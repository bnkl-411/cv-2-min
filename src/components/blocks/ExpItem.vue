<script setup>

import { ref, nextTick } from "vue"
import ItemEditable from '../ui/ItemEditable.vue'
import TextareaSection from '../ui/TextareaSection.vue'


const modelValue = defineModel({ type: Object, required: true })

const props = defineProps({
    index: { type: Number, required: true },
    type: { type: String, required: true }
})

const focusExtraInfo = ref(false)
const extraInfo = ref(modelValue.value.extraInfo !== '');

const toggleExtraInfo = () => {
    focusExtraInfo.value = !focusExtraInfo.value
    extraInfo.value = !extraInfo.value
}

const handleExtra = () => {
    nextTick(() => {
        extraInfo.value = modelValue.value.extraInfo !== '' ?? false
        focusExtraInfo.value = false
    })
}

const config = {
    jobs: {
        mainField: 'job',
        hasExtraInfo: true
    },
    education: {
        mainField: 'school',
        hasExtraInfo: false
    }
}

const category = config[props.type]

</script>
<template>
    <div class="left">
        <ItemEditable
            class="date"
            label="date"
            v-model="modelValue.period"
        />
        <div class="draggable">
            <font-awesome-icon
                icon="fa-regular fa-circle"
                class="fa-stack-2x circle"
            />
            <font-awesome-icon
                icon="fa-solid fa-solid fa-sort"
                class="fa-stack-1x inner-icon"
            />
        </div>
    </div>
    <div class="right">
        <ItemEditable
            label="label"
            v-model="modelValue[category.mainField]"
        />

        <div v-if="category.hasExtraInfo">
            <div
                v-if="!extraInfo"
                class="add-extra-info"
                @click="toggleExtraInfo"
            >
                <span class="plus-button"> </span>
            </div>

            <div
                class="xt-info-ctn"
                v-else
            >
                <ItemEditable
                    :must-focus=focusExtraInfo
                    label="extra-info"
                    v-model="modelValue.extraInfo"
                    @handleExtra="handleExtra"
                />
            </div>
        </div>
        <TextareaSection
            class="ta-desc"
            :name="`job-desc-${props.index}`"
            v-model="modelValue.description"
        />
    </div>
</template>

<style scoped lang="scss">
.experience {
    position: relative;
}

.left {
    display: flex;
    flex-direction: column;
}

.draggable:active>* {
    transform: scale(0.9);
    color: rgb(112, 181, 255);
    filter: drop-shadow(0 0 8px rgba(112, 181, 255, 0.8));
}

.right {
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
    min-width: 0;
}

li:hover .draggable:not(:hover)>* {
    opacity: .3;
    transition: all 311ms ease;
}

.draggable {
    position: relative;
    flex: 1;
    display: flex;
    min-height: 0;
    justify-content: center;
    align-items: center;
    cursor: move;

    &>* {
        opacity: 0;
    }

    &:hover>* {
        opacity: 1;
        transition: all 111ms ease;
    }

    &>* {
        color: #b4b4b4;
    }
}

.fa-stack {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.fa-stack-2x {
    position: absolute;
}

.inner-icon {
    z-index: 1;
}

.xt-info-ctn {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
}

.ta-desc:hover {
    border-radius: 5px;
    background-color: rgb(236, 236, 236);
    color: #8a8a8a;
    box-shadow: rgba(0, 0, 0, 0.06) 0px 2px 4px 0px inset;
}

.add-extra-info {
    position: relative;
    height: 4px;
    cursor: pointer;

    &::before {
        content: '';
        position: absolute;
        display: block;
        width: 99%;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -65%);
        border-top-style: dashed;
        border-color: rgb(94, 94, 94);
        border-width: 2px;
        opacity: 0;
        background-color: #f3f3f3;
        box-shadow: rgba(0, 0, 0, 0.06) 0px 2px 4px 0px inset;
    }

    &:hover::before {
        opacity: .8;
    }

    &:hover .plus-button {
        opacity: 1;
    }
}

.plus-button {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -53%);
    width: 18px;
    height: 18px;
    border-radius: 50%;
    cursor: pointer;
    background-color: #ffffff;
    box-shadow: 0px 1px 1px #20211e40, 0px 0px 1px #1E1F214F;
    opacity: 0;
    transition: opacity 100ms ease;

    &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 8px;
        height: 2px;
        background-color: rgb(82, 82, 82);
    }

    &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 2px;
        height: 8px;
        background-color: rgb(87, 87, 87);
    }
}
</style>