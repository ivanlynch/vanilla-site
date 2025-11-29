import express from "express";
import build from "./build.mjs";
import compression from "compression";
import { watchSourceFiles } from "./watcher.mjs";
import path from "path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

// Build inicial
console.log("🔨 Building project...");
await build();
console.log("✅ Build completed!\n");

// Iniciar observación de archivos fuente
const closeWatchers = watchSourceFiles(projectRoot, build);

// Limpiar watchers al cerrar el proceso
process.on("SIGINT", () => {
  console.log("\n👋 Shutting down...");
  closeWatchers();
  process.exit(0);
});

function createDevelopmentServer() {
  const app = express();

  app.use(
    compression({
      threshold: 1024,
      level: 6,
      filter: (req, res) => {
        if (req.headers["x-no-compression"]) {
          return false;
        }
        return compression.filter(req, res);
      },
    })
  );

  app.use(express.static("dist"));

  return app.listen(3000, () => {
    console.log("🚀 Server running on http://localhost:3000");
    console.log("👀 Watching for changes in src/...\n");
  });
}

createDevelopmentServer();
