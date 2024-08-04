import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC8q9-h0YYCby7pKAs7qq96nTpKTC02IiM",
  authDomain: "pantry-tracker-ccb2a.firebaseapp.com",
  projectId: "pantry-tracker-ccb2a",
  storageBucket: "pantry-tracker-ccb2a.appspot.com",
  messagingSenderId: "512223365216",
  appId: "1:512223365216:web:d9fa6ddc103738cded9b05",
  measurementId: "G-WY0CDGZE87"
};

let firestore;

if (typeof window !== 'undefined' && !getApps().length) {
  // Client-side initialization
  const app = initializeApp(firebaseConfig);
  firestore = getFirestore(app);
} else if (!getApps().length) {
  // Server-side initialization
  const app = initializeApp(firebaseConfig);
  firestore = getFirestore(app);
}

export { firestore };