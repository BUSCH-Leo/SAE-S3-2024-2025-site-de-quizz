console.log('profile.js chargé');

document.addEventListener("DOMContentLoaded", () => {
    const profilePreview = document.getElementById("profile-preview");
    const buttonDivs = document.querySelectorAll(".profile-menu .button-div");

    profilePreview.addEventListener("click", () => {
        buttonDivs.forEach(buttonDiv => {
            buttonDiv.classList.toggle("show");
        });
    });
});