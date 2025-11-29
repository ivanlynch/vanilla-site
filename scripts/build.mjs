import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "fs";
import * as Utils from "./utils.mjs";
import postcss from "postcss";
import cssnano from "cssnano";

export default async function build() {
  const currentFilePath = fileURLToPath(import.meta.url);
  const currentDirPath = path.dirname(currentFilePath);
  const projectRootDir = path.dirname(currentDirPath, 2);

  const distDir = path.join(projectRootDir, "dist");
  const pagesDir = path.join(projectRootDir, "src", "pages");
  const assetsDir = path.join(projectRootDir, "src", "assets");
  const imagesDir = path.join(projectRootDir, "src", "assets", "images");

  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true });
  }

  fs.mkdirSync(distDir, { recursive: true });

  await copyDirContents(pagesDir, distDir);
  await copyDirContents(assetsDir, path.join(distDir, "assets"));

  await optimizeImages(imagesDir);

  console.log("🎨 Optimizing CSS...");
  const cssSrc = path.join(projectRootDir, "src", "styles.css");

  const pagesFiles = fs
    .readdirSync(pagesDir)
    .filter((file) => file.endsWith(".html"));

  for (const file of pagesFiles) {
    const optimizedCss = await Utils.extractOnlyUserCSSForHTML(
      cssSrc,
      path.join(pagesDir, file)
    );
    const minifiedCss = await minifyCss(optimizedCss);
    await injectInlineCSS(path.join(distDir, file), minifiedCss);
    await removeStylesheetsFromHTML(path.join(distDir, file));
  }

  console.log("✨ CSS optimization completed!");
}

async function copyDirContents(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true });

  const entries = fs.readdirSync(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const src = path.join(srcDir, entry.name);
    const dest = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      await copyDirContents(src, dest);
    } else if (entry.isFile()) {
      fs.copyFileSync(src, dest);
    }
  }
}

async function optimizeImages(imagesDir) {
  console.log("🚀 Starting image optimization...\n");

  const cacheImagesDir = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "..",
    ".cache",
    "images"
  );
  const publicImagesDir = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "..",
    "dist",
    "assets",
    "images"
  );

  // Crear directorios si no existen
  if (!fs.existsSync(cacheImagesDir)) {
    fs.mkdirSync(cacheImagesDir, { recursive: true });
  }

  // Leer breakpoints del CSS
  const sizes = Utils.readBreakpointsFromCSS();

  // Obtener todas las imágenes PNG y JPG actuales
  const imageFiles = fs
    .readdirSync(imagesDir)
    .filter((file) => /\.(png|jpg|jpeg)$/i.test(file));

  // Limpiar imágenes optimizadas huérfanas del caché
  // (aquellas cuya imagen fuente ya no existe)
  if (fs.existsSync(cacheImagesDir)) {
    const cachedFiles = fs.readdirSync(cacheImagesDir);
    const validBasenames = new Set(
      imageFiles.map((file) => path.basename(file, path.extname(file)))
    );

    for (const cachedFile of cachedFiles) {
      // Extraer el basename original del archivo optimizado
      // Formato: basename-size.webp o basename-size.png
      const match = cachedFile.match(/^(.+)-\d+\.(webp|png)$/);
      if (match) {
        const basename = match[1];
        if (!validBasenames.has(basename)) {
          const orphanedFile = path.join(cacheImagesDir, cachedFile);
          fs.unlinkSync(orphanedFile);
          console.log(`🗑️  Removed orphaned cache file: ${cachedFile}`);
        }
      }
    }
  }

  // Limpiar directorio public
  fs.rmSync(publicImagesDir, { recursive: true, force: true });
  fs.mkdirSync(publicImagesDir, { recursive: true });

  if (imageFiles.length === 0) {
    console.log("⚠️  No images found in src/assets/images/");
    return;
  }

  console.log(`📦 Found ${imageFiles.length} image(s) to optimize\n`);

  // Procesar cada imagen (generar en caché)
  for (const file of imageFiles) {
    const inputPath = path.join(imagesDir, file);
    await Utils.optimizeImage(inputPath, cacheImagesDir, sizes);
  }

  // Copiar imágenes desde caché a public (Vite las copiará a dist)
  console.log("📋 Copying optimized images to public...");
  const optimizedFiles = fs.readdirSync(cacheImagesDir);
  for (const file of optimizedFiles) {
    fs.copyFileSync(
      path.join(cacheImagesDir, file),
      path.join(publicImagesDir, file)
    );
  }

  console.log("\n✨ Image optimization completed!\n");
}

async function minifyCss(cssCode) {
  const result = await postcss([
    cssnano({
      preset: [
        "default",
        {
          discardComments: { removeAll: true },
          normalizeWhitespace: true,
        },
      ],
    }),
  ]).process(cssCode, { from: undefined });
  return result.css;
}

async function injectInlineCSS(htmlFile, cssCode) {
  const htmlContent = fs.readFileSync(htmlFile, "utf-8");
  const newHtmlContent = htmlContent.replace(
    /<\/head>/,
    `<style>${cssCode}</style>
    </head>`
  );
  fs.writeFileSync(htmlFile, newHtmlContent);
}

async function removeStylesheetsFromHTML(htmlFile) {
  const htmlContent = fs.readFileSync(htmlFile, "utf-8");
  const newHtmlContent = htmlContent.replace(
    /<link rel="stylesheet" href=".*?"\s*\/?>/g,
    ""
  );
  fs.writeFileSync(htmlFile, newHtmlContent);
}
