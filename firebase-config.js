// Configuración de Firebase — Aula Virtual Jesús Rodríguez García
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyABNqgjLdfVYavtDPWvQBbz8-3duuIyAHo",
  authDomain: "aula-virtual-jrg.firebaseapp.com",
  projectId: "aula-virtual-jrg",
  storageBucket: "aula-virtual-jrg.firebasestorage.app",
  messagingSenderId: "61107664394",
  appId: "1:61107664394:web:42624b4abbdbd500d9d1f3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db, signInAnonymously, onAuthStateChanged };
