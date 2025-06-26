window.addEventListener('load', function() {
    // Animation pour le titre
    const title = document.querySelector('.page-title');
    if (title) {
        title.style.opacity = 1;
        title.style.transform = 'translateY(0)';
    }
    const text = document.querySelector('.page-text');
    if (text) {
        setTimeout(() => {
            text.style.opacity = 1;
            text.style.transform = 'translateY(0)';
        }, 250);
    }

    const buttons = document.querySelectorAll('.quiz-button');
    setTimeout(() => {
        buttons.forEach(button => {
            button.style.opacity = 1;
            button.style.transform = 'translateY(0)';
        });
    }, 500); 
});