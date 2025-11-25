const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

/**
 * Parsea los breakpoints de CSS del archivo styles.css
 * Lee las variables CSS --breakpoint-* y retorna los tamaños de imagen a generar
 */
function readBreakpointsFromCSS() {
    const stylesPath = path.join(__dirname, '..', 'styles.css');
    const cssContent = fs.readFileSync(stylesPath, 'utf-8');

    // Extraer las variables de breakpoint del CSS
    const breakpoints = {
        sm: null,
        md: null,
        lg: null,
        '2xl': null
    };

    // Regex para encontrar --breakpoint-{size}: {value}px;
    const breakpointRegex = /--breakpoint-(sm|md|lg|2xl):\s*(\d+)px;/g;
    let match;

    while ((match = breakpointRegex.exec(cssContent)) !== null) {
        const [, size, value] = match;
        breakpoints[size] = parseInt(value, 10);
    }

    // Mapear los breakpoints a tamaños de imagen
    // Usamos valores ligeramente menores que los breakpoints para optimizar
    const imageSizes = {
        mobile: breakpoints.sm ? breakpoints.sm - 1 : 480,      // 480px (de 481px)
        tablet: breakpoints.md ? breakpoints.md - 1 : 600,      // 600px (de 601px)
        desktop: breakpoints.lg ? Math.round(breakpoints.lg * 1.04) : 800, // 800px (de 769px)
        retina: breakpoints['2xl'] ? Math.round(breakpoints['2xl'] * 1.25) : 1600 // 1600px (de 1281px, x2 para retina)
    };

    console.log('📐 Breakpoints detected from CSS:');
    console.log(`   Mobile: ${imageSizes.mobile}px (from --breakpoint-sm: ${breakpoints.sm}px)`);
    console.log(`   Tablet: ${imageSizes.tablet}px (from --breakpoint-md: ${breakpoints.md}px)`);
    console.log(`   Desktop: ${imageSizes.desktop}px (from --breakpoint-lg: ${breakpoints.lg}px)`);
    console.log(`   Retina: ${imageSizes.retina}px (from --breakpoint-2xl: ${breakpoints['2xl']}px)\n`);

    return Object.values(imageSizes);
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
        await sharp(inputPath)
            .resize(size, size, {
                fit: 'cover',
                position: 'center'
            })
            .webp({ quality: 85 })
            .toFile(webpOutput);

        const webpStats = fs.statSync(webpOutput);
        const webpSizeKB = (webpStats.size / 1024).toFixed(2);

        // Generar versión PNG
        const pngOutput = path.join(outputDir, `${basename}-${size}.png`);
        await sharp(inputPath)
            .resize(size, size, {
                fit: 'cover',
                position: 'center'
            })
            .png({ quality: 90 })
            .toFile(pngOutput);

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

    const srcImagesDir = path.join(__dirname, '..', 'assets', 'images');
    const distImagesDir = path.join(__dirname, '..', '..', 'dist', 'assets', 'images');

    // Crear directorio de salida si no existe
    if (!fs.existsSync(distImagesDir)) {
        fs.mkdirSync(distImagesDir, { recursive: true });
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

    // Procesar cada imagen
    for (const file of imageFiles) {
        const inputPath = path.join(srcImagesDir, file);
        await optimizeImage(inputPath, distImagesDir, sizes);
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
