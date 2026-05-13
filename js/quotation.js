// 1. Function to Save a new Quotation to Firebase
async function saveQuotation() {
    const client = document.getElementById('clientName').value;
    const amount = document.getElementById('totalAmount').value;
    const status = document.getElementById('quoteStatus').value;

    if (!client || !amount) {
        alert("Please fill in all fields");
        return;
    }

    try {
        await db.collection("quotations").add({
            clientName: client,
            total: parseFloat(amount),
            status: status,
            date: new Date().toLocaleDateString()
        });
        
        // Close modal and clear inputs
        bootstrap.Modal.getInstance(document.getElementById('quoteModal')).hide();
        document.getElementById('clientName').value = "";
        document.getElementById('totalAmount').value = "";
        
        alert("Quotation Saved Successfully!");
    } catch (error) {
        console.error("Error adding quotation: ", error);
    }
}

// 2. Function to Load and listen to Real-time updates
function loadQuotations() {
    db.collection("quotations").onSnapshot((snapshot) => {
        const tableBody = document.getElementById("quotationTable");
        if (!tableBody) return;

        tableBody.innerHTML = ""; // Clear existing rows
        snapshot.forEach((doc) => {
            const quote = doc.data();
            tableBody.innerHTML += `
                <tr>
                    <td>${quote.date}</td>
                    <td>${quote.clientName}</td>
                    <td>${quote.total} EGP</td>
                    <td><span class="badge ${quote.status === 'Approved' ? 'bg-success' : 'bg-warning'}">${quote.status}</span></td>
                    <td>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteQuote('${doc.id}')">Delete</button>
                    </td>
                </tr>
            `;
        });
    });
}

// 3. Delete Function
async function deleteQuote(id) {
    if(confirm("Are you sure you want to delete this?")) {
        await db.collection("quotations").doc(id).delete();
    }
}

// Run loader on startup
loadQuotations();
