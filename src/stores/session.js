import { defineStore } from 'pinia'
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase/init';
import router from '@/router';
import { useAppStore } from './app';

export const useSessionStore = defineStore('session', {
  state: () => ({
    user: null,
    state: '',
    error: null,
    signinError: null,
    signoutError: null,
    createError: null,
    initState: '',
    signoutState: '',
    signinState: '',
    updateState: '',
    updateError: null,
    contactMail: '',
    resetMailState: '',
    resetMailError: null,
    location: null,
    settings: null,
  }),
  actions: {
    createUser ( { user, password }) {
      this.state = 'fetching'
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, user, password)
        .then(() => {
          this.state = 'success';
          this.user = user;
          this.createError = null;
          signOut(auth)
            .then(() => {
              this.signoutState = 'success';
              this.user = null;
              this.signoutError = null;
              router.push('/');
            })
            .catch(error => {
              this.signoutError = error.code;
              this.signoutState = 'error';
            });
        })
        .catch(error => {
          this.createError = error.code;
          this.state = 'error';
        });
    },
    init () {
      this.initState='fetching';
      const auth = getAuth();
      navigator.geolocation.watchPosition(pos => {
        this.location = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
      });
      onAuthStateChanged(auth, async user => {
        const appStore = useAppStore();
        appStore.loading = true;
        if (user) {
          try {
            const querySnapshot = await getDoc(
              doc(db, 'settings', auth.currentUser.uid)
            );
            if (querySnapshot.data()) {
              this.contactMail = querySnapshot.data().to_email || '';
              this.settings = querySnapshot.data();
            }
            this.user = user;
            this.initState = 'success';
            this.error = null;
          } catch (e) {
            console.error('error in getting settings', e);
            this.initState = 'success';
            this.user = null;
            this.error = null;
          } finally {
            appStore.loading = false;
          }
        } else {
          this.initState = 'success';
          this.user = null;
          this.error = null;
          appStore.loading = false;
        }
      });
    },
    signOut () {
      this.signoutState = 'fetching'
      const auth = getAuth();
      signOut(auth)
        .then(() => {
          this.signoutState = 'success';
          this.user = null;
          this.signoutError = null;
          router.push('/');
        })
        .catch(error => {
          this.signoutError = error.code;
          this.signoutState = 'error';
        });
    },
    signIn ( { email, password }) {
      this.signinState = 'fetching';
      const auth = getAuth();
      signInWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
          const user = userCredential.user;
          this.user = user;
          this.signinState = 'success';
          this.signinError = null;
          router.push('/');
        })
        .catch(error => {
          console.log(error.code);
          this.signinError = error.code;
          this.signinState = 'error';
        });
    },
    async updateSettings ({ email, region }) {
      this.updateState = 'fetching';
      const settings = {
        ...this.settings,
        to_email: email,
        region,
      };
      try {
        await setDoc(doc(db, 'settings', this.user.uid), settings);
        this.updateState = 'success';
        this.updateError = null;
        this.settings = settings;
        this.contactMail = settings.to_email;
      } catch (error) {
        console.error(error);
        this.updateError = error.code;
        this.updateState = 'error';
      }
    },
    updateDisplayName ( { displayName }) {
      this.updateState = 'fetching';
      const auth = getAuth();
      updateProfile(auth.currentUser, {
        displayName,
      })
        .then(() => {
          this.updateState = 'success';
          this.updateError = null;
        })
        .catch(error => {
          console.error(error);
          this.updateError = error.code;
          this.updateState = 'error';
        });
    },
    sendResetMail ( { email }) {
      this.resetMailState = 'fetching';
      const auth = getAuth();
      sendPasswordResetEmail(auth, email)
        .then(() => {
          this.resetMailError = null;
          this.resetMailState = 'success';
        })
        .catch(error => {
          console.error(error);
          this.resetMailError = error.code;
          this.resetMailState = 'error';
        });
    },
  },
});
