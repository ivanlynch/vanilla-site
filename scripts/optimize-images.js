const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

/**
 * Parsea los breakpoints de CSS del archivo styles.css
 * Lee las variables CSS --breakpoint-* y retorna los tamaños de imagen a generar
 */
function readBreakpointsFromCSS() {
    const stylesPath = path.join(__dirname, '..', 'src', 'styles.css');
    const cssContent = fs.readFileSync(stylesPath, 'utf-8');

    // Extraer las variables de breakpoint del CSS
    const breakpoints = {};

    // Regex para encontrar --breakpoint-{size}: {value}px;
    // Captura cualquier nombre de breakpoint
    const breakpointRegex = /--breakpoint-([a-z0-9]+):\s*(\d+)px;/g;
    let match;

    while ((match = breakpointRegex.exec(cssContent)) !== null) {
        const [, size, value] = match;
        breakpoints[size] = parseInt(value, 10);
    }

    console.log('📐 Breakpoints detected from CSS:');

    // Generar tamaños de imagen dinámicamente basados en los breakpoints encontrados
    const sizes = Object.entries(breakpoints).map(([name, value]) => {
        return value;
    });

    return sizes;
}

/**
 * Optimiza una imagen generando múltiples tamaños en WebP y PNG
 */
async function optimizeImage(inputPath, outputDir, sizes) {
    const basename = path.basename(inputPath, path.extname(inputPath));
    const stats = fs.statSync(inputPath);
    const originalSizeKB = (stats.size / 1024).toFixed(2);

    console.log(`\n🖼️  Processing: ${path.basename(inputPath)} (${originalSizeKB} KB)`);

    let totalSaved = 0;

    for (const size of sizes) {
        // Generar versión WebP
        const webpOutput = path.join(outputDir, `${basename}-${size}.webp`);
        if (!fs.existsSync(webpOutput)) {
            await sharp(inputPath)
                .resize(size, size, {
                    fit: 'cover',
                    position: 'center'
                })
                .webp({ quality: 85 })
                .toFile(webpOutput);
        }

        const webpStats = fs.statSync(webpOutput);
        const webpSizeKB = (webpStats.size / 1024).toFixed(2);

        // Generar versión PNG
        const pngOutput = path.join(outputDir, `${basename}-${size}.png`);
        if (!fs.existsSync(pngOutput)) {
            await sharp(inputPath)
                .resize(size, size, {
                    fit: 'cover',
                    position: 'center'
                })
                .png({ quality: 90 })
                .toFile(pngOutput);
        }

        const pngStats = fs.statSync(pngOutput);
        const pngSizeKB = (pngStats.size / 1024).toFixed(2);

        const saved = ((1 - (webpStats.size / pngStats.size)) * 100).toFixed(0);
        totalSaved += pngStats.size - webpStats.size;

        console.log(`   ✓ ${size}px: WebP ${webpSizeKB} KB | PNG ${pngSizeKB} KB (WebP saves ${saved}%)`);
    }

    const totalSavedKB = (totalSaved / 1024).toFixed(2);
    console.log(`   💾 Total saved with WebP: ${totalSavedKB} KB`);
}

/**
 * Procesa todas las imágenes en el directorio de origen
 */
async function optimizeAllImages() {
    console.log('🚀 Starting image optimization...\n');

    const srcImagesDir = path.join(__dirname, '..', 'src', 'assets', 'images');
    const cacheImagesDir = path.join(__dirname, '..', '.cache', 'images');
    const publicImagesDir = path.join(__dirname, '..', 'src', 'public', 'assets', 'images');

    // Crear directorios si no existen
    if (!fs.existsSync(cacheImagesDir)) {
        fs.mkdirSync(cacheImagesDir, { recursive: true });
    }
    if (!fs.existsSync(publicImagesDir)) {
        fs.mkdirSync(publicImagesDir, { recursive: true });
    }

    // Leer breakpoints del CSS
    const sizes = readBreakpointsFromCSS();

    // Obtener todas las imágenes PNG y JPG
    const imageFiles = fs.readdirSync(srcImagesDir)
        .filter(file => /\.(png|jpg|jpeg)$/i.test(file));

    if (imageFiles.length === 0) {
        console.log('⚠️  No images found in src/assets/images/');
        return;
    }

    console.log(`📦 Found ${imageFiles.length} image(s) to optimize\n`);

    // Procesar cada imagen (generar en caché)
    for (const file of imageFiles) {
        const inputPath = path.join(srcImagesDir, file);
        await optimizeImage(inputPath, cacheImagesDir, sizes);
    }

    // Copiar imágenes desde caché a public (Vite las copiará a dist)
    console.log('📋 Copying optimized images to public...');
    const optimizedFiles = fs.readdirSync(cacheImagesDir);
    for (const file of optimizedFiles) {
        fs.copyFileSync(
            path.join(cacheImagesDir, file),
            path.join(publicImagesDir, file)
        );
    }

    console.log('\n✨ Image optimization completed!\n');
}

// Exportar para uso en build.js
module.exports = { optimizeAllImages };

// Permitir ejecución directa
if (require.main === module) {
    optimizeAllImages().catch(error => {
        console.error('❌ Error during image optimization:', error);
        process.exit(1);
    });
}
