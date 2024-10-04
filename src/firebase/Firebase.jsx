import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; 
import { getFirestore } from 'firebase/firestore';;
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAQDi-fJE_XjeB6O17njvXua-kh9cio7hI",
  authDomain: "fitplay-1e75c.firebaseapp.com",
  projectId: "fitplay-1e75c",
  storageBucket: "fitplay-1e75c.appspot.com",
  messagingSenderId: "53982245474",
  appId: "1:53982245474:web:a37db19f4b4acb4eb9173b",
  measurementId: "G-GLWLWR09Y7"
};


const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const storage = getStorage(app);

const auth = getAuth(app);
export { auth, firestore,storage };

