document.addEventListener('DOMContentLoaded', function() {
    const imageUpload = document.getElementById('imageUpload');
    const imageDisplay = document.getElementById('imageDisplay');
    const imagePreview = document.getElementById('imagePreview');
    const timeSelect = document.getElementById('timeSelect');
    const timeDisplay = document.getElementById('timeDisplay');

    // Prévisualisation de l'image téléchargée
    imageUpload.addEventListener('change', function(event) {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            imageDisplay.style.display = 'none'; // Masquer l'image par défaut
            imagePreview.innerHTML = `<img src="${e.target.result}" alt="Image" />`; // Afficher la prévisualisation
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    });

    // Mise à jour du background du slider
    function updateSliderBackground() {
        const value = (timeSelect.value - timeSelect.min) / (timeSelect.max - timeSelect.min) * 100;
        timeSelect.style.background = `linear-gradient(to right, #7BD634 ${value}%, #ddd ${value}%)`;
    }

    // Initialisation du slider
    updateSliderBackground();
    timeSelect.addEventListener('input', function() {
        timeDisplay.textContent = `${timeSelect.value}s`;
        updateSliderBackground();
    });
});
