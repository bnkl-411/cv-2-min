import { createApp } from 'vue'
import App from './App.vue'
import '../src/assets/styles/variables.css'
import colorWheel from './directives/colorWheel'
import sidebarResizer from './directives/sidebarResizer'
import fontSizeEditor from './directives/fontSizeEditor';
import wcagAdapter from './directives/wcagAdapter'
import { croppable } from './directives/croppable'
import { createGtag } from "vue-gtag";

const app = createApp(App)

const gtag = createGtag({
  tagId:  "G-5F1ZH0FHK5"
})

app.use(gtag)

app.config.performance = true

app.directive('colorWheel', colorWheel)
app.directive('fontSizeEditor', fontSizeEditor)
app.directive('sidebarResizer', sidebarResizer)
app.directive('croppable', croppable)
app.directive('wcagAdapter', wcagAdapter)
app.mount('#app')