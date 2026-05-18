// Automated Professional Quotation Logic Engine
let cartItems = [];

window.onload = () => {
    checkAccessControl(["Manager", "Sales"]);
    populateProductDropdown();
    document.getElementById('client-city').addEventListener('change', calculateTotals);
};

function populateProductDropdown() {
    const el = document.getElementById('product-select');
    if (!el) return;
    el.innerHTML = '<option value="0">Select Inventory Hardware Object...</option>';
    GLOBAL_HARDWARE_CATALOG.forEach(item => {
        el.innerHTML += `<option value="${item.id}">[${item.brand}] ${item.category} - ${item.name} (${item.price} EGP)</option>`;
    });
}

function appendProductToQuote() {
    const id = parseInt(document.getElementById('product-select').value);
    const qty = parseInt(document.getElementById('product-qty').value);
    if (!id || qty < 1) return alert("Select standard baseline operational properties.");

    const asset = GLOBAL_HARDWARE_CATALOG.find(h => h.id === id);
    const exist = cartItems.find(c => c.id === id);

    if (exist) {
        exist.qty += qty;
        exist.total = exist.qty * asset.price;
    } else {
        cartItems.push({ ...asset, qty: qty, total: asset.price * qty });
    }
    renderTable();
}

function renderTable() {
    const body = document.getElementById('quote-items-body');
    body.innerHTML = '';
    cartItems.forEach(i => {
        body.innerHTML += `<tr>
            <td>${i.name} (${i.category})</td>
            <td>${i.brand}</td>
            <td>${i.price}.00 EGP</td>
            <td>${i.qty}</td>
            <td><b>${i.total}.00 EGP</b></td>
        </tr>`;
    });
    calculateTotals();
}

function calculateTotals() {
    let subtotal = 0;
    cartItems.forEach(i => subtotal += i.total);

    const city = document.getElementById('client-city').value;
    const shipping = DELIVERY_MATRIX[city] || 0;
    const install = subtotal * 0.15; // 15% Installation Base
    const preVat = subtotal + install + shipping;
    const vat = preVat * 0.14; // 14% Government Standard VAT
    const grand = preVat + vat;

    document.getElementById('txt-subtotal').innerText = subtotal.toFixed(2);
    document.getElementById('txt-install').innerText = install.toFixed(2);
    document.getElementById('txt-delivery').innerText = shipping.toFixed(2);
    document.getElementById('txt-vat').innerText = vat.toFixed(2);
    document.getElementById('txt-grand').innerText = grand.toFixed(2);
}

function finalizeOrder() {
    if (cartItems.length === 0) return alert("Cannot construct a quote execution structure on empty sets.");
    
    db.collection('orders').add({
        clientName: document.getElementById('client-name').value || "Default Prospect client",
        city: document.getElementById('client-city').value,
        items: cartItems,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        alert("Configuration committed to firestore storage logs securely.");
        cartItems = [];
        document.getElementById('client-name').value = '';
        renderTable();
    });
}
