<script setup>
import { ref, inject, nextTick } from 'vue'
import ButtonAddContact from "../ui/ButtonAddContact.vue";
import ItemEditable from '../ui/ItemEditable.vue'
import ButtonRemoveItem from "../ui/ButtonRemoveItem.vue";
import draggable from 'vuedraggable'


const cvData = inject('cvData')
const defaultCvData = inject('defaultCvData')
const focusTarget = ref(null);

const focusNewInput = async (keys) => {
    await nextTick()
    focusTarget.value = cvData.value.cv[keys].length;
}

const addContact = (key, value) => {
    cvData.value = {
        ...cvData.value,
        cv: {
            ...cvData.value.cv,
            contact: [...cvData.value.cv['contact'], { key: key, value }]
        }
    }

    focusNewInput('contact')
    focusTarget.value = null
}

const removeContact = (index) => {
    cvData.value = {
        ...cvData.value,
        cv: {
            ...cvData.value.cv,
            contact: cvData.value.cv.contact.toSpliced(index, 1)
        }
    }
}

</script>
<template>
    <div class="contact">
        <div class="sidebar-label">
            CONTACT
        </div>
        <ul class="list">
            <draggable
                v-model="cvData.cv.contact"
                item-key="key"
                handle=".draggable"
                animation=150
                easing="cubic-bezier(0.33, 1, 0.68, 1)"
            >
                <template #item="{ element, index }">
                    <li class="hoverable">
                        <div class="drag-icon draggable">

                            <font-awesome-icon icon="fa-solid fa-list" />
                        </div>
                        <ItemEditable
                            class="contact-item"
                            :label="element.key"
                            v-model="element.value"
                            :must-focus="focusTarget === cvData.cv.contact.length"
                            placeholder="Nouveau contact"
                        />
                        <ButtonRemoveItem
                            :show="cvData.cv.contact.length > 1"
                            @delete="removeContact(index)"
                        />

                    </li>
                </template>
            </draggable>
            <ButtonAddContact
                :storedData="cvData.cv.contact"
                :defaultData="defaultCvData.cv.contact"
                @addContact="addContact"
            />
        </ul>
    </div>
</template>
<style scoped>
.drag-icon {
    position: absolute;
    left: -35px;
    top: 50%;
    transform: translateY(-50%) translateX(-10px);
    /* background-color: #f8f8f8; */
    background-color: #48a8c0;

    color: white;
    padding: 8px 12px;
    border-radius: 6px;
    /* opacity: 0; */
    pointer-events: all;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;
    box-shadow: 0 4px 12px rgba(96, 135, 208, 0.3);
    cursor: pointer;
}

.drag-icon:hover {
    background-color: #48a8c0;
}

.drag-icon svg {
    width: 16px;
    height: 16px;
}

li:hover .drag-icon {
    opacity: 1;
    transform: translateY(-50%) translateX(0);
}

.drag-icon:hover {
    opacity: 1;
    transform: translateY(-50%) translateX(0);
}
</style>