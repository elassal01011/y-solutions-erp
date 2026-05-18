// Storage Control Panel Framework Logic
window.onload = () => {
    checkAccessControl(["Manager", "Storage"]);
    renderInventoryTable();
};

function renderInventoryTable() {
    const tbody = document.getElementById('warehouse-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';
    GLOBAL_HARDWARE_CATALOG.forEach(h => {
        tbody.innerHTML += `<tr>
            <td>#${h.id}</td>
            <td>${h.category}</td>
            <td><b>${h.name}</b></td>
            <td>${h.brand}</td>
            <td>${h.price} EGP</td>
        </tr>`;
    });
}

function commitNewHardwareItem() {
    const name = document.getElementById('wh-name').value;
    const brand = document.getElementById('wh-brand').value;
    const category = document.getElementById('wh-cat').value;
    const price = parseInt(document.getElementById('wh-price').value);

    if (!name || !brand || !price) return alert("Fill in product specifications parameters.");

    const generatedId = GLOBAL_HARDWARE_CATALOG.length + 100;
    const newAsset = { id: generatedId, category: category, name: name, brand: brand, price: price };

    GLOBAL_HARDWARE_CATALOG.push(newAsset);
    db.collection('inventory_pool').doc(`item_${generatedId}`).set(newAsset).then(() => {
        alert("Item logged to Firestore catalog pool.");
        renderInventoryTable();
        document.getElementById('wh-name').value = '';
        document.getElementById('wh-brand').value = '';
        document.getElementById('wh-price').value = '';
    });
}
