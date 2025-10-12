<script setup>
import { ref, watch } from "vue"
import vResizer from '../directives/textResizer'
import vFocus from '../directives/inputFocus'

const props = defineProps({
    label: String,
    modelValue: String,
    defaultFontSize: Number,
    mustFocus: Boolean,
    allowResizing: {
        type: Object, default: () => ({
            enabled: false
        })
    }
})

watch(() => props.mustFocus, (newVal) => {
    console.log(newVal);
    if (newVal) {
        editing.value = true;
        document.getElementById(props.label + '-input')?.focus();
    }
});

const emit = defineEmits(['update:model-value'])

const updateValue = (newValue) => {
    emit('update:model-value', newValue)
}

const editing = ref(false)

window.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        document.activeElement.blur()
    }
});

</script>
<template>
    <p
        :id="label"
        v-show="!editing"
        @click="editing = true"
        :class="label"
        :data-attribute="label"
        :style="{ color: modelValue === '' ? '#e2e2e2' : 'inherit' }"
    >
        {{ modelValue || label }}
    </p>
    <input
        :id="label + '-input'"
        :class="label + '-input restyle-input'"
        v-show="editing"
        v-focus="editing"
        v-on:blur="editing = false;"
        :placeholder="modelValue"
        :style="{ fontSize: props.defaultFontSize + 'pt' }"
        v-resizer="allowResizing.enabled ? { minFontSize: allowResizing.minFontSize, default: props.defaultFontSize, id: label } : false"
        :value="modelValue"
        @input="updateValue($event.target.value)"
    />
</template>

<style scoped>
.name-container {
    container-type: inline-size;
}

.username {
    font-size: 24pt;
}

.username,
.username-input {
    font-weight: bold;
}

.username,
.lookup-job {
    flex-shrink: 1;
}

.lookup-job,
.lookup-job-input {
    font-size: x-large;
}

.extraInfo1,
.extraInfo2 {
    color: azure;
}

.restyle-input {
    display: block;
    box-sizing: border-box;
    height: auto;
    background: transparent;
    border: none;
    padding: 1px 4px 1px 4px;
    margin: 0;
    font-family: inherit;
    color: inherit;
    line-height: normal;
    text-align: inherit;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    outline: none;
    margin: 4px 0;
}

.restyle-input:focus {
    outline: none;
    box-shadow: 0 0 0 2px Highlight;
    border-radius: 5px;
}

.languages-list input {
    max-width: 125px;

    &:focus {
        margin: 3px;
    }
}
</style>