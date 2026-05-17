import { auth, db } from './config.js';

import {
signInWithEmailAndPassword,
onAuthStateChanged,
signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
doc,
getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const loginBtn = document.getElementById('loginBtn');

if(loginBtn){

loginBtn.addEventListener('click', async ()=>{

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try{

        const userCredential = await signInWithEmailAndPassword(auth,email,password);

        const uid = userCredential.user.uid;

        const userDoc = await getDoc(doc(db,'users',uid));

        if(userDoc.exists()){

            const role = userDoc.data().role;

            localStorage.setItem('role',role);
            localStorage.setItem('uid',uid);

            window.location.href='dashboard.html';

        }

    }catch(error){
        alert(error.message);
    }

});

}

onAuthStateChanged(auth,(user)=>{

    if(!user && !window.location.pathname.includes('login.html')){
        window.location.href='login.html';
    }

});
