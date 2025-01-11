// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "tourism-travel-4cf2e.firebaseapp.com",
  projectId: "tourism-travel-4cf2e",
  storageBucket: "tourism-travel-4cf2e.firebasestorage.app",
  messagingSenderId: "963402810103",
  appId: "1:963402810103:web:ae7a6bf803821b1ab589f2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);