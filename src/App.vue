<script setup>
import { ref, provide, computed, watch, onMounted } from 'vue'
import ContainerLeft from "./components/layout/ContainerLeft.vue"
import { exportToPDF } from "./utils/toPDF";

import MainSection from "./components/layout/MainSection.vue";
import Sidebar from "./components/layout/SideBar.vue";
import { dataToJson } from "./utils/dataToJson";
import { useLocalStorage } from "./composables/useLocalStorage";
import cvType1 from "./resources/cvType1.json";
import cvType2 from "./resources/cvType2.json";
import cvType3 from "./resources/cvType3.json";

const cvModels = {
  'cvType1': cvType1,
  'cvType2': cvType2,
  'cvType3': cvType3
};

const currentModel = ref('cvType1');

// Fonction pour créer une nouvelle instance de storage
const createStorage = (modelKey) => {
  return useLocalStorage(modelKey, cvModels[modelKey]);
};

// Instance actuelle du storage
let uls = createStorage(currentModel.value);

// Reactive ref pour les données
const cvData = ref(uls.data.value);

// Watch pour synchroniser les changements de données avec le localStorage
watch(cvData, (newData) => {
  uls.data.value = newData;
}, { deep: true });

// Fonction pour charger un nouveau modèle
const loadModel = (model) => {
  currentModel.value = model;
  // Créer une nouvelle instance de storage
  uls = createStorage(model);
  // Mettre à jour les données réactives
  cvData.value = uls.data.value;
};

// Fonction pour réinitialiser le CV
const initCV = () => {
  uls.clear();
  cvData.value = uls.data.value;
};

provide('cvData', cvData);
provide('defaultCvData', computed(() => cvModels[currentModel.value]));

const downloadJson = () => {
  dataToJson(cvData.value, currentModel.value);
};

// Draggable functionality
const position = ref({ x: 0, y: 0 });
const isDragging = ref(false);
const dragOffset = ref({ x: 0, y: 0 });

const centerContainer = () => {
  const container = document.getElementById('a4-container');
  if (container) {
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    position.value = {
      x: (window.innerWidth - containerWidth) / 2,
      y: (window.innerHeight - containerHeight) / 2
    };
  }
};

onMounted(() => {
  centerContainer();
});

const handleMouseDown = (e) => {
  if (e.target.classList.contains('drag-area')) {
    isDragging.value = true;
    dragOffset.value = {
      x: e.clientX - position.value.x,
      y: e.clientY - position.value.y
    };
  }
};

const handleMouseMove = (e) => {
  if (isDragging.value) {
    position.value = {
      x: e.clientX - dragOffset.value.x,
      y: e.clientY - dragOffset.value.y
    };
  }
};

const handleMouseUp = () => {
  isDragging.value = false;
};

const isLocalhost = window.location.hostname === 'localhost'

</script>

<template>
  <!-- <ContainerLeft /> -->

  <div class="container-left">
    <button @click="exportToPDF">Exporter PDF</button>
    <button @click="initCV">INIT CV</button>
    <button @click="loadModel('cvType1')">LOAD CV MODEL 1</button>
    <button @click="loadModel('cvType2')">LOAD CV MODEL 2</button>
    <button @click="loadModel('cvType3')">LOAD CV MODEL 3</button>
    <button
      v-show="isLocalhost"
      @click="downloadJson"
    >Télécharger</button>

    <div class="color-picker-container"> </div>
  </div>

  <div
    class="drag-area"
    @mousedown="handleMouseDown"
    @mousemove="handleMouseMove"
    @mouseup="handleMouseUp"
  >

    <div
      id="a4-container"
      :style="{
        position: 'absolute',
        left: position.x + 'px',
        top: position.y + 'px',
        pointerEvents: 'none'
      }"
    >
      <Sidebar
        :cvData="cvData"
        @update:cvData="cvData = $event"
      />

      <MainSection
        :cvData="cvData"
        @update:cvData="cvData = $event"
      />
    </div>
  </div>
  <div
    class="disclaimer"
    v-show="!isLocalhost"
  >Ce site est en cours de développement. Il est fonctionnel, mais certaines anomalies ou
    dysfonctionnements peuvent survenir.</div>
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

.drag-area {
  min-height: 100vh;
  background-color: #f5f5f5;
  position: relative;

  &:hover {
    cursor: move;
  }
}

.disclaimer {
  background-color: beige;
  font-style: italic;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  text-align: center;
  margin: 0 auto;
  padding: 12px;
  font-size: 8pt;
}

.sidebar,
.main {
  min-width: 0;
  min-height: 0;
  pointer-events: auto;
}

#a4-container {
  background-color: whitesmoke;
  display: grid;
  grid-template-columns: var(--sidebar-width) 1fr;
  width: 210mm;
  height: 297mm;
  padding: 0 12px 10px 12px;
  box-shadow: 0 4px 5px rgba(75, 75, 75, 0.2);
  box-sizing: border-box;
}

:deep(textarea) {
  all: unset;
  display: block;
  width: 100%;
  height: auto;
  overflow: hidden;
  resize: none;
  box-sizing: border-box;
  border: none;
  border-radius: 4px;
  scrollbar-width: none;
  font-size: 11pt;
  padding: 2px;

  &:focus-within {
    box-shadow: 0 0 0 2px Highlight;
    border-radius: 5px;
  }
}

:deep(textarea::-webkit-scrollbar) {
  display: none;
}

@page {
  size: A4 portrait;
  margin: 0;

  @top-left {
    content: none;
  }

  @top-center {
    content: none;
  }

  @top-right {
    content: none;
  }

  @bottom-left {
    content: none;
  }

  @bottom-center {
    content: none;
  }

  @bottom-right {
    content: none;
  }

}

@media print {

  html,
  body {
    margin: 0;
    padding: 0;
    height: 100%;
    overflow: hidden;
  }

  body * {
    visibility: hidden;
  }

  #a4-container,
  #a4-container * {
    visibility: visible;
  }

  .drag-area {
    position: static !important;
  }

  #a4-container {
    position: fixed !important;
    left: 0 !important;
    top: 0 !important;
    transform: none !important;
    margin: 0 !important;
    box-shadow: none;
    overflow: hidden !important;
  }

  .container-left,
  .disclaimer,
  button {
    display: none !important;
  }

  * {
    page-break-inside: avoid;
    page-break-after: avoid;
  }
}
</style>