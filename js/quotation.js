import { db } from './config.js';

    return 700;
}

const addItemBtn = document.getElementById('addItem');

addItemBtn.addEventListener('click',()=>{

    const itemName = itemsSelect.value;
    const qty = Number(document.getElementById('qty').value);

    const selected = allItems.find(i=>i.name===itemName);

    const itemTotal = qty * selected.price;

    quotationItems.push({
        item:itemName,
        qty,
        price:selected.price,
        total:itemTotal
    });

    total += itemTotal;

    quotationTable.innerHTML += `
    <tr>
        <td>${itemName}</td>
        <td>${qty}</td>
        <td>${selected.price}</td>
        <td>${itemTotal}</td>
    </tr>
    `;

    updateTotal();

});

function updateTotal(){

    const vat = Number(document.getElementById('vat').value);
    const installation = Number(document.getElementById('installation').value);

    const city = document.getElementById('clientCity').value;

    const delivery = cityDelivery(city);

    const vatValue = total * vat / 100;

    const grand = total + vatValue + installation + delivery;

    document.getElementById('grandTotal').innerText = `Grand Total: ${grand} EGP`;

}

const saveBtn = document.getElementById('saveQuotation');

saveBtn.addEventListener('click', async()=>{

    const client = document.getElementById('clientName').value;
    const phone = document.getElementById('clientPhone').value;

    await addDoc(collection(db,'orders'),{

        client,
        phone,
        items:quotationItems,
        total,
        status:'Pending',
        createdAt:new Date()

    });

    alert('Quotation Saved');

});
