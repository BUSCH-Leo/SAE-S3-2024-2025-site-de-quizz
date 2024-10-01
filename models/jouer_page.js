window.addEventListener('load', function() {
    // Animation pour le titre
    const title = document.querySelector('.page-title');
    title.style.opacity = 1; // Rendre visible
    title.style.transform = 'translateY(0)'; // Déplacer en position finale

    // Animation pour les boutons
    const buttons = document.querySelectorAll('.quiz-button');
    setTimeout(() => {
        buttons.forEach(button => {
            button.style.opacity = 1; // Rendre visible
            button.style.transform = 'translateY(0)'; // Déplacer en position finale
        });
    }, 500); // Délai avant que les boutons apparaissent
});
