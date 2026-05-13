// Check Auth State
auth.onAuthStateChanged(user => {
    const path = window.location.pathname;
    if (user) {
        if (path.includes('login.html')) window.location.href = 'dashboard.html';
    } else {
        if (path.includes('dashboard.html')) window.location.href = 'login.html';
    }
});

// Logout Function
function logout() {
    auth.signOut().then(() => {
        window.location.href = 'login.html';
    });
}