// 1. SAVE DATA: Function to add a new item to Firebase
async function addNewItem() {
    const name = document.getElementById('itemName').value;
    const stock = document.getElementById('itemStock').value;
    const price = document.getElementById('itemPrice').value;

    if (!name || !stock || !price) {
        alert("Please fill all fields");
        return;
    }

    try {
        await db.collection("products").add({
            name: name,
            stock: parseInt(stock),
            price: parseFloat(price),
            lastUpdated: new Date().toLocaleString()
        });

        // Hide the popup
        const modal = bootstrap.Modal.getInstance(document.getElementById('addItemModal'));
        modal.hide();
        
        // Reset fields
        document.getElementById('itemName').value = "";
        document.getElementById('itemStock').value = "";
        document.getElementById('itemPrice').value = "";

    } catch (error) {
        alert("Error saving: " + error.message);
    }
}

// 2. DISPLAY DATA: Listen to Firebase for real-time changes
function loadWarehouse() {
    db.collection("products").onSnapshot((snapshot) => {
        const tableBody = document.getElementById("warehouseTable");
        if (!tableBody) return;

        tableBody.innerHTML = ""; // Clear the table first
        
        snapshot.forEach((doc) => {
            const item = doc.data();
            const statusClass = item.stock < 5 ? "bg-danger" : "bg-success";
            const statusText = item.stock < 5 ? "Low Stock" : "Available";

            tableBody.innerHTML += `
                <tr>
                    <td><strong>${item.name}</strong></td>
                    <td>${item.stock} Units</td>
                    <td>${item.price} EGP</td>
                    <td><span class="badge ${statusClass}">${statusText}</span></td>
                    <td>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteItem('${doc.id}')">Delete</button>
                    </td>
                </tr>
            `;
        });
    });
}

// 3. DELETE DATA: Remove item from cloud
async function deleteItem(id) {
    if(confirm("Delete this item forever?")) {
        await db.collection("products").doc(id).delete();
    }
}

// Start the listener when the page opens
loadWarehouse();
