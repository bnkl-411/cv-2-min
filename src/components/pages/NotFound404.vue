<template>
    404 not found
    <button @click="goToLanding">Retourner à l'accueil</button>

</template>
<script setup>
const goToLanding = () => {
    window.location.href = '/'
}
</script>