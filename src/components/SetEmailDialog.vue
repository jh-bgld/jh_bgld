<template>
  <v-row justify="center">
    <v-dialog v-model="show" persistent>
      <v-card>
        <v-card-title>Empfänger E-Mail:</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="email"
            outlined
            :rules="[rules.email]"
          />
          <v-checkbox
            v-model="saveDefault"
            dense
            hide-details
            label="Als Standard speichern"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" text @click="(show = false),cancel()">
            Zurück
          </v-btn>
          <v-spacer />
          <v-btn
            color="primary"
            @click="(show = false), confirm({ contactMail, saveDefault })"
          >
            Ok
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script setup>

  import { computed, defineEmits, ref, watch } from 'vue';
  import { useSessionStore } from '@/stores/session';

  const sessionStore = useSessionStore();
  // Props
  const props = defineProps({
    value: Boolean,
  });
  const emit = defineEmits(['input', 'cancel', 'ok']);

  // Refs and State
  const saveDefault = ref(true);
  const contactMail = ref('');
  const show = computed({
    get: () => props.value,
    set: val => emit('input', val),
  });
  const email = computed({
    get: () => sessionStore.contactMail,
    set: val => {
      contactMail.value = val;
    },
  });

  // Watch dialog open
  watch(show, val => {
    if (val) {
      contactMail.value = sessionStore.contactMail;
    }
  });

  // Email rules
  const rules = {
    email: value => {
      const pattern =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return pattern.test(value) || 'ungültige e-mail.';
    },
  };

  // Methods
  function cancel () {
    show.value = false;
    emit('cancel');
  }

  function confirm () {
    show.value = false;
    emit('ok', { contactMail: contactMail.value, saveDefault: saveDefault.value });
  }
</script>
