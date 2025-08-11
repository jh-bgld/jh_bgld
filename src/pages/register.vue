<template>
  <v-container fill-height fluid>
    <v-card class="elevation-12">
      <v-toolbar color="primary" dark>
        <v-toolbar-title>Registrieren</v-toolbar-title>
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
            v-model="pwd"
            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            label="Password"
            name="password"
            prepend-icon="mdi-lock"
            :rules="[rules.required]"
            :type="show ? 'text' : 'password'"
            @click:append="show = !show"
          />
          <v-text-field
            id="password2"
            v-model="pwd2"
            :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
            label="Password wiederholen"
            name="password2"
            prepend-icon="mdi-lock"
            :rules="[rules.required, rules.pwdMatch]"
            :type="show2 ? 'text' : 'password'"
            @click:append="show2 = !show2"
          />
        </v-form>
      </v-card-text>
      <v-card-text v-if="sessionStore.createError">
        <v-alert color="error">
          {{ sessionStore.createError }}
        </v-alert>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" text @click="$router.go(-1)">Zurück</v-btn>
        <v-spacer />
        <v-btn
          color="primary"
          :loading="
            sessionStore.state === 'fetching' ||
              sessionStore.signoutState === 'fetching'
          "
          @click="
            sessionStore.createUser({user: email, password: pwd})
          "
        >Registrieren</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>
<script setup>
  import { ref } from 'vue';
  import { useSessionStore } from '@/stores/session';

  const sessionStore = useSessionStore();
  const email = ref(null);
  const pwd = ref(null);
  const pwd2 = ref(null);
  const show = ref(false);
  const show2 = ref(false);
  const rules = {
    required: value => !!value || 'Pflichtfeld',
    email: value => {
      const pattern =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return pattern.test(value) || 'ungültige e-mail.';
    },
    pwdMatch: value =>
      value == pwd.value || 'Passwörter müssen übereinstimmen',
  }

</script>
