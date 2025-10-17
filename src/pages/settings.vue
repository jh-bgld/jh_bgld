<template>
  <v-container>
    <v-card-title>Einstellungen</v-card-title>
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="displayName"
          class="mt-2"
          dense
          hide-details
          label="Anzeigename"
          outlined
        />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="email"
          dense
          label="Empfänger E-Mail Abschussmeldung"
          outlined
          :rules="[rules.email]"
        />
      </v-col>
      <v-col cols="12">
        <v-radio-group v-model="region" class="mt-1" hide-details>
          <v-radio label="Burgenland" :value="'burgenland'" />
          <v-radio label="Steiermark" :value="'styria'" />
        </v-radio-group>
      </v-col>
      <v-col cols="12">
        <v-btn
          block
          color="primary"
          :loading="sessionStore.updateState === 'fetching'"
          @click="() => {
            sessionStore.updateSettings({email, region})
            sessionStore.updateDisplayName({displayName});
          }
          "
        >Speichern</v-btn>
      </v-col>
    </v-row>
    <v-snackbar v-model="updateSuccess" color="success" :timeout="1500">Update erfolgreich</v-snackbar>
  </v-container>
</template>

<script setup>

  import { computed, ref } from 'vue';
  import { useSessionStore } from '@/stores/session';
  const sessionStore = useSessionStore();
  const email = ref(sessionStore.contactMail);
  const displayName = ref(sessionStore.user.displayName);
  const region = ref(sessionStore.settings.region);
  const rules = {
    email: value => {
      const pattern =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return pattern.test(value) || 'ungültige e-mail.';
    },
  };

  const updateSuccess = computed({
    get () {
      return sessionStore.updateState === 'success';
    },
    set () {
      sessionStore.updateState = '';
    },
  });
</script>
