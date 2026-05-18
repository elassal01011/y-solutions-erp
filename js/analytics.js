// Analytics Processing Script Engine
function initDashboardAnalytics() {
    const tbody = document.getElementById('revenue-table-body');
    if (!tbody) return;

    tbody.innerHTML = '';
    GLOBAL_REVENUE_DATA.forEach(row => {
        tbody.innerHTML += `<tr>
            <td><b>${row.month}</b></td>
            <td>${row.projects}</td>
            <td>${row.revenue.toLocaleString()} EGP</td>
            <td style="color:#2ecc71; font-weight:600;">${row.profit.toLocaleString()} EGP</td>
        </tr>`;
    });
}
