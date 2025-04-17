const themeManager = {
    elements: {
        mainContent: document.querySelector('.main-content'),
        themePreviews: document.querySelectorAll('.theme-preview img'),
        imageBtn: document.getElementById('imageBtn'),
        leftPanel: document.querySelector('.left-panel'),
        rightPanel: document.querySelector('.right-panel')
    },

    currentTheme: {
        url: null,
        opacity: 0.4
    },

    init() {
        this.initializeImageHandlers();
        this.initDragAndDrop();
        this.applyPanelStyles();
    },

    initializeImageHandlers() {
        this.elements.themePreviews.forEach(preview => {
            preview.addEventListener('click', () => {
                const imageSrc = preview.getAttribute('src');
                if (imageSrc) {
                    this.applyTheme(imageSrc);
                    this.updatePreviewSelection(preview);
                }
            });
        });

        this.elements.imageBtn.addEventListener('click', this.handleImageButtonClick.bind(this));
    },

    handleImageButtonClick() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.handleImageUpload(file);
            }
            document.body.removeChild(fileInput);
        });

        document.body.appendChild(fileInput);
        fileInput.click();
    },

    updatePreviewSelection(selectedPreview) {
        this.elements.themePreviews.forEach(p => 
            p.parentElement.style.transform = 'scale(1)');
        selectedPreview.parentElement.style.transform = 'scale(1.1)';
    },

    applyTheme(imageUrl) {
        if (!imageUrl) return;
        
        this.currentTheme.url = imageUrl;
        
        const img = new Image();
        img.onload = () => {

            const maxWidth = Math.max(window.innerWidth, 1920); 
            const maxHeight = Math.max(window.innerHeight, 1080); 
            const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
            const width = img.width * ratio;
            const height = img.height * ratio;
            document.body.style.background = `url('${imageUrl}')`;
            document.body.style.backgroundSize = `${width}px ${height}px`;
            document.body.style.imageRendering = 'auto'; 
        };
        img.src = imageUrl;
        
        this.elements.mainContent.style.background = 'rgba(255, 255, 255, 0.2)';
        this.applyPanelStyles();
    },

    handleImageUpload(file) {

        if (!file.type.startsWith('image/')) {
            console.error('Le fichier doit être une image');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {

                if (img.width > 1920 || img.height > 1080) {
                    this.optimizeImage(img, event.target.result);
                } else {
                    this.applyTheme(event.target.result);
                }
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    },

    optimizeImage(img, originalSrc) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        let width = img.width;
        let height = img.height;

        if (width > 1920) {
            height *= 1920 / width;
            width = 1920;
        }
        if (height > 1080) {
            width *= 1080 / height;
            height = 1080;
        }

        canvas.width = width;
        canvas.height = height;

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(img, 0, 0, width, height);

        const optimizedSrc = canvas.toDataURL('image/jpeg', 0.95); 
        this.applyTheme(optimizedSrc);
    },

    initDragAndDrop() {
        const mainContent = this.elements.mainContent;
        if (!mainContent) return;
        

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            mainContent.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        });
        

        ['dragenter', 'dragover'].forEach(eventName => {
            mainContent.addEventListener(eventName, () => {
                mainContent.classList.add('drag-active');
            });
        });
        

        ['dragleave', 'drop'].forEach(eventName => {
            mainContent.addEventListener(eventName, () => {
                mainContent.classList.remove('drag-active');
            });
        });
        
        mainContent.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            if (files.length > 0 && files[0].type.startsWith('image/')) {
                this.handleImageUpload(files[0]);
            }
        });
    },

    applyPanelStyles() {
        if (this.currentTheme.url) {
            const panelStyle = 'rgba(255, 255, 255, 0.85)';
            if (this.elements.leftPanel) this.elements.leftPanel.style.background = panelStyle;
            if (this.elements.rightPanel) this.elements.rightPanel.style.background = panelStyle;
        }
    },
};


document.addEventListener('DOMContentLoaded', () => {
    themeManager.init();
});
