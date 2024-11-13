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
document.getElementById('save-changes').addEventListener('click', async () => {
    const username = document.getElementById('username-input').value;
    const phoneNumber = document.getElementById('phone-input').value;
    const profilePreview = document.getElementById('profile-preview').getAttribute('src');
    
    // Préparation du formulaire de données
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
            const data = await response.json();
            document.getElementById('success-message').style.display = 'block';
            setTimeout(() => {
                document.getElementById('success-message').style.display = 'none';
            }, 3000);
            console.log('Profil mis à jour:', data);
        } else {
            console.error('Erreur lors de la mise à jour du profil');
        }
    } catch (error) {
        console.error('Erreur lors de la requête :', error);
    }

    // Envoi de la mise à jour du nom d'utilisateur
    if (username) {
        try {
            const response = await fetch('/profile/update-username', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userName: username })
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Nom d\'utilisateur mis à jour:', data.userName);
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Erreur lors de la mise à jour du nom d\'utilisateur');
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
                const data = await response.json();
                console.log('Numéro de téléphone mis à jour:', data.phoneNumber);
            } else {
                console.error('Erreur lors de la mise à jour du numéro de téléphone');
            }
        } catch (error) {
            console.error('Erreur lors de la requête de mise à jour du téléphone :', error);
        }
    }
});

