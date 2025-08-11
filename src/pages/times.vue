<template><v-container>
  <v-card-title>Schusszeiten</v-card-title>
  <v-tabs v-model="tab" background-color="primary" fixed-tabs>
    <v-tab value="one">Nach Wildart</v-tab>
    <v-tab value="two">Nach Datum</v-tab>
  </v-tabs>
  <v-tabs-window v-model="tab">
    <v-tabs-window-item value="one">
      <v-row>
        <v-col cols="12">
          <v-radio-group v-model="selectedCategory" class="mt-1" hide-details>
            <v-radio label="Schalenwild" :value="1" />
            <v-radio label="Raubwild" :value="2" />
            <v-radio label="Federwild" :value="3" />
            <v-radio label="Hasenartige" :value="4" />
          </v-radio-group>
        </v-col>
      </v-row>
      <v-row class="mt-0">
        <v-col class="d-flex" cols="12">
          <v-select
            v-model="selectedSpecies"
            dense
            hide-details
            :items="species"
            label="Wildart"
            outlined
          />
        </v-col>
      </v-row>
      <v-row v-if="classes && classes.length > 0 && classes[0].start">
        <v-col cols="12">
          <v-data-table
            class="elevation-1"
            :headers="headers"
            hide-default-footer
            :items="classes"
            :items-per-page="10"
          />
        </v-col>
      </v-row>
      <v-row v-if="classes[0] && classes[0].note">
        <v-col cols="12">
          <v-textarea
            v-model="classes[0].note"
            outlined
            readonly
          />
        </v-col>
      </v-row>
    </v-tabs-window-item>
    <v-tabs-window-item value="two">
      <v-row>
        <v-col class="py-0 mb-2" cols="12">
          <v-date-picker
            v-model="selectedDate"
            color="primary"
            first-day-of-week="1"
            full-width
            hide-header
            locale="de"
          />
        </v-col>
      </v-row>
      <v-row v-if="classes && classes.length > 0" class="mt-0">
        <v-col cols="12">
          <v-list class="pt-0" dense>
            <v-list-item
              v-for="(klasse, index) in classes"
              :key="`${index}-item`"
            >
              <v-list-item-title
                v-if="klasse && klasse.title && klasse.title.length > 0"
              >{{ klasse.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </v-tabs-window-item>
  </v-tabs-window>
</v-container>
</template>
<script setup>
  import { computed, ref,watch } from 'vue';
  import flatten from 'lodash/flatten';
  const tab = ref('one')
  const selectedSpecies = ref();
  const selectedDate = ref();
  const selectedCategory = ref(1);
  const dateMatches = (
    startDay,
    endDay,
    startMonth,
    endMonth,
    compareDay,
    compareMonth
  ) => {
    if (startMonth > endMonth) {
      if (
        (compareMonth >= startMonth && compareMonth <= 12) ||
        compareMonth <= endMonth
      ) {
        if (compareMonth === startMonth) {
          return compareDay >= startDay;
        } else if (compareMonth === endMonth) {
          return compareDay <= endDay;
        }
        return true;
      } else {
        return false;
      }
    } else if (startMonth < endMonth) {
      if (compareMonth >= startMonth && compareMonth <= endMonth) {
        if (compareMonth === startMonth) {
          return compareDay >= startDay;
        } else if (compareMonth === endMonth) {
          return compareDay <= endDay;
        }
        return true;
      } else {
        return false;
      }
    } else if (startMonth === endMonth) {
      return (
        compareDay <= endDay &&
        compareDay >= startDay &&
        compareMonth == startMonth &&
        compareMonth === endMonth
      );
    }
  }

  const species = computed(() => {
    return times.map(entry => {
      if (entry.category === selectedCategory.value) {
        return entry.wildArt
      }
    }).filter(Boolean)
  })

  const headers = computed(() => {
    const hasClasses = classes.value.filter(filterClass => {
      return filterClass.klasse ? true : false;
    });
    if (hasClasses && hasClasses.length > 0) {
      return [
        {
          title: 'Klasse',
          key: 'klasse',
          sortable: false,
        },
        {
          title: 'Start',
          key: 'start',
          sortable: false,
        },
        {
          title: 'Ende',
          key: 'end',
          sortable: false,
        },
      ];
    }
    return [
      {
        title: 'Start',
        key: 'start',
        sortable: false,
      },
      {
        title: 'Ende',
        key: 'end',
        sortable: false,
      },
    ];
  })
  const classes = computed(() => {

    let classes = undefined;
    if (tab.value === 'one') {
      classes = times.find(time => {
        return time.wildArt === selectedSpecies.value;
      });
      if (classes && !classes.klassen) {
        classes.klassen = [
          {
            end: classes.end,
            start: classes.start,
            note: classes.note || null,
          },
        ];
      }
    } else if (selectedDate.value) {
      const compareDay = new Date(selectedDate.value).getDate();
      const compareMonth = new Date(selectedDate.value).getMonth() + 1;
      classes = times.map(time => {
        if (time.klassen) {
          return time.klassen.map(klasse => {
            if (klasse.end && klasse.start) {
              const endDay = parseInt(klasse.end.split('.')[0]);
              const endMonth = parseInt(klasse.end.split('.')[1]);
              const startDay = parseInt(klasse.start.split('.')[0]);
              const startMonth = parseInt(klasse.start.split('.')[1]);
              if (
                dateMatches(
                  startDay,
                  endDay,
                  startMonth,
                  endMonth,
                  compareDay,
                  compareMonth
                )
              ) {
                return {
                  title:
                    time.wildArt +
                    (klasse.klasse ? `, ${klasse.klasse}` : ''),
                };
              }
            } else {
              return {
                title:
                  time.wildArt + (klasse.klasse ? `, ${klasse.klasse}` : ''),
              };
            }
          });
        } else {
          if (time.start && time.end) {
            const endDay = parseInt(time.end.split('.')[0]);
            const endMonth = parseInt(time.end.split('.')[1]);
            const startDay = parseInt(time.start.split('.')[0]);
            const startMonth = parseInt(time.start.split('.')[1]);
            if (
              dateMatches(
                startDay,
                endDay,
                startMonth,
                endMonth,
                compareDay,
                compareMonth
              )
            ) {
              return [
                {
                  title: time.wildArt,
                },
              ];
            }
          } else {
            return [
              {
                title: time.wildArt,
              },
            ];
          }
        }
      });
      classes.klassen = flatten(classes);
    }
    let klassen = classes ? classes.klassen : [];
    klassen = klassen.filter(filterKlasse => {
      if (filterKlasse) {
        return true;
      }
    });
    return klassen;
  })

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
  watch(selectedCategory, (newVal, oldVal) => {
    if (newVal !== oldVal) {
      selectedSpecies.value = undefined
    }
  })
</script>
