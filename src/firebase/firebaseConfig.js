import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Replace with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyChwLAIa_iYtDnKKxB__ASRtalOip-b5xo",
  authDomain: "taskmanager-28c46.firebaseapp.com",
  projectId: "taskmanager-28c46",
  storageBucket: "taskmanager-28c46.firebasestorage.app",
  messagingSenderId: "93785557225",
  appId: "1:93785557225:web:df6298b55f2b8d91aa4878"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };
