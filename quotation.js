let cart = [];

function addToQuote(productId, name, price) {
    const item = { productId, name, price, qty: 1 };
    cart.push(item);
    renderQuote();
}

function renderQuote() {
    let subtotal = 0;
    const quoteList = document.getElementById('quoteList');
    quoteList.innerHTML = '';

    cart.forEach((item, index) => {
        const total = item.price * item.qty;
        subtotal += total;
        quoteList.innerHTML += `<li>${item.name} - ${item.qty} x ${item.price} = ${total}</li>`;
    });

    const vat = subtotal * 0.14; // 14% VAT
    const grandTotal = subtotal + vat;

    document.getElementById('totalAmount').innerText = `${grandTotal.toFixed(2)} EGP`;
}

function printInvoice() {
    window.print(); // Browser handles the "Print to PDF" perfectly
}