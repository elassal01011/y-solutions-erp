// Firebase SDK Import
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyARIpexHYJRjy_K2mjjro68sKi-hQEfswc",
  authDomain: "y-solutions-erp.firebaseapp.com",
  projectId: "y-solutions-erp",
  storageBucket: "y-solutions-erp.firebasestorage.app",
  messagingSenderId: "414095083537",
  appId: "1:414095083537:web:b5dbce7b9f255fa6bfc9b0",
  measurementId: "G-YN7E8FTX3T"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { auth, db };
