// script.js

// Sélectionner les éléments nécessaires pour la barre de sélection
const slider = document.getElementById('value-slider');
const sliderValue = document.getElementById('slider-value');

// Initialiser la valeur affichée
sliderValue.textContent = slider.value;
slider.style.setProperty('--value', `${(slider.value - slider.min) / (slider.max - slider.min) * 100}%`);

// Événement pour la barre de sélection
slider.addEventListener('input', function() {
    sliderValue.textContent = this.value; // Afficher la valeur actuelle

    // Calculer la position du texte selon la valeur
    const valuePosition = ((this.value - this.min) / (this.max - this.min)) * 100; 
    sliderValue.style.left = `calc(${valuePosition}% - ${sliderValue.offsetWidth / 2}px)`; // Ajuster la position du texte

    // Mettre à jour la couleur de la barre
    slider.style.setProperty('--value', `${valuePosition}%`);
});

// Optionnel : Si vous souhaitez afficher un message lorsque l'utilisateur relâche le curseur
slider.addEventListener('change', function() {
    console.log(`Valeur sélectionnée : ${this.value}`);
});

// Gestion du compte à rebours
let timeLeft = 60; // Durée initiale en secondes
const progress = document.getElementById('progress');
const interval = setInterval(updateProgressBar, 1000);

function updateProgressBar() {
    timeLeft--;
    let progressWidth = (timeLeft / 60) * 100;
    progress.style.width = progressWidth + '%';

    // Mettre à jour le temps restant affiché
    document.getElementById('time-left').textContent = `${timeLeft}s`;

    if (timeLeft <= 0) {
        clearInterval(interval);
        document.getElementById('time-up').style.display = 'block'; // Afficher le message "Temps écoulé !"
        // Ici, vous pouvez ajouter d'autres actions lorsque le temps est écoulé
    }
}
