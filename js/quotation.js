// --- 1. REAL-TIME CALCULATION ---
function calcQuotation() {
    // Get client name and inputs
    const clientName = document.getElementById('cName').value;
    
    // In a professional system, prices should come from your 'products' collection
    // For this calculation, we use the standard rates
    let subtotal = 0;
    const items = [];

    // Select all inputs with class 'device-qty' (add this class to your HTML inputs)
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

    const vat = subtotal * 0.14; // 14% VAT
    const total = subtotal + vat;

    // Update the Preview UI
    renderPreview(items, subtotal, vat, total);

    return { items, subtotal, vat, total, clientName };
}

function renderPreview(items, subtotal, vat, total) {
    const previewBox = document.getElementById('quotationOutput');
    if (!previewBox) return;

    if (items.length === 0) {
        previewBox.innerHTML = `<p class="text-muted text-center">Select devices to preview quotation...</p>`;
        return;
    }

    let html = `
        <div class="p-3 border rounded bg-light">
            <h5 class="fw-bold mb-3">Quotation Preview</h5>
            <table class="table table-sm">
                <thead><tr><th>Item</th><th>Qty</th><th>Total</th></tr></thead>
                <tbody>
                    ${items.map(i => `<tr><td>${i.name}</td><td>${i.qty}</td><td>${i.lineTotal.toLocaleString()} EGP</td></tr>`).join('')}
                </tbody>
            </table>
            <div class="text-end border-top pt-2">
                <p class="mb-1">Subtotal: ${subtotal.toLocaleString()} EGP</p>
                <p class="mb-1">VAT (14%): ${vat.toLocaleString()} EGP</p>
                <h5 class="fw-bold text-primary">Total: ${total.toLocaleString()} EGP</h5>
            </div>
        </div>`;
    
    previewBox.innerHTML = html;
}

// --- 2. SAVE TO FIREBASE ---
async function saveQuotation() {
    const data = calcQuotation();
    
    if (!data.clientName) {
        alert("Please enter the Client Name first.");
        return;
    }

    try {
        // Save to 'quotations' collection
        const docRef = await db.collection("quotations").add({
            clientName: data.clientName,
            clientPhone: document.getElementById('cPhone').value || "N/A",
            items: data.items,
            total: data.total,
            status: "Pending", // Initial status for Ops team
            date: new Date().toLocaleDateString(),
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            consultant: auth.currentUser.email
        });

        alert("Quotation saved successfully!");
        
        // Clear form
        document.getElementById('cName').value = '';
        document.querySelectorAll('.device-qty').forEach(i => i.value = 0);
        renderPreview([], 0, 0, 0);

    } catch (error) {
        console.error("Error saving quotation:", error);
        alert("Failed to save: " + error.message);
    }
}

// --- 3. AUTO-CONTRACT GENERATOR ---
function printContract(id) {
    // Fetch the specific quotation from Firestore
    db.collection("quotations").doc(id).get().then(doc => {
        if (!doc.exists) return alert("Quotation not found");
        
        const data = doc.data();
        const printWindow = window.open('', '', 'height=800,width=900');
        
        // Professional Contract Template
        printWindow.document.write(`
            <html>
            <head>
                <title>Contract - ${data.clientName}</title>
                <style>
                    body { font-family: 'Segoe UI', sans-serif; padding: 50px; line-height: 1.6; }
                    .header { text-align: center; border-bottom: 2px solid #c5a059; margin-bottom: 30px; }
                    .gold { color: #c5a059; }
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
                    .footer { margin-top: 50px; display: flex; justify-content: space-between; }
                    .sig-line { border-top: 1px solid black; width: 200px; margin-top: 50px; text-align: center; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1 class="gold">Y SOLUTIONS</h1>
                    <p>Smart Home Systems & Engineering Services</p>
                </div>
                
                <h3>SMART HOME INSTALLATION AGREEMENT</h3>
                <p><strong>Date:</strong> ${data.date}</p>
                <p><strong>Client Name:</strong> ${data.clientName}</p>
                
                <table>
                    <thead><tr><th>Equipment Description</th><th>Quantity</th><th>Price</th></tr></thead>
                    <tbody>
                        ${data.items.map(item => `<tr><td>${item.name}</td><td>${item.qty}</td><td>${item.lineTotal.toLocaleString()} EGP</td></tr>`).join('')}
                    </tbody>
                </table>
                
                <h4 class="text-end">Total Contract Value: <span class="gold">${data.total.toLocaleString()} EGP</span></h4>
                
                <div class="terms">
                    <p><strong>Terms of Service:</strong></p>
                    <ul>
                        <li>Hardware is covered by a 1-year limited warranty.</li>
                        <li>Installation will commence within 7-10 working days from date of signature.</li>
                        <li>This quotation is valid for 15 days.</li>
                    </ul>
                </div>

                <div class="footer">
                    <div>
                        <p>Y SOLUTIONS Representative</p>
                        <div class="sig-line">Signature</div>
                    </div>
                    <div>
                        <p>Client Acceptance</p>
                        <div class="sig-line">Signature</div>
                    </div>
                </div>
            </body>
            </html>
        `);
        
        printWindow.document.close();
        // Wait for images/styles to load before printing
        setTimeout(() => { printWindow.print(); }, 500);
    });
}
