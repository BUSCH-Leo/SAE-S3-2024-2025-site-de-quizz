//Slider 
const timeSlider = document.getElementById('timeSlider');
const timeDisplay = document.getElementById('timeDisplay');

// Mise à jour dynamique lors du déplacement du slider
timeSlider.addEventListener('input', () => {
    timeDisplay.textContent = `${timeSlider.value}s`;
});

// Toggle panels
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

const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Désactive tous les onglets
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // Active l'onglet cliqué
        button.classList.add('active');
        const tabId = button.getAttribute('data-tab');
        document.getElementById(`${tabId}-content`).classList.add('active');
    });
});

// Récupération des éléments existants pour la zone de dépôt
const dropZone = document.querySelector('.media-upload');
const uploadIcon = dropZone.querySelector('i');
const uploadText = dropZone.querySelector('p');
const uploadButton = dropZone.querySelector('button');

// Créer l'input file caché
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = 'image/*';
fileInput.style.display = 'none';
dropZone.appendChild(fileInput);

// Créer le conteneur de prévisualisation
const previewContainer = document.createElement('div');
previewContainer.style.display = 'none';
previewContainer.style.position = 'absolute';
previewContainer.style.top = '0';
previewContainer.style.left = '0';
previewContainer.style.width = '100%';
previewContainer.style.height = '100%';
previewContainer.innerHTML = `
    <img src="" alt="Prévisualisation" style="width: 100%; height: 100%; object-fit: cover;">
    <button class="remove-preview" style="position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,0.5); color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
        <i class="fas fa-times"></i>
    </button>
`;
dropZone.appendChild(previewContainer);

// Style de base pour la zone de dépôt
dropZone.style.position = 'relative';
dropZone.style.width = '300px';
dropZone.style.height = '300px';
dropZone.style.cursor = 'pointer';

// Gérer le clic sur le bouton Parcourir
uploadButton.addEventListener('click', (e) => {
    e.preventDefault();
    fileInput.click();
});

// Gérer le drag & drop
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = 'var(--primary, #4F46E5)';
    dropZone.style.backgroundColor = 'rgba(79, 70, 229, 0.05)';
});

dropZone.addEventListener('dragleave', () => {
    dropZone.style.borderColor = '#e5e7eb';
    dropZone.style.backgroundColor = 'rgb(243 244 246)';
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
});

// Gérer la sélection de fichier via l'input
fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
});

// Gérer la suppression de la prévisualisation
previewContainer.querySelector('.remove-preview').addEventListener('click', (e) => {
    e.stopPropagation();
    resetUploadZone();
});

function handleFiles(files) {
    if (files.length === 0) return;
    
    const file = files[0];
    if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner une image');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        previewContainer.querySelector('img').src = e.target.result;
        showPreview();
    };
    reader.readAsDataURL(file);
}

function showPreview() {
    uploadIcon.style.display = 'none';
    uploadText.style.display = 'none';
    uploadButton.style.display = 'none';
    previewContainer.style.display = 'block';
    dropZone.style.backgroundColor = 'transparent';
}

function resetUploadZone() {
    fileInput.value = '';
    previewContainer.style.display = 'none';
    uploadIcon.style.display = 'block';
    uploadText.style.display = 'block';
    uploadButton.style.display = 'block';
    dropZone.style.backgroundColor = 'rgb(243 244 246)';
    dropZone.style.borderColor = '#e5e7eb';
}


// Gérer les paramètres
const settings = {
    font: 'Arial',
    defaultPoints: 10,
    enableBonus: false
  };

  const fontSelector = document.getElementById('fontSelector');
  const defaultPointsInput = document.getElementById('defaultPoints');
  const enableBonusCheckbox = document.getElementById('enableBonus');

  fontSelector.addEventListener('change', (e) => {
    settings.font = e.target.value;
  });

  defaultPointsInput.addEventListener('input', (e) => {
    settings.defaultPoints = parseInt(e.target.value);
  });

  enableBonusCheckbox.addEventListener('change', (e) => {
    settings.enableBonus = e.target.checked;
  });
