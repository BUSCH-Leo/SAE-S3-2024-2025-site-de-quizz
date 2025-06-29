const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

class ImageOptimizer {
    constructor() {
        this.supportedFormats = ['.jpg', '.jpeg', '.png', '.webp'];
        this.totalSaved = 0;
        this.filesProcessed = 0;
        this.totalOriginalSize = 0;
    }

    async optimizeImage(inputPath, outputDir) {
        try {
            const ext = path.extname(inputPath).toLowerCase();
            const filename = path.basename(inputPath, ext);
            
            if (!this.supportedFormats.includes(ext)) {
                return;
            }

            await fs.mkdir(outputDir, { recursive: true });

            const originalStats = await fs.stat(inputPath);
            const originalSize = originalStats.size;
            this.totalOriginalSize += originalSize;

            // Optimiser selon le format
            const optimizedPath = path.join(outputDir, `${filename}${ext}`);
            
            if (ext === '.png') {
                await sharp(inputPath)
                    .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
                    .png({ compressionLevel: 8, adaptiveFiltering: true })
                    .toFile(optimizedPath);
            } else {
                await sharp(inputPath)
                    .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
                    .jpeg({ quality: 85, progressive: true })
                    .toFile(optimizedPath);
            }

            // Créer version WebP
            const webpPath = path.join(outputDir, `${filename}.webp`);
            await sharp(inputPath)
                .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
                .webp({ quality: 80, effort: 4 })
                .toFile(webpPath);

            const optimizedStats = await fs.stat(optimizedPath);
            const webpStats = await fs.stat(webpPath);
            
            const optimizedSize = optimizedStats.size;
            const webpSize = webpStats.size;
            const bestSize = Math.min(optimizedSize, webpSize);
            
            const savedBytes = originalSize - bestSize;
            this.totalSaved += savedBytes;
            this.filesProcessed++;

            const relativePath = path.relative(path.join(__dirname, '../public'), inputPath);
            console.log(`✅ ${relativePath}`);
            console.log(`   📊 ${this.formatBytes(originalSize)} → ${this.formatBytes(bestSize)}`);
            console.log(`   💾 Économie: ${this.formatBytes(savedBytes)} (${Math.round(savedBytes/originalSize*100)}%)`);
            console.log('');

        } catch (error) {
            console.error(`❌ Erreur avec ${path.basename(inputPath)}:`, error.message);
        }
    }

    async processDirectory(inputDir, outputDir = null) {
        if (!outputDir) {
            outputDir = path.join(inputDir, '../optimized');
        }

        try {
            const items = await fs.readdir(inputDir);
            
            for (const item of items) {
                const fullPath = path.join(inputDir, item);
                const stats = await fs.stat(fullPath);
                
                if (stats.isDirectory()) {
                    const subOutputDir = path.join(outputDir, item);
                    await this.processDirectory(fullPath, subOutputDir);
                } else {
                    await this.optimizeImage(fullPath, outputDir);
                }
            }
        } catch (error) {
            console.error(`❌ Erreur lecture dossier ${inputDir}:`, error.message);
        }
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    async run() {
        console.log('🚀 Optimisation des images - Quizzine\n');
        
        const resourceDir = path.join(__dirname, '../public/ressource');
        
        try {
            await fs.access(resourceDir);
        } catch {
            console.error('❌ Dossier public/ressource introuvable');
            return;
        }

        const startTime = Date.now();
        await this.processDirectory(resourceDir);
        const endTime = Date.now();
        
        console.log('🎉 Optimisation terminée !');
        console.log(`⏱️  Temps: ${Math.round((endTime - startTime) / 1000)}s`);
        console.log(`📁 ${this.filesProcessed} fichiers traités`);
        console.log(`📊 Taille originale: ${this.formatBytes(this.totalOriginalSize)}`);
        console.log(`💾 Économie totale: ${this.formatBytes(this.totalSaved)}`);
        
        if (this.totalSaved > 0) {
            const percentage = Math.round((this.totalSaved / this.totalOriginalSize) * 100);
            console.log(`📈 Réduction: ${percentage}%`);
            console.log(`\n📝 Images optimisées dans: public/optimized/`);
            console.log(`💡 Remplacez le contenu de public/ressource/ par public/optimized/`);
        }
    }
}

if (require.main === module) {
    const optimizer = new ImageOptimizer();
    optimizer.run().catch(console.error);
}

module.exports = ImageOptimizer;