fetch('profile')
    .then(response => response.text())
    .then(data => {
        document.getElementById('profile-menu').innerHTML = data;
        initializeProfileMenu();
    })
    .catch(error => console.error('Erreur lors du chargement du fichier profile :', error));


function initializeProfileMenu() {
    const profilePreview = document.getElementById('profile-preview');
    const buttonDivs = document.querySelectorAll('.profile-menu .button-div');
    const profileMenu = document.querySelector('.profile-menu');

    buttonDivs.forEach(div => div.classList.remove('visible'));

    if (profilePreview) {
        profilePreview.addEventListener('click', (event) => {
            event.stopPropagation(); 
            
            const isVisible = buttonDivs[0].classList.contains('visible');
            buttonDivs.forEach(div => {
                if (isVisible) {
                    div.classList.remove('visible'); 
                } else {
                    div.classList.add('visible'); 
                }
            });
        });
        

        profileMenu.addEventListener('click', (event) => {
            event.stopPropagation();
        });
        
        document.body.addEventListener('click', () => {
            const isMenuVisible = buttonDivs[0].classList.contains('visible');
            if (isMenuVisible) {
                buttonDivs.forEach(div => div.classList.remove('visible'));
            }
        });
    } else {
        console.error("profilePreview n'a pas été trouvé après le chargement !");
    }
}