document.addEventListener('DOMContentLoaded', function() {
    const selectQuizButton = document.getElementById('select-quiz-btn');
    const modalContainer = document.querySelector('.modal');
    const uploadModal = document.getElementById('upload-modal');
    const projectsModal = document.getElementById('projects-modal');
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const validateButton = document.getElementById('validate-button');
    const removeButton = document.getElementById('remove-button');

    // Ouvrir les deux modales en même temps
    selectQuizButton.addEventListener('click', function() {
        modalContainer.style.display = 'flex';
        uploadModal.style.display = 'flex';
        projectsModal.style.display = 'flex';
    });

    // Fermer les deux modales lorsque l'on clique à l'extérieur
    window.addEventListener('click', function(event) {
        if (event.target === modalContainer) {
            modalContainer.style.display = 'none';
            uploadModal.style.display = 'none';
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


// ---------------------------------------------------------------------

// Sélection de la nouvelle modale et des boutons
const newQuizButton = document.getElementById('new-quiz-btn');
const projectNameModal = document.getElementById('project-name-modal');
const saveProjectNameButton = document.getElementById('save-project-name-btn');
const cancelProjectNameButton = document.getElementById('cancel-project-name-btn');
const projectNameInput = document.getElementById('project-name-input');


newQuizButton.addEventListener('click', function() {
    projectNameModal.style.display = 'flex'; 
});

window.addEventListener('click', function(event) {
    if (event.target === projectNameModal) {
        projectNameModal.style.display = 'none';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('project-name-modal');
    const projectNameInput = document.getElementById('project-name-input');
    const newQuizBtn = document.getElementById('new-quiz-btn');

    if (newQuizBtn) {
        newQuizBtn.addEventListener('click', () => {
            modal.style.display = 'flex';
        });
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Gérer la création du projet
    const handleProjectCreation = async () => {
        const projectName = projectNameInput.value.trim();
        
        if (!projectName) {
            alert('Veuillez entrer un nom de projet');
            return;
        }

        try {
            const response = await fetch('/projects/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: projectName })
            });

            const data = await response.json();

            if (data.success) {
                window.location.href = `/editor.html?projectId=${data.project.id}`;
            } else {
                alert(data.message || 'Erreur lors de la création du projet');
            }

        } catch (error) {
            console.error('Erreur:', error);
            alert('Une erreur est survenue lors de la création du projet');
        }
    };

    // Modifier le bouton continuer pour utiliser notre fonction
    const continueButton = modal.querySelector('button');
    continueButton.onclick = handleProjectCreation;

    // Gérer la soumission avec la touche Entrée
    projectNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleProjectCreation();
        }
    });
});
document.querySelectorAll('.project-item').forEach(item => {
    item.addEventListener('click', function() {
        const projectId = this.dataset.projectId;
        window.location.href = `/editor.html?projectId=${projectId}`;
    });
});
