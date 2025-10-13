<script setup>

import { computed } from 'vue'

const props = defineProps({
    storedData: { type: Array, required: true },
    defaultData: { type: Object, required: false },
    pathPrefix: { type: String, required: true },
    defaultValue: { type: String, default: "Nouvelle entrée" },
});

const emit = defineEmits(["add-contact"]);

const requiredFields = computed(() => {
    if (!props.defaultData) return [];
    return props.defaultData.filter(item => item.required === true);
});

const storedKeys = computed(() => {
    return props.storedData.map(item => item.key);
});

const missingRequiredFields = computed(() => {
    return requiredFields.value.filter(field =>
        !storedKeys.value.includes(field.key)
    );
});

function getUpcomingValue() {
    const [firstMissing] = missingRequiredFields.value;

    if (firstMissing?.key) {
        return {
            key: firstMissing.key,
            value: firstMissing.value,
        };
    }

    return {
        key: 'extraInfo',
        value: props.defaultValue,
    };
}

function handleAdd() {
    const path = `${props.pathPrefix}.${getUpcomingValue().key}`;
    const value = getUpcomingValue().value

    emit("add-contact", path, value, 'add');
}

</script>

<template>
    <button
        class="addItemButton"
        @click="handleAdd"
        aria-label="Ajouter un nouveau contact"
    ></button>
</template>

<style scoped lang="scss"></style>
