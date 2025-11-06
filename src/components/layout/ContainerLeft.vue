<script setup>
import { inject } from 'vue';
import { exportToPDF } from "../../utils/toPDF";

const initCV = inject('initCV');
const loadModel = inject('loadModel');
const isLocalhost = window.location.hostname === 'localhost'

</script>

<template>
    <div class="container-left">
        <button @click="exportToPDF">Exporter PDF</button>
        <button @click="initCV">INIT CV</button>
        <button @click="() => loadModel('cvType1')">LOAD CV MODEL 1</button>
        <button @click="() => loadModel('cvType2')">LOAD CV MODEL 2</button>
        <button @click="() => loadModel('cvType3')">LOAD CV MODEL 3</button>
        <button
            v-show="isLocalhost"
            @click="downloadJson"
        >Télécharger</button>

        <div class="color-picker-container"></div>
    </div>
</template>


<style scoped lang="scss">
.container-left {
    display: flex;
    flex-direction: column;
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    background-color: #ffffff;
    padding: 20px;
    box-sizing: border-box;
    z-index: 1;
    gap: 8px;
}
</style>
