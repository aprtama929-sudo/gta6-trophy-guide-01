// shots.mjs — take the entry's screenshots with headless Chrome.
//
// Serves app/ from a small static server written for this tool, drives the
// Chrome headless shell over the DevTools protocol (Node's built-in
// WebSocket; no dependencies), loads each scene from shots.json with the
// deterministic ?seed= demo state, waits for the app to signal
// window.__shotReady, and captures a JPEG. Quality starts at 85 and steps
// down until the file fits the 262,144-byte cap. Console errors, exceptions
// and error-level log entries from every scene are counted and reported;
// the tool exits non-zero if any appear.
//
//   CHROME_BIN=/path/to/chrome-headless-shell node tools/shots.mjs

import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const appDir = join(repoRoot, 'app');
const shotsDir = join(repoRoot, 'screenshots');
const scenes = JSON.parse(readFileSync(join(repoRoot, 'shots.json'), 'utf8'));
const chromeBin = process.env.CHROME_BIN || process.env.CHROME;
if (!chromeBin || !existsSync(chromeBin)) {
  console.error('shots: set CHROME or CHROME_BIN to the headless Chrome binary');
  process.exit(2);
}
const MAX_BYTES = 262144;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
};

function serveApp() {
  return new Promise((resolveServer) => {
    const server = createServer((req, res) => {
      let pathname;
      try {
        pathname = decodeURIComponent(new URL(req.url ?? '/', 'http://shots').pathname);
      } catch {
        res.writeHead(400).end('bad request');
        return;
      }
      if (pathname.endsWith('/')) pathname += 'index.html';
      const file = resolve(join(appDir, normalize(pathname)));
      if (file !== appDir && !file.startsWith(appDir + sep)) {
        res.writeHead(403).end('forbidden');
        return;
      }
      let body;
      try {
        body = readFileSync(file);
      } catch {
        res.writeHead(404).end('not found');
        return;
      }
      res.writeHead(200, {
        'content-type': MIME[extname(file).toLowerCase()] ?? 'application/octet-stream',
        'content-length': body.length,
        'cache-control': 'no-store',
      });
      res.end(body);
    });
    server.listen(0, '127.0.0.1', () => resolveServer(server));
  });
}

function launchChrome() {
  return new Promise((resolveLaunch, rejectLaunch) => {
    const profile = join(repoRoot, 'out-shots-profile');
    rmSync(profile, { recursive: true, force: true });
    const proc = spawn(chromeBin, [
      '--no-sandbox',
      '--disable-gpu',
      '--hide-scrollbars',
      '--remote-debugging-port=0',
      `--user-data-dir=${profile}`,
      '--window-size=1280,800',
      'about:blank',
    ], { stdio: ['ignore', 'ignore', 'pipe'] });
    let stderr = '';
    const timer = setTimeout(() => rejectLaunch(new Error('chrome did not announce DevTools in time')), 20000);
    proc.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
      const match = stderr.match(/DevTools listening on (ws:\/\/\S+)/);
      if (match) {
        clearTimeout(timer);
        resolveLaunch({ proc, wsUrl: match[1], profile });
      }
    });
    proc.on('error', rejectLaunch);
  });
}

// A minimal DevTools-protocol client: request/response by id, plus an event
// sink. Flatten-mode session messages carry a sessionId on the envelope.
class Cdp {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.nextId = 1;
    this.pending = new Map();
    this.listeners = [];
  }
  async open() {
    await new Promise((res, rej) => {
      this.ws.addEventListener('open', res, { once: true });
      this.ws.addEventListener('error', rej, { once: true });
    });
    this.ws.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve: res, reject: rej } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) rej(new Error(`${msg.error.message}`));
        else res(msg.result);
      } else if (msg.method) {
        for (const fn of this.listeners) fn(msg);
      }
    });
  }
  send(method, params = {}, sessionId) {
    const id = this.nextId++;
    const payload = { id, method, params };
    if (sessionId) payload.sessionId = sessionId;
    return new Promise((res, rej) => {
      this.pending.set(id, { resolve: res, reject: rej });
      this.ws.send(JSON.stringify(payload));
    });
  }
  on(fn) { this.listeners.push(fn); }
  close() { try { this.ws.close(); } catch { /* already gone */ } }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const server = await serveApp();
  const port = server.address().port;
  const { proc, wsUrl, profile } = await launchChrome();
  const errors = [];
  try {
    const cdp = new Cdp(wsUrl);
    await cdp.open();
    const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true });
    cdp.on((msg) => {
      if (msg.sessionId !== sessionId) return;
      if (msg.method === 'Runtime.exceptionThrown') {
        errors.push(`exception: ${msg.params.exceptionDetails?.text ?? 'unknown'}`);
      }
      if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
        errors.push('console.error from page');
      }
      if (msg.method === 'Log.entryAdded' && msg.params.entry.level === 'error') {
        errors.push(`log: ${msg.params.entry.text}`);
      }
    });
    await cdp.send('Page.enable', {}, sessionId);
    await cdp.send('Runtime.enable', {}, sessionId);
    await cdp.send('Log.enable', {}, sessionId);

    mkdirSync(shotsDir, { recursive: true });
    for (const name of readdirSync(shotsDir)) rmSync(join(shotsDir, name));

    for (const scene of scenes) {
      const { width, height } = scene.viewport;
      await cdp.send('Emulation.setDeviceMetricsOverride',
        { width, height, deviceScaleFactor: 1, mobile: false }, sessionId);
      const url = `http://127.0.0.1:${port}/${scene.seed ? '?seed=demo' : ''}${scene.hash ?? '#/'}`;
      await cdp.send('Page.navigate', { url }, sessionId);
      let ready = false;
      for (let i = 0; i < 150 && !ready; i++) {
        await sleep(100);
        const result = await cdp.send('Runtime.evaluate',
          { expression: 'window.__shotReady === true', returnByValue: true }, sessionId);
        ready = result?.result?.value === true;
      }
      if (!ready) throw new Error(`scene ${scene.file}: app never signalled __shotReady`);
      await sleep(300);
      let quality = 85;
      let bytes = null;
      while (quality >= 40) {
        const shot = await cdp.send('Page.captureScreenshot',
          { format: 'jpeg', quality, captureBeyondViewport: false }, sessionId);
        bytes = Buffer.from(shot.data, 'base64');
        if (bytes.length <= MAX_BYTES) break;
        quality -= 10;
      }
      if (!bytes || bytes.length > MAX_BYTES) {
        throw new Error(`scene ${scene.file}: cannot fit under ${MAX_BYTES} bytes`);
      }
      writeFileSync(join(shotsDir, scene.file), bytes);
      console.log(`${scene.file}: ${bytes.length} bytes (jpeg q${quality})`);
    }
    cdp.close();
  } finally {
    proc.kill('SIGKILL');
    rmSync(profile, { recursive: true, force: true });
    server.close();
  }
  if (errors.length) {
    console.error(`shots: ${errors.length} console/page error(s):`);
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }
  console.log('shots: 0 console errors');
}

main().catch((err) => {
  console.error(`shots: ${err.message}`);
  process.exit(1);
});
