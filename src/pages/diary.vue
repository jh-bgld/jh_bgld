<template>  <v-container>
  <v-card-title>Streckenbuch</v-card-title>
  <v-select
    v-model="selectedYear"
    :items="['2022', '2023', '2024', '2025']"
    label="Jagdjahr"
    outlined
  />
  <template
    v-if="
      diaryStore.status != 'fetching' &&
        diaryStore.deleteStatus != 'fetching'
    "
  >
    <v-alert v-if="entries.length < 1">Keine Einträge für gewähltes Jagdjahr vorhanden</v-alert>

    <v-expansion-panels v-model="panel" multiple>
      <v-expansion-panel
        v-for="(entry, index) in entries"
        :key="'panel-' + index"
      >
        <v-expansion-panel-title> {{ entry.date }}</v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-card class="pa-0 elevation-0" falt>
            <v-card-text>{{ entry.wildArt }}
              {{ entry.gender ? ", " + entry.gender : "" }}
              {{
                entry.weight ? ", " + entry.weight + " kg" : ""
              }}</v-card-text>
            <v-card-text><v-icon>mdi-clock</v-icon> {{ entry.time }}
              {{ entry.erleger }}</v-card-text>
            <v-card-text v-if="entry.image" class="position-relative">
              <v-img class="img-container" cover :src="entry.image" :width="300">
                <v-btn
                  class="top-right-btn"
                  color="red"
                  density="compact"
                  icon
                  outlined
                  @click="deleteImage(entry)"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-img>
            </v-card-text>
            <v-card-actions>
              <v-btn
                v-if="entry.lat && entry.lng"
                color="primary"
                icon
                outlined
                small
                @click="showMapDialog(entry.lat, entry.lng)"
              ><v-icon>mdi-map</v-icon></v-btn>
              <v-btn
                color="primary"
                icon
                :loading="isSelecting"
                outlined
                small
                @click="handleFileImport(), (clickedItem = entry)"
              ><v-icon>mdi-camera</v-icon></v-btn>
              <v-spacer /><v-btn
                icon
                small
                @click="() => {showDialog = true; clickedItem = entry}"
              ><v-icon color="red">mdi-delete</v-icon></v-btn></v-card-actions>
          </v-card>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </template>
  <v-progress-circular v-else indeterminate />
  <input ref="uploader" class="d-none" type="file" @change="onFileChanged">
  <confirm-dialog
    v-model="showDialog"
    :dialog-text="'Wirklich löschen?'"
    @cancel="dialog = false"
    @ok="onConfirmDelete"
  />
  <map-dialog v-model="showMap" :lat="lat" :lng="lng" />
  <v-snackbar
    v-model="error"
    color="primary"
  >{{ diaryStore.error }}
    <template #action="{ attrs }">
      <v-btn icon text v-bind="attrs" @click="error = null">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
  <v-footer app dense>
    <v-spacer />
    <v-btn
      block
      color="primary"
      @click="
        amStore.diaryOnly = true;
        amStore.saveDiary = true;
        $router.push('abschussmeldung');
      "
    ><v-icon>mdi-plus</v-icon></v-btn>
  </v-footer>
</v-container></template>
<script setup>
  import ConfirmDialog from '@/components/ConfirmDialog.vue';
  import MapDialog from '@/components/MapDialog.vue';
  import { computed, ref } from 'vue';
  import { useDiaryStore } from '@/stores/diary';
  import { useAMStore } from '@/stores/abschussmeldung';
  const amStore = useAMStore();
  const uploader = ref(null);
  const diaryStore = useDiaryStore();
  const panel = ref([]);
  const selectedYear = ref('2025');
  const showDialog = ref(false);
  const isSelecting = ref(false);
  const showMap = ref(false);
  const clickedItem = ref(null);
  const lat = ref(null);
  const lng = ref(null);
  const entries = computed(() => {
    if(selectedYear.value) {
      return diaryStore.entries.filter(value => {
        const year = value.date.split('-')[0];
        if (year === selectedYear.value) {
          return value;
        }
      });
    }
    return []
  })
  const error = computed({
    get: () => diaryStore.error,
    set: val => {
      diaryStore.error = val;
    },
  });
  onMounted(() => {
    diaryStore.getEntries();
  });
  function onConfirmDelete () {
    showDialog.value = false;

    diaryStore.deleteEntry(clickedItem.value.id);
  }
  function showMapDialog (latitude, longitude) {
    lat.value = latitude;
    lng.value = longitude;
    showMap.value = true;
  }
  function handleFileImport () {
    isSelecting.value = true;

    window.addEventListener(
      'focus',
      () => {
        isSelecting.value = false;
      },
      { once: true }
    );

    uploader.value?.click(); // trigger click auf das input-element
  }

  function deleteImage (entry) {
    diaryStore.deleteImage(entry);
  }
  function onFileChanged (e) {
    const file = e.target.files[0];
    diaryStore.uploadImage({ file,
                             id: clickedItem.value.id })
  }

</script>
<style scoped>
.img-container {
  position: relative;
}

.top-right-btn {
  position: absolute;
  top: 2px;
  right: 2px;
}
</style>
