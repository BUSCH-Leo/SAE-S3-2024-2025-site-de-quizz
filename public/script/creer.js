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
                const projectSelectResponse = await fetch('/select-project?destination=editor', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ projectId: data.project.id })
                });
                
                if (projectSelectResponse.ok) {
                    window.location.href = '/editor';
                }
            } else {
                alert(data.message || 'Erreur lors de la création du projet');
            }

        } catch (error) {
            console.error('Erreur:', error);
            alert('Une erreur est survenue lors de la création du projet');
        }
    };

    const continueButton = modal.querySelector('button');
    continueButton.onclick = handleProjectCreation;

    projectNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleProjectCreation();
        }
    });
});

document.querySelectorAll('.project-item').forEach(item => {
    item.addEventListener('click', async function() {
        const projectId = this.dataset.projectId;
        
        try {
            const response = await fetch('http://localhost:3001/select-project?destination=editor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ projectId }),
            });
            
            if (response.ok) {
                window.location.href = '/editor';
            } else {
                console.error('Erreur lors de la sélection du projet');
                alert('Erreur lors de la sélection du projet');
            }
        } catch (error) {
            console.error('Erreur:', error);
        }
    });
});

// Fonction pour afficher un toast
function showToast(type, title, message, duration = 5000) {
    const toast = document.getElementById('toast');
    const toastTitle = document.getElementById('toast-title');
    const toastDescription = document.getElementById('toast-description');
    const toastIcon = document.getElementById('toast-icon');
    const toastProgress = document.querySelector('.toast-progress::before');
    
    // Réinitialiser les classes
    toast.className = 'toast';
    
    // Ajouter la classe de type
    toast.classList.add(type);
    
    // Définir l'icône en fonction du type
    if (type === 'success') {
        toastIcon.className = 'fas fa-check-circle';
    } else if (type === 'error') {
        toastIcon.className = 'fas fa-exclamation-circle';
    } else if (type === 'warning') {
        toastIcon.className = 'fas fa-exclamation-triangle';
    } else {
        toastIcon.className = 'fas fa-info-circle';
    }
    
    // Définir le contenu du toast
    toastTitle.textContent = title;
    toastDescription.textContent = message;
    
    // Afficher le toast
    setTimeout(() => {
        toast.classList.add('active');
    }, 100);
    
    // Définir la durée de la barre de progression
    document.documentElement.style.setProperty('--progress-duration', `${duration}ms`);
    
    // Masquer le toast après la durée spécifiée
    const timeoutId = setTimeout(() => {
        hideToast();
    }, duration);
    
    // Gérer la fermeture manuelle
    const closeButton = toast.querySelector('.toast-close');
    closeButton.onclick = () => {
        clearTimeout(timeoutId);
        hideToast();
    };
    
    function hideToast() {
        toast.classList.remove('active');
    }
}

// Modification de la partie de suppression du projet
document.addEventListener('DOMContentLoaded', function() {
    const confirmModal = document.getElementById('confirm-delete-modal');
    const confirmYesBtn = document.getElementById('confirm-yes');
    const confirmNoBtn = document.getElementById('confirm-no');
    let projectToDeleteId = null;
    let projectToDeleteName = null;

    // Attacher les gestionnaires d'événements aux boutons de suppression
    document.querySelectorAll('.delete-project-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Empêcher la propagation au parent (qui ouvrirait le projet)
            projectToDeleteId = this.getAttribute('data-project-id');
            // Récupérer le nom du projet pour un message plus personnalisé
            const projectItem = this.closest('.project-item');
            projectToDeleteName = projectItem.querySelector('.project-name').textContent;
            confirmModal.style.display = 'flex';
        });
    });

    // Gestion du bouton de confirmation de suppression
    confirmYesBtn.addEventListener('click', async function() {
        if (projectToDeleteId) {
            // Afficher un indicateur de chargement
            confirmYesBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Suppression...';
            confirmYesBtn.disabled = true;
            
            try {
                const response = await fetch(`/projects/${projectToDeleteId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const data = await response.json();
                
                if (data.success) {
                    // Supprimer l'élément de la liste avec une animation
                    const projectItem = document.querySelector(`.project-item .delete-project-btn[data-project-id="${projectToDeleteId}"]`).closest('.project-item');
                    if (projectItem) {
                        // Animation de disparition
                        projectItem.style.transition = 'opacity 0.3s, transform 0.3s';
                        projectItem.style.opacity = '0';
                        projectItem.style.transform = 'translateX(30px)';
                        
                        setTimeout(() => {
                            projectItem.remove();
                            
                            // Si la liste est vide, afficher "Aucun projet trouvé"
                            const projectsList = document.getElementById('projects-list');
                            if (projectsList.children.length === 0) {
                                projectsList.innerHTML = '<li class="project-item">Aucun projet trouvé</li>';
                            }
                        }, 300);
                    }
                    
                    // Afficher un message de succès avec toast
                    setTimeout(() => {
                        showToast(
                            'success', 
                            'Projet supprimé', 
                            `Le projet "${projectToDeleteName}" a été supprimé avec succès.`
                        );
                    }, 300);
                } else {
                    // Afficher un message d'erreur avec toast
                    showToast(
                        'error', 
                        'Échec de la suppression', 
                        data.message || 'Erreur lors de la suppression du projet'
                    );
                }
            } catch (error) {
                console.error('Erreur:', error);
                // Afficher un message d'erreur avec toast
                showToast(
                    'error', 
                    'Erreur système', 
                    'Une erreur est survenue lors de la suppression du projet'
                );
            } finally {
                // Réinitialiser le bouton et fermer la modale
                confirmYesBtn.innerHTML = 'Oui, supprimer';
                confirmYesBtn.disabled = false;
                confirmModal.style.display = 'none';
                projectToDeleteId = null;
                projectToDeleteName = null;
            }
        }
    });

    // Le reste du code reste inchangé
    confirmNoBtn.addEventListener('click', function() {
        confirmModal.style.display = 'none';
        projectToDeleteId = null;
        projectToDeleteName = null;
    });

    confirmModal.addEventListener('click', function(e) {
        if (e.target === confirmModal) {
            confirmModal.style.display = 'none';
            projectToDeleteId = null;
            projectToDeleteName = null;
        }
    });

    // Ajoutez ceci pour gérer le clic sur le bouton de fermeture du toast
    document.addEventListener('click', function(e) {
        if (e.target.closest('.toast-close')) {
            const toast = document.getElementById('toast');
            toast.classList.remove('active');
        }
    });
});