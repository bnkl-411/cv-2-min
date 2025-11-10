<script setup>
import { ref, inject, nextTick } from 'vue'
import ItemEditable from '../ui/ItemEditable.vue'
import ButtonRemoveItem from "../ui/ButtonRemoveItem.vue";
import ButtonAddSkill from "../ui/ButtonAddSkill.vue";
import draggable from 'vuedraggable'

const cvData = inject('cvData')
const focusTarget = ref(null);
const isDragging = ref(false)

const focusNewInput = async (keys) => {
    await nextTick()
    focusTarget.value = cvData.value.cv[keys].length;
}

const addSkills = () => {
    cvData.value = {
        ...cvData.value,
        cv: {
            ...cvData.value.cv,
            skills: [...cvData.value.cv['skills'], ""]
        }
    }

    focusNewInput('skills')
    focusTarget.value = null
}

const removeSkill = (index) => {
    cvData.value = {
        ...cvData.value,
        cv: {
            ...cvData.value.cv,
            skills: cvData.value.cv.skills.toSpliced(index, 1)
        }
    }
}

</script>
<template>
    <div class="skills">
        <div class="sidebar-label">
            COMPÉTENCES
        </div>
        <draggable
            v-model="cvData.cv.skills"
            item-key="key"
            handle=".draggable"
            animation=150
            easing="cubic-bezier(0.33, 1, 0.68, 1)"
            tag="ul"
            class="list"
        >
            <template #item="{ index }">

                <li
                    class="draggable"
                    :class="{ 'is-dragging': isDragging }"
                    @dragstart="isDragging = true"
                    @dragend="isDragging = false"
                >
                    <div class="hoverable item">
                        <ItemEditable
                            :label="'skill'"
                            v-model="cvData.cv.skills[index]"
                            :must-focus="focusTarget === (cvData.cv.skills.length)"
                            placeholder="Nouvelle compétence"
                        />

                        <ButtonRemoveItem
                            :show="cvData.cv.skills.length > 1"
                            @click="removeSkill(index)"
                        />
                    </div>
                </li>
            </template>
            <template #footer>
                <ButtonAddSkill @addSkill="addSkills" />
            </template>
        </draggable>
    </div>
</template>
<style scoped>
.skills {
    hyphens: auto;
}

.item {
    flex: 1;
}
</style>