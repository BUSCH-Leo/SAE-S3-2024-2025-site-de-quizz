// Chargement du fichier profile.ejs
fetch('profile')
    .then(response => response.text())
    .then(data => {
        document.getElementById('profile-menu').innerHTML = data;
        initializeProfileMenu();
    })
    .catch(error => console.error('Erreur lors du chargement du fichier profile :', error));

// Initialisation du menu profile
function initializeProfileMenu() {
    const profilePreview = document.getElementById('profile-preview');
    const buttonDivs = document.querySelectorAll('.profile-menu .button-div');

    buttonDivs.forEach(div => div.classList.remove('visible'));

    if (profilePreview) {
        profilePreview.addEventListener('click', () => {
            const isVisible = buttonDivs[0].classList.contains('visible');
            buttonDivs.forEach(div => {
                if (isVisible) {
                    div.classList.remove('visible'); 
                } else {
                    div.classList.add('visible'); 
                }
            });
        });
    } else {
        console.error("profilePreview n'a pas été trouvé après le chargement !");
    }
}