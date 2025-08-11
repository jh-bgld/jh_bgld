/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { de } from 'vuetify/locale'
// Composables
import { createVuetify } from 'vuetify'

const darkTheme = {
  dark: true,
  colors: {
    primary: '#35661d',
    secondary: '#424242',
    accent: '#82B1FF',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107',
  },
};
const lightTheme = {
  dark: false,
  colors: {
    primary: '#35661d',
    secondary: '#424242',
    accent: '#82B1FF',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107',
  },
};
// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
const defaultTheme = systemPrefersDark ? 'darkTheme' : 'lightTheme'

export default createVuetify({
  locale: {
    locale: 'de',
    messages: { de },
  },
  theme: {
    defaultTheme,
    themes: {
      darkTheme,lightTheme,
    },
  },
})
