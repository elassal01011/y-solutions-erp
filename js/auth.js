// Y-Solutions ERP - Security Access & Identity Mapping
function checkAccessControl(allowedRoles) {
    auth.onAuthStateChanged(user => {
        if (!user) {
            window.location.href = "login.html";
        } else {
            const role = resolveUserRole(user.email);
            if (allowedRoles && !allowedRoles.includes(role)) {
                alert("Security Violation: Unauthorized operational section view.");
                window.location.href = "dashboard.html";
            } else {
                buildDynamicSidebarMenu(role);
                document.body.style.display = "flex"; // Show layout safely
            }
        }
    });
}

function resolveUserRole(email) {
    const format = email.toLowerCase();
    if (format.includes("manager")) return "Manager";
    if (format.includes("ops") || format.includes("operations")) return "Operations";
    if (format.includes("hr")) return "HR";
    if (format.includes("storage") || format.includes("warehouse")) return "Storage";
    return "Sales";
}

function buildDynamicSidebarMenu(currentRole) {
    const sidebar = document.getElementById('sidebar-container');
    if (!sidebar) return;

    const email = auth.currentUser ? auth.currentUser.email : "";
    let navLinksHtml = "";

    if (currentRole === "Manager" || currentRole === "HR") navLinksHtml += `<a href="dashboard.html" id="nav-dash">Executive Dashboard</a>`;
    if (currentRole === "Manager" || currentRole === "Sales") navLinksHtml += `<a href="quotation.html" id="nav-quote">Quotation System</a>`;
    if (currentRole === "Manager" || currentRole === "Operations") navLinksHtml += `<a href="operations.html" id="nav-ops">Operations Desk</a>`;
    if (currentRole === "Manager" || currentRole === "Storage") navLinksHtml += `<a href="warehouse.html" id="nav-wh">Storage Catalog</a>`;
    if (currentRole === "Manager" || currentRole === "HR") navLinksHtml += `<a href="employees.html" id="nav-emp">HR Staff Directory</a>`;

    sidebar.innerHTML = `
        <h2>Y-Solutions</h2>
        <p style="font-size: 0.8em; color: #bdc3c7; word-break: break-all;">${email}</p>
        <span class="role-badge">${currentRole}</span>
        <hr style="border-color:rgba(255,255,255,0.1); margin: 15px 0;">
        <nav>${navLinksHtml}</nav>
        <button onclick="auth.signOut().then(() => window.location.href='login.html')" class="logout-btn">Log Out</button>
    `;

    // Highlighting current selection row contextually
    const path = window.location.pathname.split("/").pop();
    if (path.includes("dashboard")) document.getElementById('nav-dash')?.classList.add('active');
    if (path.includes("quotation")) document.getElementById('nav-quote')?.classList.add('active');
    if (path.includes("operations")) document.getElementById('nav-ops')?.classList.add('active');
    if (path.includes("warehouse")) document.getElementById('nav-wh')?.classList.add('active');
    if (path.includes("employees")) document.getElementById('nav-emp')?.classList.add('active');
}
