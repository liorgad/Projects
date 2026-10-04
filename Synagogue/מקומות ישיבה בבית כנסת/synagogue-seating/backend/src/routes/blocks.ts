import { Router } from 'express';
import { pool } from '../db.js';
import { mapBlock, type BlockRow } from '../types.js';

export const blocksRouter = Router();

// PATCH /api/blocks/:id - עדכון כותרת הבלוק
blocksRouter.patch('/blocks/:id', async (req, res) => {
  const { id } = req.params;
  const { title } = req.body ?? {};
  if (typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'כותרת לא תקינה' });
  }
  try {
    const result = await pool.query<BlockRow>(
      'UPDATE blocks SET title = $1 WHERE id = $2 RETURNING *',
      [title.trim(), id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'בלוק לא נמצא' });
    }
    res.json(mapBlock(result.rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'שגיאה בעדכון הבלוק' });
  }
});

// POST /api/sections/:sectionId/blocks - יצירת בלוק חדש באזור
blocksRouter.post('/sections/:sectionId/blocks', async (req, res) => {
  const { sectionId } = req.params;
  const { id, title } = req.body ?? {};
  if (typeof id !== 'string' || !id.trim() || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'יש לציין מזהה וכותרת לבלוק' });
  }
  try {
    const countResult = await pool.query('SELECT COUNT(*) FROM blocks WHERE section_id = $1', [
      sectionId,
    ]);
    const sortOrder = Number(countResult.rows[0].count);
    const result = await pool.query<BlockRow>(
      'INSERT INTO blocks (id, section_id, title, sort_order) VALUES ($1, $2, $3, $4) RETURNING *',
      [id.trim(), sectionId, title.trim(), sortOrder],
    );
    res.status(201).json({ ...mapBlock(result.rows[0]), seats: [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'שגיאה ביצירת הבלוק' });
  }
});

// DELETE /api/blocks/:id
blocksRouter.delete('/blocks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM blocks WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'בלוק לא נמצא' });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'שגיאה במחיקת הבלוק' });
  }
});
