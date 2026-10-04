import { describe, it, expect, vi, afterEach } from 'vitest';
import { fetchLayout } from './api';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('request error handling', () => {
  it('turns a network-level failure into a Hebrew message', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new TypeError('Failed to fetch'))));
    await expect(fetchLayout()).rejects.toThrow('לא ניתן להתחבר לשרת');
  });

  it('surfaces the server error message when the response is not ok', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
          json: () => Promise.resolve({ error: 'שגיאה בטעינת המפה' }),
        }),
      ),
    );
    await expect(fetchLayout()).rejects.toThrow('שגיאה בטעינת המפה');
  });
});
