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
        const audioFilePath = `/ressource/la quizzine ${randomNumber}.mp3`;
        console.log(`Playing audio: ${audioFilePath}`);
        
        const audio = new Audio(audioFilePath);
        audio.play().then(() => {
            console.log('Audio is playing');
        }).catch(error => {
            console.error('Error playing sound effect:', error);
        });
    }

    const jouerButton = document.getElementById('jouer');
    const creerButton = document.getElementById('créer');
    const title = document.getElementById('title');

    jouerButton.addEventListener('click', function() {
        console.log('Jouer button clicked');
    });

    creerButton.addEventListener('click', function() {
        console.log('Créer button clicked');
    });
    
    title.addEventListener('click', function() {
        console.log('Title clicked');
        playRandomAudio();
		title.classList.add('clicked');
    
    setTimeout(() => {
        title.classList.remove('clicked');
    }, 200);  
    });
    
    musicPopup.style.display = 'block';

    acceptMusic.addEventListener('click', function() {
        music.play().then(() => {
            isMusicPlaying = true;
            toggleIcon.src = '/ressource/speaker_on.webp';
            console.log('Background music is playing');
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
            toggleIcon.src = '/ressource/speaker_off.webp';
            console.log('Music paused');
        } else {
            music.play().then(() => {
                toggleIcon.src = '/ressource/speaker_on.webp';
                console.log('Music playing');
            }).catch(error => {
                console.error('Error playing music:', error);
            });
        }
        isMusicPlaying = !isMusicPlaying;
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const jouerMenu = document.querySelector("#jouer-menu");
    const creerMenu = document.querySelector("#creer-menu");
    const jouerButton = document.querySelector("#zone_jouer");
    const creerButton = document.querySelector("#zone_créer");

    function closeAllMenus() {
        if (jouerMenu) jouerMenu.classList.remove("active");
        if (creerMenu) creerMenu.classList.remove("active");
    }

    function closeOnClickOutside(event) {
        if (!event.target.closest(".slide-menu") && !event.target.closest(".button_zone")) {
            closeAllMenus();
        }
    }

    if (jouerButton && jouerMenu) {
        jouerButton.addEventListener("click", () => {
            closeAllMenus();
            jouerMenu.classList.add("active");
            document.addEventListener("click", closeOnClickOutside);
        });
    }

    if (creerButton && creerMenu) {
        creerButton.addEventListener("click", () => {
            closeAllMenus();
            creerMenu.classList.add("active");
            document.addEventListener("click", closeOnClickOutside);
        });
    }

    document.querySelectorAll(".slide-menu").forEach(menu => {
        menu.addEventListener("click", (e) => e.stopPropagation());
    });
});