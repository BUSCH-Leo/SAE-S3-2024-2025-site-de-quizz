// Slider
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

// Onglets
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


// Paramètres
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
