// Chargement du fichier burger.html
fetch('burger.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('burger-menu').innerHTML = data;
        loadBurgerJS();
    })
    .catch(error => console.error('Erreur lors du chargement du fichier burger.html:', error));

// Charge dynamiquement burger.js
function loadBurgerJS() {
    const script = document.createElement('script');
    script.src = '/script/burger.js';
    script.defer = true;
    document.body.appendChild(script);
}

function initializeProfilePhotoHandler() {
    const changeProfilePhotoBtn = document.getElementById('change-profile-photo-btn');
    const profilePhotoInput = document.getElementById('profilePhotoInput');
    const submitPhotoBtn = document.getElementById('submit-photo-btn');
    
    if (changeProfilePhotoBtn && profilePhotoInput && submitPhotoBtn) {
        changeProfilePhotoBtn.addEventListener('click', function() {
            profilePhotoInput.style.display = 'block';
            submitPhotoBtn.style.display = 'inline-block';
        });
    }
}

document.addEventListener('DOMContentLoaded', initializeProfilePhotoHandler);