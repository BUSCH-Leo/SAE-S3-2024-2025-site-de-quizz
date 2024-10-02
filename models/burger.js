console.log('burger.js chargé');

const burgerIcon = document.getElementById('burger-icon');
const slideMenu = document.getElementById('slide-menu');

let isMenuOpen = false;

burgerIcon.addEventListener('click', function() {
    slideMenu.classList.toggle('active');

    if (isMenuOpen) {
        burgerIcon.classList.remove('rotate-open');
        burgerIcon.classList.add('rotate-close');
    } else {
        burgerIcon.classList.remove('rotate-close');
        burgerIcon.classList.add('rotate-open');
    }

    isMenuOpen = !isMenuOpen;
});