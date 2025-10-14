<script setup>

import { ref, useTemplateRef, onMounted, nextTick } from "vue"

const props = defineProps({
    modelValue: String,
})

const hobbies = ref(props.modelValue)

const emit = defineEmits(['update:hobbies'])

const handleHobbies = (value) => {
    emit('update:hobbies', value)
}

const ta = useTemplateRef('hobbies-textarea')

onMounted(async () => {
    await nextTick()

    ta.value?.addEventListener('input', () => {
        console.log(ta.value.scrollHeight);
        ta.value.style.height = 'auto'
        ta.value.style.height = (ta.value.scrollHeight + 20) + 'px'
    })
    ta.value.style.height = (ta.value.scrollHeight + 0) + 'px'
})

</script>
<template>
    <div class="hobbies">
        <div class="sidebar-label">
            CENTRES D'INTÉRÊT
        </div>
        <ul class="hobbies-list">
            <li>
                <textarea
                    ref="hobbies-textarea"
                    id="hobbiesTextarea"
                    class=""
                    name="hobbies"
                    v-model="hobbies"
                    @change="handleHobbies"
                ></textarea>
            </li>
        </ul>
    </div>
</template>

<style scoped>
.sidebar-label {
    font-size: larger;
    font-weight: bold;
    color: #f0f1f1;
    margin-bottom: 8px;
}

.hobbies textarea {
    all: unset;
    width: 100%;
    /* min-height: 50px; */
    height: auto;
    overflow: hidden;
    resize: none;
    box-sizing: border-box;
    border: none;
    border-radius: 4px;
    scrollbar-width: none;
    font-size: 11pt;

    &:focus {
        outline: none;
        box-shadow: 0 0 0 2px Highlight;
        border-radius: 5px;
    }
}

textarea::-webkit-scrollbar {
    display: none;
}

.hobbies {
    border-radius: 6px;
    padding: 14px 14px 0px 14px;

}

.hobbies {
    ul {
        padding-left: 4px;
    }

    & :deep(p) {
        font-size: 11pt;
    }
}

.hobbies-list {
    margin: 4px 0 -8px 0px;

    li {
        display: flex;
        flex-wrap: wrap;
        list-style: none;
        position: relative;
    }

    & :deep(p) {
        margin: 6px 0;
    }
}
</style>