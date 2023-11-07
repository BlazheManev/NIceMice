//firebase konfiguracija


import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";



const firebaseConfig = {
  apiKey: "AIzaSyB0UVrOuzqSHGskQd6DqjloQmsJt7t4O_0",
  authDomain: "nice-mice.firebaseapp.com",
  databaseURL: "https://nice-mice-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "nice-mice",
  storageBucket: "nice-mice.appspot.com",
  messagingSenderId: "769204381453",
  appId: "1:769204381453:web:b1216aeecd5f3f7cb0b244",
  measurementId: "G-T1RK90NZMV"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getDatabase(app);

const auth = getAuth(app); 

export { app, db, auth };