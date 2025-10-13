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
    ></div>
</template>
