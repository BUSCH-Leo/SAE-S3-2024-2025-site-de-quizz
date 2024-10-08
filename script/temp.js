document.addEventListener('DOMContentLoaded', function() {
    const music = document.getElementById('bg-music');
    const title = document.getElementById('title');
    const musicPopup = document.getElementById('music-popup');
    const acceptMusic = document.getElementById('accept-music');
    const declineMusic = document.getElementById('decline-music');
    const musicToggle = document.getElementById('music-toggle');
    const toggleIcon = document.getElementById('toggle-icon');

    let isMusicPlaying = false;

    // Set up audio context for analyzing the music
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaElementSource(music);
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    // Show popup on page load to request permission for music
    musicPopup.style.display = 'block';

    acceptMusic.addEventListener('click', function() {
        music.play().then(() => {
            isMusicPlaying = true;
            toggleIcon.src = 'ressource/speaker_on.png';
            audioContext.resume(); // Ensure audio context is running
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
            toggleIcon.src = 'ressource/speaker_off.png';
        } else {
            music.play().then(() => {
                toggleIcon.src = 'ressource/speaker_on.png';
            }).catch(error => {
                console.error('Error playing music:', error);
            });
        }
        isMusicPlaying = !isMusicPlaying;
    });

    // Adjust title size based on music loudness
    function updateTitleSize() {
        if (isMusicPlaying) {
            analyser.getByteFrequencyData(dataArray);
            const average = dataArray.reduce((sum, value) => sum + value) / dataArray.length;
            const scale = 1 + average / 100; // Adjust scaling factor as needed
            title.style.transform = `translate(-50%, -50%) scale(${scale})`;
        }
        requestAnimationFrame(updateTitleSize);
    }
    updateTitleSize();
});
