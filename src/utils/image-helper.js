/**
 * Genera el markup HTML para una imagen responsive con múltiples formatos y tamaños
 * 
 * @param {string} imageName - Nombre base de la imagen (sin extensión)
 * @param {string} altText - Texto alternativo para la imagen
 * @param {string} cssClass - Clases CSS opcionales para aplicar
 * @returns {string} HTML markup del elemento <picture>
 * 
 * @example
 * // Genera markup para profile.png con responsive sizes
 * generateResponsiveImage('profile', 'Ivan Lynch', 'hero-avatar')
 */
function generateResponsiveImage(imageName, altText, cssClass = '') {
    // Tamaños generados por el build (basados en breakpoints CSS)
    const sizes = [480, 600, 800, 1600];

    // Generar srcset para WebP
    const webpSrcset = sizes
        .map(size => `assets/images/${imageName}-${size}.webp ${size}w`)
        .join(',\n            ');

    // Generar srcset para PNG
    const pngSrcset = sizes
        .map(size => `assets/images/${imageName}-${size}.png ${size}w`)
        .join(',\n            ');

    // Definir tamaños responsive basados en breakpoints CSS
    // Mobile (hasta 481px): 480px
    // Tablet (hasta 601px): 600px  
    // Desktop: 800px
    const sizesAttr = '(max-width: 481px) 480px, (max-width: 601px) 600px, 800px';

    const classAttr = cssClass ? ` class="${cssClass}"` : '';

    return `<picture>
  <source 
    type="image/webp"
    srcset="${webpSrcset}"
    sizes="${sizesAttr}">
  <source 
    type="image/png"
    srcset="${pngSrcset}"
    sizes="${sizesAttr}">
  <img src="assets/images/${imageName}-800.png" alt="${altText}"${classAttr}>
</picture>`;
}

// Exportar para uso en otros scripts si es necesario
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { generateResponsiveImage };
}
