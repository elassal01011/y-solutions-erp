// Y-Solutions ERP - Executive Dashboard UI Controller Interface
document.addEventListener("DOMContentLoaded", () => {
    // 1. Instantly trigger security wall checks (Only Managers & HR personnel allowed here)
    if (typeof checkAccessControl === "function") {
        checkAccessControl(["Manager", "HR"]);
    }

    // 2. Safely capture the UI Table hook
    const tableBody = document.getElementById("revenue-table-body");
    
    // 3. Verify datasets are alive and run the view generator loop
    if (tableBody && typeof GLOBAL_REVENUE_DATA !== "undefined") {
        tableBody.innerHTML = ""; // Clear existing table structure placeholders
        
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
