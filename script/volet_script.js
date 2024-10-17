document.addEventListener('DOMContentLoaded', function() {
    const ouvrirBtn = document.querySelector('.ouvrir');
    const fermerBtn = document.querySelector('.fermer');
    const volet = document.querySelector('#volet');
    const deroulerBtns = document.querySelectorAll('.derouler');

    // Gestion de l'ouverture du volet
    ouvrirBtn.addEventListener('click', function(e) {
        e.preventDefault();
        volet.classList.add('open');
        ouvrirBtn.style.display = 'none';
        fermerBtn.style.display = 'block';
    });

    // Gestion de la fermeture du volet
    fermerBtn.addEventListener('click', function(e) {
        e.preventDefault();
        volet.classList.remove('open');
        fermerBtn.style.display = 'none';
        ouvrirBtn.style.display = 'block';
        
        // Réinitialiser l'affichage des sous-menus
        document.querySelectorAll('.sous-quiz, .sous-option, .sous-theme').forEach(subMenu => {
            subMenu.style.display = 'none';
            const parentDiv = subMenu.previousElementSibling;
            parentDiv.classList.remove('open');
        });
    });

    // Gestion de l'affichage des sous-menus (Quiz, Option, Thème)
    deroulerBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const sousMenu = this.parentElement.nextElementSibling; 
            const parentDiv = this.parentElement;

            // Toggle de l'affichage du sous-menu
            if (sousMenu.style.display === 'block') {
                sousMenu.style.display = 'none';
                parentDiv.classList.remove('open'); 
                this.classList.remove('rotated'); 
            } else {
                sousMenu.style.display = 'block';
                parentDiv.classList.add('open'); 
                this.classList.add('rotated'); 
            }
        });
    });

    // Fermer le volet en cliquant à l'extérieur
    document.addEventListener('click', function(event) {
        if (!volet.contains(event.target) && !ouvrirBtn.contains(event.target)) {
            if (volet.classList.contains('open')) {
                fermerBtn.click(); // Simule le clic sur le bouton fermer
            }
        }
    });
});

// Fonction pour changer le thème
function changeTheme(theme) {
    const volet = document.getElementById('volet');
    volet.classList.remove('theme1', 'theme2', 'theme3'); // Réinitialiser les thèmes
    volet.classList.add(theme); // Ajouter le thème sélectionné
}
