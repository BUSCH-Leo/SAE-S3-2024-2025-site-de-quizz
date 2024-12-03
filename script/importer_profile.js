// Chargement du fichier profile.ejs
fetch('profile')
    .then(response => response.text())
    .then(data => {
        document.getElementById('profile-menu').innerHTML = data;
        console.log("importation profile réussis");
    })
    .catch(error => console.error('Erreur lors du chargement du fichier profile :', error));