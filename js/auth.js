// ===============================
// FIREBASE IMPORTS
// ===============================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    getFirestore,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ===============================
// FIREBASE CONFIG
// ===============================

const firebaseConfig = {
    apiKey: "AIzaSyARIpexHYJRjy_K2mjjro68sKi-hQEfswc",
    authDomain: "y-solutions-erp.firebaseapp.com",
    projectId: "y-solutions-erp",
    storageBucket: "y-solutions-erp.firebasestorage.app",
    messagingSenderId: "414095083537",
    appId: "1:414095083537:web:b5dbce7b9f255fa6bfc9b0",
    measurementId: "G-YN7E8FTX3T"
};


// ===============================
// INITIALIZE FIREBASE
// ===============================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


// ===============================
// LOGIN SYSTEM
// ===============================

const loginBtn = document.getElementById("loginBtn");

if (loginBtn) {

    loginBtn.addEventListener("click", async () => {

        console.log("LOGIN STARTED");

        const email = document.getElementById("email").value.trim();

        const password = document.getElementById("password").value.trim();

        // VALIDATION

        if (!email || !password) {

            alert("Please enter email and password");

            return;
        }

        try {

            // LOGIN

            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            const user = userCredential.user;

            console.log("LOGIN SUCCESS");

            console.log(user);

            // GET USER ROLE

            const userRef = doc(db, "users", user.uid);

            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {

                const userData = userSnap.data();

                console.log("USER DATA:", userData);

                // SAVE TO LOCAL STORAGE

                localStorage.setItem("uid", user.uid);

                localStorage.setItem("email", user.email);

                localStorage.setItem("role", userData.role);

                localStorage.setItem("name", userData.name || "");

                // ROLE REDIRECT

                window.location.href = "dashboard.html";

            } else {

                alert("User role not found in Firestore");

            }

        } catch (error) {

            console.error(error);

            // FRIENDLY ERRORS

            if (error.code === "auth/invalid-email") {

                alert("Invalid email");

            } else if (error.code === "auth/user-not-found") {

                alert("User not found");

            } else if (error.code === "auth/wrong-password") {

                alert("Wrong password");

            } else if (error.code === "auth/invalid-credential") {

                alert("Wrong email or password");

            } else {

                alert(error.message);

            }

        }

    });

}


// ===============================
// SESSION CHECK
// ===============================

onAuthStateChanged(auth, (user) => {

    console.log("AUTH STATE CHANGED");

    if (user) {

        console.log("USER LOGGED IN");

    } else {

        console.log("NO USER");

        // ONLY REDIRECT IF NOT IN LOGIN PAGE

        const currentPage = window.location.pathname;

        if (
            !currentPage.includes("login.html") &&
            !currentPage.endsWith("/")
        ) {

            window.location.href = "login.html";

        }

    }

});


// ===============================
// LOGOUT SYSTEM
// ===============================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", async () => {

        try {

            await signOut(auth);

            localStorage.clear();

            window.location.href = "login.html";

        } catch (error) {

            console.error(error);

            alert("Logout Failed");

        }

    });

}
