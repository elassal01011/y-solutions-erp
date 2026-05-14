// --- 1. THE MENU BUILDER ---
function buildMenu(userRole) {
    const menuContainer = document.getElementById('sideMenu');
    if (!menuContainer) {
        console.error("SIDEBAR ERROR: Could not find element with ID 'sideMenu'");
        return;
    }

    // Force role to lowercase to handle MANAGEMENT vs management
    const cleanRole = (userRole || 'sales').toLowerCase().trim();
    console.log("Building menu for role:", cleanRole);

    const rolePermissions = {
        'management': ['main', 'sales', 'ops', 'storage', 'archive', 'hr'],
        'manager': ['main', 'sales', 'ops', 'storage', 'archive', 'hr'],
        'operations': ['main', 'ops', 'storage', 'archive'],
        'sales': ['main', 'sales', 'archive'],
        'storage': ['storage']
    };

    const items = {
        main: { icon: 'fa-chart-pie', label: 'Dashboard', link: 'dashboard.html' },
        sales: { icon: 'fa-plus-circle', label: 'New Quotation', link: 'quotations.html' },
        ops: { icon: 'fa-tools', label: 'Operations', link: 'operations.html' },
        storage: { icon: 'fa-warehouse', label: 'Storage', link: 'warehouse.html' },
        archive: { icon: 'fa-archive', label: 'Project Archive', link: 'archive.html' },
        hr: { icon: 'fa-users', label: 'Staff Mgmt', link: 'employees.html' }
    };

    menuContainer.innerHTML = ''; 

    // Find keys - if role not found, default to 'sales' instead of empty
    const allowedKeys = rolePermissions[cleanRole] || rolePermissions['sales'];
    console.log("Allowed links for this role:", allowedKeys);

    allowedKeys.forEach(key => {
        const m = items[key];
        if (!m) return;
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
        console.log("Firebase Auth detected user:", user.email);
        
        db.collection("users").doc(user.uid).get().then((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                const role = userData.role || 'sales';
                console.log("Firestore Data Found:", userData);
                
                if(document.getElementById('userBadge')) {
                    document.getElementById('userBadge').innerText = role.toUpperCase();
                }
                
                buildMenu(role);
            } else {
                console.warn("No Firestore document for UID:", user.uid, "- Creating default 'sales' menu.");
                buildMenu('sales');
            }
        }).catch(err => {
            console.error("Firestore Error:", err);
            buildMenu('sales'); // Fallback menu so it's never empty
        });
    } else {
        console.log("No user logged in. Redirecting...");
        if (!window.location.pathname.includes('login.html')) {
            window.location.href = 'login.html';
        }
    }
});

// --- 3. LOGIN & LOGOUT ---
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
