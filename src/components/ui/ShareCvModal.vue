<script setup>

import { ref } from 'vue'
import { generatePDF } from '@utils/generatePDF'


const isOpen = defineModel()

const shareUrl = ref(null)

const generateShareLink = async () => {
    shareUrl.value = await generatePDF('store')
}
</script>

<template>
    <Teleport to="body">
        <div
            v-if="isOpen"
            class="modal-overlay"
            @click="isOpen = false"
        >
            <div
                class="modal-content"
                @click.stop
            >



                <h2>Générer un lien de votre PDF</h2>
                <p>Avec ce lien vous pourrez facilement partager votre CV
                    dans vos candidatures
                </p>

                <div v-if="shareUrl">
                    <p>Lien de partage :</p>
                    <a
                        :href="shareUrl"
                        target="_blank"
                    >{{ shareUrl }}</a>
                </div>
                <button
                    v-else
                    @click="generateShareLink"
                >
                    Générer le lien
                </button>

                <button @click="isOpen = false">Fermer</button>
            </div>
        </div>
    </Teleport>
</template>


<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    max-width: 500px;
    width: 90%;
}
</style>