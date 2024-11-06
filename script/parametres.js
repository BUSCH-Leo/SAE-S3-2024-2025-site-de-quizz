document.getElementById('save-button').addEventListener('click', async function() {
    const phone = document.getElementById('phone-input').value;

    try {
        // Envoi d'une requête POST pour enregistrer le numéro de téléphone
        const response = await fetch('/update-phone', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ phone })
        });

        if (response.ok) {
            document.getElementById('success-message').style.display = 'block';
            setTimeout(() => {
                document.getElementById('success-message').style.display = 'none';
            }, 3000);
        } else {
            alert("Erreur lors de la mise à jour du numéro de téléphone.");
        }
    } catch (error) {
        console.error('Erreur réseau:', error);
    }
});