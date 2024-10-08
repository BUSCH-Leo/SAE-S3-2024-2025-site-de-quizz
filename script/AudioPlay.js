document.addEventListener('DOMContentLoaded', function() {
    const music = document.getElementById('bg-music');
    const musicPopup = document.getElementById('music-popup');
    const acceptMusic = document.getElementById('accept-music');
    const declineMusic = document.getElementById('decline-music');
    const musicToggle = document.getElementById('music-toggle');
    const toggleIcon = document.getElementById('toggle-icon');

    let isMusicPlaying = false;

    function getRandomAudioNumber() {
        return Math.floor(Math.random() * 5) + 1;
    }

    function playRandomAudio() {
        const randomNumber = getRandomAudioNumber();
        const audioFilePath = `../ressource/la quizzine ${randomNumber}.mp3`;
        console.log(`Playing audio: ${audioFilePath}`); // Log the audio file path
        
        const audio = new Audio(audioFilePath);
        audio.play().then(() => {
            console.log('Audio is playing'); // Confirm successful play
        }).catch(error => {
            console.error('Error playing sound effect:', error);
        });
    }

    // Select buttons directly using their IDs
    const jouerButton = document.getElementById('jouer');
    const creerButton = document.getElementById('créer');
    const title = document.getElementById('title');

    jouerButton.addEventListener('click', function() {
        console.log('Jouer button clicked');
        playRandomAudio();
    });

    creerButton.addEventListener('click', function() {
        console.log('Créer button clicked');
        playRandomAudio();
    });
    
    title.addEventListener('click', function() {
        console.log('Title clicked');
        playRandomAudio();
    });
    
    musicPopup.style.display = 'block';

    acceptMusic.addEventListener('click', function() {
        music.play().then(() => {
            isMusicPlaying = true;
            toggleIcon.src = '../ressource/speaker_on.png';
            console.log('Background music is playing'); // Log successful play
        }).catch(error => {
            console.error('Error playing music:', error);
        });
        musicPopup.style.display = 'none';
    });

    declineMusic.addEventListener('click', function() {
        musicPopup.style.display = 'none';
    });

    musicToggle.addEventListener('click', function() {
        console.log('Music toggle clicked');
        if (isMusicPlaying) {
            music.pause();
            toggleIcon.src = '../ressource/speaker_off.png';
            console.log('Music paused');
        } else {
            music.play().then(() => {
                toggleIcon.src = '../ressource/speaker_on.png';
                console.log('Music playing');
            }).catch(error => {
                console.error('Error playing music:', error);
            });
        }
        isMusicPlaying = !isMusicPlaying;
    });
});
