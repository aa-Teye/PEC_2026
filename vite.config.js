import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import registrationsHandler from './api/registrations.js';
import attendanceHandler from './api/attendance.js';
import statsHandler from './api/stats.js';
import verifyHandler from './api/verify.js';
import initHandler from './api/init.js';
import sendSmsHandler from './api/send-sms.js';

function vercelServerlessPlugin(env) {
  return {
    name: 'vercel-serverless-local',
    configureServer(server) {
      Object.assign(process.env, env);

      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api/')) return next();

        const parsedUrl = new URL(req.url, 'http://localhost');
        const pathname = parsedUrl.pathname;
        const query = Object.fromEntries(parsedUrl.searchParams.entries());

        let body = {};
        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
          const buffers = [];
          for await (const chunk of req) {
            buffers.push(chunk);
          }
          const raw = Buffer.concat(buffers).toString();
          try {
            body = raw ? JSON.parse(raw) : {};
          } catch {
            body = raw;
          }
        }

        const vercelReq = Object.assign(req, { query, body });
        const vercelRes = {
          statusCode: 200,
          setHeader: (name, value) => res.setHeader(name, value),
          status(code) {
            this.statusCode = code;
            res.statusCode = code;
            return this;
          },
          json(data) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
          },
          send(data) {
            res.end(data);
          },
          end() {
            res.end();
          }
        };

        try {
          if (pathname === '/api/registrations') {
            await registrationsHandler(vercelReq, vercelRes);
          } else if (pathname === '/api/attendance') {
            await attendanceHandler(vercelReq, vercelRes);
          } else if (pathname === '/api/stats') {
            await statsHandler(vercelReq, vercelRes);
          } else if (pathname === '/api/verify') {
            await verifyHandler(vercelReq, vercelRes);
          } else if (pathname === '/api/init') {
            await initHandler(vercelReq, vercelRes);
          } else if (pathname === '/api/send-sms') {
            await sendSmsHandler(vercelReq, vercelRes);
          } else {
            next();
          }
        } catch (err) {
          console.error('[API Middleware Error]:', err);
          vercelRes.status(500).json({ error: err.message });
        }
      });
    }
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), vercelServerlessPlugin(env)],
    server: {
      port: 5174,
      host: '127.0.0.1'
    }
  };
});
