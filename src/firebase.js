import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyD9sbjvDt1ZtpVKoKVVdyz9f9kKW0PCLs",
  authDomain: "zip-crm.firebaseapp.com",
  projectId: "zip-crm",
  storageBucket: "zip-crm.appspot.com",
  messagingSenderId: "276358985938",
  appId: "1:276358985938:web:4f9f77b122520a3676150b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app; 