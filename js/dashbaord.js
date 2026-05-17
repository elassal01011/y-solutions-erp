import { db, auth } from './config.js';

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const ordersTable = document.getElementById('ordersTable');

async function loadDashboard(){

    const ordersSnapshot = await getDocs(collection(db,'orders'));

    document.getElementById('totalOrders').innerText = ordersSnapshot.size;

    let pending = 0;

    ordersSnapshot.forEach((doc)=>{

        const data = doc.data();

        if(data.status === 'Pending'){
            pending++;
        }

        ordersTable.innerHTML += `
        <tr>
            <td>${data.client}</td>
            <td>${data.status}</td>
            <td>${data.total} EGP</td>
        </tr>
        `;

    });

    document.getElementById('pendingProjects').innerText = pending;

    const employeesSnapshot = await getDocs(collection(db,'users'));

    document.getElementById('totalEmployees').innerText = employeesSnapshot.size;

}

loadDashboard();

const logoutBtn = document.getElementById('logoutBtn');

logoutBtn.addEventListener('click', async()=>{

    await signOut(auth);

    window.location.href='login.html';

});
