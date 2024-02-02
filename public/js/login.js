

document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = data.redirect; // Redirect on successful login
            } else {
                document.getElementById('message').textContent = data.message; // Show error message
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});
