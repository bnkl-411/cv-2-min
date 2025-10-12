<script setup>

defineProps({
    path: String,
})

const emit = defineEmits(['update:path'])

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

</script>
<template>
    <div class="picture_container">
        <label for="user-picture" class="custom-file-upload">
            <img :src="path" class="picture" alt="user_picture" />
            <input id="user-picture" type="file" accept="image/*" value="" @change=uploadPicture>
        </label>
    </div>
</template>

<style scoped>
.sidebar .picture_container {
    max-width: 90%;
    align-self: center;

}

.sidebar img {
    width: 100%;

    cursor: pointer;
    border-radius: 12px;
    height: auto;
    aspect-ratio: 1 / 1;
    object-fit: cover;
}

input[type="file"] {
    display: none;
}
</style>