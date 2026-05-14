// --- 1. THE MENU BUILDER ---
function buildMenu(userRole) {
    const menuContainer = document.getElementById('sideMenu');
    if (!menuContainer) return;

    // Permissions list uses lowercase keys
    const rolePermissions = {
        'management': ['main', 'sales', 'ops', 'storage', 'archive', 'hr'],
        'manager': ['main', 'sales', 'ops', 'storage', 'archive', 'hr'], // Included both just in case
        'sales': ['main', 'sales', 'archive'],
        'operations': ['main', 'ops', 'storage', 'archive'],
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

    // CRITICAL FIX: Ensure the role used to look up permissions is lowercase
    const allowedKeys = rolePermissions[userRole.toLowerCase()] || ['main'];

    allowedKeys.forEach(key => {
        const m = items[key];
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
        db.collection("users").doc(user.uid).get().then((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                
                // Get the role and force it to lowercase for the Menu Builder
                const rawRole = userData.role || 'sales';
                const role = rawRole.toLowerCase(); 
                
                if(document.getElementById('userBadge')) {
                    document.getElementById('userBadge').innerText = rawRole.toUpperCase();
                }
                
                buildMenu(role);
            } else {
                console.error("No Firestore document found for UID:", user.uid);
                buildMenu('sales'); // Fallback
            }
        }).catch(err => console.error("Database Error:", err));
    } else {
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
