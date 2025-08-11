import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics, logEvent } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyDmoEJoc1L2-b8VzcY6r-024FSeTZsfk6k',
  authDomain: 'jagdhelfer-burgenland-b5822.firebaseapp.com',
  projectId: 'jagdhelfer-burgenland-b5822',
  storageBucket: 'jagdhelfer-burgenland-b5822.appspot.com',
  messagingSenderId: '467294055160',
  appId: '1:467294055160:web:5da5b67493563b253d690d',
  measurementId: 'G-ZRDHQ7J0DH',
};

// init firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// init analytics
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}


// init firestore service
const db = getFirestore()
export { db, auth, analytics, logEvent };
