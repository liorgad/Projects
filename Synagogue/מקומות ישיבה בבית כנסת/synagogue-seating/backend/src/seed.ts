import 'dotenv/config';
import { seedDemoData, waitForDb } from './bootstrap.js';
import { pool } from './db.js';

async function main() {
  await waitForDb();
  await seedDemoData();
  console.log('✔ Seed data inserted successfully');
  await pool.end();
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
