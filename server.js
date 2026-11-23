const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// Telegram sozlamalari (Backendda xavfsiz saqlanadi)
const TELEGRAM_BOT_TOKEN = "9047999050:AAG8Mdy2NpBBeTf_OfpOflgr54l96TGGdsc";
// Xabarlar borishi kerak bo'lgan barcha foydalanuvchilar Chat ID lari
const TELEGRAM_CHAT_IDS = [
    "8066680981", // 1-foydalanuvchi (@javlon_abdumannopov)
    "8955023942"  // 2-foydalanuvchi (@ooo_NURHAYO_textile)
];

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp'
};

const server = http.createServer((req, res) => {
    let reqUrl = decodeURI(req.url.split('?')[0]);

    // ==========================================
    // BACKEND API: /api/send (Telegramga xabar yuborish)
    // ==========================================
    if (req.method === 'POST' && reqUrl === '/api/send') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const messageText = data.message || '';

                if (!messageText) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ ok: false, description: 'Xabar matni bo\'sh' }));
                    return;
                }

                // Barcha ko'rsatilgan foydalanuvchilarga xabar yuborish
                const sendPromises = TELEGRAM_CHAT_IDS.map(chatId => {
                    return new Promise((resolve) => {
                        const postPayload = JSON.stringify({
                            chat_id: chatId,
                            text: messageText,
                            parse_mode: 'HTML'
                        });

                        const tgReq = https.request({
                            hostname: 'api.telegram.org',
                            port: 443,
                            path: `/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Content-Length': Buffer.byteLength(postPayload)
                            }
                        }, (tgRes) => {
                            let tgData = '';
                            tgRes.on('data', c => { tgData += c; });
                            tgRes.on('end', () => {
                                resolve({ chatId, statusCode: tgRes.statusCode, ok: tgRes.statusCode === 200 });
                            });
                        });

                        tgReq.on('error', (err) => {
                            console.error(`Telegram xatolik (${chatId}):`, err.message);
                            resolve({ chatId, statusCode: 500, ok: false, error: err.message });
                        });

                        tgReq.write(postPayload);
                        tgReq.end();
                    });
                });

                Promise.all(sendPromises).then(results => {
                    const hasSuccess = results.some(r => r.ok);
                    res.writeHead(hasSuccess ? 200 : 502, {
                        'Content-Type': 'application/json; charset=utf-8',
                        'Access-Control-Allow-Origin': '*'
                    });
                    res.end(JSON.stringify({ ok: hasSuccess, results }));
                });

            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ ok: false, description: 'Noto\'g\'ri JSON' }));
            }
        });
        return;
    }

    // CORS preflight OPTIONS
    if (req.method === 'OPTIONS' && reqUrl === '/api/send') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        res.end();
        return;
    }

    // ==========================================
    // STATIK FAYLLARNI UZATISH
    // ==========================================
    if (reqUrl === '/') reqUrl = '/index.html';
    
    // Resolve safe path inside current directory
    const safePath = path.normalize(reqUrl).replace(/^(\.\.[\/\\])+/, '');
    const filePath = path.join(__dirname, safePath);

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('404 Not Found');
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        res.writeHead(200, {
            'Content-Type': contentType,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        });
        fs.createReadStream(filePath).pipe(res);
    });
});

server.listen(PORT, '127.0.0.1', () => {
    console.log(`Server is running at http://localhost:${PORT}/`);
});
