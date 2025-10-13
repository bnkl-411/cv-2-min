<script setup>

defineProps({
    path: String,
    imageBorderRadius: { type: Number, default: 2 },
})

const emit = defineEmits(['update:path', 'update:imageBorderRadius'])

const uploadPicture = (e) => {
    const file = e.target.files.item(0)

    if (!file) { return false }
    if (!file.type.match('image.*')) { return false }

    const fileReader = new FileReader(file)

    fileReader.onload = (evt) => {
        emit('update:path', evt.target.result)
    };
    fileReader.readAsDataURL(file);
}

const updateRadius = (value) => {
    emit('update:imageBorderRadius', Number(value))
}

</script>
<template>
    <div class="picture_container">
        <label
            for="user-picture"
            class="custom-file-upload"
        >
            <div class="image-wrapper">
                <img
                    :src="path"
                    class="picture"
                    :style="{ borderRadius: imageBorderRadius + '%' }"
                    alt="user_picture"
                />

                <div class="btns_container">
                    <div class="image-btn green">↻</div>
                    <div class="image-btn red">−</div>
                </div>
                <input
                    class="radiusAdjuster"
                    type="range"
                    :value="imageBorderRadius"
                    @change="updateRadius($event.target.value)"
                    min="0"
                    max="50"
                />
            </div>
            <input
                id="user-picture"
                type="file"
                accept="image/*"
                value=""
                @change=uploadPicture
            >
        </label>
    </div>
</template>

<style scoped>
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

input[type="file"] {
    display: none;
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
    z-index: 3;
    cursor: pointer;
    transition: opacity 0.3s ease;
}

.image-wrapper:hover .radiusAdjuster {
    opacity: 0.6;
}

.image-wrapper::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.3);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 1;
}

.image-wrapper:hover::before {
    opacity: 0.9;
}

.btns_container {
    position: absolute;
    display: flex;
    gap: 8px;
    top: 14px;
}

.image-btn {
    width: 25px;
    height: 25px;
    border-radius: 6px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 500;
    font-size: 18px;
    color: white;
    opacity: 0;
    z-index: 2;
    transition: opacity 0.3s ease;
    cursor: pointer;
    box-shadow: var(--box-shadow-base);
}

.image-btn.green {
    background-color: #55B39A;
}

.image-btn.red {
    background-color: #B36B55;
}

.image-wrapper:hover .image-btn {
    opacity: 0.9;
    pointer-events: auto;
}

.image-wrapper:hover .image-btn:hover {
    opacity: 1;
    box-shadow: var(--box-shadow-hover);
    transform: scale(1.1);
    transition: opacity 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.image-wrapper:hover .radiusAdjuster:hover {
    opacity: 1;
}
</style>