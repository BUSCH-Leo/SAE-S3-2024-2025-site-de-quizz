document.addEventListener('DOMContentLoaded', function() {
    const selectQuizButton = document.getElementById('select-quiz-btn');
    const modalContainer = document.querySelector('.modal'); 
    const uploadModal = document.getElementById('upload-modal');
    const projectsModal = document.getElementById('projects-modal');
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const validateButton = document.getElementById('validate-button');
    const removeButton = document.getElementById('remove-button');

    selectQuizButton.addEventListener('click', function() {
        modalContainer.style.display = 'flex'; 
        uploadModal.style.display = 'flex';
        projectsModal.style.display = 'flex'; 
    });

    window.addEventListener('click', function(event) {
        if (event.target === modalContainer) {
            modalContainer.style.display = 'none';
            uploadModal.style.display = 'none'; 
            projectsModal.style.display = 'none'; 
        }
    });

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
        item.addEventListener('click', async () => {
            const projectId = item.getAttribute('data-project-id');
            
            try {
                const response = await fetch('/select-project', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ projectId }),
                });
                
                if (response.ok) {
                    window.location.href = '/quiz';
                } else {
                    console.error('Erreur lors de la sélection du projet');
                    alert('Erreur lors de la sélection du projet');
                }
            } catch (error) {
                console.error('Erreur:', error);
            }
        });
    });
});