document.addEventListener('DOMContentLoaded', async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('projectId');

    if (!projectId) {
        alert('Project ID is missing in the URL');
        return;
    }

    try {
        const response = await fetch(`/quizzes/${projectId}`);
        const data = await response.json();

        if (data._id) {
            // Créer un événement personnalisé pour passer les données
            const projectDataEvent = new CustomEvent('projectDataLoaded', {
                detail: data
            });
            document.dispatchEvent(projectDataEvent);
        } else {
            alert('Failed to load project data');
        }
    } catch (error) {
        console.error('Error fetching project data:', error);
        alert('An error occurred while fetching project data');
    }
});