const fs = require('fs');
const path = require('path');
const { optimizeAllImages } = require('./optimize-images');

const srcDir = path.join(__dirname, '..');
const distDir = path.join(__dirname, '..', '..', 'dist');

/**
 * Lee el contenido de un archivo
 */
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return '';
  }
}

/**
 * Reemplaza los placeholders <!-- path/to/file --> con el contenido real
 */
function replaceComponents(html) {
  const placeholderRegex = /<!--\s*([a-zA-Z0-9/_-]+)\s*-->/g;

  return html.replace(placeholderRegex, (match, filePath) => {
    const fullPath = path.join(srcDir, `${filePath}.html`);
    const content = readFile(fullPath);

    if (content) {
      console.log(`  ✓ Injected: ${filePath}.html`);
      return content;
    } else {
      console.warn(`  ⚠ Warning: Could not find ${filePath}.html`);
      return match; // Mantener el placeholder si no se encuentra el archivo
    }
  });
}

/**
 * Copia recursivamente archivos y directorios
 */
function copyDirectory(src, dest, exclude = []) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    // Skip excluded directories
    if (exclude.includes(entry.name)) {
      continue;
    }

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath, exclude);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Construye una página HTML completa
 */
function buildPage(templateContent, pageFile, outputFileName) {
  console.log(`\nBuilding ${outputFileName}...`);

  // Reemplazar el placeholder de la página con su contenido
  let html = templateContent.replace(
    /<!--\s*pages\/[a-zA-Z0-9/_-]+\s*-->/,
    `<!-- pages/${pageFile} -->`
  );

  // Reemplazar todos los placeholders con el contenido real
  html = replaceComponents(html);

  // Escribir el archivo de salida
  const outputPath = path.join(distDir, outputFileName);
  fs.writeFileSync(outputPath, html, 'utf-8');
  console.log(`✅ Created: ${outputFileName}`);
}

/**
 * Script principal de build
 */
async function build() {
  console.log('🚀 Starting build process...\n');

  // Limpiar y crear directorio dist
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true });
    console.log('🗑️  Cleaned dist directory');
  }
  fs.mkdirSync(distDir, { recursive: true });

  // Leer el template base (index.html)
  const templatePath = path.join(srcDir, 'index.html');
  const templateContent = readFile(templatePath);

  if (!templateContent) {
    console.error('❌ Error: Could not read template file');
    process.exit(1);
  }

  // Obtener todas las páginas en src/pages/
  const pagesDir = path.join(srcDir, 'pages');
  let pages = [];

  if (fs.existsSync(pagesDir)) {
    pages = fs.readdirSync(pagesDir)
      .filter(file => file.endsWith('.html'))
      .map(file => file.replace('.html', ''));
  }

  // Generar index.html (página home)
  buildPage(templateContent, 'home', 'index.html');

  // Generar una página por cada archivo en src/pages/ (excepto home)
  pages.forEach(pageName => {
    if (pageName !== 'home') {
      buildPage(templateContent, pageName, `${pageName}.html`);
    }
  });

  // Optimizar imágenes antes de copiar assets
  console.log('\n');
  await optimizeAllImages();

  // Copiar assets al directorio dist
  const assetsDir = path.join(srcDir, 'assets');
  if (fs.existsSync(assetsDir)) {
    const destAssetsDir = path.join(distDir, 'assets');
    copyDirectory(assetsDir, destAssetsDir);
    console.log('\n📦 Copied assets directory');
  }

  // Copiar y minificar styles.css
  const stylesPath = path.join(srcDir, 'styles.css');
  if (fs.existsSync(stylesPath)) {
    let cssContent = fs.readFileSync(stylesPath, 'utf-8');
    // Minificación simple: eliminar comentarios y espacios innecesarios
    cssContent = cssContent
      .replace(/\/\*[\s\S]*?\*\//g, '') // Eliminar comentarios
      .replace(/\s+/g, ' ') // Colapsar espacios
      .replace(/\s*([{}:;,])\s*/g, '$1') // Eliminar espacios alrededor de caracteres especiales
      .trim();

    fs.writeFileSync(path.join(distDir, 'styles.css'), cssContent);
    console.log('📦 Copied and minified styles.css');
  }

  // Copiar index.js si existe
  const indexJsPath = path.join(srcDir, 'index.js');
  if (fs.existsSync(indexJsPath)) {
    fs.copyFileSync(indexJsPath, path.join(distDir, 'index.js'));
    console.log('📦 Copied index.js');
  }

  console.log('\n✨ Build completed successfully!\n');
}

// Ejecutar el build
build().catch(error => {
  console.error('❌ Build failed:', error);
  process.exit(1);
});
