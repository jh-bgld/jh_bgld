// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    loading: true,
    updateExists: false,
    menu: [
      {
        title: 'Home',
        route: '/',
        icon: 'mdi-home',
        showLoggedOut: true,
      },
      {
        title: 'Schusszeiten',
        route: '/times',
        icon: 'mdi-timeline-clock-outline',
        showLoggedOut: true,
      },
      {
        title: 'Tage d. Jagdruhe',
        route: '/jagdruhe',
        icon: 'mdi-calendar',
        showLoggedOut: true,
      },
      {
        title: 'Abschussmeldung',
        route: '/abschussmeldung',
        icon: 'mdi-target',
        showLoggedOut: false,
      },
      {
        title: 'Streckenbuch',
        route: '/diary',
        icon: 'mdi-binoculars',
        showLoggedOut: false,
      },
      {
        title: 'Einstellungen',
        route: '/settings',
        icon: 'mdi-cog',
        showLoggedOut: false,
      },
      /*
      {
        title: 'Hilfe',
        route: '/anleitung',
        icon: 'mdi-help',
        showLoggedOut: true,
        disabledLoggedIn: false,
      },*/
      {
        title: 'Rezepte',
        route: '/recipes',
        icon: 'mdi-file-document',
        showLoggedOut: true,
      },
    ],
  }),
  actions: {
    refreshApp () {
      window.location.reload();
    },
  },

})
