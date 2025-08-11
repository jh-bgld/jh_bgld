<template>
  <v-container>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-card>
        <v-card-title>Abschussmeldung</v-card-title>
        <v-card-text>
          <v-row>
            <v-col class="d-flex" cols="12">
              <v-select
                v-model="abschuss.wildArt"
                dense
                hide-details
                :items="species"
                label="Wildart"
                outlined
                :rules="[rules.required]"
              />
            </v-col>
          </v-row>
          <v-row algin="center" justify="center">
            <v-col class="py-0" cols="6">
              <v-radio-group v-model="abschuss.gender" label="Geschlecht:">
                <v-radio label="männlich" value="männlich" />
                <v-radio label="weiblich" value="weiblich" />
              </v-radio-group>
            </v-col>
            <v-col align-self="center" cols="6">
              <v-row class="pa-0">
                <v-col class="py-1" cols="12">
                  <v-select
                    v-model="abschuss.klasse"
                    dense
                    :disabled="classItems.length < 1"
                    hide-details
                    :items="classItems"
                    label="Klasse"
                    outlined
                  />
                </v-col>
                <v-col class="py-1" cols="12">
                  <v-text-field
                    v-model="abschuss.weight"
                    dense
                    hide-details
                    label="Gewicht(kg)"
                    outlined
                    type="number"
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="py-0" cols="6">
              <v-dialog
                ref="aTime"
                v-model="abschuss.timepicker"
                v-model:return-value="abschuss.time"
                persistent
              >
                <template #activator="{ props }">
                  <v-text-field
                    v-model="abschuss.time"
                    label="Uhrzeit"
                    prepend-icon="mdi-clock-time-four-outline"
                    readonly
                    :rules="[rules.required]"
                    v-bind="props"
                  />
                </template>
                <v-time-picker
                  v-if="abschuss.timepicker"
                  v-model="abschuss.time"
                  format="24hr"
                  full-width
                >
                  <template #actions>
                    <v-btn
                      color="primary"
                      text
                      @click="abschuss.timepicker = false"
                    >
                      Zurück
                    </v-btn>
                    <v-spacer />
                    <v-btn
                      color="primary"
                      text
                      @click="abschuss.timepicker = false"
                    >
                      OK
                    </v-btn>
                  </template>
                </v-time-picker>
              </v-dialog>
            </v-col>
            <v-col class="py-0" cols="6">
              <v-dialog
                ref="aDate"
                v-model="abschuss.datepicker"
                v-model:return-value="abschuss.date"
                persistent
              >
                <template #activator="{ props }">
                  <v-text-field
                    v-model="abschuss.date"
                    label="Datum"
                    prepend-icon="mdi-calendar"
                    readonly
                    :rules="[rules.required]"
                    v-bind="props"
                  />
                </template>
                <v-date-picker
                  v-if="abschuss.datepicker"
                  v-model="abschuss.date"
                  first-day-of-week="1"
                  full-width
                  locale="de"
                  :max="maxDate"
                >
                  <template #actions>

                    <v-btn
                      color="primary"
                      text
                      @click="abschuss.datepicker = false"
                    >
                      Zurück
                    </v-btn>
                    <v-spacer />
                    <v-btn
                      color="primary"
                      text
                      @click="abschuss.datepicker = false"
                    >
                      OK
                    </v-btn>
                  </template>
                </v-date-picker>
              </v-dialog>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="pt-0" cols="12">
              <v-text-field
                v-model="abschuss.erleger"
                dense
                label="Erleger:"
                outlined
                :rules="[rules.required]"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-form>
    <v-form ref="untForm" v-model="untValid">
      <v-card>
        <v-card-title>Wildfleischuntersuchung</v-card-title>
        <v-card-text>
          <v-row>
            <v-col class="py-0" cols="6">
              <v-dialog
                ref="uTime"
                v-model="untersuchung.timepicker"
                v-model:return-value="untersuchung.time"
                persistent
              >
                <template #activator="{ props }">
                  <v-text-field
                    v-model="untersuchung.time"
                    dense
                    hide-details
                    label="Uhrzeit"
                    prepend-icon="mdi-clock-time-four-outline"
                    readonly
                    :rules="[rules.requiredUntersuchung]"
                    v-bind="props"
                  />
                </template>
                <v-time-picker
                  v-if="untersuchung.timepicker"
                  v-model="untersuchung.time"
                  format="24hr"
                  full-width
                >
                  <template #actions>
                    <v-btn
                      color="primary"
                      text
                      @click="untersuchung.timepicker = false"
                    >
                      Zurück
                    </v-btn>
                    <v-spacer />
                    <v-btn
                      color="primary"
                      text
                      @click="untersuchung.timepicker = false"
                    >
                      OK
                    </v-btn>
                  </template>
                </v-time-picker>
              </v-dialog>
            </v-col>
            <v-col class="py-0" cols="6">
              <v-dialog
                ref="uDate"
                v-model="untersuchung.datepicker"
                v-model:return-value="untersuchung.date"
                persistent
              >
                <template #activator="{ props }">
                  <v-text-field
                    v-model="untersuchung.date"
                    dense
                    hide-details
                    label="Datum"
                    prepend-icon="mdi-calendar"
                    readonly
                    :rules="[rules.requiredUntersuchung]"
                    v-bind="props"
                  />
                </template>
                <v-date-picker
                  v-if="untersuchung.datepicker"
                  v-model="untersuchung.date"
                  first-day-of-week="1"
                  full-width
                  locale="de"
                  :max="maxDate"
                >
                  <template #actions>

                    <v-btn
                      color="primary"
                      text
                      @click="untersuchung.datepicker = false"
                    >
                      Zurück
                      <v-spacer />
                    </v-btn>
                    <v-btn
                      color="primary"
                      text
                      @click="untersuchung.datepicker = false"
                    >
                      OK
                    </v-btn>
                  </template>
                </v-date-picker>
              </v-dialog>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="pa-0" cols="12">
              <div class="text-subtitle-1">Nr. kundige Person:</div>
            </v-col>
            <v-col class="py-0" cols="6">
              <v-text-field
                v-model="untersuchung.kundigePerson"
                dense
                hide-details
                outlined
                :rules="[rules.requiredUntersuchung]"
              />
            </v-col>
            <v-col class="py-0" cols="6">
              <v-text-field
                v-model="untersuchung.blattNr"
                dense
                hide-details
                label="Blattnr."
                outlined
                :rules="[rules.requiredUntersuchung]"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-radio-group
                v-model="untersuchung.beanstandungen"
                dense
                hide-details
                :rules="[rules.requiredUntersuchung]"
              >
                <v-radio
                  label="keine Beanstandungen"
                  value="keine Beanstandungen"
                />
                <v-radio label="Sonstige:" value="sonstige" />
              </v-radio-group>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-if="
                  untersuchung.beanstandungen &&
                    untersuchung.beanstandungen == 'sonstige'
                "
                v-model="untersuchung.sonstige"
                dense
                hide-details
                label="Beanstandungen:"
                outlined
              /></v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-form>
    <v-form ref="wvForm" v-model="wvValid">
      <v-card>
        <v-card-title class="pb-0">Weiterverwendung</v-card-title>
        <v-card-text>
          <v-row>
            <v-col class="pt-0" cols="12">
              <v-radio-group
                v-model="weiterverwendung.usage"
                dense
                hide-details
              >
                <v-radio
                  label="Wildbrethandel"
                  value="Wildbrethandel"
                />
                <v-text-field
                  v-if="
                    weiterverwendung &&
                      weiterverwendung.usage === 'Wildbrethandel'
                  "
                  v-model="weiterverwendung.wildbrethandel"
                  dense
                  label="Wildbrethändler:"
                  :rules="[rules.required]"
                />
                <v-radio
                  label="Direktvermarktung"
                  value="Direktvermarktung"
                />
                <v-text-field
                  v-if="
                    weiterverwendung &&
                      weiterverwendung.usage === 'Direktvermarktung'
                  "
                  v-model="weiterverwendung.direkt"
                  dense
                  label="Direkt-Abnehmer:"
                  :rules="[rules.required]"
                />
                <v-radio label="Eigenverzehr" value="Eigenverzehr" />
                <v-radio label="TKV" value="tkv" />
              </v-radio-group>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-form>
    <v-card-text>
      <v-text-field
        ref="locationField"
        v-model="position"
        append-outer-icon="mdi-map-marker-plus"
        dense
        hide-details
        label="Position auswählen"
        outlined
        readonly
        @click="showMap = true"
        @click:append-outer="showMap = true"
      />
      <map-dialog
        v-model="showMap"
        :lat="abschuss.lat"
        :lng="abschuss.lng"
        @ok="mapClosed($event)"
      />
    </v-card-text>
    <v-alert
      v-model="alert"
      color="error"
    >Nicht alle nötigen Felder korrekt befüllt</v-alert>
    <v-card>
      <v-card-actions>
        <v-row>
          <v-col cols="12">
            <v-checkbox
              v-model="saveDiary"
              dense
              hide-details
              label="In Streckenbuch speichern"
            />
          </v-col>
          <v-col cols="12">
            <v-checkbox
              v-model="diaryOnly"
              desne
              hide-details
              label="NUR Streckenbucheintrag"
            />
          </v-col>
          <v-col cols="12">
            <v-btn
              block
              color="primary"
              :loading="amStore.state === 'fetching'"
              @click="sendMail()"
            >Absenden</v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
    <v-snackbar v-model="sendingSuccess" color="success" :timeout="1500">{{ diaryOnly ? "Speichern" : "Senden" }} erfolgreich</v-snackbar>
    <v-snackbar v-model="sendingFailure" color="success" :timeout="1500">{{ diaryOnly ? "Speichern" : "Senden" }} fehlgeschlagen</v-snackbar>
    <set-email-dialog
      :value="showEmailDialog"
      @cancel="showEmailDialog = false"
      @ok="
        (showEmailDialog = false),
        amStore.updateAndSend({
          email: $event.contactMail,
          saveDefault: $event.saveDefault,
          abschuss,
          untersuchung,
          weiterverwendung,
          diaryOnly,
        })

      "
    />
  </v-container>
</template>


<script setup>
  import { computed, nextTick, ref, watch } from 'vue';
  import { useAMStore } from '@/stores/abschussmeldung'; // assuming a Pinia store
  import dateFormat from 'dateformat';
  import SetEmailDialog from '@/components/SetEmailDialog.vue';
  import MapDialog from '@/components/MapDialog.vue';
  import { VTimePicker } from 'vuetify/labs/VTimePicker'
  import dayjs from 'dayjs'

  const amStore = useAMStore();
  const abschuss = ref({
    wildArt: null,
    gender: null,
    klasse: null,
    erleger: null,
    time: null,
    date: null,
    timepicker: false,
    datepicker: false,
    lat: null,
    lng: null,
  });

  const times = [
    {
      wildArt: 'Schwarzwild',
      note: 'Ganzjährig, außer säugende Bachen',
      category: 1,
    },
    {
      wildArt: 'Fuchs',
      note: 'Ganzjährig',
      category: 2,
    },
    {
      wildArt: 'Rotwild',
      category: 1,
      klassen: [
        {
          klasse: 'Hirsch Klasse I, II u. III',
          start: '15.08.',
          end: '31.12.',
        },
        {
          klasse: 'Schmalspießer',
          start: '01.05.',
          end: '31.12.',
        },
        {
          klasse: 'Schmaltier',
          start: '01.05.',
          end: '15.01.',
        },
        {
          klasse: 'Tier und Nachwuchsstücke',
          start: '01.08.',
          end: '15.01.',
        },
      ],
    },
    {
      wildArt: 'Damwild',
      category: 1,
      klassen: [
        {
          klasse: 'Hirsch Klasse I, II u. III',
          start: '01.09.',
          end: '31.12.',
        },
        {
          klasse: 'Schmaltier',
          start: '01.05.',
          end: '31.12.',
        },
        {
          klasse: 'Tier und Nachwuchsstücke',
          start: '01.09.',
          end: '31.12.',
        },
      ],
    },
    {
      wildArt: 'Rehwild',
      category: 1,
      klassen: [
        {
          klasse: 'Rehbock Klasse I',
          start: '01.05.',
          end: '31.10.',
        },
        {
          klasse: 'Rehbock Klasse II',
          start: '16.04.',
          end: '31.10.',
        },
        {
          klasse: 'Schmalgeiß',
          start: '16.04.',
          end: '31.12.',
        },
        {
          klasse: 'Geiß und Nachwuchsstücke',
          start: '16.08.',
          end: '31.12.',
        },
      ],
    },
    {
      wildArt: 'Muffelwild',
      start: '01.05.',
      end: '31.12.',
      note: 'Zeiten gelten sowohl für Widder, Schafe und Lämmer',
      category: 1,
    },
    { wildArt: 'Sikawild', start: '01.09.', end: '31.12.', category: 1 },
    { wildArt: 'Gamswild', start: '01.08.', end: '31.12.', category: 1 },
    { wildArt: 'Feldhase', start: '01.10.', end: '31.12.', category: 4 },
    { wildArt: 'Wildkaninchen', note: 'Ganzjährig', category: 4 },
    {
      wildArt: 'Baum- oder Edelmarder',
      start: '01.07.',
      end: '31.03.',
      category: 2,
    },
    { wildArt: 'Dachs', start: '01.06.', end: '31.01.', category: 2 },
    { wildArt: 'Goldschakal', start: '01.10.', end: '15.03.', category: 2 },
    { wildArt: 'Rebhuhn', start: '16.09.', end: '30.11.', category: 3 },
    {
      wildArt: 'Fasan',
      category: 3,
      klassen: [
        {
          klasse: 'Fasanhahn',
          start: '01.10.',
          end: '15.01.',
        },
        {
          klasse: 'Fasanhenne',
          start: '01.11.',
          end: '31.12.',
        },
      ],
    },
    { wildArt: 'Wachtel', start: '01.09.', end: '30.09.', category: 3 },
    {
      wildArt: 'Wildtruthahn',
      category: 3,
      klassen: [
        {
          klasse: 'Wildtruthahn Mai',
          start: '01.05.',
          end: '31.05.',
        },
        {
          klasse: 'Wildtruthahn Herbst',
          start: '01.11.',
          end: '31.12.',
        },
        {
          klasse: 'Wildtruthenne',
          start: '01.11.',
          end: '31.12.',
        },
      ],
    },
    {
      wildArt: 'Wildtauben',
      category: 3,
      klassen: [
        {
          klasse: 'Ringel- und Türkentaube',
          start: '16.08.',
          end: '15.04.',
        },
        {
          klasse: 'Turteltaube',
          start: '16.08.',
          end: '31.10.',
        },
      ],
    },
    {
      wildArt: 'Schnepfen',
      category: 3,
      klassen: [
        {
          klasse: 'Waldschnepfe',
          start: '01.10.',
          end: '31.12.',
        },
        {
          klasse: 'Bekassine (Sumpfschnepfe)',
          start: '16.08.',
          end: '30.11.',
        },
      ],
    },
    {
      wildArt: 'Wildgänse',
      category: 3,
      klassen: [
        {
          klasse: 'Saatgans, Graugans, Kanadagans',
          start: '01.08.',
          end: '31.01.',
        },
        {
          klasse: 'Blässgans',
          start: '01.08.',
          end: '15.01.',
          note: 'ganzjährig geschont - schussbar nur für Reviere mit Ausnahmegenehmigung gemäß § 78 Abs. 4 Bgld. Jagdgesetz 2017',
        },
      ],
    },
    { wildArt: 'Wildenten', start: '01.09.', end: '15.01.', category: 3 },
    { wildArt: 'Blässhuhn', start: '01.09.', end: '30.09.', category: 3 },
    {
      wildArt: 'Elster und Aaskrähe',
      category: 3,
      start: '01.08.',
      end: '15.03.',
      note: 'pro Jagdjahr sind 3500 Stück Aaskrähen und 500 Stück Elstern im gesamten Burgenland frei',
    },
  ];

  const untersuchung = ref({
    timepicker: false,
    datepicker: false,
    date: null,
    time: null,
    kundigePerson: null,
    blattNr: null,
    beanstandungen: null,
    sonstige: null,
  });

  const weiterverwendung = ref({
    wildbrethandel: null,
    direkt: null,
    usage: null,
  });

  const valid = ref(false);
  const untValid = ref(false);
  const wvValid = ref(false);
  const alert = ref(false);
  const showMap = ref(false);
  const showEmailDialog = ref(false);
  const position = ref(null);

  const form = ref();
  const untForm = ref();
  const wvForm = ref();
  const aTime = ref();
  const aDate = ref();
  const uTime = ref();
  const uDate = ref();

  const species = computed(() => times.map(entry => entry.wildArt));

  const classItems = computed(() => {
    switch (abschuss.value.wildArt) {
      case 'Rehwild': return ['Kitz', 'Geiß', '1', '2'];
      case 'Rotwild': return ['Kalb', 'Tier', '1', '2', '3'];
      case 'Damwild': return ['Kalb', 'Tier', '1', '2', '3'];
      default: return [];
    }
  });

  const maxDate = computed(() => dateFormat(new Date(), 'yyyy-mm-dd'));

  const sendingSuccess = computed({
    get () {
      return diaryOnly.value
        ? amStore.updateState === 'success'
        : amStore.state === 'success';
    },
    set () {
      amStore.RESET_UPDATE();
    },
  });

  const sendingFailure = computed({
    get: () => amStore.state === 'error',
    set: () => amStore.state = '',
  });

  const saveDiary = computed({
    get: () => amStore.saveDiary,
    set: val => amStore.saveDiary = val,
  });

  const diaryOnly = computed({
    get: () => amStore.diaryOnly,
    set: val => amStore.diaryOnly = val,
  });

  const rules = {
    required: value => !!value || 'Pflichtfeld!',
    requiredUntersuchung: value => !!value || 'Wildfleischuntersuchung nötig!',
  };

  function mapClosed (event) {
    if (event.lat && event.lng) {
      position.value = `${event.lat}, ${event.lng}`;
      abschuss.value.lat = event.lat;
      abschuss.value.lng = event.lng;
    }
  }

  function sendMail () {
    nextTick(async () => {
      const validForm = await form.value?.validate();
      const validWv = await wvForm.value?.validate();
      const validUnt = await untForm.value?.validate();
      if(untersuchung.value.date) {
        untersuchung.value.date = dayjs(untersuchung.value.date).format('YYYY-MM-DD');
      }
      if(abschuss.value.date) {
        abschuss.value.date = dayjs(abschuss.value.date).format('YYYY-MM-DD');
      }

      if (validForm?.valid && validWv?.valid) {
        if (
          weiterverwendung.value.usage === 'Direktvermarktung' ||
          weiterverwendung.value.usage === 'Wildbrethandel'
        ) {
          if (validUnt) {
            alert.value = false;
            if (saveDiary.value) {
              amStore.updateUserDiary({ abschuss: abschuss.value });
            }
            if (!diaryOnly.value) {
              showEmailDialog.value = true;
            }
          } else {
            alert.value = true;
          }
        } else {
          alert.value = false;
          if (saveDiary.value) {
            amStore.updateUserDiary({ abschuss: abschuss.value });
          }
          if (!diaryOnly.value) {
            showEmailDialog.value = true;
          }
        }
      } else {
        alert.value = true;
      }
    });
  }

  watch(sendingSuccess, val => {
    if (val) window.location.reload();
  });


</script>
