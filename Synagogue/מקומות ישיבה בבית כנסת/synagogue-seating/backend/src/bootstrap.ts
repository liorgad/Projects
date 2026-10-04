import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { pool } from './db.js';
import type { SeatStatus } from './types.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function waitForDb(retries = 15, delayMs = 2000): Promise<void> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await pool.query('SELECT 1');
      return;
    } catch (err) {
      console.log(`ממתין למסד הנתונים... (ניסיון ${attempt}/${retries})`);
      if (attempt === retries) throw err;
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
}

export async function applySchema(): Promise<void> {
  const sql = readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
  await pool.query(sql);
}

const SECTIONS = [
  {
    id: 'men',
    title: 'עזרת גברים',
    blocks: [
      { id: 'm-right', title: 'אגף ימין', rows: 6, seatsPerRow: 8 },
      { id: 'm-center', title: 'אגף מרכז', rows: 6, seatsPerRow: 10 },
      { id: 'm-left', title: 'אגף שמאל', rows: 6, seatsPerRow: 8 },
    ],
  },
  {
    id: 'women',
    title: 'עזרת נשים (יציע)',
    blocks: [
      { id: 'w-right', title: 'אגף ימין', rows: 5, seatsPerRow: 10 },
      { id: 'w-left', title: 'אגף שמאל', rows: 5, seatsPerRow: 10 },
    ],
  },
];

const SAMPLE_NAMES = [
  'כהן יעקב', 'לוי משה', 'מזרחי דוד', 'אברהם רחל', 'ביטון שרה',
  'פרץ אליהו', 'אזולאי חנה', 'גבאי שלמה', 'דהן מרים', 'עמר יוסף',
];

const DEFAULT_PRICE = 1200;

function hashSeed(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) % 1000;
  }
  return h;
}

export async function seedDemoData(): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('TRUNCATE seats, blocks, sections CASCADE');

    for (const [sectionIdx, section] of SECTIONS.entries()) {
      await client.query('INSERT INTO sections (id, title, sort_order) VALUES ($1, $2, $3)', [
        section.id,
        section.title,
        sectionIdx,
      ]);

      for (const [blockIdx, block] of section.blocks.entries()) {
        await client.query(
          'INSERT INTO blocks (id, section_id, title, sort_order) VALUES ($1, $2, $3, $4)',
          [block.id, section.id, block.title, blockIdx],
        );

        for (let row = 1; row <= block.rows; row++) {
          for (let col = 1; col <= block.seatsPerRow; col++) {
            const id = `${block.id}-r${row}-s${col}`;
            const seed = hashSeed(id);
            let status: SeatStatus = 'available';
            let name = '';
            if (seed % 7 === 0) {
              status = 'assigned';
              name = SAMPLE_NAMES[seed % SAMPLE_NAMES.length];
            } else if (seed % 11 === 0) {
              status = 'reserved';
            }
            await client.query(
              `INSERT INTO seats (id, block_id, row_num, col_num, name, status, price)
               VALUES ($1, $2, $3, $4, $5, $6, $7)`,
              [id, block.id, row, col, name, status, DEFAULT_PRICE],
            );
          }
        }
      }
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function seedIfEmpty(): Promise<void> {
  const result = await pool.query('SELECT COUNT(*) FROM sections');
  if (Number(result.rows[0].count) === 0) {
    console.log('מסד הנתונים ריק - מזריע נתוני דמו ראשוניים...');
    await seedDemoData();
  }
}
