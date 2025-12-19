<script setup>

import { useRouter } from 'vue-router'
const router = useRouter()

const cvMaker = () => {
    router.push({ name: 'cv' })
}
const cvImport = () => {
    router.push('/cv')
}
</script>

<template>
    <div class="navigation-container">
        <h1 class="heading">Le CV parfait. Sans effort.</h1>
        <h2 class="subheading">Créez un CV optimisé ATS en quelques minutes avec un
            éditeur intelligent qui vous guide à chaque étape. L'IA
            fait le reste.</h2>

        <h3>Valorisez votre parcours, multipliez vos opportunités.</h3>
        <div class="button-group">
            <button
                @click="cvMaker"
                class="nav-button"
            >
                Créer votre CV
            </button>
            <button
                @click="cvImport"
                class="nav-button"
            >
                Importer un CV
            </button>
        </div>
    </div>
</template>

<style scoped>
.navigation-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 1252px;
    min-height: 100vh;
    margin: 0 auto;
    padding: 20px;
    text-align: center;
    justify-content: flex-start;
    margin: 12vh auto;
}

.heading {
    font-size: 26pt;
    padding: 0;
    text-wrap: balance;
    color: #161616;
    width: 25%;
    margin: 22px auto;
    letter-spacing: 1px;
}

.subheading {
    font-size: 16pt;
    margin: 0 auto;
    max-width: 700px;
    padding: 0;
    text-wrap: balance;
    font-weight: 300;
    margin-bottom: 30px;
}

.button-group {
    display: flex;
    gap: 20px;
}

.nav-button {
    font-family: "Inter", "Roboto", -apple-system, "San Francisco", "Segoe UI", "Helvetica Neue", sans-serif;
    padding: 12px 22px;
    font-size: 16px;
    font-weight: 500;
    color: white;
    background-color: #3b82f6;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.nav-button:hover {
    background: #0075de;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.nav-button:active {
    transform: translateY(0);
}
</style>