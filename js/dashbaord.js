// ==========================================
// Y SOLUTIONS ERP - EXECUTIVE DASHBOARD
// SAFE VERSION
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    console.log("Dashboard Loaded");

    // ==========================================
    // ACCESS CONTROL
    // ==========================================

    try {

        if (typeof checkAccessControl === "function") {

            checkAccessControl(["Manager", "HR"]);

        } else {

            console.warn("checkAccessControl() not found");

        }

    } catch (error) {

        console.error("Access Control Error:", error);

    }

    // ==========================================
    // TABLE BODY
    // ==========================================

    const tableBody =
        document.getElementById("revenue-table-body");

    if (!tableBody) {

        console.error(
            "Element #revenue-table-body NOT FOUND"
        );

        return;

    }

    // ==========================================
    // FALLBACK DATA
    // ==========================================

    let revenueData = [];

    if (
        typeof GLOBAL_REVENUE_DATA !== "undefined" &&
        Array.isArray(GLOBAL_REVENUE_DATA)
    ) {

        revenueData = GLOBAL_REVENUE_DATA;

    } else {

        console.warn(
            "GLOBAL_REVENUE_DATA missing -> Using fallback data"
        );

        revenueData = [

            {
                month: "January",
                projects: 8,
                revenue: 120000,
                profit: 30000
            },

            {
                month: "February",
                projects: 12,
                revenue: 180000,
                profit: 45000
            },

            {
                month: "March",
                projects: 15,
                revenue: 250000,
                profit: 70000
            }

        ];

    }

    // ==========================================
    // CLEAR TABLE
    // ==========================================

    tableBody.innerHTML = "";

    // ==========================================
    // RENDER TABLE
    // ==========================================

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
                ${Number(row.revenue).toLocaleString()} EGP
            </td>

            <td style="color:#16a34a;font-weight:bold;">
                +${Number(row.profit).toLocaleString()} EGP
            </td>

        `;

        tableBody.appendChild(tr);

    });

    console.log("Revenue Table Rendered Successfully");

});
