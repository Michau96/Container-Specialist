import express from 'express';
import path from 'path';
import http from 'http';
import { spawn, ChildProcess } from 'child_process';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;
const PYTHON_PORT = 5001;

let pythonProcess: ChildProcess | null = null;

function startPythonBackend() {
  const scriptPath = path.join(process.cwd(), 'backend', 'app.py');
  console.log(`[Node Server] Launching Python backend: python3 ${scriptPath} ${PYTHON_PORT}`);

  try {
    pythonProcess = spawn('python3', [scriptPath, String(PYTHON_PORT)], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env, PYTHON_PORT: String(PYTHON_PORT) },
    });

    pythonProcess.stdout?.on('data', (data) => {
      console.log(`[Python] ${data.toString().trim()}`);
    });

    pythonProcess.stderr?.on('data', (data) => {
      console.error(`[Python Err] ${data.toString().trim()}`);
    });

    pythonProcess.on('close', (code) => {
      console.log(`[Python] exited with code ${code}. Restarting in 2s...`);
      setTimeout(startPythonBackend, 2000);
    });
  } catch (err) {
    console.error('[Node Server] Failed to spawn python process:', err);
  }
}

// Start Python daemon
startPythonBackend();

// Graceful cleanup
process.on('SIGINT', () => {
  if (pythonProcess) pythonProcess.kill();
  process.exit(0);
});
process.on('SIGTERM', () => {
  if (pythonProcess) pythonProcess.kill();
  process.exit(0);
});

// Middleware for parsing JSON
app.use(express.json());

// Proxy API requests to Python Backend
app.all('/api/*', (req, res) => {
  const pythonUrl = `http://127.0.0.1:${PYTHON_PORT}${req.originalUrl}`;
  const parsedUrl = new URL(pythonUrl);

  const postData = req.method !== 'GET' && req.method !== 'HEAD' && req.body ? JSON.stringify(req.body) : null;

  const headers: http.OutgoingHttpHeaders = {
    ...req.headers,
    host: `127.0.0.1:${PYTHON_PORT}`,
  };

  if (postData) {
    headers['content-type'] = 'application/json';
    headers['content-length'] = Buffer.byteLength(postData);
  }

  const options: http.RequestOptions = {
    hostname: parsedUrl.hostname,
    port: parsedUrl.port,
    path: parsedUrl.pathname + parsedUrl.search,
    method: req.method,
    headers,
    timeout: 6000,
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (err) => {
    console.error('[Proxy Error to Python]', err.message);
    if (!res.headersSent) {
      res.status(503).json({
        error: 'Python Backend starting up, please wait a moment.',
        details: err.message,
      });
    }
  });

  proxyReq.on('timeout', () => {
    proxyReq.destroy();
    if (!res.headersSent) {
      res.status(504).json({ error: 'Gateway Timeout to Python Backend' });
    }
  });

  if (postData) {
    proxyReq.write(postData);
  }
  proxyReq.end();
});

async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Express] Balkonowy Ogród listening on http://0.0.0.0:${PORT}`);
  });
}

start();
