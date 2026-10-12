import express from 'express';
import path from 'path';
import http from 'http';
import { spawn, ChildProcess } from 'child_process';
import { createServer as createViteServer } from 'vite';
import { createAuthRouter } from './server/auth';
import { createApiRouter } from './server/apiRouter';

const app = express();

function resolvePort(): number {
  const portArgIndex = process.argv.findIndex((arg) => arg === '--port' || arg === '-p');
  if (portArgIndex !== -1 && process.argv[portArgIndex + 1]) {
    const val = parseInt(process.argv[portArgIndex + 1], 10);
    if (!isNaN(val)) return val;
  }
  if (process.env.DEFAULT_APP_PORT) {
    const val = parseInt(process.env.DEFAULT_APP_PORT, 10);
    if (!isNaN(val)) return val;
  }
  // In the AI Studio container, Nginx listens on 8080 and proxies traffic to 3000.
  // Never bind Node.js to 8080 if Nginx is present; always bind to 3000.
  if (process.env.PORT && process.env.PORT !== '8080') {
    const val = parseInt(process.env.PORT, 10);
    if (!isNaN(val)) return val;
  }
  return 3000;
}

const PORT = resolvePort();
const PYTHON_PORT = 5001;

let pythonProcess: ChildProcess | null = null;
let pythonFailed = false;

function checkPortInUse(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const req = http.get(`http://127.0.0.1:${port}/api/health`, { timeout: 800 }, () => {
      resolve(true);
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function startPythonBackend() {
  const isAlreadyUp = await checkPortInUse(PYTHON_PORT);
  if (isAlreadyUp) {
    console.log(`[Node Server] Python backend is already active on port ${PYTHON_PORT}.`);
    return;
  }

  const scriptPath = path.join(process.cwd(), 'backend', 'app.py');
  console.log(`[Node Server] Launching Python backend: python3 ${scriptPath} ${PYTHON_PORT}`);

  try {
    pythonProcess = spawn('python3', [scriptPath, String(PYTHON_PORT)], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env, PYTHON_PORT: String(PYTHON_PORT) },
    });

    pythonProcess.on('error', (err) => {
      console.warn('[Node Server] Python process spawn error (node-native API will handle all requests):', err.message);
      pythonFailed = true;
      pythonProcess = null;
    });

    pythonProcess.stdout?.on('data', (data) => {
      console.log(`[Python] ${data.toString().trim()}`);
    });

    pythonProcess.stderr?.on('data', (data) => {
      console.error(`[Python Err] ${data.toString().trim()}`);
    });

    pythonProcess.on('close', (code) => {
      console.log(`[Python] exited with code ${code}.`);
      pythonProcess = null;
    });
  } catch (err) {
    console.warn('[Node Server] Failed to spawn python process (node-native API active):', err);
    pythonFailed = true;
    pythonProcess = null;
  }
}

// Start Python daemon asynchronously
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

// Authentication and user balcony settings API
app.use('/api/auth', createAuthRouter());

// Native Node.js gardening API (recommendations, calendar, weather, plants, regions)
// Guarantees zero-dependency, ultra-fast responses in production deployment (Cloud Run) without Python
app.use('/api', createApiRouter());

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', python: pythonProcess !== null });
});

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
  const httpServer = http.createServer(app);

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR === 'true' ? false : { server: httpServer },
      },
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

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`[Express] Balkonowy Ogród listening on http://0.0.0.0:${PORT}`);
  });
}

start();
