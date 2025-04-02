export function showFeedback(message, type = 'success') {
    const feedbackEl = document.createElement('div');
    feedbackEl.textContent = message;
    
    const bgColor = type === 'success' ? 'bg-green-500' : 
                   (type === 'warning' ? 'bg-yellow-500' : 'bg-red-500');
    
    feedbackEl.className = `fixed bottom-4 right-4 ${bgColor} text-white px-4 py-2 rounded-full opacity-0 transition-opacity duration-300`;
    document.body.appendChild(feedbackEl);

    setTimeout(() => {
        feedbackEl.classList.remove('opacity-0');
    }, 100);

    setTimeout(() => {
        feedbackEl.classList.add('opacity-0');
        setTimeout(() => {
            feedbackEl.remove();
        }, 300);
    }, 2000);
}