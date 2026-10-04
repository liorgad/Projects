import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockQuery, mockConnect } = vi.hoisted(() => ({
  mockQuery: vi.fn(),
  mockConnect: vi.fn(),
}));

vi.mock('./db.js', () => ({
  pool: { query: mockQuery, connect: mockConnect },
}));

const { seedDemoData } = await import('./bootstrap.js');

describe('seedDemoData', () => {
  beforeEach(() => {
    mockQuery.mockReset();
    mockConnect.mockReset();
  });

  it('seeds all 256 demo seats with no price', async () => {
    const client = {
      query: vi.fn().mockResolvedValue({ rows: [] }),
      release: vi.fn(),
    };
    mockConnect.mockResolvedValue(client);

    await seedDemoData();

    const seatInserts = client.query.mock.calls.filter(
      ([sql]) => typeof sql === 'string' && sql.includes('INSERT INTO seats'),
    );
    // 6*8 + 6*10 + 6*8 + 5*10 + 5*10 = 256 מקומות
    expect(seatInserts.length).toBe(256);
    // סדר הפרמטרים: id, block_id, row, col, name, status, price
    expect(seatInserts.every(([, params]) => params[6] === 0)).toBe(true);
  });
});
