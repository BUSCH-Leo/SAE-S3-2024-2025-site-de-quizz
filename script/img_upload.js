document.addEventListener('DOMContentLoaded', function() {
    // Sélectionner les éléments du DOM
    const imageUpload = document.getElementById('imageUpload');
    const imagePreview = document.getElementById('imagePreview');
    const imageDisplay = document.getElementById('imageDisplay');

    console.log("Le script est chargé.");

    // Vérifier si l'élément 'imageUpload' existe dans le DOM
    if (imageUpload) {
        console.log("élément imageUpload trouvé.");
    } else {
        console.error("élément imageUpload introuvable.");
    }

    // Ajouter un gestionnaire d'événements pour le changement du fichier
    imageUpload.addEventListener('change', function(event) {
        console.log("Changement détecté dans l'input file !");
        const file = event.target.files[0]; // Récupérer le premier fichier sélectionné

        if (file) {
            console.log("Fichier sélectionné:", file.name);
            const reader = new FileReader();
            reader.onload = function(e) {
                console.log("Image chargée avec succès.");
                // Mettre à jour l'image de prévisualisation
                imageDisplay.src = e.target.result;

                // Mettre à jour l'image de fond dans le div de prévisualisation
                if (imagePreview) {
                    imagePreview.style.backgroundImage = `url('${e.target.result}')`;
                    imagePreview.style.backgroundSize = 'cover';
                    imagePreview.style.backgroundPosition = 'center';
                    imagePreview.style.height = '200px'; // Pour assurer une taille visible du div
                }
            };
            reader.readAsDataURL(file); // Lire le fichier en tant que DataURL
        } else {
            console.log("Aucun fichier sélectionné.");
        }
    });
});
