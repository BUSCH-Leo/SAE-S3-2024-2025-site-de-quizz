document.addEventListener('wheel', function (event) {
    if (event.ctrlKey) {
        event.preventDefault(); // Prevent zooming when Ctrl is pressed
    }
}, { passive: false });