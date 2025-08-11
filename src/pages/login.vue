<template>
  <v-container fill-height fluid>
    <v-card class="elevation-12">
      <v-toolbar color="primary" dark>
        <v-toolbar-title>Anmelden</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-form>
          <v-text-field
            v-model="email"
            label="E-Mail"
            name="login"
            prepend-icon="mdi-mail"
            :rules="[rules.required, rules.email]"
            type="text"
          />
          <v-text-field
            id="password"
            v-model="password"
            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            label="Password"
            name="password"
            prepend-icon="mdi-lock"
            :rules="[rules.required]"
            :type="show ? 'text' : 'password'"
            @click:append="show = !show"
          />
        </v-form>
      </v-card-text>
      <v-card-text v-if="sessionStore.signinError">
        <v-alert color="error">
          {{ errorMatch }}
        </v-alert>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="primary"
          text
          @click="$router.push( '/register' )"
        >Registrieren</v-btn>
        <v-spacer />
        <v-btn
          color="primary"
          @click="sessionStore.signIn({ email, password })"
        >Anmelden</v-btn>
      </v-card-actions>
    </v-card>
    <v-card-actions>
      <v-btn
        block
        class="mt-2"
        color="primary"
        text
        @click="pwdResetDialog = true"
      >Passwort zurücksetzen</v-btn>
    </v-card-actions>
    <v-dialog v-model="pwdResetDialog" max-width="400px">
      <v-card>
        <v-card-title>Passwort zurücksetzen</v-card-title>
        <v-card-text>Gib hier die Mail-Adresse an, an der die Mail für das Zurücksetzen
          des Passwords geschickt werden soll</v-card-text>
        <v-card-text>
          <v-text-field
            v-model="resetMail"
            label="E-Mail"
            name="resetMail"
            prepend-icon="mdi-mail"
            :rules="[rules.required, rules.email]"
            type="text"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="primary"
            :disabled="sessionStore.resetMailState === 'fetching'"
            text
            @click="pwdResetDialog = false"
          >
            Abbrechen
          </v-btn>
          <v-spacer />
          <v-btn
            color="primary"
            :loading="sessionStore.resetMailState === 'fetching'"
            @click=" sessionStore.sendResetMail({email: resetMail})
            "
          >
            Senden</v-btn>
        </v-card-actions>
        <v-card-text>
          <v-alert v-if="sessionStore.resetMailError" color="error">{{
            sessionStore.resetMailError
          }}</v-alert>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script setup>
  import { computed, ref, watch } from 'vue';
  import { useSessionStore } from '@/stores/session';

  const sessionStore = useSessionStore();
  const email = ref(null);
  const password = ref(null);
  const resetMail = ref(null);
  const pwdResetDialog = ref(false);
  const show = ref(false);
  // Vuetify-style validation rules
  const rules = {
    required: value => !!value || 'Pflichtfeld',
    email: value => {
      const pattern =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return pattern.test(value) || 'ungültige e-mail.';
    },
  };
  const errorMatch = computed(() => {
    switch (sessionStore.signinError) {
      case 'auth/wrong-password':
        return 'Falsches Passwort';
      case 'auth/user-not-found':
        return 'Benutzer nicht gefunden';
      default:
        return sessionStore.signinError;
    }
  });

  watch(
    () => sessionStore.resetMailState,
    (newVal, oldVal) => {
      if (newVal === 'success' && oldVal === 'fetching') {
        pwdResetDialog.value = false;
        email.value = null;
        password.value = null;
      }
    }
  );
</script>
