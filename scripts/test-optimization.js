const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

async function testSingleImage() {
    const resourceDir = path.join(__dirname, '../public/ressource');
    const outputDir = path.join(__dirname, '../test-optimization');
    
    await fs.mkdir(outputDir, { recursive: true });
    
    try {
        // Chercher la première image dans le dossier ressource
        const files = await fs.readdir(resourceDir);
        const imageFile = files.find(file => 
            ['.jpg', '.jpeg', '.png', '.webp'].includes(path.extname(file).toLowerCase())
        );
        
        if (!imageFile) {
            console.log('❌ Aucune image trouvée dans public/ressource');
            return;
        }
        
        const testImage = path.join(resourceDir, imageFile);
        const originalStats = await fs.stat(testImage);
        
        console.log(`📷 Test sur: ${imageFile}`);
        console.log(`📊 Taille originale: ${formatBytes(originalStats.size)}`);
        console.log('');
        
        // Créer plusieurs versions avec qualités différentes
        const qualities = [95, 85, 75];
        
        for (const quality of qualities) {
            const ext = path.extname(imageFile);
            const name = path.basename(imageFile, ext);
            const outputPath = path.join(outputDir, `${name}-quality-${quality}${ext}`);
            
            if (ext.toLowerCase() === '.png') {
                await sharp(testImage)
                    .png({ compressionLevel: quality === 95 ? 6 : quality === 85 ? 8 : 9 })
                    .toFile(outputPath);
            } else {
                await sharp(testImage)
                    .jpeg({ quality, progressive: true })
                    .toFile(outputPath);
            }
            
            const newStats = await fs.stat(outputPath);
            const reduction = Math.round((1 - newStats.size/originalStats.size) * 100);
            
            console.log(`✅ Qualité ${quality}%: ${formatBytes(newStats.size)} (-${reduction}%)`);
        }
        
        // Créer version WebP
        const webpPath = path.join(outputDir, `${path.basename(imageFile, path.extname(imageFile))}.webp`);
        await sharp(testImage)
            .webp({ quality: 80 })
            .toFile(webpPath);
            
        const webpStats = await fs.stat(webpPath);
        const webpReduction = Math.round((1 - webpStats.size/originalStats.size) * 100);
        console.log(`🚀 WebP: ${formatBytes(webpStats.size)} (-${webpReduction}%)`);
        
        console.log('\n🔍 Résultats dans le dossier: test-optimization/');
        console.log('👁️  Ouvrez et comparez visuellement les images');
        console.log('📝 Si la qualité vous convient, on peut optimiser toutes vos images !');
        
    } catch (error) {
        console.error('❌ Erreur:', error.message);
        console.log('💡 Vérifiez que le dossier public/ressource contient des images');
    }
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

if (require.main === module) {
    testSingleImage().catch(console.error);
}