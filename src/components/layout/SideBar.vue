<script setup>
import { ref, computed, watchEffect, onMounted } from 'vue'
import PictureUploader from "../ui/PictureUploader.vue";
import TextareaSection from "../ui/TextareaSection.vue"
import PersonalInfo from '../blocks/PersonalInfo.vue';
import ContactInfo from '../blocks/ContactInfo.vue';
import SkillsList from '../blocks/SkillsList.vue';
import LanguagesList from '../blocks/LanguagesList.vue';
import ColorPicker from '../ui/ColorPicker.vue';

onMounted(() => {
  console.log('SidebAR');
});

const props = defineProps({
  cvData: {
    type: Object,
    required: true,
  }
});

const colorPickerOpen = ref(false)

const $cv = computed(() => props.cvData.cv);

const emit = defineEmits(["update:cvData"]);

const handleSidebarResize = (event) => {
  emit("update:cvData", {
    ...props.cvData,
    layout: {
      ...props.cvData.layout,
      sidebarSize: event.detail.sidebarWidth,
    }
  });
};

watchEffect(() => {
  if (props.cvData?.layout?.color) {
    document.documentElement.style.setProperty('--main-box-color', props.cvData.layout.color);
  }
});

const handleChangeColor = (color) => {
  console.log('changed color');
  document.documentElement.style.setProperty('--main-box-color', color)
}

</script>
<template>
  <div
    id="sidebar"
    class="sidebar"
    v-wcag-adapter="props.cvData.layout.color"
    v-sidebar-resizer="{
      minWidth: 234,
      maxWidth: 340,
      userWidth: props.cvData.layout.sidebarSize,
    }"
    @sidebar-resized="handleSidebarResize"
  >
    <div class="topbox1 box-color"></div>

    <PersonalInfo v-model="$cv.personal" />

    <PictureUploader
      v-model:path="$cv.picture.path"
      v-model:image-border-radius="$cv.picture.imageBorderRadius"
    />

    <div class="infos box-color">

      <ContactInfo />

      <SkillsList />

      <LanguagesList />

      <div class="hobbies">
        <div class="sidebar-label">
          CENTRES D'INTÉRÊT
        </div>
        <TextareaSection
          v-model="$cv.hobbies"
          name="hobbies"
        />
      </div>
    </div>
    <!-- <button @click="colorPickerOpen = true">Open Modal</button>
    <Teleport to="color-picker-container">
      <div
        v-if="colorPickerOpen"
        class="modal"
      >
        <ColorPicker @changeColor="handleChangeColor" />

        <button @click="colorPickerOpen = false">Close</button>
      </div>
    </Teleport> -->
  </div>
</template>
<style lang="scss" scoped>
.topbox1 {
  min-height: 20px;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
}

.box-color {
  background-color: var(--main-box-color);
}

.sidebar {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  width: var(--sidebar-width);
  gap: 4px;
}

.infos {
  flex: 1;
  border-radius: 6px;
  white-space: normal;
  word-break: break-word;
}

.infos>* {
  color: #f0f1f1;
}

:deep(.sidebar-label) {
  font-size: larger;
  font-weight: bold;
  margin-bottom: 6px;
}

.contact,
.skills,
.languages {
  border-radius: 6px;
  padding: 14px 12px 4px 12px;
}

.hobbies {
  padding: 15px 13px;

  .sidebar-label {
    padding: 0 2px;
  }

  .textarea-section {
    padding: 2px;
  }
}

:deep(ul) {
  padding: 0;

  &>* {
    font-size: 11pt;
  }
}

:deep(.list) {
  display: flex;
  flex-direction: column;
  margin: 4px 0 -8px 0px;
  gap: 3px;

  &>div {
    border: 1px solid;
  }

  li {
    display: flex;
    list-style: none;
    position: relative;
    align-items: center;
    margin-right: -10px;
    padding-right: 10px;

    .removeItem {
      margin-top: 0;
      position: absolute;
      display: flex;
      top: 0;
      right: 0;
      height: 100%;
      align-items: center;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: -18px;
        margin-left: 11px;
      }
    }

    &:focus-within .hoverable {
      box-shadow: 0 0 0 2px Highlight;
      border-radius: 5px;
    }

    &:hover .removeItem,
    .removeItem:hover {
      opacity: var(--colorful-opacity);
      transform: translateX(86%);
    }
  }

  & p {
    margin: 0 0;
  }
}

:deep(.list li) {
  display: flex;
  list-style: none;
  position: relative;
  padding-left: 22px;
  margin-left: -20px;
  align-items: center;

  .drag-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    background-color: #48a8c0;
    color: white;
    padding: 3px;
    border-radius: 6px;
    pointer-events: all;
    white-space: nowrap;
    opacity: 0;
    box-shadow: 0 4px 12px rgba(96, 135, 208, 0.3);
    transition: all 0.3s ease;
    cursor: grab;

    &:hover {
      background-color: #48a8c0;
    }

    &:active {
      border: 1px solid yellow;
      opacity: 1 !important;
    }
  }

  &:hover .drag-icon {
    opacity: 1;
    transform: translateY(-50%) translateX(-50%);
  }

  &.is-dragging .drag-icon {
    opacity: 0 !important;
  }

}
</style>