import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import fs from 'fs';

const jsonApiPlugin = {
  name: 'json-api-server',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.method === 'POST' && req.url && req.url.startsWith('/api/save/')) {
        const fileType = req.url.replace('/api/save/', '');
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
          try {
            let filePath = '';
            if (fileType === 'products') {
              filePath = path.resolve(__dirname, 'public/products.json');
            } else if (fileType === 'cosmetics') {
              filePath = path.resolve(__dirname, 'public/cosmetics.json');
            } else if (fileType === 'offers') {
              filePath = path.resolve(__dirname, 'public/offers.json');
            } else {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Invalid file' }));
              return;
            }
            fs.writeFileSync(filePath, body, 'utf8');
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true }));
          } catch (e) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: e.message }));
          }
        });
      } else {
        next();
      }
    });
  }
};

export default defineConfig(({mode}) => {
  return {
    plugins: [react(), tailwindcss(), jsonApiPlugin],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
  };
});
