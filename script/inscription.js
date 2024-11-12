document.getElementById('toggle-password').addEventListener('click', function () {
    const passwordInput = document.getElementById('password');
    const icon = this.querySelector('i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
});

document.getElementById('toggle-password-confirm').addEventListener('click', function () {
    const passwordInput = document.getElementById('confirm-password');
    const icon = this.querySelector('i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
});

document.querySelector('.registration-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Empêche la soumission par défaut du formulaire

    const userName = document.getElementById('userName').value;
    const email = document.getElementById('email').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    try {
        const response = await fetch('/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userName, email, phoneNumber, password, confirmPassword }),
        });

        if (response.ok) {
            // Si l'inscription est réussie, redirige l'utilisateur
            window.location.href = '/connexion';
        } else {
            // Si l'inscription échoue, affiche le message d'erreur
            const data = await response.json();
            const errorMessageElement = document.getElementById('error-message');
            errorMessageElement.textContent = data.message;
            errorMessageElement.style.display = 'block';
        }
    } catch (error) {
        console.error('Erreur lors de l\'inscription :', error);
    }
});