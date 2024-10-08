// Chargement du fichier burger.html
fetch('burger.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('burger-menu').innerHTML = data;
        loadBurgerJS();
    })
    .catch(error => console.error('Erreur lors du chargement du fichier burger.html:', error));

// Charge dynamiquement burger.js
function loadBurgerJS() {
    const script = document.createElement('script');
    script.src = '../script/burger.js';
    script.defer = true;
    document.body.appendChild(script);
}