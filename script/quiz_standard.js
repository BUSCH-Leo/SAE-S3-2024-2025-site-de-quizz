// quiz_standard.js

(function() {
    let defaultImage = '../ressource/fond1.jpg';

    function initQuizStandard() {
        const imageUpload = document.getElementById('imageUpload');
        const imagePreview = document.getElementById('imagePreview');
        const quizTypeSelector = document.getElementById('quizType');
        const questionSection = document.querySelector('.question-section');

        setBackgroundImage(defaultImage);

        quizTypeSelector.addEventListener('change', updateQuiz);

    }

    // Fonction pour appliquer une image en fond
    function setBackgroundImage(imageUrl) {
        document.body.style.backgroundImage = `url('${imageUrl}')`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundAttachment = 'fixed';
    }

    function updateSliderBackground() {
        const timeSelect = document.getElementById('timeSelect');
        if (timeSelect) {
            const value = (timeSelect.value - timeSelect.min) / (timeSelect.max - timeSelect.min) * 100;
            timeSelect.style.background = `linear-gradient(to right, #7BD634 ${value}%, #ddd ${value}%)`;
        }
    }

    function updateQuiz() {
        
    }

    window.quizStandard = {
        init: initQuizStandard,
        setBackgroundImage: setBackgroundImage,
        updateSliderBackground: updateSliderBackground,
        updateQuiz: updateQuiz
    };
})();

document.addEventListener('DOMContentLoaded', window.quizStandard.init);