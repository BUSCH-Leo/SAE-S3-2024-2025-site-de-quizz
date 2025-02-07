document.addEventListener("DOMContentLoaded", function() {
    // Animation pour le titre
    const title = document.querySelector('header h1');
    title.classList.add('fade-in'); 

    // Animation pour les membres de l'équipe
    const teamMembers = document.querySelectorAll('.member');
    teamMembers.forEach((member, index) => {
        setTimeout(() => {
            member.classList.add('fade-in-delay'); 
        }, index * 500); 
    });
});
