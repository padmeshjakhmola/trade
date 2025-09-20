import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

const importAPIHandler = async (filePath) => {
  try {
    const module = await import(filePath);
    return module.default;
  } catch (error) {
    console.error(`Error importing API handler: ${filePath}`, error);
    return null;
  }
};

app.all('/api/stocks/:id', async (req, res) => {
  const handler = await importAPIHandler('./api/stocks/[id].js');
  if (handler) {
    await handler(req, res);
  } else {
    res.status(500).json({ error: 'Handler not found' });
  }
});

app.all('/api/stocks', async (req, res) => {
  const handler = await importAPIHandler('./api/stocks.js');
  if (handler) {
    await handler(req, res);
  } else {
    res.status(500).json({ error: 'Handler not found' });
  }
});

app.all('/api/auth/:action', async (req, res) => {
  const handler = await importAPIHandler('./api/auth.js');
  if (handler) {
    await handler(req, res);
  } else {
    res.status(500).json({ error: 'Handler not found' });
  }
});

app.all('/api/auth', async (req, res) => {
  const handler = await importAPIHandler('./api/auth.js');
  if (handler) {
    await handler(req, res);
  } else {
    res.status(500).json({ error: 'Handler not found' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints available:`);
  console.log(`   - POST /api/auth/register`);
  console.log(`   - POST /api/auth/login`);
  console.log(`   - GET  /api/auth/me`);
  console.log(`   - GET  /api/stocks`);
  console.log(`   - POST /api/stocks`);
  console.log(`   - DELETE /api/stocks/:id`);
  console.log(`   - GET  /health`);
});