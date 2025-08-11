/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Styles
import 'unfonts.css'
import 'leaflet/dist/leaflet.css';

const app = createApp(App)

registerPlugins(app)
import { useSessionStore } from '@/stores/session'
const session = useSessionStore()
session.init()
app.mount('#app')
