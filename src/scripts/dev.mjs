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
            '.webp': 'image/webp',
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

                // Set cache headers based on file type
                const headers = { 'Content-Type': contentType };

                // Immutable assets (fonts, images) - cache for 1 year
                if (['.woff', '.woff2', '.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif', '.ico'].includes(ext)) {
                    headers['Cache-Control'] = 'public, max-age=31536000, immutable';
                }
                // CSS and JS - cache but revalidate
                else if (['.css', '.js'].includes(ext)) {
                    headers['Cache-Control'] = 'public, max-age=3600, must-revalidate';
                }
                // HTML - no cache (always fresh)
                else if (ext === '.html') {
                    headers['Cache-Control'] = 'no-cache';
                }

                res.writeHead(200, headers);
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