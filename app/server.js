const http = require('http');
const fs = require('fs');
const os = require('os');

const server = http.createServer((req, res) => {
    if (req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            hostname: os.hostname(),
            uptime: process.uptime()
        }));
        return;
    }

    fs.readFile('index.html', (err, data) => {
        if (err) {
            res.writeHead(500);
            res.end('Error loading page');
        } else {
            // Replace hostname in the HTML
            const html = data.toString().replace(/\$\（hostname\）/g, os.hostname());
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(html);
        }
    });
});

const PORT = 8081;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Container hostname: ${os.hostname()}`);
});