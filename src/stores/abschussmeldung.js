import { defineStore } from 'pinia';

import { useSessionStore } from './session';
import { db } from '@/firebase/init';

import { send } from '@emailjs/browser';
import { addDoc, collection } from 'firebase/firestore';

export const useAMStore = defineStore('abschussmeldung', {
  state: () => ({
    state: '',
    error: null,
    publicKey: 'zgJ6LV8NM3MPVxJjC',
    template: 'template_oiumjvh',
    serviceId: 'service_yvrvw1q',
    updateState: '',
    updateError: null,
    diaryOnly: false,
    saveDiary: true,
    species: [
      'Rotwild',
      'Rehwild',
      'Schwarzwild',
      'Damwild',
      'Muffelwild',
      'Sikawild',
      'Gamswild',
      'Aaskrähen',
      'Baumfalke',
      'Baummarder',
      'Bekassine',
      'Blässgans',
      'Blesshuhn',
      'Dachs',
      'Eichelhäher',
      'Elstern',
      'Fasane',
      'Feldhase',
      'Fischadler',
      'Fischotter',
      'Fuchs',
      'Goldschakal',
      'Graugans',
      'Großes Wiesel',
      'Habicht',
      'Haselwild',
      'Iltisse',
      'Kaiseradler',
      'Kanadagans',
      'Kleines Wiesel',
      'Knäkente',
      'Kormoran',
      'Kornweihe',
      'Krickente',
      'Löffelente',
      'Luchs',
      'Marderhund',
      'Mäusebussard',
      'Nutria',
      'Pfeifente',
      'Rauhfussbussard',
      'Rebhuhn',
      'Reierente',
      'Reiher',
      'Rohrweihe',
      'Rotfussfalke',
      'Rothalsgans',
      'Rotmilan',
      'Saatgans',
      'Sakerfalke',
      'Schellente',
      'Schleiereule',
      'Schnatterente',
      'Schwarzmilan',
      'Seeadler',
      'Sperber',
      'Spießente',
      'Steinmarder',
      'Steppeniltis',
      'Stockente',
      'Tafelente',
      'Trappen',
      'Turmfalke',
      'Uhu',
      'Wachtel',
      'Waldkauz',
      'Waldohreule',
      'Waldschnepfe',
      'Wanderfalke',
      'Waschbär',
      'Wespenbussard',
      'Wiesenweihe',
      'Wildkaninchen',
      'Wildkatze',
      'Wildtauben',
      'Wolf',
    ],
  }),
  actions: {
    sendMeldung (
      {
        email,
        abschuss,
        untersuchung,
        weiterverwendung,
      }
    ) {
      const sessionStore = useSessionStore();
      email = sessionStore.contactMail
      const formData = {
        to_email: email,
        abschuss,
        untersuchung,
        weiterverwendung,
        from_name:
        sessionStore.user.displayName || sessionStore.user.email,
      };
      this.state = 'fetching';
      send(this.serviceId, this.template, formData, this.publicKey).then(
        () => {
          this.state = 'success';
          this.error = null;
        },
        error => {
          this.state = 'error';
          this.error = error;
          console.error('FAILED...', error.text);
        }
      );
    },
    async updateAndSend (
      { email, saveDefault, abschuss, untersuchung, weiterverwendung }
    ) {
      const sessionStore = useSessionStore();
      if (saveDefault && sessionStore.contactMail != email) {
        await sessionStore.updateSettings({ email });
      }
      await this.sendMeldung({
        email,
        abschuss,
        untersuchung,
        weiterverwendung,
      });
    },
    async updateUserDiary ( { abschuss }) {
      const sessionStore = useSessionStore();
      this.updateState = 'fetching';
      try {
        await addDoc(collection(db, 'diary'), {
          user: sessionStore.user.uid,
          ...abschuss,
        });
        this.updateState = 'success';
      } catch (error) {
        console.error(error);
        this.updateState = 'error';
      }
    },
  },
})
