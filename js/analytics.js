async function updateDashboardStats() {
    // Get Total Projects
    const projectsSnap = await db.collection('projects').get();
    document.getElementById('stat-projects').innerText = projectsSnap.size;

    // Get Total Employees
    const employeesSnap = await db.collection('employees').get();
    document.getElementById('stat-employees').innerText = employeesSnap.size;

    // Calculate Total Inventory Value
    const stockSnap = await db.collection('products').get();
    let totalValue = 0;
    stockSnap.forEach(doc => {
        totalValue += (doc.data().buyPrice * doc.data().stock);
    });
    document.getElementById('stat-revenue').innerText = `${totalValue.toLocaleString()} EGP`;
}

// Run on load
if (document.getElementById('salesChart')) {
    updateDashboardStats();
}