// Variable globale pour stocker l'ID du projet
let projectId = null;

document.addEventListener('DOMContentLoaded', async function() {
    // Récupérer l'ID du projet via l'API
    const id = await getProjectId();
    if (!id) {
        console.error('Impossible de récupérer l\'ID du projet');
        return;
    }

    // Utiliser l'ID du projet comme nécessaire
    console.log('ID du projet:', id);

    // En cas de besoin de récupération directe du projet (comme solution de secours)
    if (!window.projectDataLoaded) {
        fetchCurrentProject();
    }
});

// Fonction pour obtenir l'ID du projet
async function getProjectId() {
    if (projectId) return projectId;
    
    try {
        const response = await fetch('/api/current-project');
        const data = await response.json();
        
        if (data.success) {
            projectId = data.project._id;
            return projectId;
        } else {
            console.error('Erreur:', data.message);
            return null;
        }
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'ID du projet:', error);
        return null;
    }
}

// Écoute l'événement projectDataLoaded pour obtenir l'ID du projet
document.addEventListener('projectDataLoaded', function(e) {
    projectId = e.detail._id;
    console.log('ID du projet chargé dans quizTheme:', projectId);
    
    // Si vous avez besoin d'initialiser des fonctionnalités de thème après le chargement du projet
    initializeThemeFeatures();
});

// Fonction pour récupérer directement le projet
async function fetchCurrentProject() {
    try {
        const response = await fetch('/api/current-project');
        const data = await response.json();
        
        if (data.success) {
            const projectDataEvent = new CustomEvent('projectDataLoaded', {
                detail: data.project
            });
            document.dispatchEvent(projectDataEvent);
            window.projectDataLoaded = true;
        } else {
            console.error('Erreur:', data.message);
        }
    } catch (error) {
        console.error('Erreur lors du chargement du projet:', error);
    }
}

// Pour toute fonction qui a besoin de l'ID du projet
async function initializeThemeFeatures() {
    const id = await getProjectId();
    if (!id) {
        console.error('Impossible de récupérer l\'ID du projet');
        return;
    }
    
    // Utilisez l'ID du projet pour vos fonctionnalités de thème
    console.log('Initialisation des fonctionnalités de thème avec l\'ID:', id);
    
    // Autres fonctionnalités de thème...
}

// Pour toute fonction qui envoie des requêtes au serveur nécessitant l'ID du projet
async function saveThemeSettings(themeSettings) {
    const id = await getProjectId();
    if (!id) {
        console.error('Impossible de récupérer l\'ID du projet');
        return;
    }
    
    try {
        const response = await fetch('/api/save-theme', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                projectId: id,
                settings: themeSettings
            })
        });
        
        const result = await response.json();
        if (result.success) {
            console.log('Paramètres de thème enregistrés avec succès');
        } else {
            console.error('Erreur lors de l\'enregistrement des paramètres de thème:', result.message);
        }
    } catch (error) {
        console.error('Erreur lors de la sauvegarde des paramètres de thème:', error);
    }
}