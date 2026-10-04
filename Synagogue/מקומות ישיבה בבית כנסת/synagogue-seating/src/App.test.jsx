import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('./api', () => ({
  fetchLayout: vi.fn(),
  updateSeat: vi.fn(),
  createSeat: vi.fn(),
  deleteSeat: vi.fn(),
  addRow: vi.fn(),
  clearBlockSeats: vi.fn(),
}));

import * as api from './api';
import App from './App';

const layout = {
  sections: [
    {
      id: 'men',
      title: 'עזרת גברים',
      sortOrder: 0,
      blocks: [
        {
          id: 'b1',
          sectionId: 'men',
          title: 'אגף ימין',
          sortOrder: 0,
          seats: [
            {
              id: 's1',
              blockId: 'b1',
              row: 1,
              col: 1,
              posX: null,
              posY: null,
              name: 'לוי משה',
              status: 'assigned',
              price: 0,
            },
          ],
        },
      ],
    },
  ],
};

describe('failed delete', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.fetchLayout.mockResolvedValue(structuredClone(layout));
  });

  it('keeps the seat on the map and reports the failure', async () => {
    const user = userEvent.setup();
    api.deleteSeat.mockRejectedValue(new Error('שגיאת שרת (500)'));

    const { container } = render(<App />);
    await screen.findByText('עזרת גברים');

    // בוחרים את המקום לפני הכניסה למצב עריכה: מחוץ למצב עריכה
    // handleSeatPointerDown קורא ל-onSeatClick ישירות, בלי setPointerCapture
    // (ש-jsdom לא מממש על אלמנטי SVG).
    const seatRect = container.querySelector('rect.seatmap-seat');
    expect(seatRect).not.toBeNull();
    fireEvent.pointerDown(seatRect);

    // כניסה למצב עריכה כדי שכפתור המחיקה יופיע בפאנל (הבחירה נשמרת)
    await user.click(screen.getByRole('button', { name: /ערוך מפה/ }));
    await user.click(screen.getByRole('button', { name: 'מחיקת מקום זה' }));

    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent('מחיקת המקום נכשלה'),
    );
    // המקום עדיין על המפה
    expect(container.querySelectorAll('rect.seatmap-seat')).toHaveLength(1);
  });

  it('keeps the seat on the map and the delete button disabled while the delete is in flight', async () => {
    const user = userEvent.setup();
    let resolveDelete;
    api.deleteSeat.mockReturnValue(
      new Promise((resolve) => {
        resolveDelete = resolve;
      }),
    );

    const { container } = render(<App />);
    await screen.findByText('עזרת גברים');

    const seatRect = container.querySelector('rect.seatmap-seat');
    fireEvent.pointerDown(seatRect);

    await user.click(screen.getByRole('button', { name: /ערוך מפה/ }));
    await user.click(screen.getByRole('button', { name: 'מחיקת מקום זה' }));

    // בזמן שהבקשה עדיין תלויה: המקום נשאר, הכפתור נעול, אין עדיין שגיאה
    const deleteButton = await screen.findByRole('button', { name: 'מוחק…' });
    expect(deleteButton).toBeDisabled();
    expect(container.querySelectorAll('rect.seatmap-seat')).toHaveLength(1);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    resolveDelete();

    await waitFor(() =>
      expect(container.querySelectorAll('rect.seatmap-seat')).toHaveLength(0),
    );
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    // הפאנל נסגר כי הבחירה התנקתה
    expect(screen.queryByRole('button', { name: /מחיקת מקום זה|מוחק…/ })).not.toBeInTheDocument();
  });
});
