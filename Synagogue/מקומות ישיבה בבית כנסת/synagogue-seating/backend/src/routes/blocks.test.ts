import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

const { mockQuery } = vi.hoisted(() => ({ mockQuery: vi.fn() }));

vi.mock('../db.js', () => ({
  pool: { query: mockQuery, connect: vi.fn() },
}));

const { blocksRouter } = await import('./blocks.js');

const app = express();
app.use(express.json());
app.use('/api', blocksRouter);

describe('PATCH /api/blocks/:id', () => {
  beforeEach(() => mockQuery.mockReset());

  it('returns the block in camelCase, like the seat routes do', async () => {
    mockQuery.mockResolvedValueOnce({
      rows: [{ id: 'm-right', section_id: 'men', title: 'אגף ימין', sort_order: 0 }],
    });

    const res = await request(app).patch('/api/blocks/m-right').send({ title: 'אגף ימין' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: 'm-right',
      sectionId: 'men',
      title: 'אגף ימין',
      sortOrder: 0,
    });
  });

  it('rejects an empty title', async () => {
    const res = await request(app).patch('/api/blocks/m-right').send({ title: '   ' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('כותרת לא תקינה');
  });
});

describe('POST /api/sections/:sectionId/blocks', () => {
  beforeEach(() => mockQuery.mockReset());

  it('returns the new block in camelCase with an empty seat list', async () => {
    mockQuery
      .mockResolvedValueOnce({ rows: [{ count: '2' }] })
      .mockResolvedValueOnce({
        rows: [{ id: 'm-new', section_id: 'men', title: 'אגף חדש', sort_order: 2 }],
      });

    const res = await request(app)
      .post('/api/sections/men/blocks')
      .send({ id: 'm-new', title: 'אגף חדש' });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      id: 'm-new',
      sectionId: 'men',
      title: 'אגף חדש',
      sortOrder: 2,
      seats: [],
    });
  });
});
