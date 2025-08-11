<template>
  <v-container class="text-center pb-10 pt-2">
    <v-card class="mx-auto" flat max-width="600">
      <v-card-subtitle class="font-weight-bold" style="word-break: break-word;">Dein digitaler Jagdbegleiter fürs Burgenland</v-card-subtitle>
      <v-avatar class="my-2 mx-auto" size="100">
        <v-img alt="App Logo" src="/logo.png" />
      </v-avatar>
      <v-card-text class="text-body-1">
        Verwalte dein Streckenbuch, übermittle Abschussmeldungen, entdecke Wildrezepte und behalte alle Schusszeiten im Blick – alles bequem in einer App.
      </v-card-text>

      <v-card-text class="text-body-1">
        ✅ Schusszeiten & Jagdruhe-Tage<br>
        ✅ Streckenbuch digital führen<br>
        ✅ Abschussmeldung an deinen Jagdleiter<br>
        ✅ Wildrezepte entdecken
      </v-card-text>

      <v-alert v-if="!user" class="mb-6" type="info">
        🔒 Einige Funktionen sind nur mit Account verfügbar – <strong>jetzt kostenlos registrieren</strong> und alle Vorteile nutzen!
      </v-alert>

      <v-btn v-if="!user" class="mb-6" color="primary" to="/register">
        Kostenlos registrieren
      </v-btn>

      <v-card-text class="text-caption">
        Fragen oder Feedback? Schreib mir an
        <a class="text-decoration-none" :href="'mailto:jagdhelfer.burgenland@gmail.com'">
          {{ email }}
        </a>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
  import { ref } from 'vue';
  import { useSessionStore } from '@/stores/session';
  import logo from '@/assets/logo.png'
  const sessionStore = useSessionStore();
  const user = computed(() => sessionStore.user);
  //reactive state
  const email = ref('jagdhelfer.burgenland@gmail.com')
  //const latitude = ref('24.8864')
  //const longitude = ref('91.8807')
</script>
