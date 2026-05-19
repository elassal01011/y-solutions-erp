document.addEventListener("DOMContentLoaded", () => {

    console.log("Dashboard Loaded");

    const tableBody =
        document.getElementById("revenue-table-body");

    if (!tableBody) {

        console.error("Table body not found");

        return;
    }

    const revenueData = [

        {
            month: "January",
            projects: 12,
            revenue: 250000,
            profit: 70000
        },

        {
            month: "February",
            projects: 18,
            revenue: 320000,
            profit: 90000
        },

        {
            month: "March",
            projects: 25,
            revenue: 450000,
            profit: 120000
        }

    ];

    tableBody.innerHTML = "";

    revenueData.forEach((row) => {

        const tr = document.createElement("tr");

        tr.innerHTML = `

            <td>
                <strong>${row.month}</strong>
            </td>

            <td>
                ${row.projects} Projects
            </td>

            <td>
                ${row.revenue.toLocaleString()} EGP
            </td>

            <td style="color:green;font-weight:bold;">
                +${row.profit.toLocaleString()} EGP
            </td>

        `;

        tableBody.appendChild(tr);

    });

});
