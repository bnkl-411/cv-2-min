<script setup>
import { computed } from 'vue'

const props = defineProps({
    storedData: { type: Array, required: true },
    defaultData: { type: Object, required: false },
    pathPrefix: { type: String, required: true },
    defaultValue: { type: String, default: "Nouvelle entrée" },
});

const emit = defineEmits(["add-item"]);

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

    emit("add-item", path, value);
}
</script>

<template>
    <button
        class="addItemButton"
        @click.prevent
    ></button>
    <div
        class="newItem"
        @click="handleAdd"
    ></div>
</template>

<style scoped lang="scss">
.newItemWrapper {

    position: relative;
    height: 0;
}

.addItemButton {
    all: unset;
    cursor: pointer;
}

.newItem {
    position: relative;
    width: 98%;
    height: 0;
    cursor: pointer;
    border-radius: 5px;
    transition: height 100ms ease-out;
    margin: 0;

    &::before {
        content: '';
        position: absolute;
        background-color: var(--colorful-button-add);
        border-radius: 5px;
        opacity: 0;
        height: 22px;
        z-index: 1;
        width: 100%;
        transition: width 100ms ease-out;
        box-shadow: rgba(0, 0, 0, 0.35) 0px 2px 1px;
    }

    &::after {
        content: '+';
        position: absolute;
        top: 50%;
        left: 51%;
        transform: translate(-50%, -50%);
        font-weight: bold;
        font-size: 18px;
        color: #ffffff;
        opacity: 0;
        z-index: 2;
        pointer-events: none;
    }
}

.skills-list:last-child:hover .newItem,
.contact-list:last-child:hover .newItem,
.languages-list:last-child:hover .newItem {
    height: 22px;
    margin-top: 7px;

    &::before {
        opacity: var(--colorful-opacity);
        width: 100%;
    }

    &::after {
        opacity: 0.9;
    }
}
</style>
