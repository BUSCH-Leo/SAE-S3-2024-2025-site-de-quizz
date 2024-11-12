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
