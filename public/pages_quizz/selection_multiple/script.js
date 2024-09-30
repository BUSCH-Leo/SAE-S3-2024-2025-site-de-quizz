const buttons = document.querySelectorAll('.answer');
const progress = document.getElementById('progress');
const timeLeftText = document.getElementById('time-left');
const timeUpMessage = document.getElementById('time-up');

let timeLeft = 60;
const interval = setInterval(updateProgressBar, 1000);

buttons.forEach(button => {
    button.addEventListener('click', function() {
        if (this.classList.contains('selected')) {
            this.classList.remove('selected');
        } else {
            this.classList.add('selected');
        }
    });
});

function updateProgressBar() {
    timeLeft--;
    let progressWidth = (timeLeft / 60) * 100;
    progress.style.width = progressWidth + '%';
    timeLeftText.textContent = timeLeft + 's';

    if (timeLeft <= 0) {
        clearInterval(interval);
        timeLeftText.textContent = '0s';
        timeUpMessage.style.display = 'block';
    }
}