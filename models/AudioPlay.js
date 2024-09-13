document.addEventListener('DOMContentLoaded', function() {
    const music = document.getElementById('bg-music');
    const musicPopup = document.getElementById('music-popup');
    const acceptMusic = document.getElementById('accept-music');
    const declineMusic = document.getElementById('decline-music');
    const musicToggle = document.getElementById('music-toggle');
    const toggleIcon = document.getElementById('toggle-icon');

    let isMusicPlaying = false;

    // Show popup on page load to request permission for music
    musicPopup.style.display = 'block';

    acceptMusic.addEventListener('click', function() {
        music.play().then(() => {
            isMusicPlaying = true;
            toggleIcon.src = '../ressource/speaker_on.png';
        }).catch(error => {
            console.error('Error playing music:', error);
        });
        musicPopup.style.display = 'none';
    });

    declineMusic.addEventListener('click', function() {
        musicPopup.style.display = 'none';
    });

    // Toggle music on/off when clicking the speaker button
    musicToggle.addEventListener('click', function() {
        if (isMusicPlaying) {
            music.pause();
            toggleIcon.src = '../ressource/speaker_off.png';
        } else {
            music.play().then(() => {
                toggleIcon.src = '../ressource/speaker_on.png';
            }).catch(error => {
                console.error('Error playing music:', error);
            });
        }
        isMusicPlaying = !isMusicPlaying;
    });
});
