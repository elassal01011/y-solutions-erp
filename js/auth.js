// 1. The Login Function (This was missing!)
function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        alert("Please enter both email and password");
        return;
    }

    auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
        // Success! Redirect to dashboard
        window.location.href = 'dashboard.html';
    })
    .catch((error) => {
        // Show the specific error (e.g., wrong password)
        alert(error.message);
    });
}

// 2. Check Auth State (Persistence)
auth.onAuthStateChanged(user => {
    const path = window.location.pathname;
    // If logged in and on login page, go to dashboard
    if (user) {
        if (path.includes('login.html') || path.endsWith('/')) {
            window.location.href = 'dashboard.html';
        }
    } else {
        // If logged out and trying to see dashboard, go to login
        if (path.includes('dashboard.html')) {
            window.location.href = 'login.html';
        }
    }
});

// 3. Logout Function
function logout() {
    auth.signOut().then(() => {
        window.location.href = 'login.html';
    });
}
