import express from "express";
import build from "./build.mjs";
import compression from "compression";

build();

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
    console.log("Server running on http://localhost:3000");
  });
}

createDevelopmentServer();
