// Importar las funciones necesarias desde los SDKs de Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyArcBJtAFvfJTG7nHF7iA5x3mmiJPZJfWs",
  authDomain: "prestaciones-b0b41.firebaseapp.com",
  projectId: "prestaciones-b0b41",
  storageBucket: "prestaciones-b0b41.firebasestorage.app",
  messagingSenderId: "72036753565",
  appId: "1:72036753565:web:3d64380cea0b9610e9b474",
  measurementId: "G-LHYXVYGVP1"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Obtener las instancias de Firestore y Auth
const db = getFirestore(app);
const auth = getAuth(app);

// Exportar las instancias para su uso en otros archivos
export { db, auth };
