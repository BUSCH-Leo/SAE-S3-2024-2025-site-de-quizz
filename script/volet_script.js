function inviteCollaborator() {
    const email = prompt("Entrez l'email du collaborateur :");
    const quizId = generateQuizId();
    const inviteUrl = window.location.href + "?quizId=" + quizId + "&invite=" + email;
    alert("Envoyez ce lien à votre collaborateur : " + inviteUrl);
}

    function togglePanel() {
    const panel = document.getElementById("sidePanel");
    const button = document.getElementById("toggleButton");
    const buttonImage = document.getElementById("toggleButtonImage");
    
    panel.classList.toggle("open");

    if (panel.classList.contains("open")) {
        button.style.right = "350px";
        buttonImage.src = "../ressource/page_creation_quiz/fermer.png";
    } else {
        button.style.right = "0px";
        buttonImage.src = "../ressource/page_creation_quiz/ouvrir.png";
    }
}

    function showTab(tab) {
        const colorTab = document.getElementById("colorTab");
        const imageTab = document.getElementById("imageTab");
        const tabs = document.querySelectorAll(".tab");

        if (tab === 'colors') {
            colorTab.style.display = 'block';
            imageTab.style.display = 'none';
            tabs[0].classList.add('active');
            tabs[1].classList.remove('active');
        } else {
            colorTab.style.display = 'none';
            imageTab.style.display = 'block';
            tabs[0].classList.remove('active');
            tabs[1].classList.add('active');
        }
    }

    function updateTheme(isDarkMode) {
      const body = document.body;
      const panel = document.getElementById("sidePanel");

      if (isDarkMode) {
        body.style.setProperty("--background-color", "hsl(0deg 0.18% 32.37%)");
        body.style.setProperty("--text-color", "hsl(228, 5%, 80%)");
        panel.style.setProperty("--background-color", "hsl(0deg 0% 37.16%)");
        panel.style.setProperty("--text-color", "hsl(228, 5%, 80%)");
      } else {
        body.style.setProperty("--background-color", "#FFF");
        body.style.setProperty("--text-color", "#222");
        panel.style.setProperty("--background-color", "#FFF");
        panel.style.setProperty("--text-color", "#222");
      }
    }

    function setBackgroundColor(color) {
        document.body.style.backgroundImage = "none";
        document.body.style.backgroundColor = color;
    }

    function setBackgroundImage(imageUrl) {
        document.body.style.backgroundImage = `url(${imageUrl})`;
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";
        document.body.style.backgroundRepeat = "no-repeat";
    }

    function saveQuiz() {
        const quizType = document.getElementById("quizType").value;

        localStorage.setItem("savedQuiz", quizType);
        alert("Le quiz a été enregistré !");
        
        console.log("Quiz enregistré : Type de quiz -", quizType);
    }

    function shareQuiz() {
    const quizLink = "file:///C:/Users/bk030481/Desktop/Nouveau%20dossier/test.html"; 

    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(quizLink)}`;
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(quizLink)}&text=Découvrez ce quiz incroyable !`;
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(quizLink)}`;
    const instaUrl = `https://www.instagram.com/?url=${encodeURIComponent(quizLink)}`;

    const socialChoice = prompt("Sur quel réseau souhaitez-vous partager ? (facebook, twitter, linkedin, instagram)");

    let shareUrl;
    switch (socialChoice.toLowerCase()) {
        case 'facebook':
            shareUrl = facebookUrl;
            break;
        case 'twitter':
            shareUrl = twitterUrl;
            break;
        case 'linkedin':
            shareUrl = linkedinUrl;
            break;
        case 'instagram':
            shareUrl = instaUrl;
            break;
        default:
            alert("Veuillez choisir entre 'facebook', 'twitter', 'linkedin' ou 'Instagram.");
            return;
    }
    window.open(shareUrl, '_blank');
    alert("Le quiz a été partagé !");
}
const translations = {
  en: {
    quizType: "Quiz Type",
    h3: "Choose Theme (Background Color)",
    h2: "Quiz Settings",
    chooseQuizType: "Choose a type",
    colorTab: "Colors",
    imageTab: "Images",
    backgroundColor: "Choose Background Color",
    backgroundImage: "Choose Background Image",
    submit: "Save Quiz",
    share: "Share Quiz"
  },
  fr: {
    quizType: "Type de Quiz",
    h3: "Choisissez le Thème (Couleur de Fond)",
    h2: "Paramètres du Quiz",
    chooseQuizType: "Choisissez un type",
    colorTab: "Couleurs",
    imageTab: "Images",
    backgroundColor: "Choisissez la couleur de fond",
    backgroundImage: "Choisissez une image de fond",
    submit: "Enregistrer le Quiz",
    share: "Partager le Quiz"
  }
};

function changeLanguage() {
  const selectedLanguage = document.getElementById('languageSelector').value;
  const translation = translations[selectedLanguage];

  document.querySelector('label[for="quizType"]').textContent = translation.quizType;
  document.getElementById('quizType').setAttribute('placeholder', translation.chooseQuizType);
  document.querySelector('.tab:nth-child(1)').textContent = translation.colorTab;
  document.querySelector('.tab:nth-child(2)').textContent = translation.imageTab;
  document.querySelector('.theme-section button.submit-button').textContent = translation.submit;
  document.querySelector('.theme-section button.submit-button + button').textContent = translation.share;
   document.querySelector('h3').textContent = translation.h3;
   document.querySelector('h2').textContent = translation.h2;
}


