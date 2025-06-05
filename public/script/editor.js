// Slider
const timeSlider = document.getElementById('timeSlider');
const timeDisplay = document.getElementById('timeDisplay');

timeSlider.addEventListener('input', () => {
    timeDisplay.textContent = `${timeSlider.value}s`;
});

// Panneaux latéraux
const leftPanel = document.querySelector('.left-panel');
const rightPanel = document.querySelector('.right-panel');
const mainContent = document.querySelector('.main-content');
const leftToggle = leftPanel.querySelector('.toggle-button');
const rightToggle = rightPanel.querySelector('.toggle-button');

leftToggle.addEventListener('click', () => {
    leftPanel.classList.toggle('collapsed');
    mainContent.classList.toggle('left-collapsed');
    leftToggle.querySelector('i').classList.toggle('fa-chevron-right');
    leftToggle.querySelector('i').classList.toggle('fa-chevron-left');
});

rightToggle.addEventListener('click', () => {
    rightPanel.classList.toggle('collapsed');
    mainContent.classList.toggle('right-collapsed');
    rightToggle.querySelector('i').classList.toggle('fa-chevron-left');
    rightToggle.querySelector('i').classList.toggle('fa-chevron-right');
});

// Onglets
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {

        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        button.classList.add('active');
        const tabId = button.getAttribute('data-tab');
        document.getElementById(`${tabId}-content`).classList.add('active');
    });
});


// Paramètres
const settings = {
    font: 'Arial',
    defaultPoints: 10,
    enableBonus: false
};

// Remplacer ces lignes qui causent l'erreur
// const fontSelector = document.getElementById('fontSelector');
const defaultPointsInput = document.getElementById('defaultPoints');
const enableBonusCheckbox = document.getElementById('enableBonus');

// Pas besoin de cet event listener puisque fontSelector n'existe pas
// fontSelector.addEventListener('change', (e) => {
//     settings.font = e.target.value;
// });

// À la place, utilisez vos previews de polices
document.querySelectorAll('.font-preview').forEach(preview => {
    preview.addEventListener('click', function() {
        settings.font = this.dataset.font;
        document.body.style.fontFamily = settings.font;
        document.querySelectorAll('.font-preview').forEach(p => p.classList.remove('selected'));
        this.classList.add('selected');
    });
});

defaultPointsInput.addEventListener('input', (e) => {
    settings.defaultPoints = parseInt(e.target.value);
});

enableBonusCheckbox.addEventListener('change', (e) => {
    settings.enableBonus = e.target.checked;
});

let currentProjectId = null;

// Fonction pour obtenir l'ID du projet courant
async function getCurrentProjectId() {
    if (window.currentProjectId) {
        console.log('ID du projet déjà en mémoire:', window.currentProjectId);
        return window.currentProjectId;
    }
    
    try {
        console.log('Récupération de l\'ID du projet via l\'API');
        const response = await fetch('/api/current-project');
        const data = await response.json();
        
        if (data.success) {
            window.currentProjectId = data.project._id;
            console.log('ID du projet récupéré avec succès:', window.currentProjectId);
            return window.currentProjectId;
        } else {
            console.error('Échec de la récupération de l\'ID du projet:', data.message);
            return null;
        }
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'ID du projet:', error);
        return null;
    }
}

document.addEventListener('projectDataLoaded', function(e) {
    currentProjectId = e.detail._id;
    console.log('ID du projet chargé:', currentProjectId);
});

document.getElementById('submit-quiz').addEventListener('click', async function() {
    console.log('Clic sur le bouton de soumission du quiz');
    
    try {
        if (!window.quizEditor) {
            console.error("L'éditeur de quiz n'est pas initialisé");
            alert("Erreur: L'éditeur de quiz n'est pas correctement initialisé");
            return;
        }
        
        const themeManager = window.themeManager || { 
            currentTheme: { 
                url: document.body.style.backgroundImage 
                    ? document.body.style.backgroundImage.replace(/url\(['"](.+)['"]\)/, '$1') 
                    : null 
            } 
        };
        
        console.log('Récupération des données du quiz');
        const questionData = window.quizEditor.questionData;
        
        if (!questionData || questionData.length === 0) {
            alert("Votre quiz doit contenir au moins une question");
            return;
        }
        
        const loadingMessage = document.createElement('div');
        loadingMessage.style.position = 'fixed';
        loadingMessage.style.top = '50%';
        loadingMessage.style.left = '50%';
        loadingMessage.style.transform = 'translate(-50%, -50%)';
        loadingMessage.style.padding = '20px';
        loadingMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        loadingMessage.style.color = 'white';
        loadingMessage.style.borderRadius = '10px';
        loadingMessage.style.zIndex = '9999';
        loadingMessage.textContent = 'Enregistrement du quiz...';
        document.body.appendChild(loadingMessage);
        
        console.log('Récupération de l\'ID du projet');
        const projectId = await getCurrentProjectId();
        console.log('ID du projet récupéré:', projectId);
        
        let result;
        
        if (window.submitQuiz) {
            console.log('Utilisation de la fonction submitQuiz importée');
            result = await window.submitQuiz(questionData, themeManager, projectId);
        } else {
            console.log('Essai d\'importation dynamique de submitQuiz');
            try {
                const module = await import('/utils/quizSubmiter.js');
                result = await module.submitQuiz(questionData, themeManager, projectId);
            } catch (importError) {
                console.error('Erreur lors de l\'importation du module:', importError);
                result = { error: 'Erreur lors de l\'importation du module de soumission' };
            }
        }
        
        document.body.removeChild(loadingMessage);
        
        console.log('Résultat de la soumission:', result);
        
        if (result && !result.error) {
            alert('Quiz enregistré avec succès !');
            window.location.href = '/creer_page';
        } else {
            alert('Erreur lors de l\'enregistrement: ' + (result?.error || 'Une erreur inconnue est survenue'));
        }
    } catch (error) {
        console.error('Erreur lors de la soumission du quiz:', error);
        alert('Une erreur est survenue lors de la soumission du quiz: ' + error.message);
    }
});

async function submitQuizManually() {
    const projectId = await getCurrentProjectId();
    
    if (!projectId) {
        alert("Erreur: Impossible de récupérer l'ID du projet");
        return;
    }
    
    const questionData = window.quizEditor ? window.quizEditor.getQuestionData() : [];
    
    const quizData = {
        questions: questionData.map(q => ({
            questionText: q.text || 'Question sans texte',
            mediaUrl: q.media || '',
            mediaType: q.media ? 'image' : '',
            timeLimit: q.time || 30,
            points: q.points || 10,
            type: q.type || 'multiple',
            answerOptions: q.answers || []
        })),
        theme: document.body.style.backgroundImage 
            ? document.body.style.backgroundImage.replace(/url\(['"](.+)['"]\)/, '$1') 
            : null,
        font: document.body.style.fontFamily || 'Arial',
        points: parseInt(document.getElementById('defaultPoints').value) || 10,
        enableTimeBonus: document.getElementById('enableBonus').checked || false
    };
    
    const submitResponse = await fetch(`/quizzes/${projectId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(quizData)
    });
    
    const result = await submitResponse.json();
    
    if (!result.error) {
        alert('Quiz enregistré avec succès !');
        window.location.href = '/creer_page';
    } else {
        alert('Erreur lors de l\'enregistrement: ' + result.error);
    }
}
