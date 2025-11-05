<template>
  <v-container>
    <v-card-title>Schusszeiten</v-card-title>
    <v-card-subtitle>Quelle: <a class="text-decoration-none" :href="currentSource.link">{{ currentSource.linkName }}</a></v-card-subtitle>
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
              <v-radio label="Hasenartige u. Nagetiere" :value="4" />
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
                  style="word-break: break-word; white-space: normal;"
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
  import { useSessionStore } from '@/stores/session';
  const tab = ref('one')
  const selectedSpecies = ref();
  const selectedDate = ref();
  const selectedCategory = ref(1);
  const sessionStore = useSessionStore();
  const region = ref(sessionStore.settings.region);
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


  const currentSource = computed(() => {
    const times = timesTotal.find(p => p.region == region.value);
    if(times) {
      return times.source;
    }
    return '';
  })

  const species = computed(() => {
    const times = timesTotal.find( p => p.region == region.value);
    return times.times.map(entry => {
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
    const times = timesTotal.find( p => p.region == region.value);
    if (tab.value === 'one') {
      classes = times.times.find(time => {
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
      classes = times.times.map(time => {
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
              if(!time.note || time.note && !time.note.includes('geschont'))
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

            if(!time.note || time.note && !time.note.includes('geschont'))
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


  const timesTotal = [
    {
      region: 'loweraustria',
      source: {
        linkName: 'Jagdverband NÖ',
        link: 'https://www.noejagdverband.at/wp-content/uploads/Schuszzeiten-NOE-2024-1.pdf',
      },
      times: [
        {
          wildArt: 'Adler',
          category: 3,
          note: 'Ganzjährig geschont',
        },
        {
          wildArt: 'Alpenschneehase',
          category: 4,
          note: 'Ganzjährig geschont',
        },
        {
          wildArt: 'Auerhenne',
          category: 3,
          note: 'Ganzjährig geschont',
        },
        {
          wildArt: 'Auerhahn',
          category: 3,
          start: '01.05.',
          end: '31.05.',
          note: 'In geraden Jahren - NÖ Auer- und Birkhahnen-Verordnung',
        },
        {
          wildArt: 'Bär',
          category: 2,
          note: 'Ganzjährig geschont',
        },
        {
          wildArt: 'Wolf',
          category: 2,
          note: 'Ganzjährig geschont',
        },
        {
          wildArt: 'Birkhahn',
          category: 3,
          start: '01.05.',
          end: '31.05.',
          note: 'In ungeraden Jahren - NÖ Auer- und Birkhahnen-Verordnung',
        },
        {
          wildArt: 'Bläßhuhn',
          category: 3,
          start: '01.08.',
          end: '28.02.',
        },
        {
          wildArt: 'Mäusebussard',
          category: 3,
          note: 'Ganzjährig geschont',
        },
        {
          wildArt: 'Dachs',
          category: 2,
          start: '16.06.',
          end: '31.01.',
        },
        {
          wildArt: 'Eichelhäher',
          category: 3,
          start: '01.08.',
          end: '15.03.',
          note: 'Bezirks-Verordnung beachten',
        },
        {
          wildArt: 'Elster',
          category: 3,
          start: '01.08.',
          end: '15.03.',
          note: 'Bezirks-Verordnung beachten',
        },
        {
          wildArt: 'Eulen',
          category: 3,
          note: 'Ganzjährig geschont',
        },
        {
          wildArt: 'Falken',
          category: 3,
          note: 'Ganzjährig geschont',
        },
        {
          wildArt: 'Fasane',
          category: 3,
          start: '01.10.',
          end: '31.12.',
          note: 'Abweichungen durch bezirksweise Regelungen möglich',
        },
        {
          wildArt: 'Feldhase',
          category: 4,
          start: '01.10.',
          end: '31.12.',
          note: ' In Weingärten und in den an Weingärten angrenzenden Grundflächen bis zu einer Tiefe von etwa 200 m sowie in Weingartenrieden in den von Weingärten ganz oder teilweise umschlossenen Grundflächen: 01. 10. - 31. 01.',
        },
        {
          wildArt: 'Fuchs',
          category: 2,
          start: '01.01.',
          end: '31.12.',
        },
        {
          wildArt: 'Geier',
          category: 3,
          note: 'Ganzjährig geschont',
        },
        {
          wildArt: 'Graureiher',
          category: 3,
          note: 'Ganzjährig geschont - NÖ Kormoran und Graureiher -Verordnung',
        },
        {
          wildArt: 'Habicht',
          category: 3,
          note: 'Ganzjährig geschont',
        },
        {
          wildArt: 'Haselhahn',
          category: 3,
          start: '01.09.',
          end: '31.10.',
        },
        {
          wildArt: 'Haselhenne',
          category: 3,
          note: 'Ganzjährig geschont',
        },
        {
          wildArt: 'Steppeniltis',
          category: 2,
          note: 'Ganzjährig geschont',
        },
        {
          wildArt: 'Waldiltis',
          category: 2,
          start: '01.01.',
          end: '31.12.',
        },
        {
          wildArt: 'Kolkrabe',
          category: 3,
          note: 'Ganzjährig geschont',
        },
        {
          wildArt: 'Kormoran',
          category: 3,
          note: 'Ganzjährig geschont - NÖ Kormoran und Graureiher -Verordnung',
        },
        {
          wildArt: 'Krammetsvogel',
          category: 3,
          note: 'Ganzjährig geschont',
        },
        {
          wildArt: 'Milane',
          category: 3,
          note: 'Ganzjährig geschont',
        },
        {
          wildArt: 'Edelmarder',
          category: 2,
          start: '01.11.',
          end: '28.02.',
        },
        {
          wildArt: 'Steinmarder',
          category: 2,
          start: '01.01.',
          end: '31.12.',
        },
        {
          wildArt: 'Marderhund',
          category: 2,
          start: '01.01.',
          end: '31.12.',
        },
        {
          wildArt: 'Luchs',
          category: 2,
          note: 'Ganzjährig geschont',
        },
        {
          wildArt: 'Elch',
          category: 1,
          note: 'Ganzjährig geschont',
        },
        {
          wildArt: 'Muffelwild',
          category: 1,
          start: '01.06.',
          end: '31.12.',
        },
        {
          wildArt: 'Murmeltier',
          category: 4,
          note: 'Ganzjährig geschont',
        },
        {
          wildArt: 'Nebelkrähe',
          category: 3,
          start: '01.07.',
          end: '31.03.',
          note: 'Bezirks-Verordnung beachten',
        },
        {
          wildArt: 'Rabenkrähe',
          category: 3,
          start: '01.07.',
          end: '31.03.',
          note: 'Bezirks-Verordnung beachten',
        },
        {
          wildArt: 'Rackelhahn Mai',
          category: 3,
          start: '01.05.',
          end: '31.05.',
        },
        {
          wildArt: 'Rackelhahn Winter',
          category: 3,
          start: '01.10.',
          end: '28.03.',
        },
        {
          wildArt: 'Rackelhenne',
          category: 3,
          note: 'Ganzjährig geschont',
        },
        {
          wildArt: 'Rebhuhn',
          category: 3,
          start: '21.09.',
          end: '30.11.',
          note: 'Abweichungen durch bezirksweise Regelungen möglich',
        },
        {
          wildArt: 'Schneehuhn',
          category: 3,
          note: 'Ganzjährig geschont',
        },
        {
          wildArt: 'Schwäne',
          category: 3,
          note: 'Ganzjährig geschont',
        },
        {
          wildArt: 'Sperber',
          category: 3,
          note: 'Ganzjährig geschont',
        },
        {
          wildArt: 'Steinhuhn',
          category: 3,
          note: 'Ganzjährig geschont',
        },
        {
          wildArt: 'Taucher',
          category: 3,
          note: 'Ganzjährig geschont',
        },
        {
          wildArt: 'Trappen',
          category: 3,
          note: 'Ganzjährig geschont',
        },
        {
          wildArt: 'Wachtel',
          category: 3,
          note: 'Ganzjährig geschont',
        },
        {
          wildArt: 'Sikawild',
          category: 1,
          klassen: [
            {
              klasse: 'Hirsch klasse I, II, III',
              start: '01.09.',
              end: '15.01.',
            },
            {
              klasse: 'Schmalspießer',
              start: '01.05.',
              end: '15.01.',
            },
            {
              klasse: 'Schmaltier',
              start: '01.05.',
              end: '15.01.',
            } ,
            {
              klasse: 'sonstige Tiere',
              start: '01.07.',
              end: '15.01.',
            },
            {
              klasse: 'Kalb',
              start: '01.07.',
              end: '15.01.',
            },


          ],
        },
        {
          wildArt: 'Rehwild',
          category: 1,
          klassen: [
            {
              klasse: 'Älterer Bock',
              start: '16.05.',
              end: '15.10.',
            },
            {
              klasse: 'Jährlingsbock',
              start: '16.04.',
              end: '15.10.',
            },
            {
              klasse: 'Schmalgais',
              start: '16.04.',
              end: '31.12.',
            },
            {
              klasse: 'sonstige Gaisen u. Kitze',
              start: '16.08.',
              end: '31.12.',
            },
          ],
        },
        {
          wildArt: 'Rotwild',
          category: 1,
          klassen: [
            {
              klasse: 'Hirsch Klasse I, II',
              start: '01.08.',
              end: '30.11.',
            },
            {
              klasse: 'Hirsch Klasse III',
              start: '01.08.',
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
              end: '31.12.',
            },
            {
              klasse: 'sonstige Tiere',
              start: '01.07.',
              end: '31.12.',
            },
            {
              klasse: 'Kalb',
              start: '01.07.',
              end: '31.12.',
            },
          ],
        },
        {
          wildArt: 'Gamswild',
          category: 1,
          klassen: [
            {
              klasse: 'Bock Klasse I, II u. III',
              start: '01.07.',
              end: '31.12.',
            },
            {
              klasse: 'Gais(III)',
              start: '01.07.',
              end: '31.12.',
            },
            {
              klasse: 'sonstige Gaisen und Kitze',
              start: '01.08.',
              end: '31.12.',
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
              end: '15.01.',
            },
            {
              klasse: 'Schmalspießer',
              start: '01.05.',
              end: '15.01.',
            },
            {
              klasse: 'Schmaltier',
              start: '01.05.',
              end: '15.01.',
            },
            {
              klasse: 'sonstige Tiere u. Kalb',
              start: '01.09.',
              end: '15.01.',
            },
          ],
        },
        {
          wildArt: 'Steinwild',
          category: 1,
          start: '01.08.',
          end: '31.12.',
        },
        {
          wildArt: 'Waldschnepfe',
          category: 3,
          start: '16.09.',
          end: '31.12.',
        },
        {
          wildArt: 'Waschbär',
          category: 2,
          start: '01.01.',
          end: '31.12.',
        },
        {
          wildArt: 'Wiesel',
          category: 2,
          start: '01.01.',
          end: '31.12.',
        },
        {
          wildArt: 'Stockente',
          cateogry: 3,
          start: '01.09.',
          end: '31.12.',
        },
        {
          wildArt: 'Krick-, Knäk-, Pfeif-, Schnatter-, Spieß-, Löffel-, Tafel-, Reiher-, Schellente',
          category: 3,
          start: '01.10.',
          end: '31.12.',
        },
        {
          wildArt: 'Grau- u. Saatganzs',
          category: 3,
          start: '01.08.',
          end: '31.01.',
        },
        {
          wildArt: 'andere Gänse',
          category: 3,
          note: 'Ganzjährig geschont',
        },
        {
          wildArt: 'Wildkaninchen',
          category: 4,
          start: '01.01.',
          end: '31.12.',
        },
        {
          wildArt: 'Hohltaube',
          category: 3,
          note: 'Ganzjährig geschont',
        },
        {
          wildArt: 'Ringeltaube',
          category: 3,
          start: '01.09.',
          end: '31.01.',
        },
        {
          wildArt: 'Türkentaube',
          category: 3,
          start: '15.09.',
          end: '31.01.',
        },
        {
          wildArt: 'Turteltaube',
          category: 3,
          note: 'Ganzjährig geschont',
        },
        {
          wildArt: 'Weihen',
          category: 3,
          note: 'Ganzjährig geschont',
        },
        {
          wildArt: 'Wildkatze',
          category: 2,
          note: 'Ganzjährig geschont',
        },
        {
          wildArt: 'Wildschwein',
          category: 1,
          start: '01.01.',
          end: '31.12.',
          note: 'Führende Bache 16.07. - 15.02.',
        },
        {
          wildArt: 'Wildtruthahn',
          category: 3,
          note: 'Ganzjährig geschont',
        },
      ],
    },
    { region: 'styria',
      source: {
        linkName: 'Die Steirische Jagd',
        link: 'https://www.jagd-stmk.at/jagd-in-der-steiermark/jagdzeiten/',
      },
      times: [
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
              klasse: 'Schmaltiere und Schmalspießer',
              start: '15.15.',
              end: '31.12.',
            },
            {
              klasse: 'nichtführende Tiere',
              start: '01.06.',
              end: '31.12.',
            },
            {
              klasse: 'führende Tier und Kälber',
              start: '01.07.',
              end: '15.01.',
            },
          ],
        },
        {
          wildArt: 'Damwild',
          category: 1,
          klassen: [
            {
              klasse: 'Schmaltiere und Schmalspießer',
              start: '01.05.',
              end: '31.12.',
            },
            {
              klasse: 'sonstiges Damwild',
              start: '01.08.',
              end: '31.12.',
            },
          ],
        },
        {
          wildArt: 'Steinwild',
          category: 1,
          start: '01.08.',
          end: '31.12.',
        },
        {
          wildArt: 'Gamswild',
          category: 1,
          start: '01.08.',
          end: '31.12.',
        },
        {
          wildArt: 'Schwarzwild',
          category: 1,
          klassen: [
            { klasse: 'führende Bachen',
              start: '01.08.',
              end: '31.01.',
            },
            {
              klasse: 'sonst. Schwarzwild',
              start: '01.04.',
              end: '31.03.',
            },
          ],
        },
        {
          wildArt: 'Kaninchen',
          category: 4,
          start: '01.04.',
          end: '31.03.',
        },
        {
          wildArt: 'Alpenmurmeltier',
          category: 4,
          start: '01.08.',
          end: '30.09.',
        },
        {
          wildArt: 'Fuchs',
          category: 2,
          start: '01.04.',
          end: '31.03.',
        },
        {
          wildArt: 'Marderhunde',
          category: 2,
          start: '01.04.',
          end: '31.03.',
        },
        {
          wildArt: 'Waschbären',
          category: 2,
          start: '01.04.',
          end: '31.03',
        },
        {
          wildArt: 'Goldschakal',
          category: 2,
          start: '01.10.',
          end: '15.03.',
        },
        {
          wildArt: 'Dachse',
          category: 2,
          start: '01.04.',
          end: '31.03.',
        },
        {
          wildArt: 'Baum(Edel-)marder',
          category: 2,
          start: '01.04.',
          end: '31.03.',
        },
        {
          wildArt: 'Steinmarder',
          category: 2,
          start: '01.04.',
          end: '31.03.',
        },
        {
          wildArt: 'Iltisse',
          category: 2,
          start: '01.04.',
          end: '31.03.',
        },
        {
          wildArt: 'Großes Wiesel (Hermelin)',
          category: 2,
          start: '01.06.',
          end: '31.01.',
        },
        {
          wildArt: 'Kleines Wiesel, Mauswiesel',
          category: 2,
          start: '01.06.',
          end: '31.01.',
        },
        {
          wildArt: 'Feldhasen',
          category: 4,
          klassen: [
            {
              klasse: 'in den Bezirken Deutschlandsberg, Südoststeiermark, Hartberg-Fürstenfeld, Graz-Stadt, Graz-Umgebung (mit Ausnahme des Gerichtsbezirks Frohnleiten), Leibnitz und Weiz',
              start: '16.10.',
              end: '15.12.',
            },
            {
              klasse: 'in den übrigen Bezirken, und im Ger.Bez. Frohnleiten',
              start: '01.11.',
              end: '31.12.',
            },
          ],
        },
        {
          wildArt: 'Grau- und Saatgänse',
          cateogry: 3,
          start: '01.09.',
          end: '31.12.',
        },
        {
          wildArt: 'Stock- und Krickenten',
          cateogry: 3,
          start: '01.09.',
          end: '31.12.',
        },
        {
          wildArt: 'Blässhühner',
          cateogry: 3,
          start: '01.09.',
          end: '31.12.',
        },
        {
          wildArt: 'Haselhahnen',
          cateogry: 3,
          start: '01.09.',
          end: '30.11',
        },
        {
          wildArt: 'Rebhühner',
          cateogry: 3,
          start: '16.10.',
          end: '30.11.',
        },
        {
          wildArt: 'Fasan',
          cateogry: 3,
          start: '16.10.',
          end: '31.12.',
        },
        {
          wildArt: 'Waldschnepfen',
          cateogry: 3,
          start: '11.09.',
          end: '19.02.',
        },
        {
          wildArt: 'Ringeltauben',
          cateogry: 3,
          start: '01.09.',
          end: '31.01.',
        },
        {
          wildArt: 'Türkentauben',
          cateogry: 3,
          start: '01.10.',
          end: '31.01.',
        },
        {
          wildArt: 'Rehwild',
          category: 1,
          klassen: [
            {
              klasse: 'Rehböcke der Klasse I und II',
              start: '01.06.',
              end: '31.10.',
            },
            {
              klasse: 'Rehböcke der Klasse I und II in den Bezirken Deutschlandsberg, Leibnitz, Graz, Hartberg-Fürstenfeld, Weiz und Südoststeiermark',
              start: '16.05.',
              end: '15.10.',
            },
            {
              klasse: 'Rehböcke der Klasse III',
              start: '01.05.',
              end: '31.10.',
            },
            {
              klasse: 'Rehböcke der Klasse III in den Bezirken Deutschlandsberg, Leibnitz, Graz, Hartberg-Fürstenfeld, Weiz und Südoststeiermark',
              start: '16.04.',
              end: '15.10.',
            },
            {
              klasse: 'Schmalgeißen',
              start: '01.05.',
              end: '31.12.',
            },
            {
              klasse: 'Schmalgeißen in den Bezirken Deutschlandsberg, Leibnitz, Graz, Hartberg-Fürstenfeld, Weiz und Südoststeiermark',
              start: '16.04.',
              end: '15.12.',
            },
            {
              klasse: 'nichtführende Rehgeißen',
              start: '16.05.',
              end: '31.12.',
            },
            {
              klasse: 'nichtführende Rehgeißen in den Bezirken Deutschlandsberg, Leibnitz, Graz, Hartberg-Fürstenfeld, Weiz und Südoststeiermark',
              start: '01.05.',
              end: '15.12.',
            },
            {
              klasse: 'führende Rehgeißen und -kitze',
              start: '16.08.',
              end: '31.12.',
            }, {
              klasse: 'nichtführende Rehgeißen führende Rehgeißen und -kitze in den Bezirken Deutschlandsberg, Leibnitz, Graz, Hartberg-Fürstenfeld, Weiz und Südoststeiermark',
              start: '16.05.',
              end: '15.12.',
            },
          ],
        },


      ],
    },{


      region: 'burgenland',
      source: {
        linkName: 'Jagd Burgenland',
        link: 'https://www.jagd-burgenland.at/jagd/info/schusszeiten/',
      },
      times: [
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
      ],
    },
  ]


  watch(selectedCategory, (newVal, oldVal) => {
    if (newVal !== oldVal) {
      selectedSpecies.value = undefined
    }
  })
</script>
