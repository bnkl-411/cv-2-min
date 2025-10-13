<script setup>
import Sidebar from "./components/SideBar.vue";
import { useLocalStorage } from "./composables/useLocalStorage";
import defaultCvData from "./resources/defaultCvData.json";

const dlJSON = () => {
  const jsonLocalStorage = localStorage.getItem("cvData")
  const blob = new Blob([jsonLocalStorage], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = 'cvData.json'
  a.click()

  URL.revokeObjectURL(url)
}

const { value: data, clear: clearCvData } = useLocalStorage(
  "cvData",
  defaultCvData
);

</script>

<template>
  <!-- <button @click="print">Download PDF</button> -->
  <button @click="clearCvData">Réinitialiser les données</button>
  <button @click="clearLayout">Réinitialiser le template</button>
  <button @click="dlJSON">Télécharger</button>

  <div id="container">
    <Sidebar
      :cvData="data"
      :defaultCvData="defaultCvData"
      @update:cvData="data = $event"
    />

    <div class="main">
      <section id="bio">
        <p>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Veniam,
          aliquid quod! Harum, dolorum assumenda. Iusto ullam deserunt officia
          enim in voluptatibus impedit voluptates aliquid debitis architecto,
          delectus excepturi eaque necessitatibus.
        </p>
      </section>
      <section id="professional-xp">
        <div class="main-label">Expériences professionelles</div>
        <ul class="jobs">
          <li class="job">
            <div class="job-header">
              <div class="job-date">2011-2013</div>
              <div class="job-label">Eleveur de hérissons</div>
            </div>
            <p class="job-description">
              Durant cette période j'ai élevé beaucoup de petits hérissons et je
              les ai soignés et puis aussi bla bla bla bla bla bla bla bla
            </p>
          </li>
          <li class="job">
            <div class="job-header">
              <div>
                <div class="job-date">2016-2017</div>
                <div class="extra-date">6 mois</div>
              </div>
              <div class="job-label">Eleveur de bestioles</div>
            </div>
            <p class="job-description">
              Durant cette période j'ai élevé beaucoup de petites bestioles et
              je les ai soignées et puis aussi bla bla bla bla bla bla bla bla
            </p>
          </li>
        </ul>
      </section>
      <section id="xtra-xp">
        <div class="main-label">Expériences extra-professionelles</div>
        <ul class="xtra">
          <li class="xtra-job">
            <div class="xtra-job-header">
              <div class="xtra-job-label">Eleveur de bestioles</div>
            </div>
            <p class="xtra-job-description">
              Durant cette période j'ai élevé beaucoup de petites bestioles et
              je les ai soignées et puis aussi bla bla bla bla bla bla bla bla
            </p>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<style scoped>
#container {
  background-color: whitesmoke;
  display: grid;
  grid-template-columns: var(--sidebar-width) 1fr;
  width: 210mm;
  height: 297mm;
  padding: 0 10px 10px 10px;
  margin: 37px auto;
  box-shadow: 0 4px 5px rgba(75, 75, 75, 0.2);
}

.main {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  margin-left: 12px;
  padding: 0 11px;
  hyphens: auto;
}

.main section {
  flex: 0 1 0;
}

#bio p {
  margin-top: 19px;
}

.job,
.xtra-job {
  display: flex;
  flex-direction: column;
}

.main-label {
  display: inline-flex;
  padding-right: 11px;
  font-size: x-large;
  border-bottom: 2px solid #cbcfd1;
}

.job-header,
.xtra-job-header {
  display: flex;
  gap: 1rem;
}

.job-date {
  font-weight: 500;
  align-self: flex-start;
}

.extra-date {
  align-self: flex-end;
  font-size: smaller;
  font-style: italic;
}

.job-label {
  flex: 1;
}

.job-description,
.xtra-job-description {
  font-size: 14px;
  margin-top: 0.25rem;
}

.job-label,
.xtra-job-label {
  font-weight: bold;
}
</style>