import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
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
