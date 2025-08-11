import { defineStore } from 'pinia';
import { db } from '@/firebase/init';
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { sortBy } from 'lodash';
import { useSessionStore } from './session';
export const useDiaryStore = defineStore('diary', {
  state: () => ({
    entries: [],
    error: null,
    status: '',
    deleteStatus: '',
    progress: 0,
  }),
  actions: {
    async getEntries () {
      const sessionStore = useSessionStore();
      this.status = 'fetching';
      this.error = null;
      //
      try {
        const entries = [];
        const q = query(
          collection(db, 'diary'),
          where('user', '==', sessionStore.user.uid)
        );

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(doc => {
          entries.push(doc);
        });
        this.status = 'success';
        this.entries = entries.map(item => {
          return { ...item.data(), id: item.id };
        });
        this.entries = sortBy(this.entries, entry => {
          return new Date(entry.date);
        });

      } catch (error) {
        this.error = error;
        this.status = 'error';
        console.error(error);

      }
    },
    async deleteEntry (id) {
      this.deleteStatus = 'fetching';
      this.error = null;

      try {
        await deleteDoc(doc(db, 'diary', id));
        this.deleteStatus = 'success';
        this.error = null;
        this.getEntries();
      } catch (error) {
        console.error(error);
        this.error = error;
        this.deleteStatus = 'error';
      }
    },

    async uploadImage ({ file, id }) {
      this.status = 'fetching';
      const sessionStore = useSessionStore();
      const storage = getStorage();
      const diaryRef = doc(db, 'diary', id);
      const imagePath = `${sessionStore.user.uid}/${file.name}`;

      try {
        // 1. Zuerst Eintrag holen, um alten Pfad zu löschen
        const snapshot = await getDoc(diaryRef);
        const oldEntry = snapshot.exists() ? snapshot.data() : null;

        // 2. Falls altes Bild vorhanden, löschen
        if (oldEntry?.imagePath) {
          const oldImageRef = ref(storage, oldEntry.imagePath);
          await deleteObject(oldImageRef).catch(err => {
            console.warn('Altes Bild konnte nicht gelöscht werden:', err.message);
          });
        }

        // 3. Neuen Upload vorbereiten
        const storageRef = ref(storage, imagePath);
        const metadata = {
          contentType: 'image/jpeg',
        };
        const uploadTask = uploadBytesResumable(storageRef, file, metadata);

        // 4. Upload überwachen
        uploadTask.on(
          'state_changed',
          snapshot => {
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            this.progress = progress;
          },
          error => {
            console.error(error);
            this.error = error;
            this.status = 'error';
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            await updateDoc(diaryRef, {
              image: downloadURL,
              imagePath, // neuen Pfad speichern
            });
            this.status = 'success';
            this.getEntries();
          }
        );
      } catch (error) {
        console.error('Fehler beim Hochladen:', error);
        this.error = error;
        this.status = 'error';
      }
    },
    async deleteImage (entry) {
      const storage = getStorage()

      try {
        if (entry.image) {
          if (!entry.imagePath) {
            this.error = 'Kein Bildpfad gefunden';
            this.status = 'error';
            return;
          }

          const imageRef = ref(storage, entry.imagePath);

          try {
            await deleteObject(imageRef);
            this.status = 'success';
            await updateDoc(doc(db, 'diary', entry.id), { image: null, imagePath: null });
            this.getEntries();
          } catch (error) {
            console.error('Fehler beim Löschen des Bildes:', error);
            this.error = error;
            this.status = 'error';
          }
        }

      } catch (error) {
        console.error('Fehler beim Löschen des Bildes:', error)
      }
    },
  },
})
