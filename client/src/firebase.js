// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "exam-site-eb38f.firebaseapp.com",
  projectId: "exam-site-eb38f",
  storageBucket: "exam-site-eb38f.appspot.com",
  messagingSenderId: "343041246312",
  appId: "1:343041246312:web:382c0b8f48bc05cd61a7dd"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);