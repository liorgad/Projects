import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SeatDetailsPanel from './SeatDetailsPanel';

const baseSeat = {
  id: 's1',
  blockId: 'b1',
  row: 1,
  col: 1,
  posX: null,
  posY: null,
  name: '',
  status: 'available',
  price: 0,
};

const noop = () => {};

function renderPanel(seat, overrides = {}) {
  const props = {
    seat,
    blockTitle: 'עזרת גברים · אגף ימין',
    editMode: false,
    onSave: () => Promise.resolve(),
    onClose: noop,
    onDelete: noop,
    onResetPosition: noop,
    ...overrides,
  };
  return render(<SeatDetailsPanel {...props} />);
}

describe('price hint', () => {
  it('says the price has not been set when it is 0', () => {
    renderPanel(baseSeat);
    expect(screen.getByText('טרם נקבע מחיר')).toBeInTheDocument();
  });

  it('shows the formatted currency once a price is set', () => {
    renderPanel({ ...baseSeat, price: 1200 });
    expect(screen.queryByText('טרם נקבע מחיר')).not.toBeInTheDocument();
    expect(screen.getByText(/1,200/)).toBeInTheDocument();
  });
});

describe('pessimistic saving', () => {
  it('disables the form while saving and keeps the typed value on success', async () => {
    const user = userEvent.setup();
    let resolveSave;
    const onSave = vi.fn(() => new Promise((resolve) => { resolveSave = resolve; }));
    renderPanel(baseSeat, { onSave });

    const nameInput = screen.getByLabelText('שם');
    const statusSelect = screen.getByLabelText('סטאטוס');
    const priceInput = screen.getByLabelText('מחיר שנתי', { exact: false });
    await user.type(nameInput, 'כהן יעקב');
    await user.click(screen.getByRole('button', { name: 'שמירה' }));

    expect(nameInput).toBeDisabled();
    expect(statusSelect).toBeDisabled();
    expect(priceInput).toBeDisabled();
    expect(screen.getByRole('button', { name: 'שומר…' })).toBeDisabled();

    resolveSave();
    await waitFor(() => expect(nameInput).toBeEnabled());
    expect(nameInput).toHaveValue('כהן יעקב');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('restores the last server value and shows the error when the save fails', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn(() => Promise.reject(new Error('שגיאת שרת (500)')));
    renderPanel({ ...baseSeat, name: 'לוי משה' }, { onSave });

    const nameInput = screen.getByLabelText('שם');
    await user.clear(nameInput);
    await user.type(nameInput, 'מזרחי דוד');
    await user.click(screen.getByRole('button', { name: 'שמירה' }));

    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent('שגיאת שרת (500)'),
    );
    expect(nameInput).toHaveValue('לוי משה');
    expect(nameInput).toBeEnabled();
  });

  it('does not restore the previous seat values after the user switches seats mid-save', async () => {
    const user = userEvent.setup();
    const seatA = { ...baseSeat, id: 'A', row: 1, col: 1, name: 'לוי משה', price: 100 };
    const seatB = { ...baseSeat, id: 'B', row: 2, col: 5, name: 'כהן דוד', price: 200 };
    let rejectSave;
    const onSave = vi.fn(() => new Promise((_resolve, reject) => { rejectSave = reject; }));

    const { rerender } = renderPanel(seatA, { onSave });

    const nameInput = screen.getByLabelText('שם');
    await user.clear(nameInput);
    await user.type(nameInput, 'מזרחי אבי');
    await user.click(screen.getByRole('button', { name: 'שמירה' }));

    // המשתמש עובר למקום אחר בזמן שהשמירה הקודמת עדיין תלויה
    rerender(
      <SeatDetailsPanel
        seat={seatB}
        blockTitle="עזרת גברים · אגף ימין"
        editMode={false}
        onSave={onSave}
        onClose={noop}
        onDelete={noop}
        onResetPosition={noop}
      />,
    );

    rejectSave(new Error('שגיאת שרת (500)'));

    await waitFor(() => expect(screen.getByLabelText('שם')).toBeEnabled());
    expect(screen.getByLabelText('שם')).toHaveValue(seatB.name);
    expect(screen.getByLabelText('סטאטוס')).toHaveValue(seatB.status);
    expect(screen.getByLabelText('מחיר שנתי', { exact: false })).toHaveValue(seatB.price);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
