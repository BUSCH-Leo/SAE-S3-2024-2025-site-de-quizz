document.addEventListener('DOMContentLoaded', () => {
    const mediaContainer = document.getElementById('mediaContainer');
    const imageUpload = document.getElementById('imageUpload');

    mediaContainer.addEventListener('click', () => {
        imageUpload.click();
    });

    imageUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                mediaContainer.style.backgroundImage = `url(${reader.result})`;
                mediaContainer.style.backgroundSize = 'cover';
                mediaContainer.style.backgroundPosition = 'center';
                mediaContainer.innerHTML = ''; // Enlever l'icône et le texte
            };
            reader.readAsDataURL(file);
        }
    });
});
