import express from 'express';
import path from 'path';
import http from 'http';
import { spawn, ChildProcess } from 'child_process';
import { createServer as createViteServer } from 'vite';
import { createAuthRouter } from './server/auth';
import { createApiRouter } from './server/apiRouter';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const PYTHON_PORT = 5001;

let pythonProcess: ChildProcess | null = null;
let pythonFailed = false;

function startPythonBackend() {
  const scriptPath = path.join(process.cwd(), 'backend', 'app.py');
  console.log(`[Node Server] Launching Python backend: python3 ${scriptPath} ${PYTHON_PORT}`);

  try {
    pythonProcess = spawn('python3', [scriptPath, String(PYTHON_PORT)], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env, PYTHON_PORT: String(PYTHON_PORT) },
    });

    pythonProcess.on('error', (err) => {
      console.error('[Node Server] Python process error (python3 might not be in container):', err.message);
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
      if (!pythonFailed && code !== 0) {
        // Attempt single restart after 5s if not failed via ENOENT
        setTimeout(() => {
          if (!pythonFailed) startPythonBackend();
        }, 5000);
      }
    });
  } catch (err) {
    console.error('[Node Server] Failed to spawn python process:', err);
    pythonFailed = true;
    pythonProcess = null;
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
