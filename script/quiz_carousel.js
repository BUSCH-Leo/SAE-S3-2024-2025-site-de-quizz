document.addEventListener("DOMContentLoaded", () => {
    // Initialisation de Swiper
    const swiper = new Swiper('.swiper-container', {
        direction: 'vertical',
        slidesPerView: 'auto',
        spaceBetween: 10,
        freeMode: true,
    });

    let slideCount = 1; // Compteur pour les diapositives

    // Gestion de l'ajout de nouvelles diapositives
    document.querySelector('.add-slide').addEventListener('click', () => {
        slideCount++;
        const newSlide = document.createElement('div');
        newSlide.className = 'swiper-slide';
        newSlide.innerHTML = `
            <div class="slide-thumbnail" data-slide-index="${slideCount}">
                <p class="slide-number">${slideCount}</p>
                <p class="slide-preview-title">Question ${slideCount}</p>
            </div>
        `;

        swiper.appendSlide(newSlide); // Ajout dans Swiper
    });

    // Gestion du clic sur une miniature
    document.querySelector('.swiper-container').addEventListener('click', (e) => {
        const slideThumbnail = e.target.closest('.slide-thumbnail');
        if (!slideThumbnail) return;

        const index = slideThumbnail.dataset.slideIndex;
        updateMainSlide(index);
    });

    // Mise à jour de la zone principale
    const updateMainSlide = (index) => {
        const questionInput = document.querySelector('.question-input');
        questionInput.value = `Question ${index}`;
        // Ajouter d'autres mises à jour nécessaires ici
    };
});
