// --- 1. THE MENU BUILDER ---
// This function creates links based on the user's role
function buildMenu(userRole) {
    const menuContainer = document.getElementById('sideMenu');
    if (!menuContainer) return;

    // Define permissions for each role
  // Change 'management' to 'manager' here to match your database
const rolePermissions = {
    'manager': ['main', 'sales', 'ops', 'storage', 'archive', 'hr'], // Updated this line
    'sales': ['main', 'sales', 'archive'],
    'operations': ['main', 'ops', 'storage', 'archive'],
    'storage': ['storage']
};
    // Define the link details (icon, label, and file name)
    const items = {
        main: { icon: 'fa-chart-pie', label: 'Dashboard', link: 'dashboard.html' },
        sales: { icon: 'fa-plus-circle', label: 'New Quotation', link: 'quotations.html' },
        ops: { icon: 'fa-tools', label: 'Operations', link: 'operations.html' },
        storage: { icon: 'fa-warehouse', label: 'Storage', link: 'warehouse.html' },
        archive: { icon: 'fa-archive', label: 'Project Archive', link: 'archive.html' },
        hr: { icon: 'fa-users', label: 'Staff Mgmt', link: 'employees.html' }
    };

    menuContainer.innerHTML = ''; // Clear old menu

    // Get the specific keys for this user's role
    const allowedKeys = rolePermissions[userRole] || ['main'];

    allowedKeys.forEach(key => {
        const m = items[key];
        // Check if this is the current page to highlight it
        const isActive = window.location.pathname.includes(m.link) ? 'active' : '';
        
        menuContainer.innerHTML += `
            <a class="nav-link ${isActive}" href="${m.link}">
                <i class="fas ${m.icon} me-3"></i> ${m.label}
            </a>`;
    });
}

// --- 2. AUTHENTICATION & SECURITY GUARD ---
auth.onAuthStateChanged(user => {
    if (user) {
        // If logged in, get their role from Firestore
        db.collection("users").doc(user.uid).get().then((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                const role = userData.role || 'sales'; // Default role
                
                // Update UI elements
                if(document.getElementById('userBadge')) {
                    document.getElementById('userBadge').innerText = role.toUpperCase();
                }
                
                // Build the sidebar
                buildMenu(role);
            }
        });
    } else {
        // If not logged in, redirect to login page
        if (!window.location.pathname.includes('login.html')) {
            window.location.href = 'login.html';
        }
    }
});

// --- 3. LOGIN & LOGOUT FUNCTIONS ---
function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    auth.signInWithEmailAndPassword(email, password)
        .then(() => { window.location.href = 'dashboard.html'; })
        .catch(err => alert(err.message));
}

function logout() {
    auth.signOut().then(() => { window.location.href = 'login.html'; });
}
