<script setup>
import { ref, computed, nextTick, onMounted, watch, inject } from "vue"
import vFocus from '@directives/inputFocus'
import { useEditingState } from '@composables/useEditingState'
import { useDebouncer } from '@composables/useDebouncer'

const cvData = inject('cvData')

const props = defineProps({
    name: { type: String, required: true },
    placeholder: { type: String, default: '' },
    mustFocus: { type: Boolean, default: false }
})

const modelValue = defineModel({ type: String })

const { editing, startEditing, endEditing } = useEditingState()

const { localValue, updateModelValue, flushUpdate, resetLocal } = useDebouncer(
    modelValue,
    { delay: 500, isEditing: editing }
)

const customFontSize = computed(() => {
    return cvData.value?.configuration?.fontSize?.[props.name]
        ? `${cvData.value.configuration.fontSize[props.name]}pt`
        : ''
})

const textareaRef = ref(null)

const isEmpty = computed(() => !localValue.value)

const itemClasses = computed(() => [
    'extra-padding',
    'item',
    'hoverable',
    { 'greyed-out': isEmpty.value }
])

const textareaClasses = computed(() => [
    'extra-padding',
    'textarea-section',
    'hoverable',
    `ta-${props.name}`
])

const heightAdjust = () => {
    if (!textareaRef.value) return

    requestAnimationFrame(() => {
        textareaRef.value.style.height = 'auto'
        textareaRef.value.style.height = textareaRef.value.scrollHeight + 'px'
    })
}

const activateEditing = async () => {
    resetLocal()
    startEditing()

    await nextTick()
    textareaRef.value?.focus()
    heightAdjust()
}

const handleInput = () => {
    heightAdjust()
    updateModelValue()
}

const handleKeydown = (e) => {
    if (e.key === "Enter" && e.ctrlKey) {
        e.target.blur()
    }
}

const handleBlur = () => {
    flushUpdate()
    endEditing()
}

onMounted(async () => {
    if (props.mustFocus) {
        await activateEditing()
    }

    if (document.fonts) {
        document.fonts.ready
            .then(heightAdjust)
            .catch(() => { })
    }
})

watch(() => props.mustFocus, (newVal) => {
    if (newVal) activateEditing()
})

watch(localValue, () => {
    if (editing.value) {
        nextTick(heightAdjust)
    }
})
</script>

<template>
    <div
        :id="props.name"
        :style="{ fontSize: customFontSize }"
    >
        <div
            :class="itemClasses"
            v-show="!editing"
            @click="activateEditing"
            v-bind="$attrs"
            :data-attribute="name"
        >
            {{ localValue || placeholder }}
        </div>
        <textarea
            ref="textareaRef"
            :class="textareaClasses"
            :name="name"
            v-show="editing"
            v-focus="editing"
            v-model="localValue"
            @input="handleInput"
            @blur="handleBlur"
            @keydown="handleKeydown"
            rows="1"
            :placeholder="props.placeholder"
            autocomplete="off"
        ></textarea>
    </div>
</template>