// This function MUST be here for the button to work
function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        alert("Please enter both email and password");
        return;
    }

    auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
        window.location.href = 'dashboard.html';
    })
    .catch((error) => {
        alert(error.message);
    });
}

// Security: Redirect users if they aren't logged in
auth.onAuthStateChanged(user => {
    const path = window.location.pathname;
    if (user) {
        if (path.includes('login.html')) window.location.href = 'dashboard.html';
    } else {
        if (path.includes('dashboard.html')) window.location.href = 'login.html';
    }
});
