// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCoXiVLZhsn3PaUDs-cFoRuSsMUoqcBuq0",
  authDomain: "saylani-welfare-system-8766f.firebaseapp.com",
  databaseURL: "https://saylani-welfare-system-8766f-default-rtdb.firebaseio.com",
  projectId: "saylani-welfare-system-8766f",
  storageBucket: "saylani-welfare-system-8766f.appspot.com",
  messagingSenderId: "321699969700",
  appId: "1:321699969700:web:f26472a74d77462e83c431",
  measurementId: "G-60Y91QRV7B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage }; 