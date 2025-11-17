<script setup>
import { ref, computed } from 'vue';
import ButtonRemoveItem from "../ui/ButtonRemoveItem.vue";
import uploadIcon from '@icons/upload.svg'
import { getDefaultPicture } from '../../utils/defaultImage'

const picture = defineModel({ type: Object, required: true })
const fileInputRef = ref(null)

const displayImage = computed(() =>
    picture.value.path && picture.value.path !== ''
        ? picture.value.path
        : getDefaultPicture('female')
)

const isDisabled = () => !picture.value.path || picture.value.path === ""

const removePicture = () => {
    picture.value.path = ""
}

const uploadPicture = (e) => {
    const file = e.target.files.item(0)
    if (!file || !file.type.match('image.*')) return

    const reader = new FileReader()
    reader.onload = (event) => {
        picture.value.path = event.target.result
        e.target.value = ''
    }
    reader.readAsDataURL(file)
}

const triggerFileInput = () => {
    fileInputRef.value?.click()
}
</script>

<template>
    <div class="picture_container">
        <div
            class="image-wrapper"
            :style="{ borderRadius: picture.imageBorderRadius + '%' }"
        >
            <img
                :src="displayImage"
                class="picture"
                :style="{ borderRadius: picture.imageBorderRadius + '%' }"
                alt="user_picture"
                @click="triggerFileInput"
            />

            <input
                ref="fileInputRef"
                type="file"
                accept="image/*"
                @change="uploadPicture"
                style="display: none;"
            />

            <div
                class="upload-overlay"
                @click="triggerFileInput"
            >
                <img
                    :src="uploadIcon"
                    alt="upload_icon"
                    class="upload-icon"
                />
            </div>

            <input
                class="radiusAdjuster"
                type="range"
                v-model.number="picture.imageBorderRadius"
                min="2"
                max="50"
                v-show="!isDisabled()"
            />
        </div>

        <ButtonRemoveItem
            :show="!isDisabled()"
            :class="['remove-btn', { disabled: isDisabled() }]"
            @click="removePicture()"
        />
    </div>
</template>

<style scoped>
.picture_container {
    position: relative;
}

.image-wrapper {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    margin-bottom: 4px;
}

.sidebar .picture_container {
    max-width: 89%;
    align-self: center;
}

.picture {
    width: 100%;
    cursor: pointer;
    height: auto;
    aspect-ratio: 1 / 1;
    object-fit: cover;
    transition: border-radius 0.1s ease;
}

.radiusAdjuster {
    position: absolute;
    bottom: 10px;
    width: 40%;
    opacity: 0;
    z-index: 2;
    cursor: pointer;
    transition: opacity 0.3s ease;
}

.image-wrapper:hover .radiusAdjuster {
    opacity: 0.8;
}

.upload-overlay {
    position: absolute;
    inset: 0;
    background: rgba(223, 223, 223, 0.6);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}

.image-wrapper:hover .upload-overlay {
    opacity: 0.95;
}

.upload-overlay .upload-icon {
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.remove-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    opacity: 0;
    z-index: 2;
    transition: opacity 0.3s ease;
}

.picture_container:hover .remove-btn {
    opacity: 0.9;
}

.picture_container:hover .remove-btn:hover {
    opacity: 1;
    transform: scale(1.1);
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.image-wrapper:hover .radiusAdjuster:hover {
    opacity: 1;
}
</style>