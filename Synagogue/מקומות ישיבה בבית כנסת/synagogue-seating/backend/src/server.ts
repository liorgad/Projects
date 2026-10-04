import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { layoutRouter } from './routes/layout.js';
import { seatsRouter } from './routes/seats.js';
import { blocksRouter } from './routes/blocks.js';
import { applySchema, seedIfEmpty, waitForDb } from './bootstrap.js';

const app = express();
const port = Number(process.env.PORT) || 4000;

app.use(cors({ origin: process.env.CORS_ORIGIN ?? '*' }));
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.use('/api', layoutRouter);
app.use('/api', seatsRouter);
app.use('/api', blocksRouter);

app.use((_req, res) => {
  res.status(404).json({ error: 'לא נמצא' });
});

async function start() {
  if (process.env.AUTO_MIGRATE !== 'false') {
    await waitForDb();
    await applySchema();
    await seedIfEmpty();
  }
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`🕍 Synagogue seating API listening on port ${port}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
