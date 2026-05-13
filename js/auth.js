// 1. Login Logic
function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    auth.signInWithEmailAndPassword(email, password)
        .then(() => { window.location.href = 'dashboard.html'; })
        .catch((error) => { alert("Error: " + error.message); });
}

// 2. Security Guard & Persistence
auth.onAuthStateChanged(user => {
    const path = window.location.pathname;
    const isLoginPage = path.includes('login.html') || path.endsWith('/');

    if (user) {
        if (isLoginPage) window.location.href = 'dashboard.html';
    } else {
        if (!isLoginPage) window.location.href = 'login.html';
    }
});

// 3. Logout
function logout() {
    auth.signOut().then(() => { window.location.href = 'login.html'; });
}
