import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser for JSON
  app.use(express.json());

  // Logging middleware
  app.use((req, res, next) => {
    console.log(`[HTTP] ${req.method} ${req.url}`);
    next();
  });

  // Generic Proxy Route for Kie AI API to prevent CORS & 404
  app.all('/api/v1/*', async (req, res) => {
    const subPath = req.params[0] || '';
    const queryParams = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';
    const targetUrl = `https://api.kie.ai/api/v1/${subPath}${queryParams}`;

    console.log(`[Proxy] Routing ${req.method} request to target: ${targetUrl}`);

    const authHeader = req.headers['authorization'];
    const headers: Record<string, string> = {
      'Content-Type': req.headers['content-type']?.toString() || 'application/json',
    };

    // Clean client-sent Authorization to see if it contains an actual key
    const clientAuthToken = authHeader ? authHeader.toString().trim() : '';
    const hasValidKey = clientAuthToken && 
                         clientAuthToken !== 'Bearer' && 
                         clientAuthToken !== 'Bearer null' && 
                         clientAuthToken !== 'Bearer undefined' && 
                         clientAuthToken !== 'Bearer ';

    if (hasValidKey) {
      headers['Authorization'] = clientAuthToken;
      console.log(`[Proxy] Using client-provided Authorization header.`);
    } else if (process.env.VITE_KIE_API_KEY) {
      headers['Authorization'] = `Bearer ${process.env.VITE_KIE_API_KEY}`;
      console.log(`[Proxy] Client Auth was empty or invalid. Injecting server-side VITE_KIE_API_KEY.`);
    } else {
      console.warn(`[Proxy] Warning: No authorization key detected from client OR server environment.`);
    }

    try {
      const fetchOptions: any = {
        method: req.method,
        headers,
      };

      if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
        fetchOptions.body = JSON.stringify(req.body);
      }

      const response = await fetch(targetUrl, fetchOptions);
      const text = await response.text();

      // Log details to proxy_logs.txt
      try {
        const logMsg = `\n--- [${new Date().toISOString()}] ---\n` +
                       `Request: ${req.method} ${req.url}\n` +
                       `Target: ${targetUrl}\n` +
                       `Request Body: ${JSON.stringify(req.body)}\n` +
                       `Headers Sent: ${JSON.stringify(headers)}\n` +
                       `Response Status: ${response.status}\n` +
                       `Response Body: ${text}\n`;
        fs.appendFileSync(path.join(process.cwd(), 'proxy_logs.txt'), logMsg);
      } catch (logErr) {
        console.error('Failed to write proxy log file:', logErr);
      }

      // Copy response status and send body back to SPA client
      res.status(response.status);
      res.setHeader('Content-Type', response.headers.get('content-type') || 'application/json');
      res.send(text);
    } catch (error: any) {
      console.error('[Proxy Error]', error);
      res.status(500).json({ error: 'Proxy Request Failed', details: error.message });
    }
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
