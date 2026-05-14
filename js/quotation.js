// --- 1. CALCULATE TOTALS DYNAMICALLY ---
function calcQuotation() {
    let subtotal = 0;
    const items = [];
    
    // Find all inputs with the class 'device-qty'
    document.querySelectorAll('.device-qty').forEach(input => {
        const qty = parseInt(input.value) || 0;
        const price = parseFloat(input.dataset.price) || 0;
        const name = input.dataset.name;
        
        if (qty > 0) {
            const lineTotal = qty * price;
            subtotal += lineTotal;
            items.push({ name: name, qty: qty, price: price, lineTotal: lineTotal });
        }
    });
    
    const vat = subtotal * 0.14; // 14% Taxes
    const total = subtotal + vat;

    // Display the calculation in the modal (styled with your new violet colors)
    const output = document.getElementById('quotationOutput');
    if(output) {
        output.innerHTML = `
            <div class="alert mt-3" style="background-color: var(--violet-light); color: var(--violet-dark); border: none;">
                Subtotal: ${subtotal.toLocaleString()} EGP <br>
                VAT (14%): ${vat.toLocaleString()} EGP <br>
                <strong>Total: ${total.toLocaleString()} EGP</strong>
            </div>`;
    }
    
    return { items, total };
}

// --- 2. SAVE BUTTON LOGIC (THE OPS LINK) ---
async function saveQuotation() {
    console.log("Save button clicked!"); // Debugging check

    const data = calcQuotation();
    const client = document.getElementById('cName').value.trim();
    
    // Validation Checks
    if (!client) return alert("Please enter the client's name.");
    if (data.items.length === 0) return alert("Please add at least one item (Qty > 0).");

    // Temporarily disable the button so users don't click it twice
    const btn = document.querySelector('button[onclick="saveQuotation()"]');
    if(btn) btn.disabled = true;

    try {
        // This is the "Link" to Ops. We save it to the shared database.
        await db.collection("quotations").add({
            clientName: client,
            items: data.items,
            total: data.total,
            status: "Pending", // Ops will see this status on their screen
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        alert("Success! Quotation saved and sent to Operations Pipeline.");
        location.reload(); // Refresh to show in the table
        
    } catch (error) { 
        console.error("Firebase Save Error:", error);
        alert("Error connecting to database: " + error.message);
        if(btn) btn.disabled = false; // Turn button back on if it failed
    }
}
