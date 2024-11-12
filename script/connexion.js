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

document.querySelector('.login-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Empêche le comportement par défaut de soumission du formulaire

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            // Si la réponse est réussie, redirige vers la page souhaitée
            window.location.href = '/parametres';
        } else {
            // Si la réponse est une erreur, affiche le message d'erreur
            const data = await response.json();
            const errorMessageElement = document.getElementById('error-message');
            errorMessageElement.textContent = data.message;
            errorMessageElement.style.display = 'block';
        }
    } catch (error) {
        console.error('Erreur lors de la tentative de connexion :', error);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('registrationSuccess')) {
        const modal = document.getElementById('success-modal');
        modal.style.display = 'block';

        document.getElementById('close-success-modal').addEventListener('click', () => {
            modal.style.display = 'none';
        });

        document.getElementById('modal-ok-button').addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
});
