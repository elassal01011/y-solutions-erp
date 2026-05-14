// --- 1. PREVIEW LOGIC ---
function calcQuotation() {
    let subtotal = 0;
    const items = [];
    document.querySelectorAll('.device-qty').forEach(input => {
        const qty = parseInt(input.value) || 0;
        const price = parseFloat(input.dataset.price) || 0;
        const name = input.dataset.name;
        if (qty > 0) {
            const lineTotal = qty * price;
            subtotal += lineTotal;
            items.push({ name, qty, price, lineTotal });
        }
    });
    const vat = subtotal * 0.14;
    const total = subtotal + vat;

    const output = document.getElementById('quotationOutput');
    if(output) {
        output.innerHTML = `
            <div class="alert alert-secondary mt-3">
                Subtotal: ${subtotal.toLocaleString()} EGP <br>
                VAT (14%): ${vat.toLocaleString()} EGP <br>
                <strong>Total: ${total.toLocaleString()} EGP</strong>
            </div>`;
    }
    return { items, total, subtotal, vat };
}

// --- 2. SAVE & SYNC ---
async function saveQuotation() {
    const data = calcQuotation();
    const client = document.getElementById('cName').value;
    if (!client) return alert("Please enter client name");

    try {
        await db.collection("quotations").add({
            clientName: client,
            items: data.items,
            total: data.total,
            status: "Pending Approval", // Ops will see this later
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        alert("Quotation saved and sent to Pipeline!");
        location.reload();
    } catch (e) { alert("Error: " + e.message); }
}

// --- 3. DISPLAY TABLE ---
db.collection("quotations").orderBy("createdAt", "desc").onSnapshot(snap => {
    const table = document.getElementById('quotationTable');
    if(!table) return;
    table.innerHTML = '';
    snap.forEach(doc => {
        const d = doc.data();
        table.innerHTML += `
            <tr>
                <td>${d.createdAt?.toDate().toLocaleDateString() || 'Recent'}</td>
                <td>${d.clientName}</td>
                <td>${d.total.toLocaleString()} EGP</td>
                <td><span class="badge bg-warning">${d.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-dark" onclick="printContract('${doc.id}')">Contract</button>
                </td>
            </tr>`;
    });
});
