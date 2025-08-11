<template>
  <v-container>
    <v-card-title>Tage der Jagdruhe</v-card-title>
    <v-divider class="py-0" />
    <v-list>
      <v-list-item v-for="(day, index) in days" :key="'day-' + index">
        <v-list-item-title>
          {{ day }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<script setup>
  const days = [
    'Karfreitag - 18.04.2025',
    'Ostersonntag - 20.04.2025',
    'Pfingstsonntag - 08.06.2025',
    'Allerheiligen - 01.11.2025',
    'Allerseelen - 02.11.2025',
    'Heiliger Abend - 24.12.2025',
    'Christtag - 25.12.2025',
  ]
</script>
