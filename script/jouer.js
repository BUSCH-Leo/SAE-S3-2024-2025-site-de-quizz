document.addEventListener('DOMContentLoaded', function() {
    const selectQuizButton = document.getElementById('select-quiz-btn');
    const modalContainer = document.querySelector('.modal'); // Sélection de la div contenant les modales
    const uploadModal = document.getElementById('upload-modal');
    const projectsModal = document.getElementById('projects-modal');
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const validateButton = document.getElementById('validate-button');
    const removeButton = document.getElementById('remove-button');

    // Ouvrir les deux modales en même temps
    selectQuizButton.addEventListener('click', function() {
        modalContainer.style.display = 'flex'; // Afficher le conteneur des modales
        uploadModal.style.display = 'flex'; // Afficher la modale d'importation
        projectsModal.style.display = 'flex'; // Afficher la modale des projets
    });

    // Fermer les deux modales lorsque l'on clique à l'extérieur
    window.addEventListener('click', function(event) {
        if (event.target === modalContainer) {
            modalContainer.style.display = 'none';
            uploadModal.style.display = 'none'; // Masquer la modale d'importation
            projectsModal.style.display = 'none'; // Masquer la modale des projets
        }
    });

    // Gérer le drag and drop
    dropZone.addEventListener('click', function() {
        fileInput.click();
    });

    dropZone.addEventListener('dragover', function(event) {
        event.preventDefault();
        dropZone.classList.add('hover');
    });

    dropZone.addEventListener('dragleave', function() {
        dropZone.classList.remove('hover');
    });

    dropZone.addEventListener('drop', function(event) {
        event.preventDefault();
        dropZone.classList.remove('hover');
        const files = event.dataTransfer.files;
        if (files.length) {
            fileInput.files = files;
            dropZone.textContent = `${files[0].name} sélectionné`;
            validateButton.disabled = false;
            removeButton.disabled = false;
            removeButton.classList.remove('disabled');
            validateButton.classList.remove('disabled');
        }
    });

    // Gérer la sélection d'un fichier en cliquant sur le champ de fichier
    fileInput.addEventListener('change', function() {
        const files = fileInput.files;
        if (files.length) {
            dropZone.textContent = `${files[0].name} sélectionné`;
            validateButton.disabled = false;
            removeButton.disabled = false;
            removeButton.classList.remove('disabled');
            validateButton.classList.remove('disabled');
        }
    });

    // Gérer la désélection d'un fichier
    removeButton.addEventListener('click', function() {
        fileInput.value = '';
        dropZone.textContent = 'Glissez et déposez un fichier ici ou cliquez pour sélectionner un fichier.';
        validateButton.disabled = true;
        removeButton.disabled = true;
        removeButton.classList.add('disabled');
        validateButton.classList.add('disabled');
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const projectItems = document.querySelectorAll('.project-item');
    projectItems.forEach(item => {
        item.addEventListener('click', () => {
            const projectId = item.getAttribute('data-project-id');
            window.location.href = `/quiz?projectId=${projectId}`;
        });
    });
});