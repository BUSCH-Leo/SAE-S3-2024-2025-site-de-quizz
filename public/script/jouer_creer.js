// Configuration des animations
const ANIMATION_CONFIG = {
    titleDelay: 0,
    textDelay: 250,
    buttonDelay: 500
};

let animationTimeouts = [];

// Nettoyage des timeouts
const clearAnimationTimeouts = () => {
    animationTimeouts.forEach(timeout => clearTimeout(timeout));
    animationTimeouts = [];
};

// Fonction pour animer un élément
const animateElement = (element, delay = 0) => {
    if (!element) return;
    
    const timeout = setTimeout(() => {
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    }, delay);
    
    animationTimeouts.push(timeout);
};

// Initialisation des animations
const initAnimations = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        const elements = [
            document.querySelector('.page-title'),
            document.querySelector('.page-text'),
            ...document.querySelectorAll('.quiz-button')
        ];
        
        elements.forEach(el => {
            if (el) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }
        });
        return;
    }

    // Cache des éléments DOM
    const elements = {
        title: document.querySelector('.page-title'),
        text: document.querySelector('.page-text'),
        buttons: document.querySelectorAll('.quiz-button')
    };

    animateElement(elements.title, ANIMATION_CONFIG.titleDelay);
    animateElement(elements.text, ANIMATION_CONFIG.textDelay);
    
    if (elements.buttons.length > 0) {
        const timeout = setTimeout(() => {
            requestAnimationFrame(() => {
                elements.buttons.forEach(button => {
                    button.style.opacity = '1';
                    button.style.transform = 'translateY(0)';
                });
            });
        }, ANIMATION_CONFIG.buttonDelay);
        
        animationTimeouts.push(timeout);
    }
};

// Gestion du redimensionnement
let resizeTimeout;
const handleResize = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        const elements = document.querySelectorAll('.page-title, .page-text, .quiz-button');
        elements.forEach(el => {
            if (el && el.style.opacity === '1') {
                el.style.transform = 'translateY(0)';
            }
        });
    }, 100);
};

// Event listeners
document.addEventListener('DOMContentLoaded', initAnimations);
window.addEventListener('resize', handleResize, { passive: true });
window.addEventListener('beforeunload', clearAnimationTimeouts);