function loadWarehouse() {
    db.collection("products").onSnapshot((snapshot) => {
        const tableBody = document.getElementById("warehouseTable");
        if (!tableBody) return;
        
        tableBody.innerHTML = "";
        snapshot.forEach((doc) => {
            const item = doc.data();
            tableBody.innerHTML += `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.stock} Units</td>
                    <td>${item.sellPrice} EGP</td>
                    <td><button class="btn btn-sm btn-outline-danger" onclick="deleteItem('${doc.id}')">Remove</button></td>
                </tr>`;
        });
    });
}

async function addProduct(name, price, stock) {
    await db.collection("products").add({
        name: name,
        sellPrice: parseFloat(price),
        stock: parseInt(stock)
    });
}
