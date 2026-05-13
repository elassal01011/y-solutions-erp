const productRef = db.collection('products');

// Add Product to Warehouse
async function addProduct(name, category, buyPrice, sellPrice, stock) {
    try {
        await productRef.add({
            name,
            category,
            buyPrice: parseFloat(buyPrice),
            sellPrice: parseFloat(sellPrice),
            stock: parseInt(stock),
            lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
        });
        alert("Product added successfully!");
        loadWarehouse(); // Refresh list
    } catch (error) {
        console.error("Error adding product: ", error);
    }
}

// Fetch and Render Products
function loadWarehouse() {
    productRef.onSnapshot(snapshot => {
        const tableBody = document.getElementById('warehouseTable');
        if(!tableBody) return; 
        
        tableBody.innerHTML = '';
        snapshot.forEach(doc => {
            const data = doc.data();
            tableBody.innerHTML += `
                <tr>
                    <td>${data.name}</td>
                    <td>${data.category}</td>
                    <td>${data.stock}</td>
                    <td>${data.sellPrice} EGP</td>
                    <td><button class="btn btn-sm btn-danger" onclick="deleteProduct('${doc.id}')">Delete</button></td>
                </tr>
            `;
        });
    });
}