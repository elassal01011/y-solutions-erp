// Y-Solutions ERP - Executive Dashboard UI Controller
document.addEventListener("DOMContentLoaded", () => {
    // 1. Fire security fence immediately (Only Manager & HR access this module)
    if (typeof checkAccessControl === "function") {
        checkAccessControl(["Manager", "HR"]);
    }

    // 2. Loop through app.js dataset and paint the financial trajectory table
    const tableBody = document.getElementById("revenue-table-body");
    
    if (tableBody && typeof GLOBAL_REVENUE_DATA !== "undefined") {
        tableBody.innerHTML = ""; // Wipe default text out
        
        GLOBAL_REVENUE_DATA.forEach(row => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><strong>${row.month}</strong></td>
                <td>${row.projects} Projects</td>
                <td>${row.revenue.toLocaleString()} EGP</td>
                <td style="color: #2ecc71; font-weight: bold;">+${row.profit.toLocaleString()} EGP</td>
            `;
            tableBody.appendChild(tr);
        });
    }
});
