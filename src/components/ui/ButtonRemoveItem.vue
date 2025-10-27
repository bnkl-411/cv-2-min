<script setup>

defineProps({
    show: { type: Boolean, default: true }
})

</script>

<template>
    <div
        class="removeItem"
        v-show="show"
        @click="$emit('delete')"
    >
        <font-awesome-icon
            icon="fa-solid fa-circle-xmark"
            style="color: #d06060;"
        />
    </div>
</template>

<style scoped>
.removeItem {
    cursor: pointer;
    z-index: 1;
    margin-top: -13px;
    opacity: 0;

    &>* {
        border: 2px solid rgb(255, 255, 255);
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: #ffffff;
    }
}

.removeItem:hover {
    /* box-shadow: var(--box-shadow-hover); */
}
</style>
