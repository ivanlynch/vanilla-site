import fs from "fs";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";
import uncss from "uncss";
import { promisify } from "util";

const uncssAsync = promisify(uncss);

/**
 * Parsea los breakpoints de CSS del archivo styles.css
 * Lee las variables CSS --breakpoint-* y retorna los tamaños de imagen a generar
 */
function readBreakpointsFromCSS() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const stylesPath = path.join(__dirname, "..", "src", "styles.css");
  const cssContent = fs.readFileSync(stylesPath, "utf-8");

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

  console.log("📐 Breakpoints detected from CSS:");

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

  console.log(
    `\n🖼️  Processing: ${path.basename(inputPath)} (${originalSizeKB} KB)`
  );

  let totalSaved = 0;

  for (const size of sizes) {
    // Generar versión WebP
    const webpOutput = path.join(outputDir, `${basename}-${size}.webp`);
    if (!fs.existsSync(webpOutput)) {
      await sharp(inputPath)
        .resize(size, size, {
          fit: "cover",
          position: "center",
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
          fit: "cover",
          position: "center",
        })
        .png({ quality: 90 })
        .toFile(pngOutput);
    }

    const pngStats = fs.statSync(pngOutput);
    const pngSizeKB = (pngStats.size / 1024).toFixed(2);

    const saved = ((1 - webpStats.size / pngStats.size) * 100).toFixed(0);
    totalSaved += pngStats.size - webpStats.size;

    console.log(
      `   ✓ ${size}px: WebP ${webpSizeKB} KB | PNG ${pngSizeKB} KB (WebP saves ${saved}%)`
    );
  }

  const totalSavedKB = (totalSaved / 1024).toFixed(2);
  console.log(`   💾 Total saved with WebP: ${totalSavedKB} KB`);
}

/**
 * Esta función lee el archivo css y retorna solo el css que es usado en el html
 * Usa la librería uncss para analizar el HTML y filtrar el CSS
 */
async function extractOnlyUserCSSForHTML(cssFile, htmlFile) {
  const cssContent = fs.readFileSync(cssFile, "utf-8");
  const htmlContent = fs.readFileSync(htmlFile, "utf-8");

  const options = {
    raw: cssContent,
    banner: false,
    ignoreSheets: [/./], // Ignorar hojas de estilo linkeadas en el HTML, solo procesar el raw
  };

  try {
    // Pasamos el contenido HTML directamente para evitar errores de fetch en jsdom
    const output = await uncssAsync([htmlContent], options);
    return output;
  } catch (error) {
    console.error("Error running uncss:", error);
    throw error;
  }
}

export { optimizeImage, readBreakpointsFromCSS, extractOnlyUserCSSForHTML };
