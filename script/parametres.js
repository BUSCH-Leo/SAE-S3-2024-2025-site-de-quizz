function showToast(message, isSuccess = true) {
    const toastElement = document.getElementById('confirmationToast');
    const toastBody = toastElement.querySelector('.toast-body');

    toastBody.textContent = message;
    toastElement.classList.remove('bg-success', 'bg-danger');
    toastElement.classList.add(isSuccess ? 'bg-success' : 'bg-danger');

    const toast = bootstrap.Toast.getInstance(toastElement) || new bootstrap.Toast(toastElement, {
        autohide: true,
        delay: 3000
    });

    if (toast._isShown) {
        return;
    } else {
        toast.show();
    }
}

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

document.getElementById('toggle-new-password-confirm').addEventListener('click', function () {
    const passwordInput = document.getElementById('new-password-confirm');
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

document.getElementById('toggle-new-password').addEventListener('click', function () {
    const passwordInput = document.getElementById('new-password');
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
    customPhotoInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                profilePreview.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
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
// Envoi de la mise à jour du mot de passe
document.querySelector('#change-password-btn').addEventListener('click', async () => {
    const oldPassword = document.getElementById('password').value;
    const newPassword = document.getElementById('new-password').value;
    const newPasswordConfirm = document.getElementById('new-password-confirm').value;
    const passwordErrorMessage = document.getElementById('password-error');

    if (newPassword !== newPasswordConfirm) {
        passwordErrorMessage.textContent = "Les mots de passe ne correspondent pas.";
        passwordErrorMessage.style.display = 'block';
        return; // Arrête l'exécution en cas d'erreur
    }

    try {
        const response = await fetch('/profile/change-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: oldPassword, newPassword, newPasswordConfirm }),
        });

        if (response.ok) {
            showToast('Changements enregistrés avec succès !');
        } else {
            const errorData = await response.json();
            passwordErrorMessage.textContent = errorData.message || 'Erreur lors de la mise à jour.';
            passwordErrorMessage.style.display = 'block';
        }
    } catch (error) {
        console.error('Erreur réseau ou serveur :', error);
        passwordErrorMessage.textContent = "Erreur réseau ou serveur.";
        passwordErrorMessage.style.display = 'block';
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
            window.location.href = 'index.html'; 
        } else {
            console.error('Erreur lors de la suppression du compte');
        }
    } catch (error) {
        console.error('Erreur lors de la suppression du compte :', error);
    }
});

