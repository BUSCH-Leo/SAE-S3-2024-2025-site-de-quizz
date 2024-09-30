const buttons = document.querySelectorAll('.answer');
const progress = document.getElementById('progress');
const timeLeftText = document.getElementById('time-left');
const timeUpMessage = document.getElementById('time-up');

let timeLeft = 60;
const interval = setInterval(updateProgressBar, 1000);

// Fonction pour gérer la sélection et la désélection des boutons
buttons.forEach(button => {
    button.addEventListener('click', function() {
        // Si le bouton est déjà sélectionné, on le désélectionne
        if (this.classList.contains('selected')) {
            this.classList.remove('selected');
        } else {
            buttons.forEach(btn => btn.classList.remove('selected'));  // Désélectionner tous les boutons
            this.classList.add('selected');  // Sélectionner celui cliqué
        }
    });
});

// Fonction pour mettre à jour la barre de progression et afficher le temps restant
function updateProgressBar() {
    timeLeft--;
    let progressWidth = (timeLeft / 60) * 100;
    progress.style.width = progressWidth + '%';
    timeLeftText.textContent = timeLeft + 's'; // Met à jour le texte du temps restant

    if (timeLeft <= 0) {
        clearInterval(interval); // Arrêter l'intervalle à 0 secondes
        timeLeftText.textContent = '0s'; // Afficher 0s
        timeUpMessage.style.display = 'block'; // Afficher le message "Temps écoulé"
    }
}
