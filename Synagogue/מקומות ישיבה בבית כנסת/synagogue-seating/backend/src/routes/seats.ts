import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { pool } from '../db.js';
import { mapSeat, type SeatRow, type SeatStatus } from '../types.js';

export const seatsRouter = Router();

const VALID_STATUSES: SeatStatus[] = ['available', 'assigned', 'reserved'];

// PATCH /api/seats/:id - עדכון שם / סטאטוס / מחיר / מיקום (x,y) של מקום בודד
seatsRouter.patch('/seats/:id', async (req, res) => {
  const { id } = req.params;
  const { name, status, price, posX, posY } = req.body ?? {};

  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: 'סטאטוס לא תקין' });
  }
  if (price !== undefined && (typeof price !== 'number' || price < 0)) {
    return res.status(400).json({ error: 'מחיר לא תקין' });
  }
  if (posX !== undefined && posX !== null && typeof posX !== 'number') {
    return res.status(400).json({ error: 'מיקום X לא תקין' });
  }
  if (posY !== undefined && posY !== null && typeof posY !== 'number') {
    return res.status(400).json({ error: 'מיקום Y לא תקין' });
  }

  const fields: string[] = [];
  const values: unknown[] = [];
  let idx = 1;

  if (name !== undefined) {
    fields.push(`name = $${idx++}`);
    values.push(String(name));
  }
  if (status !== undefined) {
    fields.push(`status = $${idx++}`);
    values.push(status);
  }
  if (price !== undefined) {
    fields.push(`price = $${idx++}`);
    values.push(price);
  }
  if (posX !== undefined) {
    fields.push(`pos_x = $${idx++}`);
    values.push(posX);
  }
  if (posY !== undefined) {
    fields.push(`pos_y = $${idx++}`);
    values.push(posY);
  }

  if (fields.length === 0) {
    return res.status(400).json({ error: 'לא נשלחו שדות לעדכון' });
  }

  values.push(id);

  try {
    const result = await pool.query<SeatRow>(
      `UPDATE seats SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      values,
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'מקום לא נמצא' });
    }
    res.json(mapSeat(result.rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'שגיאה בעדכון המקום' });
  }
});

// POST /api/blocks/:blockId/seats - הוספת מקום חדש לבלוק (למשל בזמן שרטוט האולם)
seatsRouter.post('/blocks/:blockId/seats', async (req, res) => {
  const { blockId } = req.params;
  const { row, col, posX, posY } = req.body ?? {};

  if (typeof row !== 'number' || typeof col !== 'number') {
    return res.status(400).json({ error: 'יש לציין מספר שורה ומספר מקום' });
  }

  const id = `${blockId}-${randomUUID().slice(0, 8)}`;

  try {
    const result = await pool.query<SeatRow>(
      `INSERT INTO seats (id, block_id, row_num, col_num, pos_x, pos_y)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [id, blockId, row, col, posX ?? null, posY ?? null],
    );
    res.status(201).json(mapSeat(result.rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'שגיאה בהוספת מקום' });
  }
});

// POST /api/blocks/:blockId/seats/row - הוספת שורה שלמה של מקומות בבת אחת
seatsRouter.post('/blocks/:blockId/seats/row', async (req, res) => {
  const { blockId } = req.params;
  const { row, count } = req.body ?? {};

  if (typeof row !== 'number' || row < 1) {
    return res.status(400).json({ error: 'מספר שורה לא תקין' });
  }
  if (typeof count !== 'number' || count < 1 || count > 200) {
    return res.status(400).json({ error: 'מספר מקומות בשורה לא תקין (1-200)' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const created: SeatRow[] = [];
    for (let col = 1; col <= count; col++) {
      const id = `${blockId}-r${row}-s${col}-${randomUUID().slice(0, 6)}`;
      const result = await client.query<SeatRow>(
        `INSERT INTO seats (id, block_id, row_num, col_num) VALUES ($1, $2, $3, $4) RETURNING *`,
        [id, blockId, row, col],
      );
      created.push(result.rows[0]);
    }
    await client.query('COMMIT');
    res.status(201).json(created.map(mapSeat));
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'שגיאה בהוספת שורה' });
  } finally {
    client.release();
  }
});

// DELETE /api/blocks/:blockId/seats - ניקוי כל המקומות בבלוק (התחלה מחדש של שרטוט)
seatsRouter.delete('/blocks/:blockId/seats', async (req, res) => {
  const { blockId } = req.params;
  try {
    await pool.query('DELETE FROM seats WHERE block_id = $1', [blockId]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'שגיאה בניקוי המקומות בבלוק' });
  }
});

// DELETE /api/seats/:id
seatsRouter.delete('/seats/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM seats WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'מקום לא נמצא' });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'שגיאה במחיקת מקום' });
  }
});
