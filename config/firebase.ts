import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA5ESOEqNyVXyV6UnRQ9p_-1Qg_GdNo3t4",
  authDomain: "pata-solidaria-fb7d8.firebaseapp.com",
  projectId: "pata-solidaria-fb7d8",
  storageBucket: "pata-solidaria-fb7d8.firebasestorage.app",
  messagingSenderId: "328945632957",
  appId: "1:328945632957:web:a4d03b311744a2de0559d4",
  measurementId: "G-ZV6VBF9CC8"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Auth
const auth = getAuth(app);

export { app, auth };
