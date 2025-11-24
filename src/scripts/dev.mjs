import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function dev() {
    const distDir = path.join(__dirname, '..', '..', 'dist');

    const server = http.createServer((req, res) => {
        const filePath = path.join(distDir, req.url === '/' ? 'index.html' : req.url);

        // Get content type based on file extension

        const ext = path.extname(filePath);
        const contentTypes = {
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'text/javascript',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.svg': 'image/svg+xml',
            '.woff': 'font/woff',
            '.woff2': 'font/woff2',
        };

        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end('404 Not Found');
            } else {
                const contentType = contentTypes[ext] || 'text/plain';
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(data);
            }
        });
    });

    server.listen(3000, () => {
        console.log('🚀 Dev server started');
        console.log('📡 Server running at http://localhost:3000');
    });
}

dev();