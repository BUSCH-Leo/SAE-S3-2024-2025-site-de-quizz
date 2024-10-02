// jouer.js
document.addEventListener('DOMContentLoaded', function() {
    const selectQuizButton = document.getElementById('select-quiz-btn');
    const uploadModal = document.getElementById('upload-modal');
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const validateButton = document.getElementById('validate-button');
    const removeButton = document.getElementById('remove-button');

    // Ouvrir la fenêtre modale
    selectQuizButton.addEventListener('click', function() {
        uploadModal.style.display = 'flex'; // Afficher la modale
    });

    // Fermer la fenêtre modale lorsque l'on clique à l'extérieur
    window.addEventListener('click', function(event) {
        if (event.target === uploadModal) {
            uploadModal.style.display = 'none'; // Fermer la modale
        }
    });

    // Gérer le drag and drop
    dropZone.addEventListener('click', function() {
        fileInput.click(); // Ouvrir l'explorateur de fichiers
    });

    dropZone.addEventListener('dragover', function(event) {
        event.preventDefault(); // Prévenir le comportement par défaut
        dropZone.classList.add('hover'); // Ajouter une classe pour le style
    });

    dropZone.addEventListener('dragleave', function() {
        dropZone.classList.remove('hover'); // Retirer la classe
    });

    dropZone.addEventListener('drop', function(event) {
        event.preventDefault();
        dropZone.classList.remove('hover'); // Retirer la classe
        const files = event.dataTransfer.files; // Obtenir les fichiers déposés
        if (files.length) {
            fileInput.files = files; // Assignation des fichiers
            dropZone.textContent = `${files[0].name} sélectionné`; // Afficher le nom du fichier
            validateButton.disabled = false; // Activer le bouton Valider
            removeButton.disabled = false; // Activer le bouton Retirer
            removeButton.classList.remove('disabled'); // Retirer la classe de désactivation
            validateButton.classList.remove('disabled'); // Retirer la classe de désactivation
        }
    });

    // Gérer la sélection d'un fichier en cliquant sur le champ de fichier
    fileInput.addEventListener('change', function() {
        const files = fileInput.files;
        if (files.length) {
            dropZone.textContent = `${files[0].name} sélectionné`; // Afficher le nom du fichier
            validateButton.disabled = false; // Activer le bouton Valider
            removeButton.disabled = false; // Activer le bouton Retirer
            removeButton.classList.remove('disabled'); // Retirer la classe de désactivation
            validateButton.classList.remove('disabled'); // Retirer la classe de désactivation
        }
    });

    // Gérer la désélection d'un fichier
    removeButton.addEventListener('click', function() {
        fileInput.value = ''; // Réinitialiser le champ de fichier
        dropZone.textContent = 'Glissez et déposez un fichier ici ou cliquez pour sélectionner un fichier.'; // Réinitialiser le message
        validateButton.disabled = true; // Désactiver le bouton Valider
        removeButton.disabled = true; // Désactiver le bouton Retirer
        removeButton.classList.add('disabled'); // Réactiver la classe de désactivation
        validateButton.classList.add('disabled'); // Réactiver la classe de désactivation
    });
});
