<template>
  <v-dialog v-model="showMap">
    <v-lazy>
      <v-card>
        <!-- Map Container with a fixed height -->
        <l-map
          v-model:center="currentCenter"
          v-model:zoom="currentZoom"
          style="height: 80vh"
          @click="clickEvent"
        >
          <l-tile-layer
            layer-type="base"
            name="OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <l-marker v-if="markerLatLng" :lat-lng="markerLatLng" />
        </l-map>
        <v-card-actions>
          <v-btn
            block
            color="primary"
            variant="flat"
            @click="handleOk"
          >
            Ok
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-lazy>
  </v-dialog>
</template>

  <script setup>
  import { computed, ref, watch } from 'vue';
  import { latLng } from 'leaflet';
  import { LMap, LMarker, LTileLayer } from '@vue-leaflet/vue-leaflet';
  import { useSessionStore } from '@/stores/session';
  const leafletMap = ref(null);
  const props = defineProps({
    modelValue: Boolean,
    lat: Number,
    lng: Number,
  });
  const emit = defineEmits(['update:modelValue', 'ok']);

  const sessionStore = useSessionStore();
  const currentZoom = ref(18);
  const currentCenter = ref(latLng(47.361895, 16.129346));
  const markerLatLng = ref(null);


  const showMap = computed({
    get: () => props.modelValue,
    set: val => emit('update:modelValue', val),
  });

  function clickEvent (event) {
    if (!props.lat || !props.lng) {
      markerLatLng.value = latLng(event.latlng.lat, event.latlng.lng);
    }
  }

  function handleOk () {
    showMap.value = false;
    emit('ok', markerLatLng.value);
  }

  watch(showMap, async val => {
    if (val) {
      markerLatLng.value = latLng(props.lat, props.lng);
      if (props.lat && props.lng) {
        currentCenter.value = latLng(props.lat, props.lng);
      } else {
        const fallback = sessionStore.location; // Make sure sessionStore has `location`
        currentCenter.value = latLng(fallback.lat, fallback.lng);
      }
    }
  });

  </script>
