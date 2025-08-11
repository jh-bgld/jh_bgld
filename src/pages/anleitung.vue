<template>
  <v-container class="pa-0">
    <v-card-title>Hilfe</v-card-title>
    <v-card>
      <v-card-title>1. Account</v-card-title>
      <v-card-text>Haben Sie noch keinen Account für den Jagdhelfer Burgenland? Einfach
        unter
        <router-link :to="'/register'">Registrieren</router-link> einen
        Account erstellen. Ein Account wird für das Speichern von persönlichen
        Einstellungen und dem Erstellen von Abschussmeldungen
        vorausgesetzt.</v-card-text>
    </v-card>
    <v-card>
      <v-card-title>2. Schusszeiten</v-card-title>
      <v-card-text>Hier finden Sie eine Übersicht über die gesetzlichen Schusszeiten im
        Burgenland. Einfach in der Auswahl die gewünschte Wildart selektieren
        uns schon sehen Sie die passenden Schusszeiten.</v-card-text>
    </v-card>
    <v-card>
      <v-card-title>3. Tage der Jagdruhe</v-card-title>
      <v-card-text>Eine Übersicht der Tage an denen die Jagd im Burgenland
        ruht</v-card-text>
    </v-card>
    <v-card>
      <v-card-title>4. Abschussmeldungen</v-card-title>
      <v-card-text>Durch das Ausfüllen und Absenden des Formulars wird die Abschussmeldung
        an den in Ihren Einstellungen angegebenen Empfänger versandt. Zusätzlich
        besteht die Möglichkeit, durch Setzen der Option den Abschuss in Ihrem
        persönlichen Streckenbuch zu speichern. Bitte seien Sie sich bewusst,
        dass diese Abschussmeldung Gültigkeit hat und daher auch vom Empfänger
        als wahrheitsgetreu empfunden wird!!</v-card-text>
    </v-card>
    <v-card>
      <v-card-title>5. Einstellungen</v-card-title>
      <v-card-text>In den Einstellungen können Sie ihren Anzeigenamen, die Mailadresse an
        welche Abschussmeldungen geschickt werden, sowie den Namen des
        Empfängers speichern. Nur wenn diese Felder befüllt sind, ist das Senden
        von Abschussmeldungen möglich!</v-card-text>
    </v-card>
    <v-card class="mb-16">
      <v-card-title>6. Anmelden</v-card-title>
      <v-card-text>Sollten Sie noch nicht eingeloggt sein, können Sie per klick auf
        <router-link :to="'/login'">Anmelden</router-link> zum Login
        Bildschirm navigieren</v-card-text>
    </v-card>
    <v-btn
      bottom
      color="primary"
      fab
      fixed
      right
      @click="openYoutube()"
    ><v-icon>mdi-youtube</v-icon></v-btn>
  </v-container>
</template>

  <script setup>
  const openYoutube = () => {
    window.open(
      'https://www.youtube.com/watch?v=9-a1BxBx7uc&list=PLW8_1S8lR0T2DkCuyhYwipB7jcKxFJ24x',
      '_blank'
    );
  }
  </script>
