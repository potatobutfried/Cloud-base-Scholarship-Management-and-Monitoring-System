import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    // Parse URL using modern WHATWG URL API
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    let pathname = parsedUrl.pathname;
    
    // Default to index.html
    if (pathname === '/') {
        pathname = '/index.html';
    }
    
    // Get file path
    const filePath = path.join(__dirname, pathname);
    
    // Check if file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // File not found
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/html');
            res.end(`
                <html>
                <head><title>404 Not Found</title></head>
                <body>
                    <h1>404 - File Not Found</h1>
                    <p>The requested file "${pathname}" was not found.</p>
                    <p><a href="/">Go to Homepage</a></p>
                </body>
                </html>
            `);
            return;
        }
        
        // Get file extension
        const ext = path.extname(filePath);
        const mimeType = mimeTypes[ext] || 'application/octet-stream';
        
        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        
        // Handle OPTIONS request
        if (req.method === 'OPTIONS') {
            res.statusCode = 200;
            res.end();
            return;
        }
        
        // Read and serve file
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'text/html');
                res.end('<h1>500 - Internal Server Error</h1>');
                return;
            }
            
            res.statusCode = 200;
            res.setHeader('Content-Type', mimeType);
            res.end(data);
        });
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📁 Serving files from: ${__dirname}`);
    console.log(`\n📋 Available pages:`);
    console.log(`   • Homepage: http://localhost:${PORT}/`);
    console.log(`   • Login: http://localhost:${PORT}/login.html`);
    console.log(`   • Apply: http://localhost:${PORT}/apply.html`);
    console.log(`   • Admin: http://localhost:${PORT}/admin.html`);
    console.log(`\n🛑 Press Ctrl+C to stop the server`);
});

// Handle server shutdown
process.on('SIGINT', () => {
    console.log('\n\n👋 Server shutting down...');
    server.close(() => {
        console.log('✅ Server stopped successfully');
        process.exit(0);
    });
});