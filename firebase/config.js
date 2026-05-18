// Y-Solutions ERP - Firebase Initialization Config
const firebaseConfig = {
    apiKey: "AIzaSyARIpexHYJRjy_K2mjjro68sKi-hQEfswc",
    authDomain: "y-solutions-erp.firebaseapp.com",
    projectId: "y-solutions-erp",
    storageBucket: "y-solutions-erp.firebasestorage.app",
    messagingSenderId: "414095083537",
    appId: "1:414095083537:web:b5dbce7b9f255fa6bfc9b0",
    measurementId: "G-YN7E8FTX3T"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
