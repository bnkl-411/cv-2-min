<script setup>

import { computed, ref } from 'vue'
import TextareaSection from "../ui/TextareaSection.vue"
import ButtonRemoveItem from "../ui/ButtonRemoveItem.vue";
import ExpItem from "../blocks/ExpItem.vue"
import draggable from 'vuedraggable'


const cvData = defineModel('cvData', {
    type: Object,
    required: true
});

const $cv = computed(() => cvData.value.cv);

const isDragging = ref(false)

const addItem = (key) => {
    cvData.value =
    {
        ...cvData.value,
        cv: {
            ...$cv.value,
            [key]: [
                ...$cv.value[key],
                {
                    "id": Date.now() + Math.random(),
                    "job": "",
                    "period": "",
                    "extraInfo": "",
                    "description": ""
                }
            ]
        }
    }
}

const removeItem = (category, index) => {
    cvData.value =
    {
        ...cvData.value,
        cv: {
            ...$cv.value,
            [category]: $cv.value[category].toSpliced(index, 1)
        }
    }
}

const onStartDrag = (e) => {
    isDragging.value = true
    e.item.classList.add('is-placeholder')
}

const onEndDrag = (e) => {
    const el = e.item
    if (el) {
        el.classList.remove('is-chosen')
        el.classList.remove('is-placeholder')
    }
    const handleMouseMove = () => {
        isDragging.value = false
        window.removeEventListener('mousemove', handleMouseMove)
    }
    window.addEventListener('mousemove', handleMouseMove)
}

</script>
<template>
    <div class="main">
        <section id="resume">
            <TextareaSection
                v-model="$cv.resume"
                name="resume"
            />
        </section>

        <section id="professional-xp">
            <div class="main-label">Expériences professionelles</div>
            <ul
                class="list"
                :class="{ 'is-dragging': isDragging }"
            >
                <draggable
                    v-model="$cv.jobs"
                    item-key="id"
                    handle=".draggable"
                    @start="onStartDrag"
                    @end="onEndDrag"
                    animation=150
                    easing="cubic-bezier(0.33, 1, 0.68, 1)"
                >
                    <template #item="{ index }">
                        <li class="experience-item">
                            <div class="header">
                                <ExpItem
                                    :index="index"
                                    type="jobs"
                                    v-model="$cv.jobs[index]"
                                />
                                <ButtonRemoveItem @delete="removeItem('jobs', index)" />
                            </div>
                        </li>
                    </template>
                    <template #footer>
                        <button
                            class="addItemButton"
                            @click="addItem('jobs')"
                        >
                        </button>
                    </template>
                </draggable>

            </ul>
        </section>
        <section id="education">
            <div class="main-label">Formation</div>
            <ul class="list">
                <div
                    v-for="(item, index) in $cv.education"
                    :key="index"
                >
                    <li class="experience">
                        <ExpItem
                            :index="index"
                            type="education"
                            v-model="$cv.education[index]"
                        />
                        <ButtonRemoveItem @delete="removeItem('education', index)" />
                    </li>
                </div>
                <button
                    class="addItemButton"
                    @click="addItem('education')"
                >
                </button>
            </ul>
        </section>
    </div>

</template>

<style scoped>
.is-placeholder {
    border: 2px dashed rgb(112, 181, 255);
    background: transparent;
    color: transparent;
    border-radius: 6px;
}

.my-ghost {
    opacity: 0.7;
    transform: scale(1.03);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.is-dragging {
    outline: none;
}

.main {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    margin-left: 12px;
    padding: 0 10px;

    & *:focus:not(.addItemButton) {
        box-shadow: 0 0 0 2px Highlight;
        border-radius: 5px;
    }
}

#resume {
    margin-top: 19px;
    margin-bottom: 10px;
    hyphens: auto;
}

#professional-xp .addItemButton {
    width: 100%;
}

.header {
    display: flex;
    width: 100%;
    min-width: 0;
    align-items: stretch;
}

.experience-item {
    padding: 6px 6px 6px 0;
}

:deep(#ta-resume) {
    font-size: 12pt;
}

.main-label {
    display: inline-flex;
    padding-right: 4px;
    font-size: x-large;
    border-bottom: 2px solid #cbcfd1;
}

li {
    list-style: none;
    position: relative;

    & .header {

        &:hover>.removeItem::after {
            opacity: .9;
        }

        &:hover>.removeItem::before {
            opacity: var(--colorful-opacity);
        }
    }
}

.list {
    padding-left: 0;
    margin: 6px auto;
}
</style>

<style>
/* Règles NON scopées pour gérer le drag */
.list.is-dragging .draggable,
.list.is-dragging .removeItem {
    pointer-events: none !important;
}

.list.is-dragging li:hover .draggable>* {
    opacity: 0 !important;
}

.list.is-dragging li .header:hover>.removeItem::before,
.list.is-dragging li .header:hover>.removeItem::after {
    opacity: 0 !important;
}
</style>