import fs from "fs";
import path from "path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Observa un directorio recursivamente y ejecuta un callback cuando hay cambios
 * @param {string} dir - Directorio a observar
 * @param {function} callback - Función a ejecutar cuando hay cambios (recibe filePath, eventType)
 * @returns {function} Función para cerrar todos los watchers
 */
export function watchDirectory(dir, callback) {
  const watchers = new Map();

  function watchRecursive(currentDir) {
    try {
      // Observar el directorio actual
      const watcher = fs.watch(
        currentDir,
        { recursive: false },
        (eventType, filename) => {
          if (filename) {
            const filePath = path.join(currentDir, filename);
            callback(filePath, eventType);
          }
        }
      );

      watchers.set(currentDir, watcher);

      // Leer subdirectorios y observarlos también
      const entries = fs.readdirSync(currentDir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const subDir = path.join(currentDir, entry.name);
          // Ignorar node_modules y otros directorios innecesarios
          if (!entry.name.startsWith(".") && entry.name !== "node_modules") {
            watchRecursive(subDir);
          }
        }
      }
    } catch (error) {
      // Ignorar errores de permisos o directorios que no se pueden leer
      if (error.code !== "EACCES" && error.code !== "ENOENT") {
        console.error(`Error watching ${currentDir}:`, error.message);
      }
    }
  }

  watchRecursive(dir);

  // Retornar función para cerrar todos los watchers
  return () => {
    for (const watcher of watchers.values()) {
      watcher.close();
    }
    watchers.clear();
  };
}

/**
 * Crea un watcher con debounce para evitar múltiples ejecuciones
 * @param {string} dir - Directorio a observar
 * @param {function} onChange - Función a ejecutar cuando hay cambios
 * @param {number} debounceMs - Tiempo de espera en milisegundos (default: 300)
 * @returns {function} Función para cerrar el watcher
 */
export function createDebouncedWatcher(dir, onChange, debounceMs = 300) {
  let timeout;
  let isProcessing = false;

  const handleChange = (filePath, eventType) => {
    // Limpiar timeout anterior
    clearTimeout(timeout);

    // Esperar antes de ejecutar (debounce)
    timeout = setTimeout(async () => {
      if (isProcessing) {
        return; // Ya hay un proceso en progreso
      }

      isProcessing = true;
      try {
        await onChange(filePath, eventType);
      } catch (error) {
        console.error("Error in onChange callback:", error);
      } finally {
        isProcessing = false;
      }
    }, debounceMs);
  };

  return watchDirectory(dir, handleChange);
}

/**
 * Crea un watcher para el directorio src/ que ejecuta el build automáticamente
 * @param {string} projectRoot - Ruta raíz del proyecto
 * @param {function} buildFn - Función de build a ejecutar
 * @returns {function} Función para cerrar el watcher
 */
export function watchSourceFiles(projectRoot, buildFn) {
  const srcDir = path.join(projectRoot, "src");

  return createDebouncedWatcher(srcDir, async (filePath) => {
    const relativePath = path.relative(projectRoot, filePath);
    console.log(`📝 File changed: ${relativePath}`);
    console.log("🔨 Rebuilding...");

    try {
      await buildFn();
      console.log("✅ Rebuild completed!\n");
    } catch (error) {
      console.error("❌ Build failed:", error.message);
    }
  });
}
