// Function to load quotations into the table
db.collection("quotations").orderBy("createdAt", "desc").onSnapshot(snapshot => {
    const table = document.getElementById('quotationTable');
    if (!table) return;
    table.innerHTML = '';
    
    snapshot.forEach(doc => {
        const data = doc.data();
        // Add a safety check to make sure the data exists
        if (!data) return;

        table.innerHTML += `
            <tr>
                <td>${data.createdAt ? data.createdAt.toDate().toLocaleDateString() : 'Pending'}</td>
                <td>${data.clientName || 'N/A'}</td>
                <td>${data.total ? data.total.toLocaleString() : 0} EGP</td>
                <td><span class="badge bg-info">${data.status || 'Pending'}</span></td>
                <td>
                    <button class="btn btn-sm btn-dark" onclick="printContract('${doc.id}')">Contract</button>
                </td>
            </tr>`;
    });
}, error => {
    console.error("QUOTATION ERROR:", error);
    if(error.code === 'permission-denied') {
        alert("Permission Denied: Check Firestore Rules!");
    }
});
