<script setup>
import { computed, ref } from 'vue'
import EditableInput from "./EditableInput.vue";
import ImageUploader from "./ImageUploader.vue";
import AddItemButton from "./AddItemButton.vue";
import languages from "../resources/languages.json"

const languageList = ref(languages)

const props = defineProps({
  cvData: {
    type: Object,
    required: true,
  },
  defaultCvData: {
    type: Object,
    required: true,
  },
});

const $cv = computed(() => props.cvData.cv)
const emit = defineEmits(["update:cvData"]);
const focusTarget = ref(null);

const handleSidebarResize = (event) => {
  emit("update:cvData", {
    ...props.cvData,
    layout: {
      ...props.cvData.layout,
      sidebarSize: event.detail.sidebarWidth,
    }
  });
};

const addItem = (path, value) => {
  const cvData = JSON.parse(JSON.stringify(props.cvData));
  const keys = path.split('.');
  let data = cvData.cv;

  console.log(path, value);
  console.log(keys);

  for (let i = 0; i < keys.length - 1; i++) {
    data = data[keys[i]];
  }

  console.log(data);

  // data.push({ "key": lastKey, "value": value, "required": false })

  // setTimeout(() => {
  //   focusTarget.value = index;

  // }, 0);
  // focusTarget.value = null;
};


const updateSkills = (index, value) => {
  emit("update:cvData", {
    ...props.cvData,
    cv: {
      ...props.cvData.cv,
      skills: props.cvData.cv.skills.map((skill, i) => i === index ? value : skill)
    }
  });
};

const updateContact = (path, value) => {
  const keys = path.split('.');
  const lastKey = keys[keys.length - 1];

  emit("update:cvData", {
    ...props.cvData,
    cv: {
      ...props.cvData.cv,
      contact: $cv.value.contact.map(item =>
        item.key === lastKey ? { ...item, value } : item
      )
    }
  });
};

const updatePicture = (value) => {
  emit("update:cvData", {
    ...props.cvData,
    cv: {
      ...props.cvData.cv,
      picture: $cv.value.picture = value
    }
  }
  );
};

const updatePersonal = (path, value) => {
  const keys = path.split('.');
  const lastKey = keys[keys.length - 1];

  emit("update:cvData", {
    ...props.cvData,
    cv: {
      ...props.cvData.cv,
      personal: $cv.value.personal.map(item =>
        item.key === lastKey ? { ...item, value } : item
      )
    }
  });
};

const removeItem = (path, index) => {
  const cvData = JSON.parse(JSON.stringify(props.cvData));
  const keys = path.split('.');
  let data = cvData.cv;

  for (let i = 0; i < keys.length - 1; i++) {
    data = data[keys[i]];
  }
  const lastKey = keys[keys.length - 1];

  if (Array.isArray(data) && data.length > 0 && data[0].hasOwnProperty('key')) {
    const item = data.find(i => i.key === lastKey);
    console.log(item);

    const index = data.indexOf(item);
    if (index > -1) {
      data.splice(index, 1);
    }
  }
  else {
    console.log(data[lastKey]);
    if (data.length < 1) {

      return
    }
    data[lastKey].splice(index, 1);

  }
  emit("update:cvData", cvData);
}

</script>

<template>
  <div
    id="sidebar"
    class="sidebar"
    v-sidebar-resizer="{
      minWidth: 238,
      maxWidth: 340,
      userWidth: props.cvData.layout.sidebarSize,
    }"
    @sidebar-resized="handleSidebarResize"
  >
    <div class="topbox1 box-color"></div>
    <div class="personal">
      <EditableInput
        label="username"
        :modelValue="$cv.personal[0].value"
        @update:modelValue="updatePersonal('personal.username', $event)"
        :defaultFontSize="24"
        :allow-resizing="{ enabled: true, minFontSize: 16 }"
      />
      <EditableInput
        label="lookup-job"
        :modelValue="$cv.personal[1].value"
        @update:modelValue="updatePersonal('personal.job', $event)"
        :defaultFontSize="18"
        :allow-resizing="{ enabled: true, minFontSize: 14 }"
      />
    </div>

    <ImageUploader
      :path="$cv.picture"
      @update:path="updatePicture($event)"
    />

    <div class="infos box-color">

      <div class="contact">
        <div class="sidebar-label">
          CONTACT
        </div>
        <ul class="contact-list">
          <li
            v-for="(contact, index) in $cv.contact"
            :key="contact.key"
          >

            <EditableInput
              :label="contact.key"
              :modelValue="$cv.contact[index].value"
              @update:modelValue="updateContact(`contact.${contact.key}`, $event)"
              :defaultFontSize="11"
              :must-focus="focusTarget === ($cv.contact.length - 1)"
            />

            <div
              class="removeItem"
              v-show="$cv.contact.length > 1"
              @click="removeItem(`contact.${contact.key}`, index)"
            >
            </div>
          </li>
          <AddItemButton
            :storedData="$cv.contact"
            :defaultData="defaultCvData.cv.contact"
            pathPrefix="contact"
            defaultValue="LinkedIn, site perso, Twitter/X..."
            @addItem="addItem"
          />

        </ul>
      </div>

      <div class="skills">

        <div class="sidebar-label">
          COMPÉTENCES
        </div>

        <ul class="skills-list">
          <li
            v-for="(skill, index) in $cv.skills"
            :key="index"
          >
            <EditableInput
              :label="'skills'"
              :modelValue="$cv.skills[index]"
              @update:modelValue="updateSkills(index, $event)"
              :defaultFontSize="12"
            />

            <div
              class="removeItem"
              v-show="$cv.skills.length > 1"
              @click="removeItem('skills', index)"
            >
            </div>
          </li>
          <AddItemButton
            :storedData="$cv.skills"
            pathPrefix="skills"
            defaultValue="Nouvelle compétence"
            @addItem="addItem"
          />
        </ul>

      </div>

      <div class="languages">

        <div class="sidebar-label">
          LANGUES
        </div>

        <ul class="languages-list">
          <li
            v-for="(language, index) in $cv.spokenLanguages"
            :key="language.language"
          >
            <label>
              <p>
                <select
                  name="language-name"
                  :id="`language-select-${index}`"
                  class="language-select"
                  :value="$cv.spokenLanguages[index].value"
                  @change="updateLanguage(`spokenLanguages.lang${index + 1}`, $event.target.value, index)"
                >
                  <option value="">Sélectionnez...</option>
                  <option
                    v-for="item in languageList"
                    :key="item.code"
                    :value="item.name"
                  >
                    {{ item.name }}
                  </option>
                </select>
              </p>
            </label>

            <label :for="`level-select-${index}`"></label>
            <select
              name="language-level"
              :id="`level-select-${index}`"
              :value="$cv.spokenLanguages[index].level"
              @change="updateLanguage('spokenLanguages.level', $event.target.value, index)"
            >
              <option value="">-- Sélectionnez un niveau --</option>
              <option value="A1">A1</option>
              <option value="A2">A2</option>
              <option value="B1">B1</option>
              <option value="B2">B2</option>
              <option value="C1">C1</option>
              <option value="C2">C2</option>
            </select>
          </li>
          <AddItemButton
            :storedData="$cv.spokenLanguages"
            :defaultData="defaultCvData.cv.spokenLanguages"
            pathPrefix="spokenLanguages"
            defaultValue="LinkedIn, site perso, Twitter/X..."
            @addItem="addItem"
          />
        </ul>
      </div>

      <div class="hobbies">
        <div class="sidebar-label">
          CENTRES D'INTÉRÊT
        </div>
        <ul class="hobbies-list">
          <li>
            <p>
              Musique, arts graphiques, sports de glisse, sports de combat,
              mécanique, travail manuel
            </p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.topbox1 {
  min-height: 20px;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
}

.personal {
  display: flex;
  flex-wrap: wrap;
  padding: 0 5px;

  :deep(p) {
    margin: 0;
  }
}

.box-color {
  background-color: var(--main-box-color);
}

.sidebar,
.main {
  min-width: 0;
  min-height: 0;
}

.sidebar {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  margin: 0 auto;
  width: var(--sidebar-width);
  overflow: hidden;
  gap: 8px;
  padding: 0 6px;
}

.skills-list {
  hyphens: auto;
}

.languages-list {
  p {
    margin: 4px 0;
  }
}

.infos {
  flex: 1;
  border-top-right-radius: 6px;
  border-top-left-radius: 6px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  white-space: normal;
  word-break: break-word;
}

.infos>* {
  color: rgb(241, 241, 224);
}

.sidebar-label {
  font-size: larger;
  font-weight: bold;
  color: #f0f1f1;
  margin-bottom: 10px;
}

.contact,
.skills,
.hobbies,
.languages {
  border-radius: 6px;
  padding: 14px 14px 0px 14px;

}

.languages-list {
  :deep(p) {
    margin: 4px 0;
  }
}

.languages,
.skills,
.contact,
.hobbies {
  ul {
    padding-left: 4px;
  }

  & :deep(p) {
    font-size: 11pt;
  }
}

ul.languages-list li {
  display: flex;
  justify-content: space-between;
}

.languages-list input {
  max-width: 125px;

  &:focus {
    margin: 3px;
  }
}

.skills-list,
.contact-list,
.hobbies-list,
.languages-list {
  margin: 4px 0 -8px 0px;

  li {
    display: flex;
    flex-wrap: wrap;
    list-style: none;
    position: relative;

    &:hover>.removeItem::after {
      opacity: .9;
    }

    &:hover>.removeItem::before {
      opacity: var(--colorful-opacity);
    }

    &:hover .newItem:hover~.removeItem::after,
    &:hover .newItem:hover~.removeItem::before {
      opacity: 0 !important;
    }
  }

  & :deep(p) {
    margin: 8px 0;
  }
}

.removeItem {
  cursor: pointer;
  position: absolute;
  right: 0;

  &::before {
    content: '';
    position: absolute;
    top: 9px;
    right: 0;
    background-color: var(--colorful-button-remove);
    box-shadow: rgba(0, 0, 0, 0.35) 0px 2px 1px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    z-index: 3;
    opacity: 0;
  }

  &::after {
    content: "-";
    position: absolute;
    top: 9px;
    right: 0;
    color: #ffffff;
    font-weight: bolder;
    font-size: x-large;
    text-align: center;
    opacity: 0;
    line-height: 10pt;
    margin-right: 2.4px;
    z-index: 4;
  }

  &::before,
  &::after {
    transition: opacity ease-in;
    transition-duration: 122ms;
  }
}

.skills-list:last-child:hover .newItem,
.contact-list:last-child:hover .newItem,
.languages-list:last-child:hover .newItem {
  height: 22px;
  margin-top: 7px;

  &::before {
    opacity: var(--colorful-opacity);
    width: 100%;
  }

  &::after {
    opacity: 0.9;
  }
}

button.addItem {
  all: unset;
}

.contact:hover {
  & .contact-list {
    padding-bottom: 14px;
  }
}

.newItem {
  position: relative;
  width: 98%;
  height: 0;
  cursor: pointer;
  border-radius: 5px;
  transition: height 100ms ease-out;
  margin: 0;

  &::before {
    content: '';
    position: absolute;
    background-color: var(--colorful-button-add);
    border-radius: 5px;
    opacity: 0;
    height: 22px;
    z-index: 1;
    width: 100%;
    transition: width 100ms ease-out;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 2px 1px;
  }

  &::after {
    content: '+';
    position: absolute;
    top: 50%;
    left: 51%;
    transform: translate(-50%, -50%);
    font-weight: bold;
    font-size: 18px;
    color: #ffffff;
    opacity: 0;
    z-index: 2;
    pointer-events: none;
  }
}

.language-select {
  width: 88%;
}

select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  border: none;
  background: transparent;
  color: inherit;
  font: inherit;
  padding: 0;
  margin: 0;
  outline: none;
  box-shadow: none;
  width: 20%;
  min-width: 0;
  height: auto;
  text-align: inherit;
  text-transform: none;
  letter-spacing: normal;
  cursor: pointer;
}

select option {
  color: #000;
  background-color: #fff;
}

.select:focus {
  outline: -webkit-focus-ring-color auto 1px;
}
</style>