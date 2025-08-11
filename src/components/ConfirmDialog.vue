<template>
  <v-row justify="center">
    <v-dialog v-model="show" persistent width="auto">
      <v-card>
        <v-card-title>
          {{ dialogText }}
        </v-card-title>
        <v-card-actions>
          <v-btn color="primary" text @click="handleCancel">
            Zurück
          </v-btn>
          <v-spacer />
          <v-btn color="primary" @click="handleOk">
            Ok
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script setup>
  import { computed, defineEmits, defineProps } from 'vue'

  const props = defineProps({
    modelValue: Boolean,
    dialogText: String,
  })

  const emit = defineEmits(['update:modelValue', 'cancel', 'ok'])

  const show = computed({
    get: () => props.modelValue,
    set: val => emit('update:modelValue', val),
  })

  function handleCancel () {
    show.value = false
    emit('cancel')
  }

  function handleOk () {
    show.value = false
    emit('ok')
  }
</script>
