import 'dotenv/config';
import { applySchema, waitForDb } from './bootstrap.js';
import { pool } from './db.js';

async function main() {
  await waitForDb();
  await applySchema();
  console.log('✔ Schema applied successfully');
  await pool.end();
}

main().catch((err) => {
  console.error('Failed to apply schema:', err);
  process.exit(1);
});
