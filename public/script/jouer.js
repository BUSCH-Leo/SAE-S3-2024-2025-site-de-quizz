document.addEventListener('DOMContentLoaded', function() {
    const els = {
        btn: document.getElementById('select-quiz-btn'),
        modal: document.querySelector('.modal'),
        uploadModal: document.getElementById('upload-modal'),
        projectsModal: document.getElementById('projects-modal'),
        dropZone: document.getElementById('drop-zone'),
        fileInput: document.getElementById('file-input'),
        validateBtn: document.getElementById('validate-button'),
        removeBtn: document.getElementById('remove-button')
    };

    const toggleBtns = (enabled) => {
        [els.validateBtn, els.removeBtn].forEach(btn => {
            btn.disabled = !enabled;
            btn.classList.toggle('disabled', !enabled);
        });
    };

    const handleFile = (file) => {
        if (file) {
            els.dropZone.textContent = `${file.name} sélectionné`;
            toggleBtns(true);
        }
    };

    els.btn.addEventListener('click', () => {
        els.modal.style.display = 'flex';
        els.uploadModal.style.display = 'flex';
        els.projectsModal.style.display = 'flex';
    });

    els.modal.addEventListener('click', (e) => {
        if (e.target === els.modal) {
            els.modal.style.display = 'none';
            els.uploadModal.style.display = 'none';
            els.projectsModal.style.display = 'none';
        }
    });

    els.dropZone.addEventListener('click', () => els.fileInput.click());
    
    els.dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        els.dropZone.classList.add('hover');
    });
    
    els.dropZone.addEventListener('dragleave', () => els.dropZone.classList.remove('hover'));
    
    els.dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        els.dropZone.classList.remove('hover');
        handleFile(e.dataTransfer.files[0]);
    });

    els.fileInput.addEventListener('change', (e) => handleFile(e.target.files[0]));

    els.removeBtn.addEventListener('click', () => {
        els.fileInput.value = '';
        els.dropZone.textContent = 'Glissez et déposez un fichier ici ou cliquez pour sélectionner un fichier.';
        toggleBtns(false);
    });

    els.modal.addEventListener('click', async (e) => {
        const item = e.target.closest('.project-item');
        if (item?.dataset.projectId) {
            const response = await fetch('/select-project', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectId: item.dataset.projectId })
            });
            if (response.ok) window.location.href = '/quiz';
        }
    });
});