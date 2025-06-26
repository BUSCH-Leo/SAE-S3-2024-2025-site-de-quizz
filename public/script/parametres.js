function showToast(message, isSuccess = true, duration = 3000) {
    const toast = document.getElementById('confirmationToast');
    const toastBody = toast.querySelector('.toast-body');
    
    toast.className = toast.className.replace(/bg-\w+/, isSuccess ? 'bg-success' : 'bg-danger');
    toastBody.textContent = message;
    
    const bsToast = new bootstrap.Toast(toast, {
        autohide: true,
        delay: duration
    });
    
    bsToast.show();
}

// Fonction générique pour toggle password
function togglePassword(buttonId, inputId) {
    document.getElementById(buttonId).addEventListener('click', function () {
        const passwordInput = document.getElementById(inputId);
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
}

// Initialisation des toggles password
togglePassword('toggle-password', 'password');
togglePassword('toggle-new-password', 'new-password');
togglePassword('toggle-new-password-confirm', 'new-password-confirm');

// Script pour gérer la sélection d'avatar et l'affichage dans le modal
document.addEventListener('DOMContentLoaded', () => {
    const avatarOptions = document.querySelectorAll('.avatar-option');
    const profilePreview = document.getElementById('profile-preview');
    let selectedAvatar = null;

    avatarOptions.forEach(option => {
        option.addEventListener('click', () => {
            avatarOptions.forEach(opt => opt.classList.remove('selected-avatar'));
            option.classList.add('selected-avatar');
            selectedAvatar = option.src;
        });
    });

    document.getElementById('confirm-avatar').addEventListener('click', () => {
        if (selectedAvatar) {
            profilePreview.src = selectedAvatar;
        }
    });

    const customPhotoInput = document.getElementById('custom-photo');
    customPhotoInput.addEventListener('change', previewImage);
});

function previewImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('profile-preview');
            preview.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

// Stocker la valeur initiale du nom d'utilisateur
const initialUsername = document.getElementById('username-input').value;

document.getElementById('save-changes').addEventListener('click', async () => {
    const username = document.getElementById('username-input').value;
    const phoneNumber = document.getElementById('phone-input').value;
    const profilePreview = document.getElementById('profile-preview').getAttribute('src');
    const formData = new FormData();
    formData.append('userName', username);
    formData.append('phoneNumber', phoneNumber);

    if (profilePreview) {
        formData.append('profilePhoto', profilePreview);
    }

    // Envoi de la mise à jour de la photo de profil
    try {
        const response = await fetch('/profile/update-profile', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            showToast('Changements enregistrés avec succès !');
        } else {
            console.error('Erreur lors de la mise à jour du profil');
            showToast('Erreur lors de la mise à jour du profil.', false);
        }
    } catch (error) {
        console.error('Erreur lors de la requête :', error);
    }

    // Envoi de la mise à jour du nom d'utilisateur seulement s'il a changé
    if (username && username !== initialUsername) {
        try {
            const response = await fetch('/profile/update-username', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userName: username })
            });

            if (response.ok) {
                showToast('Changements enregistrés avec succès !');
                const errorMessageElement = document.getElementById('error-message-user');
                errorMessageElement.style.display = 'none';
            } else {
                const data = await response.json();
                const errorMessageElement = document.getElementById('error-message-user');
                errorMessageElement.textContent = data.message;
                errorMessageElement.style.display = 'block';
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour du nom d\'utilisateur :', error);
        }
    }

    // Envoi de la mise à jour du numéro de téléphone
    if (phoneNumber) {
        try {
            const response = await fetch('/profile/update-phone', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ phoneNumber: phoneNumber })
            });

            if (response.ok) {
                showToast('Changements enregistrés avec succès !');
            } else {
                console.error('Erreur lors de la mise à jour du profil');
                showToast('Erreur lors de la mise à jour du numéro de téléphone.', false);
            }
        } catch (error) {
            console.error('Erreur lors de la requête de mise à jour du téléphone :', error);
        }
    }
});

// Fonctions d'affichage des messages pour le mot de passe
function showPasswordError(message) {
    const errorElement = document.getElementById('password-error') || createPasswordMessageElement();
    errorElement.className = 'text-danger mt-2';
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    
    setTimeout(() => {
        errorElement.style.display = 'none';
    }, 5000);
}

function showPasswordSuccess(message) {
    const successElement = document.getElementById('password-success') || createPasswordMessageElement('password-success');
    successElement.className = 'text-success mt-2';
    successElement.textContent = message;
    successElement.style.display = 'block';
    
    const errorElement = document.getElementById('password-error');
    if (errorElement) {
        errorElement.style.display = 'none';
    }
    
    setTimeout(() => {
        successElement.style.display = 'none';
    }, 5000);
}

function createPasswordMessageElement(id = 'password-error') {
    const element = document.createElement('div');
    element.id = id;
    element.style.display = 'none';
    
    const button = document.querySelector('#change-password-btn');
    button.parentNode.insertBefore(element, button.nextSibling);
    
    return element;
}

// Envoi de la mise à jour du mot de passe
document.querySelector('#change-password-btn').addEventListener('click', async () => {
    const oldPassword = document.getElementById('password').value;
    const newPassword = document.getElementById('new-password').value;
    const newPasswordConfirm = document.getElementById('new-password-confirm').value;
    if (!oldPassword || !newPassword || !newPasswordConfirm) {
        showPasswordError('Veuillez remplir tous les champs du mot de passe.');
        return;
    }
    
    if (newPassword !== newPasswordConfirm) {
        showPasswordError('Les nouveaux mots de passe ne correspondent pas.');
        return; 
    }
    
    if (newPassword.length < 8) {
        showPasswordError('Le nouveau mot de passe doit contenir au moins 8 caractères.');
        return;
    }
    
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
        showPasswordError('Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre.');
        return;
    }
    
    // Désactiver le bouton pendant la requête
    const button = document.querySelector('#change-password-btn');
    const originalText = button.textContent;
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Changement...';
    
    try {
        const response = await fetch('/profile/change-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: oldPassword, newPassword, newPasswordConfirm }),
        });

        if (response.ok) {
            showPasswordSuccess('Mot de passe changé avec succès !');
            document.getElementById('password').value = '';
            document.getElementById('new-password').value = '';
            document.getElementById('new-password-confirm').value = '';
        } else {
            const errorData = await response.json();
            showPasswordError(errorData.message || 'Erreur lors de la mise à jour.');
        }
    } catch (error) {
        console.error('Erreur réseau ou serveur :', error);
        showPasswordError('Erreur réseau ou serveur.');
    } finally {
        button.disabled = false;
        button.textContent = originalText;
    }
});

// Envoi de la suppression du compte
document.querySelector('#confirm-delete-btn').addEventListener('click', async () => {
    try {
        const response = await fetch('/profile/delete-account', {
            method: 'POST',
        });

        if (response.ok) {
            const data = await response.json();
            window.location.href = './'; 
        } else {
            console.error('Erreur lors de la suppression du compte');
        }
    } catch (error) {
        console.error('Erreur lors de la suppression du compte :', error);
    }
});
