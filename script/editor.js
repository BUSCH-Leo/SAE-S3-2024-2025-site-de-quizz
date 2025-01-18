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

// Theme selection
document.querySelectorAll('.theme-preview').forEach(theme => {
    theme.addEventListener('click', () => {
        document.querySelectorAll('.theme-preview').forEach(t => 
            t.style.transform = 'scale(1)');
        theme.style.transform = 'scale(1.1)';
        const themeUrl = theme.getAttribute('data-theme-url');
        updateBackground(themeUrl);
    });
});

// File upload for custom background
const fileInput = document.getElementById('backgroundFileInput');
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            updateBackground(event.target.result);
        };
        reader.readAsDataURL(file);
    }
});

function updateBackground(url) {
    mainContent.style.backgroundImage = `url(${url})`;
    mainContent.style.backgroundSize = 'cover';
    mainContent.style.backgroundPosition = 'center';
}

// Drag and drop file upload
const dropZone = document.querySelector('.media-upload');

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = 'var(--primary)';
    dropZone.style.background = 'rgba(79, 70, 229, 0.05)';
});

dropZone.addEventListener('dragleave', () => {
    dropZone.style.borderColor = '#e5e7eb';
    dropZone.style.background = 'transparent';
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#e5e7eb';
    dropZone.style.background = 'transparent';
    const file = e.dataTransfer.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            updateBackground(event.target.result);
        };
        reader.readAsDataURL(file);
    }
});

// Font Selection
const fontSelector = document.getElementById('fontSelector');
fontSelector.addEventListener('change', (e) => {
    document.querySelector('.main-content').style.fontFamily = e.target.value;
});





// Gérer les paramètres
document.getElementById('defaultTime').addEventListener('change', function() {
    localStorage.setItem('defaultTime', this.value);
});

document.getElementById('defaultPoints').addEventListener('change', function() {
    localStorage.setItem('defaultPoints', this.value);
});

document.getElementById('enableTimer').addEventListener('change', function() {
    localStorage.setItem('enableTimer', this.checked);
});

document.getElementById('enableBonus').addEventListener('change', function() {
    localStorage.setItem('enableBonus', this.checked);
});
