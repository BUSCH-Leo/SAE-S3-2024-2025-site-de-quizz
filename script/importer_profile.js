// Chargement du fichier profile.ejs
fetch('profile')
    .then(response => response.text())
    .then(data => {
        document.getElementById('profile-menu').innerHTML = data;
        loadProfileJS();
    })
    .catch(error => console.error('Erreur lors du chargement du fichier profile :', error));

// Charge dynamiquement profile.js
function loadProfileJS() {
    const script = document.createElement('script');
    script.src = '../script/profile.js';
    script.defer = true;
    document.body.appendChild(script);
}