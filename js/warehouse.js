import { db } from './config.js';

import {
collection,
addDoc,
getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const saveBtn = document.getElementById('saveItem');
const table = document.getElementById('warehouseTable');

saveBtn.addEventListener('click', async()=>{

const name = document.getElementById('itemName').value;
const price = Number(document.getElementById('itemPrice').value);
const qty = Number(document.getElementById('itemQty').value);

await addDoc(collection(db,'warehouse'),{
name,
price,
qty
});

alert('Item Added');

});

async function load(){

const snapshot = await getDocs(collection(db,'warehouse'));

snapshot.forEach((doc)=>{

const data = doc.data();

 table.innerHTML += `
 <tr>
 <td>${data.name}</td>
 <td>${data.price}</td>
 <td>${data.qty}</td>
 </tr>
 `;

});

}

load();
