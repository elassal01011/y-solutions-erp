async function updateDashboardStats() {

    try {

        // Projects
        const projectsSnap = await db.collection('projects').get();

        const projectsEl = document.getElementById('stat-projects');

        if(projectsEl){
            projectsEl.innerText = projectsSnap.size;
        }

        // Employees
        const employeesSnap = await db.collection('employees').get();

        const employeesEl = document.getElementById('stat-employees');

        if(employeesEl){
            employeesEl.innerText = employeesSnap.size;
        }

        // Products
        const stockSnap = await db.collection('products').get();

        let totalValue = 0;

        stockSnap.forEach(doc => {

            const data = doc.data();

            totalValue += (data.buyPrice || 0) * (data.stock || 0);

        });

        const revenueEl = document.getElementById('stat-revenue');

        if(revenueEl){
            revenueEl.innerText =
                `${totalValue.toLocaleString()} EGP`;
        }

    }

    catch(error){

        console.log(error);

    }

}

window.addEventListener('load',()=>{

    updateDashboardStats();

});
