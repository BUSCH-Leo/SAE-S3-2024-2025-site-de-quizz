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

// Gestion du lien "Mot de passe oublié"
document.getElementById('mdp_oublie').addEventListener('click', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    
    if (!email) {
        showMessage('Veuillez entrer votre adresse email d\'abord.', 'error');
        document.getElementById('email').focus();
        return;
    }
    
    if (!isValidEmail(email)) {
        showMessage('Veuillez entrer une adresse email valide.', 'error');
        return;
    }
    
    try {

        this.style.pointerEvents = 'none';
        this.style.opacity = '0.6';
        
        const response = await fetch('/auth/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showMessage('Si cet email existe dans notre système, un lien de réinitialisation a été envoyé.', 'success');
        } else {
            showMessage(data.message || 'Une erreur est survenue', 'error');
        }
        
    } catch (error) {
        console.error('Erreur:', error);
        showMessage('Erreur de connexion. Veuillez réessayer.', 'error');
    } finally {

        setTimeout(() => {
            this.style.pointerEvents = 'auto';
            this.style.opacity = '1';
        }, 5000);
    }
});

document.querySelector('.login-form').addEventListener('submit', async function(event) {
    event.preventDefault(); 

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        showMessage('Veuillez remplir tous les champs.', 'error');
        return;
    }

    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            const data = await response.json();
            showMessage('Connexion réussie ! Redirection...', 'success');
            setTimeout(() => {
                window.location.href = data.redirect || '/parametres';
            }, 1000);
        } else {
            const data = await response.json();
            showMessage(data.message || 'Erreur de connexion', 'error');
        }
    } catch (error) {
        console.error('Erreur lors de la tentative de connexion :', error);
        showMessage('Erreur de connexion. Veuillez réessayer.', 'error');
    }
});

// Fonction pour valider l'email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Fonction pour afficher les messages
function showMessage(message, type) {
    const errorMessageElement = document.getElementById('error-message');
    
    errorMessageElement.className = type === 'success' ? 'text-success' : 'text-danger';
    errorMessageElement.textContent = message;
    errorMessageElement.style.display = 'block';

    setTimeout(() => {
        errorMessageElement.style.display = 'none';
    }, 5000);
}