<script setup>
import { ref } from 'vue';

const props = defineProps({
    imageSrc: { type: String, required: true },
    show: { type: Boolean, default: false },
    compressionQuality: { type: Number, default: 0.8 }
});

const emit = defineEmits(['close', 'crop']);

const cropContainer = ref(null);

/**
 * Compresse une image base64
 * @param {string} base64 - Image en base64
 * @param {number} quality - Qualité de compression (0-1)
 * @returns {Promise<string>} - Image compressée en base64
 */
const compressImage = (base64, quality = 0.8) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            const compressed = canvas.toDataURL('image/jpeg', quality);
            resolve(compressed);
        };
        img.src = base64;
    });
};

const handleCrop = async () => {
    if (cropContainer.value && cropContainer.value._getCroppedImage) {
        const croppedBase64 = cropContainer.value._getCroppedImage();

        const compressedImage = await compressImage(croppedBase64, props.compressionQuality);

        emit('crop', compressedImage);
    }
};

const handleClose = () => {
    emit('close');
};
</script>

<template>
    <Teleport to="body">
        <Transition name="modal">
            <div
                v-if="show"
                class="modal-overlay"
            >
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Recadrer l'image</h3>
                        <button
                            class="close-btn"
                            @click="handleClose"
                        >&times;</button>
                    </div>

                    <div class="modal-body">
                        <div
                            ref="cropContainer"
                            v-croppable
                            class="crop-container"
                        >
                            <img
                                :src="imageSrc"
                                alt="Image à recadrer"
                            />
                        </div>
                        <p class="help-text">
                            Déplacez le cadre et utilisez la poignée pour redimensionner
                        </p>
                    </div>

                    <div class="modal-footer">
                        <button
                            class="btn-cancel"
                            @click="handleClose"
                        >Annuler</button>
                        <button
                            class="btn-crop"
                            @click="handleCrop"
                        >Valider</button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    border-radius: 8px;
    max-width: 500px;
    width: 90%;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
}

.close-btn {
    background: none;
    border: none;
    font-size: 28px;
    cursor: pointer;
    color: #6b7280;
    line-height: 1;
    padding: 0;
    width: 30px;
    height: 30px;
}

.close-btn:hover {
    color: #111827;
}

.modal-body {
    padding: 20px;
    overflow: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
}

.crop-container {
    max-width: 400px;
    user-select: none;
}

.crop-container img {
    max-width: 400px;
    width: 100%;
    height: auto;
    display: block;
}

.help-text {
    font-size: 12px;
    color: #6b7280;
    margin: 0;
    text-align: center;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 16px 20px;
    border-top: 1px solid #e5e7eb;
}

.btn-cancel,
.btn-crop {
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    border: none;
    transition: all 0.2s;
}

.btn-cancel {
    background: #f3f4f6;
    color: #374151;
}

.btn-cancel:hover {
    background: #e5e7eb;
}

.btn-crop {
    background: #3b82f6;
    color: white;
}

.btn-crop:hover {
    background: #2563eb;
}

.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
    transition: transform 0.2s ease;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
    transform: scale(0.95);
}
</style>