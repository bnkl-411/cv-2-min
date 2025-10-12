import { createApp } from 'vue'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import App from './App.vue'
import '../src/assets/variables.css'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import sidebarResizer from './directives/sidebarResizer'

const app = createApp(App)

app.directive('sidebarResizer', sidebarResizer)
app.mount('#app')