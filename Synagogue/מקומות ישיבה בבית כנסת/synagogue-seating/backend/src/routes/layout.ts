import { Router } from 'express';
import { pool } from '../db.js';
import { mapSeat, type Section, type SectionRow, type BlockRow, type SeatRow } from '../types.js';

export const layoutRouter = Router();

// GET /api/layout - כל המבנה: אזורים -> בלוקים -> מקומות, מקונן ומוכן לתצוגה
layoutRouter.get('/layout', async (_req, res) => {
  try {
    const [sectionsResult, blocksResult, seatsResult] = await Promise.all([
      pool.query<SectionRow>('SELECT id, title, sort_order FROM sections ORDER BY sort_order'),
      pool.query<BlockRow>('SELECT id, section_id, title, sort_order FROM blocks ORDER BY sort_order'),
      pool.query<SeatRow>('SELECT * FROM seats ORDER BY row_num, col_num'),
    ]);

    const sections: Section[] = sectionsResult.rows.map((s) => ({
      id: s.id,
      title: s.title,
      sortOrder: s.sort_order,
      blocks: [],
    }));

    const sectionById = new Map(sections.map((s) => [s.id, s]));

    const blockById = new Map<string, Section['blocks'][number]>();
    for (const b of blocksResult.rows) {
      const block = {
        id: b.id,
        sectionId: b.section_id,
        title: b.title,
        sortOrder: b.sort_order,
        seats: [],
      };
      blockById.set(b.id, block);
      sectionById.get(b.section_id)?.blocks.push(block);
    }

    for (const s of seatsResult.rows) {
      blockById.get(s.block_id)?.seats.push(mapSeat(s));
    }

    res.json({ sections });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'שגיאה בטעינת המפה' });
  }
});
