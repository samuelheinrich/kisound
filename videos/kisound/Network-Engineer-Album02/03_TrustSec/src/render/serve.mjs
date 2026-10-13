// Tiny static file server for the render page (the film folder is the web root).
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.ttf': 'font/ttf', '.svg': 'image/svg+xml', '.png': 'image/png', '.wav': 'audio/wav', '.jpg': 'image/jpeg' };

export function startServer(port = 0) {
  return new Promise((resolve) => {
    const srv = http.createServer((req, res) => {
      const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      const f = path.join(root, p === '/' ? '/src/render/index.html' : p);
      if (!f.startsWith(root) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(p === '/favicon.ico' ? 204 : 404); return res.end(); }
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      fs.createReadStream(f).pipe(res);
    });
    srv.listen(port, '127.0.0.1', () => resolve(srv));
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = +(process.argv.slice(2).find((a) => /^\d+$/.test(a)) || 8124);
  startServer(port).then(() => {
    const url = `http://127.0.0.1:${port}/`;
    console.log(`Player: ${url}   (Optionen: ?res=720|1080|1440  ·  Einzelbild: ?w=1920&h=1080&t=12.5)   Beenden: Ctrl+C`);
    if (process.argv.includes('--open')) {
      const chrome = '/Applications/Google Chrome.app';
      spawn('open', fs.existsSync(chrome) ? ['-a', 'Google Chrome', url] : [url], { stdio: 'ignore', detached: true }).unref();
    }
  });
}
