import { ref, computed, watch } from 'vue'
import { useLocalStorage } from "./useLocalStorage";
import cvType1 from "../resources/cvType1.json";
import cvType2 from "../resources/cvType2.json";
import cvType3 from "../resources/cvType3.json";

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

let uls = createStorage(currentModel.value);

// Reactive ref pour les données
const cvData = ref(uls.data.value);

// Watch pour synchroniser les changements de données avec le localStorage
watch(cvData, (newData) => {

    console.log('watching cvDATA');
    console.log(cvData.value.layout);
    uls.data.value = newData;
}, { deep: true });

export function useCvState() {
    // Load a model
    const loadModel = (model) => {
        currentModel.value = model;
        // Créer une nouvelle instance de storage
        uls = createStorage(model);
        // Mettre à jour les données réactives
        cvData.value = uls.data.value;
    };

    const initCV = () => {
        uls.clear()
        cvData.value = structuredClone(cvModels[currentModel.value])
    }

    const defaultCvData = computed(() => cvModels[currentModel.value])

    return {
        cvData,
        defaultCvData,
        currentModel,
        loadModel,
        initCV
    }
}