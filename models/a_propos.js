document.addEventListener("DOMContentLoaded", function() {
    // Animation pour le titre
    const title = document.querySelector('header h1');
    title.classList.add('fade-in'); // Ajoute la classe pour faire apparaître le titre

    // Animation pour les membres de l'équipe
    const teamMembers = document.querySelectorAll('.member');
    teamMembers.forEach((member, index) => {
        setTimeout(() => {
            member.classList.add('fade-in-delay'); // Ajoute la classe pour faire apparaître les membres de l'équipe
        }, index * 500); // Délai basé sur l'index
    });
});
